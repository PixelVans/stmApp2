import Header from "@/components/dashboard/Header";
import MachineAlerts from "@/components/dashboard/MachineAlerts";
import WaterReserve from "@/components/dashboard/WaterReserve";
import CriticalInventory from "@/components/dashboard/CriticalInventory";
import GreyRolls from "@/components/dashboard/GreyRolls";
import MachineHeatmap from "@/components/dashboard/MachineHeatmap";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-9 pb-12">
        <Header />
        
        <MachineAlerts />

        {/* Main Grid: Water, Inventory, Grey Rolls */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <WaterReserve />
          <CriticalInventory />
          <GreyRolls />
        </div>

        {/* Heatmap Section */}
        <MachineHeatmap />
      </div>
    </div>
  );
};

export default DashboardPage;
