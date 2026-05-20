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
import { MOCK_QUOTATIONS } from '@/lib/mock-data/quotations';
import {
  PACKAGING_TYPE_OPTIONS,
  PACKAGING_TIER_OPTIONS,
  getPackWeightOptions,
} from '@/lib/mock-data/packaging-materials';
import { QuotationClientInfo, PackagingType } from '@/types';
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

const MOCK_EXTRACTED_LINES: LineItem[] = [
  { id: 'ex1', ingredientId: '5',   ingredientName: 'Whey Protein Concentrate', unit: 'KG', qtyUsed: 40, pricePerHundredKg: 890,   totalPrice: 356,   source: 'database' },
  { id: 'ex2', ingredientId: '8',   ingredientName: 'Maltodextrin',             unit: 'KG', qtyUsed: 30, pricePerHundredKg: 65,    totalPrice: 19.5,  source: 'database' },
  { id: 'ex3', ingredientId: '7',   ingredientName: 'Stevia Leaf Extract',      unit: 'KG', qtyUsed: 2,  pricePerHundredKg: 3400,  totalPrice: 68,    source: 'database' },
  { id: 'ex4', ingredientId: 'ai1', ingredientName: 'Spirulina Powder',         unit: 'KG', qtyUsed: 5,  pricePerHundredKg: 2850,  totalPrice: 142.5, source: 'ai-estimated' },
  { id: 'ex5', ingredientId: 'ai2', ingredientName: 'BCAAs Blend',              unit: 'KG', qtyUsed: 10, pricePerHundredKg: 1580,  totalPrice: 158,   source: 'ai-estimated' },
];

interface QuotationWizardProps {
  onComplete?: (id: string) => void;
}

export default function QuotationWizard({ onComplete }: QuotationWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [clientInfo, setClientInfo] = useState<QuotationClientInfo>(EMPTY_CLIENT_INFO);
  const [errors, setErrors] = useState<FormErrors>({});

  const packWeightOptions = clientInfo.packagingType
    ? getPackWeightOptions(clientInfo.packagingType as PackagingType)
    : [];

  useEffect(() => {
    if (!clientInfo.packagingType) return;
    const options = getPackWeightOptions(clientInfo.packagingType as PackagingType);
    if (options.length === 0) {
      if (clientInfo.packWeightG) {
        setClientInfo((prev) => ({ ...prev, packWeightG: '' }));
      }
      return;
    }
    if (!options.some((o) => o.value === clientInfo.packWeightG)) {
      setClientInfo((prev) => ({ ...prev, packWeightG: options[0].value }));
    }
  }, [clientInfo.packagingType, clientInfo.packWeightG]);
  const [lines, setLines] = useState<LineItem[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

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
    const options = getPackWeightOptions(type as PackagingType);
    setClientInfo((prev) => ({
      ...prev,
      packagingType: type as PackagingType,
      packWeightG: options[0]?.value ?? '',
    }));
  };

  const handleNext1 = () => {
    if (validateStep1()) setStep(2);
  };

  const handleExtract = () => {
    setIsExtracting(true);
    setTimeout(() => {
      setLines(MOCK_EXTRACTED_LINES.map((l) => ({ ...l })));
      setIsExtracting(false);
      toast.success('Ingredients extracted successfully!');
    }, 2000);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newId = `q${MOCK_QUOTATIONS.length + 1}-${Date.now()}`;
      toast.success(`Quotation #${newId.toUpperCase()} generated successfully!`);
      setIsGenerating(false);
      onComplete?.(newId);
      router.push('/quotations');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto">
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
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left panel */}
          <Card>
            <h2 className="type-h3-18 text-[#0a0a0a] mb-4">Provide Product Information</h2>
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
              className="w-full px-3 py-2 text-sm border border-[#c3c3c3] rounded-lg
                focus:outline-none focus:border-[#314f2d] focus:ring-2 focus:ring-[#314f2d]/10
                text-[#0a0a0a] placeholder:text-[#a3a29e] resize-none transition-colors"
            />
            <Button
              className="mt-3 w-full"
              onClick={handleExtract}
              loading={isExtracting}
              leftIcon={!isExtracting ? <Bot size={16} /> : undefined}
            >
              {isExtracting ? 'Extracting Ingredients...' : 'Extract Ingredients'}
            </Button>
          </Card>

          {/* Right panel */}
          <div className="flex flex-col gap-4">
            <Card padding={false} className="p-4">
              <IngredientLineTable lines={lines} onChange={setLines} />
            </Card>
          </div>

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
                onClick={() => toast.success('Quotation PDF downloaded')}
              >
                Download PDF
              </Button>
              <Button onClick={handleGenerate} loading={isGenerating}>
                {isGenerating ? 'Generating...' : 'Generate Quotation'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
