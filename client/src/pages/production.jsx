
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PrintingItemsForm from "@/components/forms/PrintingItemsForm";
import VatDyeingForm from "@/components/forms/VatDyeingForm";
import WarpingStockForm from "@/components/forms/WarpingStockForm";
import WeavingProductionPage from "@/components/forms/WeavingProductionForm";

const ProductionPage = () => {
   const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="max-w-5xl mx-auto mt-2 px-2 sm:px-4  ">
    <Tabs defaultValue="warping-stock" className="w-full">
        <TabsList className="flex gri-cols-2 sm:grid-cols-4 gap-2 justify-baseline w-full mb-12 md:mb-5">
          <TabsTrigger value="warping-stock" className='px-4'>Grey Rolls</TabsTrigger>
          <TabsTrigger value="warping-production">Weaving Production</TabsTrigger>
        </TabsList>
        <TabsContent value="warping-stock">
          <WarpingStockForm />
        </TabsContent>
        <TabsContent value="warping-production">
          <WeavingProductionPage />
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

export default ProductionPage