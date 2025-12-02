
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import PrintingItemsForm from "@/components/forms/PrintingItemsForm";
import VatDyeingForm from "@/components/forms/VatDyeingForm";
import WarpingProductionForm from "@/components/forms/WarpingProductionForm";
import YarnStockForm from "@/components/forms/YarnStockForm";
import BagsAndConesForm from "@/components/forms/BagsAndCones";

const WarpingPage = () => {
   const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="max-w-5xl mx-auto mt-2 2xl:mt-5 px-2 sm:px-4  ">
    <Tabs defaultValue="warping-production" className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-12 md:mb-5">
          
          <TabsTrigger value="warping-production">Warping Production</TabsTrigger>
          <TabsTrigger value="warping-stock">Yarn Stock</TabsTrigger>
          <TabsTrigger value="bags&cones">Bags & Cones</TabsTrigger>
        </TabsList>

        <TabsContent value="warping-stock">
          <YarnStockForm />
        </TabsContent>

        <TabsContent value="bags&cones">
          <BagsAndConesForm />
        </TabsContent>

        <TabsContent value="warping-production">
          <WarpingProductionForm />
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

export default WarpingPage