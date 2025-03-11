
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardCardProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

const DashboardCard = ({
  title,
  className,
  children,
}: DashboardCardProps) => {
  return (
    <Card className={cn("overflow-hidden border shadow-sm transition-all duration-250 hover:shadow-md", className)}>
      <CardHeader className="p-4 bg-card">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
