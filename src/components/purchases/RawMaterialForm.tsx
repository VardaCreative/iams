
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FormDialog from "@/components/common/FormDialog";

export interface RawMaterial {
  id: string;
  code: string;
  name: string;
  category: string;
  description?: string;
  unit: string;
  min_stock_level: number;
  status: 'active' | 'inactive';
}

interface RawMaterialFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RawMaterial) => void;
  initialData?: RawMaterial;
  isLoading?: boolean;
}

const RawMaterialForm = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData,
  isLoading = false
}: RawMaterialFormProps) => {
  const [formData, setFormData] = React.useState<RawMaterial>({
    id: '',
    code: '',
    name: '',
    category: '',
    description: '',
    unit: 'kg',
    min_stock_level: 0,
    status: 'active',
    ...initialData
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Handle numeric inputs
    if (type === 'number') {
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
    onSubmit(formData);
  };

  return (
    <FormDialog
      title={initialData ? "Edit Raw Material" : "Add Raw Material"}
      description="Add or edit raw material information."
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="code">Material Code *</Label>
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g., RM001"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="name">Material Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Material name"
              required
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Spices, Herbs, etc."
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the material"
            className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="unit">Unit *</Label>
            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="kg">Kilogram (KG)</option>
              <option value="g">Gram (G)</option>
              <option value="l">Liter (L)</option>
              <option value="ml">Milliliter (ML)</option>
              <option value="pcs">Pieces (PCS)</option>
            </select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="min_stock_level">Min. Stock Level *</Label>
            <Input
              id="min_stock_level"
              name="min_stock_level"
              type="number"
              min="0"
              value={formData.min_stock_level}
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </FormDialog>
  );
};

export default RawMaterialForm;
