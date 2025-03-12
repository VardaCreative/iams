
import React, { useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FormDialog from "@/components/common/FormDialog";

export interface StockPurchase {
  id: string;
  purchaseDate: Date;
  vendorId: string;
  vendorName: string;
  purchaseOrder: string;
  invoice?: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  status: 'ordered' | 'received' | 'cancelled';
}

interface StockPurchaseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: StockPurchase) => void;
  initialData?: StockPurchase;
  isLoading?: boolean;
  vendors: { id: string; name: string }[];
  materials: { id: string; name: string; unit: string; unitPrice: number }[];
}

const StockPurchaseForm = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData,
  isLoading = false,
  vendors,
  materials
}: StockPurchaseFormProps) => {
  const [formData, setFormData] = React.useState<Omit<StockPurchase, 'vendorName' | 'materialName' | 'unit' | 'totalAmount'>>({
    id: '',
    purchaseDate: new Date(),
    vendorId: vendors.length > 0 ? vendors[0].id : '',
    purchaseOrder: '',
    invoice: '',
    materialId: materials.length > 0 ? materials[0].id : '',
    quantity: 0,
    unitPrice: 0,
    status: 'ordered',
    ...(initialData && {
      ...initialData,
      // Convert string date to Date object if needed
      purchaseDate: initialData.purchaseDate instanceof Date 
        ? initialData.purchaseDate 
        : new Date(initialData.purchaseDate)
    })
  });

  // Update unit price when material changes
  useEffect(() => {
    if (formData.materialId) {
      const material = materials.find(m => m.id === formData.materialId);
      if (material) {
        setFormData(prev => ({ ...prev, unitPrice: material.unitPrice }));
      }
    }
  }, [formData.materialId, materials]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (name === 'purchaseDate') {
      setFormData(prev => ({ ...prev, [name]: new Date(value) }));
    } else if (type === 'number') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value === '' ? 0 : Number(value) 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add calculated fields
    const vendor = vendors.find(v => v.id === formData.vendorId);
    const material = materials.find(m => m.id === formData.materialId);
    
    const completeData: StockPurchase = {
      ...formData as any,
      vendorName: vendor?.name || 'Unknown Vendor',
      materialName: material?.name || 'Unknown Material',
      unit: material?.unit || 'unit',
      totalAmount: formData.quantity * formData.unitPrice
    };
    
    onSubmit(completeData);
  };

  // Format date to YYYY-MM-DD for input
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <FormDialog
      title={initialData ? "Edit Stock Purchase" : "Add Stock Purchase"}
      description="Record a raw material purchase from a vendor."
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="purchaseDate">Purchase Date *</Label>
            <Input
              id="purchaseDate"
              name="purchaseDate"
              type="date"
              value={formatDateForInput(formData.purchaseDate)}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="vendorId">Vendor *</Label>
            <select
              id="vendorId"
              name="vendorId"
              value={formData.vendorId}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              {vendors.map(vendor => (
                <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="purchaseOrder">Purchase Order No. *</Label>
            <Input
              id="purchaseOrder"
              name="purchaseOrder"
              value={formData.purchaseOrder}
              onChange={handleChange}
              placeholder="e.g., PO-2023-001"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="invoice">Invoice No.</Label>
            <Input
              id="invoice"
              name="invoice"
              value={formData.invoice}
              onChange={handleChange}
              placeholder="e.g., INV-001"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="materialId">Raw Material *</Label>
          <select
            id="materialId"
            name="materialId"
            value={formData.materialId}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            {materials.map(material => (
              <option key={material.id} value={material.id}>
                {material.name} ({material.unit.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              step="0.01"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="unitPrice">Unit Price (₹) *</Label>
            <Input
              id="unitPrice"
              name="unitPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.unitPrice}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="status">Status *</Label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="ordered">Ordered</option>
            <option value="received">Received</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="mt-4 p-4 bg-muted rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold">Total Amount:</span>
            <span className="text-lg font-bold">
              ₹{(formData.quantity * formData.unitPrice).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          </div>
        </div>
      </div>
    </FormDialog>
  );
};

export default StockPurchaseForm;
