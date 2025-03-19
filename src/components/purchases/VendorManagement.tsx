import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import VendorForm from './VendorForm';
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
import { fetchVendors, saveVendor, deleteVendor } from '@/lib/database';
import { Vendor } from './types';

const VendorManagement = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const loadVendors = async () => {
      setIsLoading(true);
      try {
        const data = await fetchVendors();
        console.log('Fetched vendors:', data);
        
        const mappedVendors: Vendor[] = data.map(vendor => ({
          id: vendor.id,
          name: vendor.name,
          contact_person: vendor.contact_person || '',
          email: vendor.email || '',
          phone: vendor.phone || '',
          address: vendor.address || '',
          gstin: vendor.gstin || '',
          status: vendor.status === 'active' ? 'active' as const : 'inactive' as const
        }));
        
        setVendors(mappedVendors);
      } catch (error) {
        console.error('Error loading vendors:', error);
        toast({
          title: "Failed to load vendors",
          description: "There was an error loading vendors. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadVendors();
  }, [refreshTrigger]);

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Contact Person", accessorKey: "contact_person" },
    { header: "Email", accessorKey: "email" },
    { header: "Phone", accessorKey: "phone" },
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
      console.log('Submitting vendor data:', data);
      const savedVendor = await saveVendor(data);
      
      if (savedVendor) {
        setRefreshTrigger(prev => prev + 1);
        setOpenForm(false);
        toast({
          title: "Vendor saved",
          description: `${data.name} has been saved successfully`,
        });
      }
    } catch (error) {
      console.error('Error saving vendor:', error);
      toast({
        title: "Failed to save vendor",
        description: "There was an error saving the vendor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedVendor) return;
    
    setIsLoading(true);
    
    try {
      console.log('Deleting vendor:', selectedVendor.id);
      const success = await deleteVendor(selectedVendor.id);
      
      if (success) {
        setRefreshTrigger(prev => prev + 1);
        setOpenDeleteDialog(false);
        toast({
          title: "Vendor deleted",
          description: "Vendor has been deleted successfully",
        });
      }
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast({
        title: "Failed to delete vendor",
        description: "There was an error deleting the vendor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
