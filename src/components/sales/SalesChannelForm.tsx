
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FormDialog from "@/components/common/FormDialog";

export interface SalesChannel {
  id: string; // Changed from optional to required
  name: string;
  description?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
}

interface SalesChannelFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SalesChannel) => void;
  initialData?: SalesChannel;
  isLoading?: boolean;
}

const SalesChannelForm = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData,
  isLoading = false
}: SalesChannelFormProps) => {
  const [formData, setFormData] = React.useState<SalesChannel>({
    name: '',
    description: '',
    contactPerson: '',
    email: '',
    phone: '',
    ...initialData
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <FormDialog
      title={initialData ? "Edit Sales Channel" : "Add Sales Channel"}
      description="Add or edit a sales channel for your products."
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Channel Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="E.g., Amazon, Retail Store"
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the channel"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="contactPerson">Contact Person</Label>
          <Input
            id="contactPerson"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            placeholder="Primary contact name"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Contact email"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Contact phone number"
            />
          </div>
        </div>
      </div>
    </FormDialog>
  );
};

export default SalesChannelForm;
