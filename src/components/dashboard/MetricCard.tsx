
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

const metricCardVariants = cva(
  "rounded-xl p-4 transition-all duration-250 border overflow-hidden shadow-sm hover:shadow-md space-y-2",
  {
    variants: {
      variant: {
        default: "bg-card border-border",
        primary: "bg-primary/10 border-primary/20 text-primary-foreground",
        secondary: "bg-secondary border-secondary/50",
        success: "bg-emerald-50 border-emerald-200 text-emerald-900",
        warning: "bg-amber-50 border-amber-200 text-amber-900",
        danger: "bg-rose-50 border-rose-200 text-rose-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface MetricCardProps extends VariantProps<typeof metricCardVariants> {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: LucideIcon;
  className?: string;
}

const MetricCard = ({
  title,
  value,
  trend,
  icon: Icon,
  variant,
  className,
}: MetricCardProps) => {
  return (
    <div className={cn(metricCardVariants({ variant }), className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {Icon && (
          <div className="h-8 w-8 rounded-md flex items-center justify-center bg-background/50">
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-semibold">{value}</p>
        {trend && (
          <div 
            className={cn(
              "text-xs font-medium rounded-full px-2 py-1",
              trend.isPositive ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
            )}
          >
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
