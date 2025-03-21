
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Task } from './TaskManagement';
import { ColumnDef } from '@tanstack/react-table';

export const getTaskColumns = (
  handleEdit: (task: Task) => void,
  handleDelete: (task: Task) => void
): ColumnDef<Task>[] => [
  {
    header: "Task ID",
    accessorKey: "taskId",
  },
  {
    header: "Process",
    accessorKey: "processAssigned",
  },
  {
    header: "Material",
    accessorKey: "rmAssigned",
  },
  {
    header: "Staff Assigned",
    accessorKey: "staffName",
  },
  {
    header: "Date Assigned",
    accessorKey: "dateAssigned",
    cell: ({ row }) => {
      const date = row.original.dateAssigned;
      return date ? format(new Date(date), 'dd/MM/yyyy') : '';
    },
  },
  {
    header: "Qty Assigned",
    accessorKey: "qtyAssigned",
  },
  {
    header: "Completion",
    accessorKey: "completedQty",
    cell: ({ row }) => {
      const completed = row.original.completedQty;
      const assigned = row.original.qtyAssigned;
      const percentage = assigned > 0 ? Math.round((completed || 0) / assigned * 100) : 0;
      return completed !== undefined ? `${completed} (${percentage}%)` : '-';
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status;
      let badgeColor;
      
      switch (status) {
        case 'completed':
          badgeColor = 'bg-green-500';
          break;
        case 'in-progress':
          badgeColor = 'bg-blue-500';
          break;
        default:
          badgeColor = 'bg-yellow-500';
      }
      
      return (
        <Badge className={`${badgeColor} hover:${badgeColor}`}>
          {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
        </Badge>
      );
    },
  },
  {
    header: "Actions",
    accessorKey: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(row.original)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(row.original)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      );
    },
  },
];
