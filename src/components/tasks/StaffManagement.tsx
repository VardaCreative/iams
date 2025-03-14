
import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Phone, Mail } from 'lucide-react';
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
import StaffForm from './StaffForm';
import { supabase } from '@/integrations/supabase/client';
import { fetchStaff, saveStaff, deleteStaff } from '@/lib/database';

export interface StaffMember {
  id: string;
  name: string;
  staffId: string;
  bloodGroup: string;
  email: string;
  phone: string;
  address: string;
  aadhaar: string;
  status: 'active' | 'inactive';
}

const StaffManagement = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Effect to ensure the data is loaded when component mounts
  useEffect(() => {
    const loadStaff = async () => {
      setIsLoading(true);
      try {
        const data = await fetchStaff();
        console.log('Fetched staff data:', data);
        
        // Map database structure to frontend structure
        const mappedData = data.map(item => ({
          id: item.id,
          name: item.name,
          staffId: item.staff_id,
          bloodGroup: item.blood_group || '',
          email: item.email,
          phone: item.phone,
          address: item.address,
          aadhaar: item.aadhaar,
          status: item.status as 'active' | 'inactive'
        }));
        
        setStaff(mappedData);
      } catch (error) {
        console.error('Error loading staff:', error);
        toast({
          title: "Failed to load staff",
          description: "There was an error loading staff data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStaff();
    console.log("Staff data loaded");
  }, [refreshTrigger]);

  const columns = [
    { header: "Staff ID", accessorKey: "staffId" },
    { header: "Name", accessorKey: "name" },
    { header: "Blood Group", accessorKey: "bloodGroup" },
    { 
      header: "Contact Info", 
      accessorKey: "id",
      cell: (value: string, row: StaffMember) => (
        <div className="flex flex-col gap-1">
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
    { header: "Aadhaar", accessorKey: "aadhaar" },
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
      cell: (value: string, row: StaffMember) => (
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
    setSelectedStaff(null);
    setOpenForm(true);
  };

  const handleEdit = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember);
    setOpenForm(true);
  };

  const handleDelete = (staffMember: StaffMember) => {
    setSelectedStaff(staffMember);
    setOpenDeleteDialog(true);
  };

  const handleSubmit = async (data: StaffMember) => {
    setIsLoading(true);
    
    try {
      console.log('Saving staff data:', data);
      
      // Map frontend structure to database structure
      const dbStaff = {
        id: data.id,
        name: data.name,
        staff_id: data.staffId,
        blood_group: data.bloodGroup,
        email: data.email,
        phone: data.phone,
        address: data.address,
        aadhaar: data.aadhaar,
        status: data.status
      };
      
      const savedStaff = await saveStaff(dbStaff);
      console.log('Staff saved response:', savedStaff);
      
      if (savedStaff) {
        setRefreshTrigger(prev => prev + 1);
        setOpenForm(false);
        toast({
          title: "Staff member saved",
          description: "Staff member has been saved successfully",
        });
      }
    } catch (error) {
      console.error('Error saving staff:', error);
      toast({
        title: "Failed to save staff member",
        description: "There was an error saving the staff member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedStaff) return;
    
    setIsLoading(true);
    
    try {
      console.log('Deleting staff:', selectedStaff.id);
      const success = await deleteStaff(selectedStaff.id);
      
      if (success) {
        setRefreshTrigger(prev => prev + 1);
        setOpenDeleteDialog(false);
        toast({
          title: "Staff member deleted",
          description: "Staff member has been deleted successfully",
        });
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast({
        title: "Failed to delete staff member",
        description: "There was an error deleting the staff member. Please try again.",
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
        data={staff}
        onAddNew={handleAddNew}
        addButtonText="Add Staff Member"
        searchPlaceholder="Search staff..."
        enableImportExport={true}
        isLoading={isLoading}
      />

      <StaffForm
        open={openForm}
        onOpenChange={setOpenForm}
        onSubmit={handleSubmit}
        initialData={selectedStaff || undefined}
        isLoading={isLoading}
      />

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the staff member "{selectedStaff?.name}".
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

export default StaffManagement;
