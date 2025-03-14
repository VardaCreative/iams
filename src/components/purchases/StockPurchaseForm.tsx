
import React, { useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FormDialog from "@/components/common/FormDialog";

export interface StockPurchase {
  id: string;
  purchase_date: Date;
  vendor_id: string;
  vendor_name: string;
  purchase_order: string;
  invoice?: string;
  material_id: string;
  material_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_amount: number;
  status: 'ordered' | 'received' | 'cancelled';
}

interface StockPurchaseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: StockPurchase) => void;
  initialData?: StockPurchase;
  isLoading?: boolean;
  vendors: { id: string; name: string }[];
  materials: { id: string; name: string; unit: string; unit_price: number }[];
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
  const [formData, setFormData] = React.useState<Omit<StockPurchase, 'vendor_name' | 'material_name' | 'unit' | 'total_amount'>>({
    id: '',
    purchase_date: new Date(),
    vendor_id: vendors.length > 0 ? vendors[0].id : '',
    purchase_order: '',
    invoice: '',
    material_id: materials.length > 0 ? materials[0].id : '',
    quantity: 0,
    unit_price: 0,
    status: 'ordered',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        purchase_date: initialData.purchase_date instanceof Date 
          ? initialData.purchase_date 
          : new Date(initialData.purchase_date),
        vendor_id: initialData.vendor_id,
        purchase_order: initialData.purchase_order,
        invoice: initialData.invoice,
        material_id: initialData.material_id,
        quantity: initialData.quantity,
        unit_price: initialData.unit_price,
        status: initialData.status,
      });
    } else {
      // Reset form for new entry
      setFormData({
        id: '',
        purchase_date: new Date(),
        vendor_id: vendors.length > 0 ? vendors[0].id : '',
        purchase_order: '',
        invoice: '',
        material_id: materials.length > 0 ? materials[0].id : '',
        quantity: 0,
        unit_price: 0,
        status: 'ordered',
      });
    }
  }, [initialData, open, vendors, materials]);

  // Update unit price when material changes
  useEffect(() => {
    if (formData.material_id) {
      const material = materials.find(m => m.id === formData.material_id);
      if (material) {
        setFormData(prev => ({ ...prev, unit_price: material.unit_price }));
      }
    }
  }, [formData.material_id, materials]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (name === 'purchase_date') {
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
    const vendor = vendors.find(v => v.id === formData.vendor_id);
    const material = materials.find(m => m.id === formData.material_id);
    
    const completeData: StockPurchase = {
      ...formData,
      vendor_name: vendor?.name || 'Unknown Vendor',
      material_name: material?.name || 'Unknown Material',
      unit: material?.unit || 'unit',
      total_amount: formData.quantity * formData.unit_price
    };
    
    console.log("Submitting purchase form data:", completeData);
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
            <Label htmlFor="purchase_date">Purchase Date *</Label>
            <Input
              id="purchase_date"
              name="purchase_date"
              type="date"
              value={formatDateForInput(formData.purchase_date)}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="vendor_id">Vendor *</Label>
            <select
              id="vendor_id"
              name="vendor_id"
              value={formData.vendor_id}
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
            <Label htmlFor="purchase_order">Purchase Order No. *</Label>
            <Input
              id="purchase_order"
              name="purchase_order"
              value={formData.purchase_order}
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
          <Label htmlFor="material_id">Raw Material *</Label>
          <select
            id="material_id"
            name="material_id"
            value={formData.material_id}
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
            <Label htmlFor="unit_price">Unit Price (₹) *</Label>
            <Input
              id="unit_price"
              name="unit_price"
              type="number"
              min="0"
              step="0.01"
              value={formData.unit_price}
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
              ₹{(formData.quantity * formData.unit_price).toLocaleString('en-IN', {
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
