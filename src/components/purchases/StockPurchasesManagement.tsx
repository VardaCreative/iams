
import React from 'react';
import DataTable from '@/components/ui/data-table';
import StockPurchaseForm from './StockPurchaseForm';
import PurchaseDeleteDialog from './PurchaseDeleteDialog';
import { getPurchaseColumns } from './PurchaseTableColumns';
import { usePurchasesManager, vendors, materials } from './hooks/usePurchasesManager';

const StockPurchasesManagement = () => {
  const {
    purchases,
    openForm,
    setOpenForm,
    openDeleteDialog,
    setOpenDeleteDialog,
    selectedPurchase,
    isLoading,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleSubmit,
    confirmDelete
  } = usePurchasesManager();

  // Get columns for the DataTable
  const columns = getPurchaseColumns({ handleEdit, handleDelete });

  return (
    <>
      <DataTable
        columns={columns}
        data={purchases}
        onAddNew={handleAddNew}
        addButtonText="Add Stock Purchase"
        searchPlaceholder="Search purchases..."
        enableImportExport={true}
      />

      <StockPurchaseForm
        open={openForm}
        onOpenChange={setOpenForm}
        onSubmit={handleSubmit}
        initialData={selectedPurchase || undefined}
        isLoading={isLoading}
        vendors={vendors}
        materials={materials}
      />

      <PurchaseDeleteDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        selectedPurchase={selectedPurchase}
        isLoading={isLoading}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default StockPurchasesManagement;
