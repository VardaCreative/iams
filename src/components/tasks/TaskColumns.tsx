
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Task } from './TaskManagement';

export const getTaskColumns = (handleEdit: (task: Task) => void, handleDelete: (task: Task) => void) => [
  { header: "Task ID", accessorKey: "taskId" },
  { 
    header: "Date Assigned", 
    accessorKey: "dateAssigned",
    cell: (value: Date) => value.toLocaleDateString() 
  },
  { header: "RM Assigned", accessorKey: "rmAssigned" },
  { header: "Process", accessorKey: "processAssigned" },
  { header: "Assigned Qty", accessorKey: "qtyAssigned" },
  { header: "Staff Name", accessorKey: "staffName" },
  { 
    header: "Date Completed", 
    accessorKey: "dateCompleted",
    cell: (value: Date | undefined) => value ? value.toLocaleDateString() : '-'
  },
  { 
    header: "Completed Qty", 
    accessorKey: "completedQty",
    cell: (value: number | undefined) => value !== undefined ? value : '-'
  },
  { 
    header: "Wastage Qty", 
    accessorKey: "wastageQty",
    cell: (value: number | undefined) => value !== undefined ? value : '-'
  },
  { header: "Remarks", accessorKey: "remarks" },
  { 
    header: "Status", 
    accessorKey: "status",
    cell: (value: string) => {
      if (value === 'completed') {
        return <div className="px-2 py-1 rounded-full text-xs font-medium w-fit bg-green-100 text-green-800">Completed</div>;
      }
      if (value === 'in-progress') {
        return <div className="px-2 py-1 rounded-full text-xs font-medium w-fit bg-blue-100 text-blue-800">In Progress</div>;
      }
      return <div className="px-2 py-1 rounded-full text-xs font-medium w-fit bg-amber-100 text-amber-800">Pending</div>;
    }
  },
  { 
    header: "Actions", 
    accessorKey: "id",
    cell: (value: string, row: Task) => (
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

export default getTaskColumns;
