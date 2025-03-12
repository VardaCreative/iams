
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FormDialog from "@/components/common/FormDialog";

export interface InventoryItem {
  id: string; // Changed from optional to required
  sku: string;
  name: string;
  category?: string;
  unitPrice?: number;
  quantity?: number;
  minimumStock?: number;
}

interface InventoryItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: InventoryItem) => void;
  initialData?: InventoryItem;
  isLoading?: boolean;
}

const InventoryItemForm = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData,
  isLoading = false
}: InventoryItemFormProps) => {
  const [formData, setFormData] = React.useState<InventoryItem>({
    sku: '',
    name: '',
    category: '',
    unitPrice: 0,
    quantity: 0,
    minimumStock: 0,
    ...initialData
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'unitPrice' || name === 'quantity' || name === 'minimumStock' 
        ? parseFloat(value) || 0
        : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <FormDialog
      title={initialData ? "Edit Inventory Item" : "Add Inventory Item"}
      description="Add or edit an inventory item for your products."
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="sku">SKU *</Label>
            <Input
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="E.g., SAM250"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Product name"
              required
            />
          </div>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Product category"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="unitPrice">Unit Price</Label>
            <Input
              id="unitPrice"
              name="unitPrice"
              type="number"
              step="0.01"
              min="0"
              value={formData.unitPrice}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="quantity">Initial Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="0"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="minimumStock">Minimum Stock</Label>
            <Input
              id="minimumStock"
              name="minimumStock"
              type="number"
              min="0"
              value={formData.minimumStock}
              onChange={handleChange}
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </FormDialog>
  );
};

export default InventoryItemForm;
