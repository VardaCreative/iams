
import React, { useState } from 'react';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import RawMaterialForm, { RawMaterial } from './RawMaterialForm';
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

const RawMaterialsManagement = () => {
  const [materials, setMaterials] = useState<RawMaterial[]>([
    {
      id: '1',
      code: 'RM001',
      name: 'Red Chilli',
      category: 'Spices',
      description: 'Medium heat red chilli',
      unit: 'kg',
      unitPrice: 120,
      minStockLevel: 50,
      status: 'active'
    },
    {
      id: '2',
      code: 'RM002',
      name: 'Turmeric',
      category: 'Spices',
      description: 'Pure ground turmeric powder',
      unit: 'kg',
      unitPrice: 180,
      minStockLevel: 30,
      status: 'active'
    }
  ]);
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    { header: "Code", accessorKey: "code" },
    { header: "Name", accessorKey: "name" },
    { header: "Category", accessorKey: "category" },
    { 
      header: "Unit", 
      accessorKey: "unit",
      cell: (value: string) => value.toUpperCase()
    },
    { 
      header: "Unit Price", 
      accessorKey: "unitPrice",
      cell: (value: number) => `₹${value.toFixed(2)}`
    },
    { 
      header: "Min. Stock", 
      accessorKey: "minStockLevel",
      cell: (value: number, row: RawMaterial) => `${value} ${row.unit.toUpperCase()}`
    },
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
      cell: (value: string, row: RawMaterial) => (
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
    setSelectedMaterial(null);
    setOpenForm(true);
  };

  const handleEdit = (material: RawMaterial) => {
    setSelectedMaterial(material);
    setOpenForm(true);
  };

  const handleDelete = (material: RawMaterial) => {
    setSelectedMaterial(material);
    setOpenDeleteDialog(true);
  };

  const handleSubmit = (data: RawMaterial) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (selectedMaterial) {
        // Update existing material
        setMaterials(prev => 
          prev.map(material => 
            material.id === selectedMaterial.id ? { ...data, id: selectedMaterial.id } : material
          )
        );
        toast({
          title: "Raw material updated",
          description: `${data.name} has been updated successfully.`,
        });
      } else {
        // Add new material - ensure it has an ID
        const newMaterial: RawMaterial = {
          ...data,
          id: Date.now().toString(), // Generate temporary ID
        };
        setMaterials(prev => [...prev, newMaterial]);
        toast({
          title: "Raw material added",
          description: `${data.name} has been added successfully.`,
        });
      }
      
      setIsLoading(false);
      setOpenForm(false);
    }, 600);
  };

  const confirmDelete = () => {
    if (!selectedMaterial) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setMaterials(prev => 
        prev.filter(material => material.id !== selectedMaterial.id)
      );
      
      toast({
        title: "Raw material deleted",
        description: `${selectedMaterial.name} has been deleted.`,
        variant: "destructive",
      });
      
      setIsLoading(false);
      setOpenDeleteDialog(false);
    }, 600);
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={materials}
        onAddNew={handleAddNew}
        addButtonText="Add Raw Material"
        searchPlaceholder="Search raw materials..."
        enableImportExport={true}
      />

      <RawMaterialForm
        open={openForm}
        onOpenChange={setOpenForm}
        onSubmit={handleSubmit}
        initialData={selectedMaterial || undefined}
        isLoading={isLoading}
      />

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the raw material "{selectedMaterial?.name}".
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

export default RawMaterialsManagement;
