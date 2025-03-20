
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Task } from './TaskManagement';

export const getTaskColumns = (handleEdit: (task: Task) => void, handleDelete: (task: Task) => void) => [
  { 
    header: "Task ID", 
    accessorKey: "taskId" 
  },
  { 
    header: "Date Assigned", 
    accessorKey: "dateAssigned",
    cell: ({ getValue }: { getValue: () => any }) => {
      const value = getValue();
      return value instanceof Date ? value.toLocaleDateString() : '-';
    }
  },
  { 
    header: "RM Assigned", 
    accessorKey: "rmAssigned" 
  },
  { 
    header: "Process", 
    accessorKey: "processAssigned" 
  },
  { 
    header: "Assigned Qty", 
    accessorKey: "qtyAssigned",
    cell: ({ getValue }: { getValue: () => any }) => {
      const value = getValue();
      return value !== undefined ? Number(value).toFixed(2) : '-';
    }
  },
  { 
    header: "Staff Name", 
    accessorKey: "staffName" 
  },
  { 
    header: "Date Completed", 
    accessorKey: "dateCompleted",
    cell: ({ getValue }: { getValue: () => any }) => {
      const value = getValue();
      return value instanceof Date ? value.toLocaleDateString() : '-';
    }
  },
  { 
    header: "Completed Qty", 
    accessorKey: "completedQty",
    cell: ({ getValue }: { getValue: () => any }) => {
      const value = getValue();
      return value !== undefined ? Number(value).toFixed(2) : '-';
    }
  },
  { 
    header: "Wastage Qty", 
    accessorKey: "wastageQty",
    cell: ({ getValue }: { getValue: () => any }) => {
      const value = getValue();
      return value !== undefined ? Number(value).toFixed(2) : '-';
    }
  },
  { 
    header: "Remarks", 
    accessorKey: "remarks" 
  },
  { 
    header: "Status", 
    accessorKey: "status",
    cell: ({ getValue }: { getValue: () => any }) => {
      const value = getValue();
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
    id: "actions",
    cell: ({ row }: { row: { original: Task } }) => {
      const task = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(task);
            }}
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(task);
            }}
          >
            <Trash2 size={16} className="text-destructive" />
          </Button>
        </div>
      );
    }
  }
];

export default getTaskColumns;
