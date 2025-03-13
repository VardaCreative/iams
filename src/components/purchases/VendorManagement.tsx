
import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Phone, Mail } from 'lucide-react';
import VendorForm, { Vendor } from './VendorForm';
import { toast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from '@/integrations/supabase/client';
import { fetchVendors, saveVendor, deleteVendor } from '@/lib/database';

const VendorManagement = () => {
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: '1',
      name: 'Spice Traders Ltd.',
      contactPerson: 'John Smith',
      email: 'john@spicetraders.com',
      phone: '+91 98765 43210',
      address: '123 Spice Market, Mumbai',
      gstin: 'GSTIN12345678901',
      status: 'active'
    },
    {
      id: '2',
      name: 'Global Herbs & Spices',
      contactPerson: 'Rajesh Kumar',
      email: 'rajesh@globalherbs.com',
      phone: '+91 87654 32109',
      address: '456 Industrial Area, Delhi',
      gstin: 'GSTIN98765432109',
      status: 'active'
    }
  ]);
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load vendors from database on component mount and refresh trigger
  useEffect(() => {
    const loadVendors = async () => {
      setIsLoading(true);
      
      // In a real implementation, you would use the database.ts functions
      /*
      const data = await fetchVendors();
      if (data.length > 0) {
        // Map database fields to Vendor type if necessary
        const formattedVendors = data.map(vendor => ({
          id: vendor.id,
          name: vendor.name,
          contactPerson: vendor.contact_person,
          email: vendor.email,
          phone: vendor.phone,
          address: vendor.address,
          gstin: vendor.gstin,
          status: vendor.status
        }));
        setVendors(formattedVendors);
      }
      */
      
      // Simulate API delay
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };
    
    loadVendors();
  }, [refreshTrigger]);

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Contact Person", accessorKey: "contactPerson" },
    { 
      header: "Contact Info", 
      accessorKey: "id",
      cell: (value: string, row: Vendor) => (
        <div className="flex items-center gap-3">
          <a href={`mailto:${row.email}`} className="flex items-center text-sm text-muted-foreground hover:text-foreground">
            <Mail size={16} className="mr-1" />
            {row.email}
          </a>
          <a href={`tel:${row.phone}`} className="flex items-center text-sm text-muted-foreground hover:text-foreground">
            <Phone size={16} className="mr-1" />
            {row.phone}
          </a>
        </div>
      )
    },
    { header: "GSTIN", accessorKey: "gstin" },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: (value: string) => (
        <div className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${
          value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value === 'active' ? 'Active' : 'Inactive'}
        </div>
      )
    },
    { 
      header: "Actions", 
      accessorKey: "id",
      cell: (value: string, row: Vendor) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row);
            }}
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row);
            }}
          >
            <Trash2 size={16} className="text-destructive" />
          </Button>
        </div>
      )
    }
  ];

  const handleAddNew = () => {
    setSelectedVendor(null);
    setOpenForm(true);
  };

  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setOpenForm(true);
  };

  const handleDelete = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setOpenDeleteDialog(true);
  };

  const handleSubmit = async (data: Vendor) => {
    setIsLoading(true);
    
    try {
      if (selectedVendor) {
        // Update existing vendor
        const updatedVendor = { ...data, id: selectedVendor.id };
        
        // In a real implementation:
        /*
        const savedVendor = await saveVendor({
          id: updatedVendor.id,
          name: updatedVendor.name,
          contact_person: updatedVendor.contactPerson,
          email: updatedVendor.email,
          phone: updatedVendor.phone,
          address: updatedVendor.address,
          gstin: updatedVendor.gstin,
          status: updatedVendor.status
        });
        
        if (savedVendor) {
          // Update succeeded, refresh the vendor list
          setRefreshTrigger(prev => prev + 1);
        }
        */
        
        // For now, update local state
        setVendors(prev => 
          prev.map(vendor => 
            vendor.id === selectedVendor.id ? updatedVendor : vendor
          )
        );
        
        toast({
          title: "Vendor updated",
          description: `${data.name} has been updated successfully.`,
        });
      } else {
        // Add new vendor - ensure it has an ID
        const newVendor: Vendor = {
          ...data,
          id: Date.now().toString(), // Generate temporary ID
        };
        
        // In a real implementation:
        /*
        const savedVendor = await saveVendor({
          id: newVendor.id,
          name: newVendor.name,
          contact_person: newVendor.contactPerson,
          email: newVendor.email,
          phone: newVendor.phone,
          address: newVendor.address,
          gstin: newVendor.gstin,
          status: newVendor.status
        });
        
        if (savedVendor) {
          // Save succeeded, refresh the vendor list
          setRefreshTrigger(prev => prev + 1);
        }
        */
        
        // For now, update local state
        setVendors(prev => [...prev, newVendor]);
        
        toast({
          title: "Vendor added",
          description: `${data.name} has been added successfully.`,
        });
      }
    } catch (error) {
      console.error('Error saving vendor:', error);
      toast({
        title: "Error saving vendor",
        description: "An error occurred while saving the vendor data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setOpenForm(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedVendor) return;
    
    setIsLoading(true);
    
    try {
      // In a real implementation:
      /*
      const success = await deleteVendor(selectedVendor.id);
      
      if (success) {
        // Delete succeeded, refresh the vendor list
        setRefreshTrigger(prev => prev + 1);
      }
      */
      
      // For now, update local state
      setVendors(prev => 
        prev.filter(vendor => vendor.id !== selectedVendor.id)
      );
      
      toast({
        title: "Vendor deleted",
        description: `${selectedVendor.name} has been deleted.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast({
        title: "Error deleting vendor",
        description: "An error occurred while deleting the vendor.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={vendors}
        onAddNew={handleAddNew}
        addButtonText="Add Vendor"
        searchPlaceholder="Search vendors..."
        enableImportExport={true}
        isLoading={isLoading}
      />

      <VendorForm
        open={openForm}
        onOpenChange={setOpenForm}
        onSubmit={handleSubmit}
        initialData={selectedVendor || undefined}
        isLoading={isLoading}
      />

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the vendor "{selectedVendor?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default VendorManagement;
