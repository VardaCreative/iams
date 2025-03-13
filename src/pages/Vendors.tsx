
import React from 'react';
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DataTable from "@/components/ui/data-table";
import VendorForm from "@/components/purchases/VendorForm";
import VendorManagement from "@/components/purchases/VendorManagement";

export default function Vendors() {
  return (
    <PageContainer
      title="Vendors"
      description="Manage your suppliers and vendors"
    >
      <Tabs defaultValue="vendors" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vendors">
          <VendorManagement />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
