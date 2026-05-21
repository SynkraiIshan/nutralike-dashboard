'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bot } from 'lucide-react';
import StepIndicator from './StepIndicator';
import IngredientLineTable, { LineItem } from './IngredientLineTable';
import QuotationPreview from './QuotationPreview';
import FileUploadZone from '@/components/ui/FileUploadZone';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import {
  PACKAGING_TYPE_OPTIONS,
  PACKAGING_TIER_OPTIONS,
  getPackWeightOptions,
} from '@/lib/packaging/constants';
import { fetchPackagingMaterials } from '@/lib/api/packaging';
import { QuotationClientInfo, PackagingMaterialsData, PackagingType } from '@/types';
import { ApiError } from '@/lib/api/errors';
import {
  downloadQuotationPdf,
  extractQuotationIngredients,
  generateQuotation,
} from '@/lib/api/quotations';
import type { GeneratedQuotation } from '@/lib/api/types';
import { mapExtractedToLineItems } from '@/lib/quotations/map-extracted-lines';
import { saveGeneratedQuotation } from '@/lib/quotations/quotation-storage';
import toast from 'react-hot-toast';

interface FormErrors {
  name?: string;
  productName?: string;
  packagingType?: string;
  packWeightG?: string;
  packagingTier?: string;
}

const EMPTY_CLIENT_INFO: QuotationClientInfo = {
  name: '',
  email: '',
  productName: '',
  description: '',
  packWeightG: '',
  packagingType: '',
  packagingTier: '',
};

interface QuotationWizardProps {
  onComplete?: (id: string) => void;
}

export default function QuotationWizard({ onComplete }: QuotationWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [clientInfo, setClientInfo] = useState<QuotationClientInfo>(EMPTY_CLIENT_INFO);
  const [errors, setErrors] = useState<FormErrors>({});
  const [packagingMaterials, setPackagingMaterials] = useState<PackagingMaterialsData>({
    jar: {},
    sachet: {},
  });

  const packWeightOptions = clientInfo.packagingType
    ? getPackWeightOptions(clientInfo.packagingType as PackagingType, packagingMaterials)
    : [];

  useEffect(() => {
    const type = clientInfo.packagingType as PackagingType | '';
    if (!type) return;

    let cancelled = false;
    void fetchPackagingMaterials(type)
      .then((data) => {
        if (cancelled) return;
        setPackagingMaterials((prev) => ({
          jar: { ...prev.jar, ...data.jar },
          sachet: { ...prev.sachet, ...data.sachet },
        }));
      })
      .catch((error) => {
        if (cancelled) return;
        const msg =
          error instanceof ApiError
            ? error.message
            : 'Failed to load pack weights. Please try again.';
        toast.error(msg);
      });

    return () => {
      cancelled = true;
    };
  }, [clientInfo.packagingType]);

  useEffect(() => {
    if (!clientInfo.packagingType) return;
    const options = getPackWeightOptions(
      clientInfo.packagingType as PackagingType,
      packagingMaterials
    );
    if (options.length === 0) {
      if (clientInfo.packWeightG) {
        setClientInfo((prev) => ({ ...prev, packWeightG: '' }));
      }
      return;
    }
    if (!options.some((o) => o.value === clientInfo.packWeightG)) {
      setClientInfo((prev) => ({ ...prev, packWeightG: options[0].value }));
    }
  }, [clientInfo.packagingType, clientInfo.packWeightG, packagingMaterials]);
  const [lines, setLines] = useState<LineItem[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [generatedQuotation, setGeneratedQuotation] = useState<GeneratedQuotation | null>(
    null
  );
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const validateStep1 = (): boolean => {
    const e: FormErrors = {};
    if (!clientInfo.name.trim()) e.name = 'Company name is required';
    if (!clientInfo.productName.trim()) e.productName = 'Product name is required';
    if (!clientInfo.packagingType) e.packagingType = 'Packaging type is required';
    if (!clientInfo.packWeightG) e.packWeightG = 'Pack weight is required';
    if (!clientInfo.packagingTier) e.packagingTier = 'Cost tier is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePackagingTypeChange = (type: string) => {
    if (!type) {
      setClientInfo((prev) => ({ ...prev, packagingType: '', packWeightG: '' }));
      return;
    }
    setClientInfo((prev) => ({
      ...prev,
      packagingType: type as PackagingType,
      packWeightG: '',
    }));
  };

  const handleNext1 = () => {
    if (validateStep1()) setStep(2);
  };

  const handleExtract = async () => {
    const hasFile = !!uploadedFile;
    const hasText = !!pasteText.trim();
    const productName = clientInfo.productName.trim();
    const hasProductName = !!productName;

    if (!hasFile && !hasText && !hasProductName) {
      toast.error(
        'Upload a file, paste an ingredient list, or enter a product name in Step 1'
      );
      return;
    }

    const extractInput = hasFile
      ? { file: uploadedFile! }
      : hasText
        ? { text: pasteText }
        : { productName };

    setIsExtracting(true);
    try {
      const { data, message } = await extractQuotationIngredients(extractInput);

      if (!data.ingredients?.length) {
        toast.error('No ingredients were extracted from your input');
        return;
      }

      const mapped = await mapExtractedToLineItems(data.ingredients);
      setLines(mapped);
      const sourceHint =
        data.source === 'ai' ? ' (AI formulation — review quantities)' : '';
      toast.success(
        (message ??
          `${data.count} ingredient${data.count !== 1 ? 's' : ''} extracted successfully`) +
          sourceHint
      );
    } catch (error) {
      const msg =
        error instanceof ApiError
          ? error.message
          : 'Failed to extract ingredients. Please try again.';
      toast.error(msg);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleGenerate = async () => {
    if (lines.length === 0) {
      toast.error('Add at least one ingredient before generating');
      return;
    }

    setIsGenerating(true);
    try {
      const { quotation, message } = await generateQuotation({
        clientInfo,
        lines,
        file: uploadedFile,
      });

      saveGeneratedQuotation(quotation);
      setGeneratedQuotation(quotation);
      onComplete?.(quotation.id);

      toast.success(
        message ??
          `Quotation ${quotation.quotationNumber} generated successfully`
      );
      router.push(`/quotations/${quotation.id}`);
    } catch (error) {
      const msg =
        error instanceof ApiError
          ? error.message
          : 'Failed to generate quotation. Please try again.';
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPdf = () => {
    const quotationId = generatedQuotation?.id;
    if (!quotationId) {
      toast.error('Generate the quotation first to download the PDF');
      return;
    }

    downloadQuotationPdf(quotationId, {
      filename: generatedQuotation?.quotationNumber
        ? `${generatedQuotation.quotationNumber}.pdf`
        : undefined,
    });
    toast.success('PDF download started');
  };

  return (
    <div className={step === 2 ? 'max-w-7xl mx-auto' : 'max-w-5xl mx-auto'}>
      <StepIndicator currentStep={step} />

      {/* STEP 1 */}
      {step === 1 && (
        <Card className="max-w-2xl mx-auto">
          <h2 className="type-h3-18 text-[#0a0a0a] mb-5">Client, Product & Packaging</h2>
          <div className="flex flex-col gap-4">
            <Input
              label="Company name"
              placeholder="e.g. Aryan Proteins Pvt. Ltd."
              value={clientInfo.name}
              onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
              error={errors.name}
              required
            />
            <Input
              label="Client Email"
              type="email"
              placeholder="e.g. admin@company.com"
              value={clientInfo.email}
              onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
            />
            <Input
              label="Product Name"
              placeholder="e.g. Whey Protein Blend 2.0"
              value={clientInfo.productName}
              onChange={(e) => setClientInfo({ ...clientInfo, productName: e.target.value })}
              error={errors.productName}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 border-t border-[#f2f6ef]">
              <Select
                label="Packaging type"
                options={[{ value: '', label: 'Select type' }, ...PACKAGING_TYPE_OPTIONS]}
                value={clientInfo.packagingType}
                onChange={(e) => handlePackagingTypeChange(e.target.value)}
                error={errors.packagingType}
                required
              />
              <Select
                label="Pack weight"
                options={
                  packWeightOptions.length > 0
                    ? [{ value: '', label: 'Select weight' }, ...packWeightOptions]
                    : [{ value: '', label: 'No weights available' }]
                }
                value={clientInfo.packWeightG}
                onChange={(e) => setClientInfo({ ...clientInfo, packWeightG: e.target.value })}
                error={errors.packWeightG}
                disabled={packWeightOptions.length === 0}
                required
              />
              <Select
                label="Packaging cost tier"
                options={[{ value: '', label: 'Select tier' }, ...PACKAGING_TIER_OPTIONS]}
                value={clientInfo.packagingTier}
                onChange={(e) =>
                  setClientInfo({
                    ...clientInfo,
                    packagingTier: e.target.value as QuotationClientInfo['packagingTier'],
                  })
                }
                error={errors.packagingTier}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#373737]">
                Product Description
              </label>
              <textarea
                rows={3}
                placeholder="Describe the product, intended use, target market..."
                value={clientInfo.description}
                onChange={(e) => setClientInfo({ ...clientInfo, description: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#c3c3c3] rounded-lg
                  focus:outline-none focus:border-[#314f2d] focus:ring-2 focus:ring-[#314f2d]/10
                  text-[#0a0a0a] placeholder:text-[#a3a29e] resize-none transition-colors"
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button onClick={handleNext1} rightIcon={<span>→</span>}>
                Next: Add Ingredients
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,11fr)_minmax(0,13fr)] gap-3 lg:gap-4 items-start">
          {/* Left panel */}
          <Card padding={false} className="p-5 w-full">
            <div className="mb-3 min-h-9 flex items-center">
              <h2 className="type-h3-18 text-[#0a0a0a]">Provide Product Information</h2>
            </div>
            <FileUploadZone
              selectedFile={uploadedFile}
              onFileSelect={(f) => setUploadedFile(f)}
              onClear={() => setUploadedFile(null)}
              label="Upload ingredient file"
              hint="Excel, PDF, Word, Image, or any text file"
            />
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-[#c3c3c3]" />
              <span className="text-xs text-[#a3a29e] font-medium">or</span>
              <div className="flex-1 h-px bg-[#c3c3c3]" />
            </div>
            <textarea
              rows={5}
              placeholder="Paste ingredient list as text...&#10;e.g. Whey Protein: 40kg&#10;Maltodextrin: 30kg"
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              disabled={!!uploadedFile}
              className="w-full px-3 py-2 text-sm border border-[#c3c3c3] rounded-lg
                focus:outline-none focus:border-[#314f2d] focus:ring-2 focus:ring-[#314f2d]/10
                text-[#0a0a0a] placeholder:text-[#a3a29e] resize-none transition-colors
                disabled:opacity-60 disabled:cursor-not-allowed"
            />
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-[#c3c3c3]" />
              <span className="text-xs text-[#a3a29e] font-medium">or</span>
              <div className="flex-1 h-px bg-[#c3c3c3]" />
            </div>
            <div className="rounded-lg border border-[#f2f6ef] bg-[#f9fbf7] px-3 py-2.5">
              <p className="text-xs font-medium text-[#373737]">Product name (from Step 1)</p>
              <p className="mt-1 text-sm text-[#0a0a0a] truncate" title={clientInfo.productName}>
                {clientInfo.productName.trim() || '—'}
              </p>
              <p className="mt-1.5 text-xs text-[#a3a29e] leading-snug">
                If you skip file and paste, Extract uses this name for an AI ingredient
                formulation. File and pasted text take priority.
              </p>
            </div>
            <Button
              className="mt-3 w-full"
              onClick={() => void handleExtract()}
              disabled={isExtracting}
              loading={isExtracting}
              leftIcon={!isExtracting ? <Bot size={16} /> : undefined}
            >
              {isExtracting
                ? 'Extracting Ingredients...'
                : uploadedFile
                  ? 'Extract from File'
                  : pasteText.trim()
                    ? 'Extract from Text'
                    : 'Extract from Product Name (AI)'}
            </Button>
          </Card>

          {/* Right panel — aligned top/padding with left card */}
          <Card padding={false} className="p-5 min-w-0 w-full">
            <IngredientLineTable lines={lines} onChange={setLines} />
          </Card>

          {/* Step navigation */}
          <div className="lg:col-span-2 flex items-center justify-between">
            <Button variant="secondary" onClick={() => setStep(1)}>← Back</Button>
            <Button
              onClick={() => setStep(3)}
              disabled={lines.length === 0}
              rightIcon={<span>→</span>}
            >
              Next: Review
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="flex flex-col gap-6">
          <QuotationPreview clientInfo={clientInfo} lines={lines} />
          <div className="flex items-center justify-between">
            <Button variant="secondary" onClick={() => setStep(2)}>← Edit Ingredients</Button>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                disabled={!generatedQuotation || isDownloadingPdf || isGenerating}
                loading={isDownloadingPdf}
                onClick={() => void handleDownloadPdf()}
                title={
                  generatedQuotation
                    ? 'Download quotation PDF'
                    : 'Available after you generate the quotation'
                }
              >
                Download PDF
              </Button>
              <Button
                onClick={() => void handleGenerate()}
                loading={isGenerating}
                disabled={isGenerating || lines.length === 0}
              >
                {isGenerating ? 'Generating...' : 'Generate Quotation'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
