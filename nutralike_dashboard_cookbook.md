# Nutralike Admin Dashboard - IDE Cookbook

> SynkrAI × Nutralike | Frontend-Only Build Guide  
> Stack: Next.js 14 (App Router) + Tailwind CSS v4 + Shadcn/UI  
> Status: **Frontend only - all data is mocked/static. No backend calls.**

---

## 0. Senior Dev Pre-Read: What This System Actually Is

Before you write a single line, understand the business deeply:

Nutralike is a **nutraceutical ingredient trading company**. Their admin team manually quotes prices for custom supplement/nutrition products. Today they do this with spreadsheets. This system replaces that with an AI-powered web panel.

**Two core modules:**

| Module                    | What it does                                                                                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ingredient Management** | Central database of every ingredient - name, unit, price per 100KG. Admin can import from any file format (XLSX, DOCX, PDF, image, text). AI extracts data from uploaded files. |
| **Quotation Engine**      | Client gives product name / image / ingredient list. System matches to DB, AI estimates unknowns, runs formula, generates PDF quotation.                                        |

**Who uses the admin panel?**

- Internal admin staff (not clients). Clients only receive the final PDF quotation.
- Admin manages ingredients, generates quotations, manages clients.

**What you are building:**  
A pixel-perfect, fully interactive **frontend shell** - every screen, every state, every component - with **mock data only**. API integration is handled later by the backend team. Your job: make it look and feel 100% real and production-ready.

---

## 1. Design System & Theme

### 1.1 Color Tokens (Strictly from provided theme)

```css
/* globals.css - paste at top */
@import "tailwindcss";

@theme {
  /* Backgrounds */
  --color-lime-green: #25d366;
  --color-golden-yellow: #ffd700;
  --color-gray: #899f87;
  --color-dark-gray: #a3a29e;
  --color-silver: #c3c3c3;
  --color-white-smoke: #f2f6ef; /* PRIMARY PAGE BACKGROUND */
  --color-white: #ffffff; /* CARD / PANEL BACKGROUND */
  --color-dark-gray-1-300: #000000;
  --color-dark-gray-1-400: #222222;
  --color-dark-gray-1-500: #222222;
  --color-dark-orange: #ff8800;
  --color-charcoal: #314f2d; /* PRIMARY BRAND / SIDEBAR BG */

  /* Gradients */
  --gradient-linear: linear-gradient(#7c9f43 0%, #597a3e 100%);
  --gradient-linear-1: linear-gradient(90deg, #7c9f43 0px, #597a3e 100%);

  /* Text Colors */
  --color-black: #000000;
  --color-black-1: #0a0a0a;
  --color-dark-gray-text: #373737;
  --color-charcoal-text: #314f2d;
  --color-dark-slate-gray: #3c5d39;
  --color-dim-gray: #555555;

  /* Button Colors */
  /* Primary Button: bg charcoal (#314f2d), text white */
  /* Secondary: white bg, charcoal border + text */

  /* Typography */
  --font-inter-24pt: "Inter 24pt", sans-serif;
  --font-helvetica: Helvetica, sans-serif;
  --font-helvetica-neue: "Helvetica Neue", sans-serif;

  /* Type scale */
  --text-13: 13px;
  --text-14: 14px;
  --text-15: 15px;
  --text-16: 16px;
  --text-18: 18px;
  --text-20: 20px;
  --text-22: 22px;
  --text-30: 30px;
  --text-45: 45px;
}
```

### 1.2 Color Usage Map

| Where                    | Color               | Hex                 |
| ------------------------ | ------------------- | ------------------- |
| Page background          | `white-smoke`       | `#f2f6ef`           |
| Sidebar background       | `charcoal` gradient | `#314f2d → #3c5d39` |
| Cards / panels           | `white`             | `#ffffff`           |
| Primary button bg        | `charcoal`          | `#314f2d`           |
| Primary button text      | `white`             | `#ffffff`           |
| Active sidebar item      | `gradient-linear-1` | `#7c9f43 → #597a3e` |
| Headings                 | `black-1`           | `#0a0a0a`           |
| Body text                | `dark-gray-text`    | `#373737`           |
| Muted / sub text         | `dim-gray`          | `#555555`           |
| Success / positive       | `lime-green`        | `#25d366`           |
| Warning / pending        | `dark-orange`       | `#ff8800`           |
| Table borders            | `silver`            | `#c3c3c3`           |
| Input borders            | `silver`            | `#c3c3c3`           |
| Sidebar icons (inactive) | `gray`              | `#899f87`           |

### 1.3 Typography Classes

Use exactly these classes (defined in globals.css per the provided type system):

```css
/* Add to globals.css @layer components */
.type-h1 {
  font-family: var(--font-inter-24pt);
  font-size: 45px;
  font-weight: 600;
  letter-spacing: 1.5px;
}
.type-h2 {
  font-family: var(--font-inter-24pt);
  font-size: 30px;
  font-weight: 600;
  letter-spacing: 1.5px;
}
.type-h3 {
  font-family: var(--font-inter-24pt);
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 1.5px;
}
.type-h3-20 {
  font-family: var(--font-inter-24pt);
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 1.5px;
}
.type-h3-18 {
  font-family: var(--font-inter-24pt);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1.5px;
}
.type-h4 {
  font-family: var(--font-inter-24pt);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 1.5px;
}
.type-h5 {
  font-family: var(--font-inter-24pt);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1.5px;
}
.type-body {
  font-family: var(--font-inter-24pt);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.7;
}
.type-small-body {
  font-family: var(--font-inter-24pt);
  font-size: 15px;
  font-weight: 400;
  line-height: 1.6;
}
.type-caption {
  font-family: "Helvetica Neue", sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.6;
}
.type-button {
  font-family: var(--font-inter-24pt);
  font-size: 13px;
  font-weight: 400;
}
.type-subheading {
  font-family: var(--font-inter-24pt);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.6;
}
```

---

## 2. Project Structure

```
nutralike-admin/
├── app/
│   ├── layout.tsx                    # Root layout - font import, body bg
│   ├── (dashboard)/
│   │   ├── layout.tsx                # Sidebar + topbar shell
│   │   ├── page.tsx                  # → /  redirects to /dashboard
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Dashboard overview
│   │   ├── ingredients/
│   │   │   ├── page.tsx              # Ingredient list + import
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Edit ingredient (modal preferred)
│   │   ├── quotations/
│   │   │   ├── page.tsx              # Quotation list / history
│   │   │   ├── new/
│   │   │   │   └── page.tsx          # Create new quotation (multi-step)
│   │   │   └── [id]/
│   │   │       └── page.tsx          # View single quotation detail
│   │   ├── uploads/
│   │   │   └── page.tsx              # Upload center
│   │   ├── clients/
│   │   │   └── page.tsx              # Client management
│   │   ├── settings/
│   │   │   └── page.tsx              # Settings panel
│   │   └── reports/
│   │       └── page.tsx              # Reports & history
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── MobileSidebar.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Table.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── FileUploadZone.tsx
│   │   ├── SearchBar.tsx
│   │   ├── Pagination.tsx
│   │   └── Toast.tsx
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   ├── RecentQuotations.tsx
│   │   └── ActivityFeed.tsx
│   ├── ingredients/
│   │   ├── IngredientTable.tsx
│   │   ├── IngredientModal.tsx       # Add / Edit modal
│   │   └── ImportModal.tsx           # File import with AI extraction mock
│   ├── quotations/
│   │   ├── QuotationTable.tsx
│   │   ├── QuotationWizard.tsx       # Multi-step quotation creator
│   │   ├── IngredientBreakdown.tsx   # Line-item table inside quotation
│   │   └── QuotationPreview.tsx      # PDF-like preview panel
│   ├── clients/
│   │   ├── ClientTable.tsx
│   │   └── ClientModal.tsx
│   └── uploads/
│       └── UploadHistory.tsx
├── lib/
│   ├── mock-data/
│   │   ├── ingredients.ts
│   │   ├── quotations.ts
│   │   ├── clients.ts
│   │   └── uploads.ts
│   └── utils.ts
├── types/
│   └── index.ts
└── public/
    └── logo.svg                      # Nutralike logo placeholder
```

---

## 3. Types - Define These First

```typescript
// types/index.ts

export type Unit = "KG" | "LTR" | "GM" | "ML" | "PCS";

export interface Ingredient {
  id: string;
  name: string;
  unit: Unit;
  pricePerHundredKg: number; // price per 100 KG
  lastUpdated: string; // ISO date string
}

export interface QuotationIngredientLine {
  ingredientId: string;
  ingredientName: string;
  unit: Unit;
  qtyUsed: number;
  pricePerHundredKg: number;
  totalPrice: number;
  source: "database" | "ai-estimated"; // flag if AI guessed the price
}

export type QuotationStatus = "draft" | "generated" | "sent" | "archived";

export interface Quotation {
  id: string;
  clientName: string;
  clientEmail: string;
  productName: string;
  productDescription: string;
  ingredients: QuotationIngredientLine[];
  formulaBreakdown: string; // human-readable formula string
  totalCost: number;
  status: QuotationStatus;
  createdAt: string;
  updatedAt: string;
  pdfUrl?: string; // mock URL
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  quotationCount: number;
  createdAt: string;
}

export type UploadType = "ingredient-file" | "product-image" | "product-doc";
export type UploadStatus = "processing" | "completed" | "failed";

export interface Upload {
  id: string;
  fileName: string;
  fileType: string; // 'xlsx' | 'pdf' | 'docx' | 'jpg' | 'txt'
  uploadType: UploadType;
  status: UploadStatus;
  uploadedAt: string;
  processedRows?: number; // for ingredient files
  linkedQuotationId?: string;
}

export interface DashboardStats {
  totalIngredients: number;
  quotationsThisMonth: number;
  activeClients: number;
  pendingQuotations: number;
}
```

---

## 4. Mock Data

```typescript
// lib/mock-data/ingredients.ts
import { Ingredient } from "@/types";

export const MOCK_INGREDIENTS: Ingredient[] = [
  {
    id: "1",
    name: "Sugar",
    unit: "KG",
    pricePerHundredKg: 45.0,
    lastUpdated: "2024-06-01",
  },
  {
    id: "2",
    name: "Milk Powder",
    unit: "KG",
    pricePerHundredKg: 320.0,
    lastUpdated: "2024-06-01",
  },
  {
    id: "3",
    name: "Cocoa Powder",
    unit: "KG",
    pricePerHundredKg: 250.0,
    lastUpdated: "2024-06-01",
  },
  {
    id: "4",
    name: "Lemon Juice",
    unit: "LTR",
    pricePerHundredKg: 120.0,
    lastUpdated: "2024-06-01",
  },
  {
    id: "5",
    name: "Whey Protein Concentrate",
    unit: "KG",
    pricePerHundredKg: 890.0,
    lastUpdated: "2024-05-28",
  },
  {
    id: "6",
    name: "Vitamin C (Ascorbic Acid)",
    unit: "KG",
    pricePerHundredKg: 1200.0,
    lastUpdated: "2024-05-20",
  },
  {
    id: "7",
    name: "Stevia Leaf Extract",
    unit: "KG",
    pricePerHundredKg: 3400.0,
    lastUpdated: "2024-05-15",
  },
  {
    id: "8",
    name: "Maltodextrin",
    unit: "KG",
    pricePerHundredKg: 65.0,
    lastUpdated: "2024-06-01",
  },
  {
    id: "9",
    name: "Magnesium Stearate",
    unit: "KG",
    pricePerHundredKg: 280.0,
    lastUpdated: "2024-05-30",
  },
  {
    id: "10",
    name: "Turmeric Extract",
    unit: "KG",
    pricePerHundredKg: 760.0,
    lastUpdated: "2024-05-22",
  },
  // Add 20 more realistic nutraceutical ingredients for demo richness
];

// lib/mock-data/quotations.ts - follow same pattern
// lib/mock-data/clients.ts - follow same pattern
// lib/mock-data/uploads.ts - follow same pattern
```

---

## 5. Layout Shell

### 5.1 Root Layout (`app/layout.tsx`)

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nutralike Admin",
  description: "AI-Powered Ingredient & Quotation Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#f2f6ef] text-[#0a0a0a] antialiased">
        {children}
      </body>
    </html>
  );
}
```

### 5.2 Dashboard Layout (`app/(dashboard)/layout.tsx`)

```tsx
// app/(dashboard)/layout.tsx
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - fixed left */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 bg-[#f2f6ef]">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

## 6. Sidebar Component - Full Spec

### Visual Design

- **Width:** 240px fixed on desktop, collapsible to icon-only (64px) on toggle
- **Background:** `linear-gradient(180deg, #314f2d 0%, #3c5d39 100%)`
- **Top:** Logo area - Nutralike logo + "Admin Panel" label in white
- **Nav items:** icon + label. Inactive: `#899f87` icon, white text 60% opacity. Active: gradient pill `#7c9f43 → #597a3e` with white text + icon
- **Bottom:** Logout button with icon, separator line

### Nav Items (in order)

```
Icon            Label               Route
Home/Grid       Dashboard           /dashboard
Package         Ingredients         /ingredients
FileText        Quotations          /quotations
Upload          Uploads             /uploads
Users           Clients             /clients
Settings        Settings            /settings
BarChart2       Reports             /reports
```

### Component Code Outline

```tsx
// components/layout/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FileText,
  Upload,
  Users,
  Settings,
  BarChart2,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Ingredients", href: "/ingredients", icon: Package },
  { label: "Quotations", href: "/quotations", icon: FileText },
  { label: "Uploads", href: "/uploads", icon: Upload },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Reports", href: "/reports", icon: BarChart2 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-60 flex-shrink-0 flex flex-col h-full"
      style={{
        background: "linear-gradient(180deg, #314f2d 0%, #3c5d39 100%)",
      }}
    >
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        {/* Replace with actual SVG logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#7c9f43] flex items-center justify-center text-white font-bold text-sm">
            N
          </div>
          <div>
            <p className="text-white font-semibold text-sm tracking-wide">
              Nutralike
            </p>
            <p className="text-white/50 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150
                ${
                  isActive
                    ? "text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }
              `}
              style={
                isActive
                  ? { background: "linear-gradient(90deg, #7c9f43, #597a3e)" }
                  : {}
              }
            >
              <Icon
                size={18}
                className={isActive ? "text-white" : "text-[#899f87]"}
              />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 border-t border-white/10 pt-4">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all">
          <LogOut size={18} className="text-[#899f87]" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
```

---

## 7. Topbar Component - Full Spec

### Visual Design

- **Height:** 64px
- **Background:** `white` (`#ffffff`)
- **Border bottom:** 1px solid `#c3c3c3`
- **Left:** Current page title (dynamic from route)
- **Right:** Search bar (global, decorative for now) + notification bell (badge) + admin avatar + name

```tsx
// components/layout/Topbar.tsx
"use client";
import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/ingredients": "Ingredient Management",
  "/quotations": "Quotations",
  "/quotations/new": "New Quotation",
  "/uploads": "Upload Center",
  "/clients": "Clients",
  "/settings": "Settings",
  "/reports": "Reports & History",
};

export default function Topbar() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "Nutralike Admin";

  return (
    <header className="h-16 bg-white border-b border-[#c3c3c3] flex items-center justify-between px-6 flex-shrink-0">
      {/* Page Title */}
      <h1 className="text-[20px] font-semibold text-[#0a0a0a] tracking-[1.5px]">
        {title}
      </h1>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3a29e]"
          />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm bg-[#f2f6ef] border border-[#c3c3c3] rounded-lg w-52 focus:outline-none focus:border-[#314f2d] text-[#373737] placeholder:text-[#a3a29e]"
          />
        </div>

        {/* Bell */}
        <button className="relative p-2 rounded-lg hover:bg-[#f2f6ef]">
          <Bell size={18} className="text-[#373737]" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ff8800]" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-[#314f2d] flex items-center justify-center text-white text-xs font-semibold">
            KN
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-[#0a0a0a]">Kunal Nagani</p>
            <p className="text-xs text-[#555555]">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
```

---

## 8. Reusable UI Components

### 8.1 Button

```tsx
// components/ui/Button.tsx
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variants = {
  primary: "bg-[#314f2d] text-white hover:bg-[#3c5d39] active:scale-95",
  secondary:
    "bg-white text-[#314f2d] border border-[#314f2d] hover:bg-[#f2f6ef]",
  ghost: "bg-transparent text-[#373737] hover:bg-[#f2f6ef]",
  danger: "bg-white text-red-600 border border-red-300 hover:bg-red-50",
};

const sizes = {
  sm: "px-3 py-1.5 text-[13px]",
  md: "px-4 py-2 text-[13px]",
  lg: "px-5 py-2.5 text-[14px]",
};

export default function Button({
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 rounded-lg font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}
```

### 8.2 Card

```tsx
// components/ui/Card.tsx
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export default function Card({
  children,
  className,
  padding = true,
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-[#c3c3c3] shadow-sm",
        padding && "p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
```

### 8.3 Badge

```tsx
// components/ui/Badge.tsx
type BadgeVariant =
  | "success"
  | "warning"
  | "info"
  | "danger"
  | "neutral"
  | "ai";

const VARIANTS: Record<BadgeVariant, string> = {
  success: "bg-[#25d366]/10 text-[#1a9e4a] border border-[#25d366]/20",
  warning: "bg-[#ff8800]/10 text-[#cc6e00] border border-[#ff8800]/20",
  info: "bg-[#314f2d]/10 text-[#314f2d] border border-[#314f2d]/20",
  danger: "bg-red-50 text-red-600 border border-red-200",
  neutral: "bg-[#f2f6ef] text-[#555555] border border-[#c3c3c3]",
  ai: "bg-[#7c9f43]/10 text-[#597a3e] border border-[#7c9f43]/30",
};

export default function Badge({
  label,
  variant = "neutral",
}: {
  label: string;
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${VARIANTS[variant]}`}
    >
      {label}
    </span>
  );
}
```

### 8.4 FileUploadZone

```tsx
// components/ui/FileUploadZone.tsx
"use client";
import { useState } from "react";
import { Upload, File, X } from "lucide-react";

interface FileUploadZoneProps {
  accept?: string;
  onFileSelect?: (file: File) => void;
  label?: string;
  hint?: string;
}

export default function FileUploadZone({
  accept = ".xlsx,.docx,.pdf,.jpg,.jpeg,.png,.txt",
  onFileSelect,
  label = "Click to upload or drag & drop",
  hint = "Supports XLSX, DOCX, PDF, Image, TXT",
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect?.(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect?.(file);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
        ${
          isDragging
            ? "border-[#7c9f43] bg-[#7c9f43]/5"
            : "border-[#c3c3c3] bg-[#f2f6ef] hover:border-[#314f2d] hover:bg-white"
        }
      `}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />

      {selectedFile ? (
        <div className="flex items-center justify-center gap-3">
          <File size={20} className="text-[#314f2d]" />
          <span className="text-sm font-medium text-[#314f2d]">
            {selectedFile.name}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFile(null);
            }}
            className="text-red-400 hover:text-red-600"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#314f2d]/10 flex items-center justify-center">
            <Upload size={18} className="text-[#314f2d]" />
          </div>
          <p className="text-sm font-medium text-[#0a0a0a]">{label}</p>
          <p className="text-xs text-[#555555]">{hint}</p>
        </div>
      )}
    </div>
  );
}
```

### 8.5 SearchBar

```tsx
// components/ui/SearchBar.tsx
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3a29e]"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 text-sm bg-[#f2f6ef] border border-[#c3c3c3] rounded-lg focus:outline-none focus:border-[#314f2d] text-[#373737] placeholder:text-[#a3a29e]"
      />
    </div>
  );
}
```

### 8.6 Modal

```tsx
// components/ui/Modal.tsx
"use client";
import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: "sm" | "md" | "lg" | "xl";
}

const widths = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  width = "md",
}: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full ${widths[width]} z-10`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#c3c3c3]">
          <h2 className="text-[18px] font-semibold text-[#0a0a0a] tracking-[1.5px]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#f2f6ef] text-[#555555]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
```

---

## 9. Page - Dashboard (`/dashboard`)

### Layout: 2-row grid

```
┌─────────────────────────────────────────────────────────┐
│  STAT CARD    STAT CARD    STAT CARD    STAT CARD       │  ← Row 1: 4 stat cards
├───────────────────────────────┬─────────────────────────┤
│  Recent Quotations table      │  Recent Activity feed   │  ← Row 2: 2 col
│  (last 5 quotations)          │  (last 10 events)       │
└───────────────────────────────┴─────────────────────────┘
```

### Stat Cards (4 cards)

| Card                  | Value | Icon       | Trend              |
| --------------------- | ----- | ---------- | ------------------ |
| Total Ingredients     | 142   | `Package`  | +8 this month      |
| Quotations This Month | 34    | `FileText` | +12% vs last month |
| Active Clients        | 18    | `Users`    | 3 new this week    |
| Pending Quotations    | 5     | `Clock`    | Needs action       |

**StatCard design:**

- White bg, 1px silver border, rounded-xl
- Top: icon in a 40×40 rounded-lg with `#314f2d/10` bg, icon in `#314f2d`
- Middle: Big number in `type-h2` (30px 600)
- Below: label in `type-small-body` (15px 400 `#555555`)
- Bottom: trend chip - green for positive `#25d366/10` bg, orange for warning

### Recent Quotations Table (last 5)

Columns: #, Client Name, Product, Total (₹), Status, Date, Action (View button)  
Status badges: `generated` → success, `draft` → neutral, `sent` → info

### Activity Feed (right column)

A vertical timeline of recent events. Each item:

- Dot color based on action type (green = new quotation, orange = price update, blue = new client)
- Action text + timestamp (relative: "2 hours ago")
- Example items:
  - "Quotation #34 generated for Aryan Proteins"
  - "Whey Protein price updated to ₹890/100KG"
  - "New client added: NutriMax Pvt. Ltd."
  - "Ingredient file imported - 12 items added"

---

## 10. Page - Ingredient Management (`/ingredients`)

### Layout

```
┌──────────────────────────────────────────────────────────┐
│ [Search bar]         [Import File btn]  [+ Add Now btn]  │  ← Action bar
├──────────────────────────────────────────────────────────┤
│ S.No | Name | Unit | Price/100KG | Last Updated | Action │  ← Table header
│  1   | Sugar | KG  |  ₹45.00     |  01-06-2024  | ✏️ 🗑️  │
│  2   | Milk Powder | KG | ₹320.00 | 01-06-2024  | ✏️ 🗑️  │
│  ...                                                      │
├──────────────────────────────────────────────────────────┤
│                    Pagination                             │
└──────────────────────────────────────────────────────────┘
```

### Table Spec

- Rows: striped - odd rows `white`, even rows `#f2f6ef`
- Hover: `#f2f6ef` with `#314f2d` left border (4px)
- Edit icon: pencil, `#555555` → `#314f2d` on hover
- Delete icon: trash, `#555555` → `red-500` on hover
- Price column: right-aligned, monospace, prefixed with ₹
- Last Updated: formatted `DD MMM YYYY`
- Pagination: show 10 per page, Previous / page numbers / Next

### Import Modal (trigger: "Import File" button)

```
Modal title: "Import Ingredient File"
─────────────────────────────────────
FileUploadZone (full width)
  Hint: "Supports XLSX, DOCX, PDF, Image (JPG/PNG), TXT"

[After file selected - show "Processing..." state]
  Loading spinner + "AI is extracting ingredient data..."

[After mock 2s delay - show extracted preview table]
  ┌──────────────────────────────────────┐
  │ Extracted Ingredients Preview        │
  │ Name       | Unit | Price/100KG      │
  │ Sugar       | KG   | 45.00           │
  │ Cocoa       | KG   | 250.00          │
  │ [checkbox rows - all checked]        │
  └──────────────────────────────────────┘

[Buttons: Cancel | Save to Database]
```

**Interaction flow:**

1. User clicks "Import File"
2. Modal opens with FileUploadZone
3. User selects/drops a file
4. Mock 2s "processing" spinner with "AI is reading your file..." text
5. Preview table appears with mock extracted rows (pre-check all)
6. User can uncheck rows to exclude
7. "Save to Database" → success toast "12 ingredients added" → modal closes → table refreshes with new items at top

### Add / Edit Ingredient Modal

```
Modal title: "Add Ingredient" / "Edit Ingredient"
──────────────────────────────────────────────────
Label: Ingredient Name *
Input: [text field]

Label: Unit *
Select: KG / LTR / GM / ML / PCS

Label: Price per 100 KG (₹) *
Input: [number field, step 0.01]

[Buttons: Cancel | Save Ingredient]
```

---

## 11. Page - Quotation Management (`/quotations`)

### Layout

```
┌──────────────────────────────────────────────────────────────┐
│ [Search]  [Status filter dropdown]        [+ Create Quotation]│
├──────────────────────────────────────────────────────────────┤
│ # | Client | Product | Total | Status | Date | Actions       │
│   |        |         |       |        |      | View Download │
├──────────────────────────────────────────────────────────────┤
│                      Pagination                              │
└──────────────────────────────────────────────────────────────┘
```

### Status Filter Options: All / Draft / Generated / Sent / Archived

### Actions per row:

- **View** - navigates to `/quotations/[id]`
- **Download** - icon button, mocks a PDF download (can just open a new tab or show toast)

---

## 12. Page - Create Quotation (`/quotations/new`)

This is the most complex page. Use a **3-step wizard** layout.

### Wizard Step Indicator (top)

```
Step 1: Client & Product Info  →  Step 2: Ingredients  →  Step 3: Review & Generate
   ●────────────────────────────────○───────────────────────────────○
```

Active step: filled circle `#314f2d`, inactive: empty `#c3c3c3`, completed: checkmark green

---

### Step 1 - Client & Product Info

```
┌────────────────────────────────────────┐
│ Client Name *                          │
│ [Input text]                           │
│                                        │
│ Client Email                           │
│ [Input email]                          │
│                                        │
│ Product Name *                         │
│ [Input text]                           │
│                                        │
│ Product Description                    │
│ [Textarea - 3 rows]                    │
│                                        │
│         [Next: Add Ingredients →]      │
└────────────────────────────────────────┘
```

---

### Step 2 - Ingredients

Two sub-sections side by side (or stacked on mobile):

**Left: Upload / Paste Input**

```
┌─────────────────────────────────┐
│  Provide Product Information    │
│                                 │
│  [FileUploadZone]               │
│  "Upload image, Excel, DOC,     │
│   or any file with ingredients" │
│                                 │
│  - or -                         │
│                                 │
│  [Textarea] "Paste ingredient   │
│   list as text..."              │
│                                 │
│  [Extract Ingredients →]        │
└─────────────────────────────────┘
```

**Right: Ingredient Line Items Table**

```
┌─────────────────────────────────────────────────────────────┐
│  Ingredients                         [+ Add Row]           │
│                                                             │
│  Name          | Unit | Qty | Price/100KG | Total | Source │
│  [autocomplete]| KG ▼ | 10  | ₹45.00      | ₹4.50 | DB  ✕ │
│  [autocomplete]| KG ▼ | 5   | ₹320.00     | ₹16.00| DB  ✕ │
│  [autocomplete]| KG ▼ | 2   | ₹250.00     | ₹5.00 | DB  ✕ │
│  Unknown Herb  | KG ▼ | 1   | ₹680.00     | ₹6.80 | AI 🤖✕ │
│                                                             │
│                            Total Quotation: ₹32.30         │
└─────────────────────────────────────────────────────────────┘
```

**Source badge:**

- `DB` = Badge variant `info` - found in database
- `AI 🤖` = Badge variant `ai` - AI estimated price (with info tooltip: "Price estimated by AI based on market data")

**Ingredient Name autocomplete:**

- Typing shows dropdown of matching ingredients from mock data
- Select one → auto-fills Unit and Price from mock DB
- If user types name not in DB → show "AI will estimate price" hint text, show AI badge after

**[Extract Ingredients] button flow:**

1. Shows spinner "AI is reading file..." (2s mock delay)
2. Auto-populates the ingredient table with extracted rows
3. Unknown ones get AI badge + estimated price (slightly different from DB if present)

**Running total:**

- Recalculates as qty changes: `total = (qty * pricePerHundredKg) / 100`
- Show running sum at bottom right in bold

**[← Back] [Next: Review →]** buttons

---

### Step 3 - Review & Generate

```
┌──────────────────────────────────────────────────────────┐
│  Quotation Preview                                        │
│  ─────────────────────────────────────────────────────   │
│  Client: Aryan Proteins          Date: 01-06-2024        │
│  Product: Whey Protein Blend                              │
│                                                           │
│  ┌──────┬──────────────────┬────┬─────┬──────┬────────┐  │
│  │ S.No │ Ingredient       │ Unit│ Qty │ ₹/100KG│ Total│  │
│  │  1   │ Whey Protein     │ KG │ 10  │ 890   │ 89.00│  │
│  │  2   │ Sugar            │ KG │ 5   │ 45    │ 2.25 │  │
│  │  3   │ Unknown Herb 🤖  │ KG │ 1   │ 680   │ 6.80 │  │
│  └──────┴──────────────────┴────┴─────┴───────┴──────┘  │
│                                                           │
│  Formula Applied: (Ingredient Cost × 1.15) + Overhead   │
│                            ─────────────────────────     │
│                            Total: ₹ 113.45               │
│                                                           │
│  🤖 AI estimated 1 ingredient price                      │
│                                                           │
│  [← Edit]   [Generate Quotation]   [Download PDF]        │
└──────────────────────────────────────────────────────────┘
```

**"Generate Quotation" button behavior:**

1. Button shows loading state "Generating..."
2. Mock 1.5s delay
3. Success toast: "Quotation #35 generated successfully!"
4. Redirect to `/quotations/35`

---

## 13. Page - View Single Quotation (`/quotations/[id]`)

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Quotations                     [Download PDF]    │
│                                            [Share Link]     │
├─────────────────────────────────────────────────────────────┤
│  Quotation #34 - Generated            Badge: Generated      │
│  ─────────────────────────────────────────────────────────  │
│  Client: Aryan Proteins Ltd.          Date: 01 Jun 2024     │
│  Email: aryan@aryanproteins.com       Product: Whey Blend   │
│                                                             │
│  INGREDIENT BREAKDOWN                                       │
│  ┌──────┬──────────────────┬────┬─────┬────────┬────────┐  │
│  │ S.No │ Ingredient       │Unit│ Qty │₹/100KG │ Total  │  │
│  │  1   │ Whey Protein     │ KG │ 10  │ 890.00 │  89.00 │  │
│  │  2   │ Sugar            │ KG │  5  │  45.00 │   2.25 │  │
│  │  3   │ Unknown Herb 🤖  │ KG │  1  │ 680.00 │   6.80 │  │
│  └──────┴──────────────────┴────┴─────┴────────┴────────┘  │
│                                                             │
│  Formula: (Total Ingredient Cost × 1.15) + ₹5 Overhead     │
│  Subtotal:          ₹98.05                                  │
│  Formula Markup:    ₹14.70                                  │
│  Overhead:          ₹5.00                                   │
│  ─────────────────────────────                              │
│  TOTAL:             ₹117.75                                 │
│                                                             │
│  🤖 Note: 1 ingredient price estimated by AI               │
└─────────────────────────────────────────────────────────────┘
```

---

## 14. Page - Upload Center (`/uploads`)

### Layout

```
┌──────────────────────────────────────────────┐
│  Upload a File                               │
│  [FileUploadZone - full width]               │
│  Select upload type: [Ingredient File ▼]     │
│                          [Upload File]       │
├──────────────────────────────────────────────┤
│  Upload History                              │
│  ───────────────────────────────────────     │
│  File         | Type | Status | Date | Link  │
│  prices.xlsx  | Ingr | ✅ Done | ...  | View  │
│  product.jpg  | Prod | 🔄 Proc | ...  | -     │
│  spec.pdf     | Ingr | ❌ Fail | ...  | Retry │
└──────────────────────────────────────────────┘
```

**Status badges:**

- `completed` → success (green)
- `processing` → warning (orange) with spinning icon
- `failed` → danger (red) with retry button

---

## 15. Page - Client Management (`/clients`)

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [Search clients]                          [+ Add Client]    │
├─────────────────────────────────────────────────────────────┤
│ Name | Email | Phone | Company | Quotations | Joined | ✏️ 🗑️ │
├─────────────────────────────────────────────────────────────┤
│ Pagination                                                  │
└─────────────────────────────────────────────────────────────┘
```

### Add / Edit Client Modal

```
Fields:
- Full Name *
- Email *
- Phone
- Company Name
[Cancel] [Save Client]
```

Clicking a client name → inline expand row or navigate to a detail page showing their linked quotations.

---

## 16. Page - Settings (`/settings`)

Use a **tab-based layout** with 3 tabs:

### Tab 1: Quotation Formula

```
┌─────────────────────────────────────────────────────────────┐
│  Quotation Formula Configuration                            │
│  ─────────────────────────────────                          │
│  Formula Type:  [Simple Markup ▼]                           │
│                                                             │
│  Markup Percentage: [15] %                                  │
│  Overhead (fixed):  [₹ 5.00]                               │
│  Min Quotation:     [₹ 500]                                 │
│                                                             │
│  Preview:                                                   │
│  Total = (Ingredient Cost × 1.15) + ₹5.00                  │
│                                                             │
│  [Save Formula]                                             │
└─────────────────────────────────────────────────────────────┘
```

### Tab 2: User Management

Simple table of admin users:

- Name, Email, Role (Admin / Viewer), Status (Active / Inactive)
- Actions: Edit role, Deactivate
- [+ Invite User] button → modal with email + role select

### Tab 3: System Preferences

- Default currency: [INR ▼]
- Date format: [DD-MM-YYYY ▼]
- Auto-save quotation drafts: [Toggle - On]
- Email notifications on new quotation: [Toggle - On]
- [Save Preferences]

---

## 17. Page - Reports & History (`/reports`)

### Layout: 3 sub-tabs

**Tab 1: Quotation History**
Full searchable table of all quotations with date range filter (from/to date pickers), status filter, export to Excel/PDF button.

**Tab 2: Ingredient Changes**
Table: Ingredient name | Old Price | New Price | Changed By | Changed At  
Filterable by date range.

**Tab 3: Usage Summary**
Summary stats:

- Total quotations generated (all time)
- Total ingredients in DB
- Files uploaded this month
- Most quoted product (mock: "Whey Protein Blend - 12 times")

Simple horizontal bar chart (pure CSS, no library - use `div` with widths as percentages) showing:

- Top 5 most used ingredients by frequency in quotations

---

## 18. Component State Management

**Use React `useState` locally in each page.** No global state manager needed for frontend-only build.

**Key state patterns per page:**

```typescript
// Ingredients page
const [ingredients, setIngredients] = useState(MOCK_INGREDIENTS);
const [search, setSearch] = useState("");
const [isImportOpen, setIsImportOpen] = useState(false);
const [isAddEditOpen, setIsAddEditOpen] = useState(false);
const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(
  null,
);
const [currentPage, setCurrentPage] = useState(1);

// Filter
const filtered = ingredients.filter((i) =>
  i.name.toLowerCase().includes(search.toLowerCase()),
);
const paginated = filtered.slice((currentPage - 1) * 10, currentPage * 10);
```

```typescript
// Quotation wizard
const [step, setStep] = useState<1 | 2 | 3>(1);
const [clientInfo, setClientInfo] = useState({
  name: "",
  email: "",
  productName: "",
  description: "",
});
const [lines, setLines] = useState<QuotationIngredientLine[]>([]);
const [isExtracting, setIsExtracting] = useState(false);

// Mock AI extract
const handleExtract = () => {
  setIsExtracting(true);
  setTimeout(() => {
    setLines(MOCK_EXTRACTED_LINES);
    setIsExtracting(false);
  }, 2000);
};
```

---

## 19. Toast Notifications

```tsx
// Use a simple state-based toast at top of each page layout
// Or install: npm install react-hot-toast

import toast from "react-hot-toast";

// Usage:
toast.success("12 ingredients added to database");
toast.error("Failed to process file. Please try again.");
toast.loading("AI is extracting ingredient data...");

// In layout.tsx add: <Toaster position="top-right" />
```

Style toasts to match: `bg-[#314f2d]` for success, default for others.

---

## 20. Responsive Behavior

- **Desktop (≥1024px):** Full sidebar (240px) + main content
- **Tablet (768–1023px):** Sidebar collapses to icon-only (64px). Hover to see labels in tooltip.
- **Mobile (<768px):** Sidebar hidden. Topbar shows hamburger → slides in as overlay drawer.

Implement `MobileSidebar.tsx` as a drawer using CSS transform:

```tsx
<aside className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
```

---

## 21. Loading & Empty States

Every table must handle two states:

**Loading state:** (when `isLoading = true`)

- Show 5 skeleton rows using `div` with `animate-pulse` and `bg-[#f2f6ef]` placeholders

**Empty state:** (when data is empty / no search results)

```
┌─────────────────────────────────────┐
│         📦                          │
│   No ingredients found              │
│   Try adjusting your search or      │
│   import an ingredient file.         │
│         [Import File]               │
└─────────────────────────────────────┘
```

Use appropriate icon from lucide-react per context.

---

## 22. Key Interaction Details (Must Get Right)

| Interaction             | Behavior                                                                                                                |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Edit ingredient         | Opens modal pre-filled with ingredient data                                                                             |
| Delete ingredient       | Shows inline confirm: "Delete Sugar? This cannot be undone." [Cancel] [Delete] - no separate modal, use a small popover |
| Quotation line add row  | Appends new empty row with autocomplete name input                                                                      |
| Autocomplete ingredient | Filters MOCK_INGREDIENTS on keydown, shows dropdown max 5 results                                                       |
| Unknown ingredient      | Shows AI badge + tooltip "Price estimated by AI"                                                                        |
| Running total           | Updates on every qty/price change, formatted as ₹ with 2 decimal places                                                 |
| Generate Quotation      | 1.5s mock delay → success toast → redirect                                                                              |
| Import file             | 2s mock delay → show extracted preview table                                                                            |
| Download PDF            | Show toast "Quotation PDF downloaded" (no actual file needed)                                                           |

---

## 23. Folder & File Checklist (IDE Must Create)

```
✅ app/layout.tsx
✅ app/globals.css
✅ app/(dashboard)/layout.tsx
✅ app/(dashboard)/dashboard/page.tsx
✅ app/(dashboard)/ingredients/page.tsx
✅ app/(dashboard)/quotations/page.tsx
✅ app/(dashboard)/quotations/new/page.tsx
✅ app/(dashboard)/quotations/[id]/page.tsx
✅ app/(dashboard)/uploads/page.tsx
✅ app/(dashboard)/clients/page.tsx
✅ app/(dashboard)/settings/page.tsx
✅ app/(dashboard)/reports/page.tsx
✅ components/layout/Sidebar.tsx
✅ components/layout/Topbar.tsx
✅ components/layout/MobileSidebar.tsx
✅ components/ui/Button.tsx
✅ components/ui/Card.tsx
✅ components/ui/Badge.tsx
✅ components/ui/Modal.tsx
✅ components/ui/FileUploadZone.tsx
✅ components/ui/SearchBar.tsx
✅ components/ui/Pagination.tsx
✅ components/ui/Toast.tsx (or install react-hot-toast)
✅ components/dashboard/StatCard.tsx
✅ components/dashboard/RecentQuotations.tsx
✅ components/dashboard/ActivityFeed.tsx
✅ components/ingredients/IngredientTable.tsx
✅ components/ingredients/IngredientModal.tsx
✅ components/ingredients/ImportModal.tsx
✅ components/quotations/QuotationTable.tsx
✅ components/quotations/QuotationWizard.tsx
✅ components/quotations/StepIndicator.tsx
✅ components/quotations/IngredientLineTable.tsx
✅ components/quotations/QuotationPreview.tsx
✅ components/clients/ClientTable.tsx
✅ components/clients/ClientModal.tsx
✅ components/uploads/UploadHistory.tsx
✅ lib/mock-data/ingredients.ts
✅ lib/mock-data/quotations.ts
✅ lib/mock-data/clients.ts
✅ lib/mock-data/uploads.ts
✅ lib/utils.ts
✅ types/index.ts
```

---

## 24. Package Installation

```bash
npx create-next-app@latest nutralike-admin --typescript --app --tailwind --eslint --src-dir=no
cd nutralike-admin
npm install lucide-react react-hot-toast clsx tailwind-merge
```

For `lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 25. Do NOT Do (Anti-patterns for this project)

| ❌ Don't                                | ✅ Do                                                                 |
| --------------------------------------- | --------------------------------------------------------------------- |
| Use purple, blue, red as primary colors | Stick strictly to `#314f2d` charcoal green system                     |
| Use Inter Regular everywhere            | Use the exact type scale from section 1.3                             |
| Make backend API calls                  | All data from `/lib/mock-data/` files                                 |
| Use complex charting libraries          | CSS-based bars for reports page                                       |
| Use `localStorage`                      | Keep all state in React `useState`                                    |
| Create extra colors not in theme        | Only the 12 bg colors + 7 text colors + 2 button colors defined above |
| Use `<form>` tags                       | Use `div` + `onClick` handlers for all form submissions               |
| Show empty tables                       | Always provide meaningful empty states with CTAs                      |
| Forget the `🤖` AI badge                | Every AI-estimated price must be visually flagged                     |
| Forget loading states                   | Every async mock action needs a spinner/skeleton                      |

---

## 26. Summary of Pages vs Components

| Page               | Primary Components Used                                                                         |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| `/dashboard`       | StatCard × 4, RecentQuotations, ActivityFeed                                                    |
| `/ingredients`     | SearchBar, Button, IngredientTable, ImportModal, IngredientModal                                |
| `/quotations`      | SearchBar, Select, Button, QuotationTable, Pagination                                           |
| `/quotations/new`  | StepIndicator, QuotationWizard (3 steps), FileUploadZone, IngredientLineTable, QuotationPreview |
| `/quotations/[id]` | Card, Badge, IngredientBreakdown, Button                                                        |
| `/uploads`         | FileUploadZone, Select, Button, UploadHistory                                                   |
| `/clients`         | SearchBar, Button, ClientTable, ClientModal                                                     |
| `/settings`        | Tabs, Card, Input, Select, Toggle, Button                                                       |
| `/reports`         | Tabs, SearchBar, DatePicker (native input[type=date]), Table, CSS bar chart                     |

---

_End of Cookbook - Nutralike Admin Dashboard v1.0_  
_Prepared by: Senior System Architect & UI/UX Designer_  
_For: SynkrAI × Nutralike Frontend Build_
