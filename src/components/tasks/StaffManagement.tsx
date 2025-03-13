
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
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: '1',
      name: 'John Doe',
      staffId: 'EMP001',
      bloodGroup: 'O+',
      email: 'john@example.com',
      phone: '+91 98765 43210',
      address: '123 Main St, Bangalore',
      aadhaar: '1234 5678 9012',
      status: 'active'
    },
    {
      id: '2',
      name: 'Jane Smith',
      staffId: 'EMP002',
      bloodGroup: 'A+',
      email: 'jane@example.com',
      phone: '+91 87654 32109',
      address: '456 Park Ave, Mumbai',
      aadhaar: '9876 5432 1098',
      status: 'active'
    }
  ]);
  
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [trigger, setTrigger] = useState(0);

  // Effect to ensure the data is loaded when component mounts
  useEffect(() => {
    // In a real app, this would fetch data from an API or database
    console.log("Staff data loaded");
  }, [trigger]);

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

  const handleSubmit = (data: StaffMember) => {
    setIsLoading(true);
    
    // Persistence simulation
    setTimeout(() => {
      if (selectedStaff) {
        // Update existing staff
        setStaff(prev => 
          prev.map(member => 
            member.id === selectedStaff.id ? { ...data, id: selectedStaff.id } : member
          )
        );
        toast({
          title: "Staff updated",
          description: `${data.name} has been updated successfully.`,
        });
      } else {
        // Add new staff - ensure it has an ID
        const newStaff: StaffMember = {
          ...data,
          id: Date.now().toString(), // Generate temporary ID
        };
        setStaff(prev => [...prev, newStaff]);
        toast({
          title: "Staff added",
          description: `${data.name} has been added successfully.`,
        });
      }
      
      setIsLoading(false);
      setOpenForm(false);
      // Trigger refresh
      setTrigger(prev => prev + 1);
    }, 600);
  };

  const confirmDelete = () => {
    if (!selectedStaff) return;
    
    setIsLoading(true);
    
    // Delete simulation
    setTimeout(() => {
      setStaff(prev => 
        prev.filter(member => member.id !== selectedStaff.id)
      );
      
      toast({
        title: "Staff deleted",
        description: `${selectedStaff.name} has been deleted.`,
        variant: "destructive",
      });
      
      setIsLoading(false);
      setOpenDeleteDialog(false);
      // Trigger refresh
      setTrigger(prev => prev + 1);
    }, 600);
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
