"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ChemicalsForm from "@/components/forms/ChemicalsForm";
import DyestuffsForm from "@/components/forms/DyestuffsForm";
import PrintingItemsForm from "@/components/forms/PrintingItemsForm";
import VatDyeingForm from "@/components/forms/VatDyeingForm";

export default function UpdateStockPage() {
  
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="max-w-5xl mx-auto mt-5 px-2 sm:px-4  ">
    <Tabs defaultValue="chemicals" className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-12 md:mb-5">
          <TabsTrigger value="chemicals">Chemicals</TabsTrigger>
          <TabsTrigger value="dyestuffs">Dyestuffs</TabsTrigger>
          <TabsTrigger value="printing">Printing Items</TabsTrigger>
          <TabsTrigger value="vat">VAT Dyeing</TabsTrigger>
        </TabsList>

        <TabsContent value="chemicals">
          <ChemicalsForm />
        </TabsContent>
        <TabsContent value="dyestuffs">
          <DyestuffsForm />
        </TabsContent>
        <TabsContent value="printing">
          <PrintingItemsForm />
        </TabsContent>
        <TabsContent value="vat">
          <VatDyeingForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
