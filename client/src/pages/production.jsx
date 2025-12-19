
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PrintingItemsForm from "@/components/forms/PrintingItemsForm";
import VatDyeingForm from "@/components/forms/VatDyeingForm";
import WeavingProductionPage from "@/components/forms/WeavingProductionForm";
import GreyRollsForm from "@/components/forms/GreyRollsForm";
import WeavingProductionPage2026 from "@/components/forms/WeavingProductionForm2026";

const ProductionPage = () => {
   const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="max-w-5xl mx-auto mt-2 px-2 sm:px-2  ">
    <Tabs defaultValue="warping-production" className="w-full">
       <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-12 md:mb-5">
          
          <TabsTrigger value="warping-production">Weaving Production</TabsTrigger>
          <TabsTrigger value="warping-production26">Weaving Production New</TabsTrigger>
          <TabsTrigger value="grey-rolls" className='px-4'>Grey Rolls</TabsTrigger>
        </TabsList>
        <TabsContent value="grey-rolls">
          <GreyRollsForm />
        </TabsContent>
        <TabsContent value="warping-production">
          <WeavingProductionPage />
        </TabsContent>
        <TabsContent value="warping-production26">
          <WeavingProductionPage2026 />
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