
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormDialog from "@/components/common/FormDialog";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface Sale {
  id?: string;
  date: Date;
  salesChannel: string;
  product: string;
  quantity: number;
  unitPrice?: number;
  orderNo?: string;
  invoiceNo?: string;
  totalAmount?: number;
}

interface SaleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Sale) => void;
  initialData?: Sale;
  isLoading?: boolean;
  salesChannels: { id: string; name: string }[];
  products: { id: string; sku: string; name: string; unitPrice?: number }[];
}

const SaleForm = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData,
  isLoading = false,
  salesChannels,
  products
}: SaleFormProps) => {
  const [formData, setFormData] = React.useState<Sale>({
    date: new Date(),
    salesChannel: '',
    product: '',
    quantity: 0,
    unitPrice: 0,
    orderNo: '',
    invoiceNo: '',
    totalAmount: 0,
    ...initialData
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'quantity' || name === 'unitPrice' 
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => {
      let updatedData: any = { ...prev, [name]: value };
      
      // If changing product, update unit price if available
      if (name === 'product') {
        const selectedProduct = products.find(p => p.id === value);
        if (selectedProduct?.unitPrice) {
          updatedData.unitPrice = selectedProduct.unitPrice;
        }
      }
      
      // Calculate total amount when quantity or unitPrice changes
      if (name === 'quantity' || name === 'unitPrice' || name === 'product') {
        updatedData.totalAmount = updatedData.quantity * updatedData.unitPrice;
      }
      
      return updatedData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      totalAmount: formData.quantity * (formData.unitPrice || 0)
    });
  };

  // Effect to calculate total amount when quantity or unit price changes
  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      totalAmount: prev.quantity * (prev.unitPrice || 0)
    }));
  }, [formData.quantity, formData.unitPrice]);

  return (
    <FormDialog
      title={initialData ? "Edit Sale Record" : "Record New Sale"}
      description="Record a new sale for your products."
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="date">Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="salesChannel">Sales Channel *</Label>
            <Select 
              value={formData.salesChannel} 
              onValueChange={(value) => handleSelectChange('salesChannel', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a sales channel" />
              </SelectTrigger>
              <SelectContent>
                {salesChannels.map(channel => (
                  <SelectItem key={channel.id} value={channel.id}>
                    {channel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="orderNo">Order No.</Label>
            <Input
              id="orderNo"
              name="orderNo"
              value={formData.orderNo}
              onChange={handleInputChange}
              placeholder="Order reference"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="invoiceNo">Invoice No.</Label>
            <Input
              id="invoiceNo"
              name="invoiceNo"
              value={formData.invoiceNo}
              onChange={handleInputChange}
              placeholder="Invoice reference"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="product">Product/SKU *</Label>
          <Select 
            value={formData.product} 
            onValueChange={(value) => handleSelectChange('product', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products.map(product => (
                <SelectItem key={product.id} value={product.id}>
                  {product.sku} - {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="0"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="unitPrice">Unit Price</Label>
            <Input
              id="unitPrice"
              name="unitPrice"
              type="number"
              step="0.01"
              min="0"
              value={formData.unitPrice}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="totalAmount">Total Amount</Label>
            <Input
              id="totalAmount"
              value={formData.totalAmount?.toFixed(2)}
              readOnly
              className="bg-muted"
            />
          </div>
        </div>
      </div>
    </FormDialog>
  );
};

export default SaleForm;
