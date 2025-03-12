import React, { useState } from 'react';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import SalesChannelForm, { SalesChannel } from './SalesChannelForm';
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
import { toast } from "@/hooks/use-toast";

interface SalesChannelsProps {
  salesChannels: SalesChannel[];
  setSalesChannels: React.Dispatch<React.SetStateAction<SalesChannel[]>>;
}

const SalesChannels = ({ salesChannels, setSalesChannels }: SalesChannelsProps) => {
  const [openForm, setOpenForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<SalesChannel | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    { header: "Channel Name", accessorKey: "name" },
    { header: "Description", accessorKey: "description" },
    { header: "Contact Person", accessorKey: "contactPerson" },
    { header: "Email", accessorKey: "email" },
    { header: "Phone", accessorKey: "phone" },
    { 
      header: "Actions", 
      accessorKey: "id",
      cell: (value: string, row: SalesChannel) => (
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
    setSelectedChannel(null);
    setOpenForm(true);
  };

  const handleEdit = (channel: SalesChannel) => {
    setSelectedChannel(channel);
    setOpenForm(true);
  };

  const handleDelete = (channel: SalesChannel) => {
    setSelectedChannel(channel);
    setOpenDeleteDialog(true);
  };

  const handleSubmit = (data: SalesChannel) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (selectedChannel) {
        // Update existing channel
        setSalesChannels(prev => 
          prev.map(channel => 
            channel.id === selectedChannel.id ? { ...data, id: selectedChannel.id } : channel
          )
        );
        toast({
          title: "Channel updated",
          description: `${data.name} has been updated successfully.`,
        });
      } else {
        // Add new channel - ensure it has an ID
        const newChannel: SalesChannel = {
          ...data,
          id: Date.now().toString(), // Generate temporary ID
        };
        setSalesChannels(prev => [...prev, newChannel]);
        toast({
          title: "Channel added",
          description: `${data.name} has been added successfully.`,
        });
      }
      
      setIsLoading(false);
      setOpenForm(false);
    }, 600);
  };

  const confirmDelete = () => {
    if (!selectedChannel) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSalesChannels(prev => 
        prev.filter(channel => channel.id !== selectedChannel.id)
      );
      
      toast({
        title: "Channel deleted",
        description: `${selectedChannel.name} has been deleted.`,
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
        data={salesChannels}
        onAddNew={handleAddNew}
        addButtonText="Add Sales Channel"
        searchPlaceholder="Search channels..."
        enableImportExport={true}
      />

      <SalesChannelForm
        open={openForm}
        onOpenChange={setOpenForm}
        onSubmit={handleSubmit}
        initialData={selectedChannel || undefined}
        isLoading={isLoading}
      />

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the sales channel
              {selectedChannel && <Badge variant="outline" className="ml-1">{selectedChannel.name}</Badge>}.
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

export default SalesChannels;
