
import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { fetchRawMaterials, saveRawMaterial, deleteRawMaterial } from '@/lib/database';

const RawMaterialsManagement = () => {
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const loadMaterials = async () => {
      setIsLoading(true);
      try {
        const data = await fetchRawMaterials();
        console.log('Fetched raw materials:', data);
        
        // Map database data to the expected RawMaterial type
        const mappedMaterials = data.map(material => ({
          id: material.id,
          code: material.code,
          name: material.name,
          category: material.category,
          description: material.description || '',
          unit: material.unit,
          min_stock_level: material.min_stock_level,
          status: material.status === 'active' ? 'active' as const : 'inactive' as const
        }));
        
        setMaterials(mappedMaterials);
      } catch (error) {
        console.error('Error loading materials:', error);
        toast({
          title: "Failed to load raw materials",
          description: "There was an error loading raw materials. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMaterials();
  }, [refreshTrigger]);

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
      header: "Min. Stock", 
      accessorKey: "min_stock_level",
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

  const handleSubmit = async (data: RawMaterial) => {
    setIsLoading(true);
    
    try {
      console.log('Submitting raw material data:', data);
      const savedMaterial = await saveRawMaterial(data);
      
      if (savedMaterial) {
        setRefreshTrigger(prev => prev + 1);
        setOpenForm(false);
        toast({
          title: "Raw material saved",
          description: `${data.name} has been saved successfully`,
        });
      }
    } catch (error) {
      console.error('Error saving material:', error);
      toast({
        title: "Failed to save raw material",
        description: "There was an error saving the raw material. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedMaterial) return;
    
    setIsLoading(true);
    
    try {
      console.log('Deleting raw material:', selectedMaterial.id);
      const success = await deleteRawMaterial(selectedMaterial.id);
      
      if (success) {
        setRefreshTrigger(prev => prev + 1);
        setOpenDeleteDialog(false);
        toast({
          title: "Raw material deleted",
          description: "Raw material has been deleted successfully",
        });
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      toast({
        title: "Failed to delete raw material",
        description: "There was an error deleting the raw material. Please try again.",
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
        data={materials}
        onAddNew={handleAddNew}
        addButtonText="Add Raw Material"
        searchPlaceholder="Search raw materials..."
        enableImportExport={true}
        isLoading={isLoading}
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
