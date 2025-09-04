import { useMemo } from "react";
import useDyeingStore from "../../store/zustand";
import useWeavingData from "./useWeavingProductionData";


export default function useProductionSteps() {
 const { selectedWeek } = useDyeingStore();
 const { data, loading, error } = useWeavingData(selectedWeek);
 let steps = [];
  if (!loading && !error && data) {

    console.log("From this value: data.Tue.machines[1].shiftA we are getting ", data.Tue.machines[1].shiftA)
    steps = [
      {
    machine: "Machine No: 1",
    rows: [
      {
        prodInfo:"Machine 1 Shift A",
        mon: data.Mon.machines[1].shiftA, 
        tue: data.Tue.machines[1].shiftA, 
        wed: data.Wed.machines[1].shiftA, 
        thur: data.Thur.machines[1].shiftA ,
        fri: data.Fri.machines[1].shiftA, 
        sat: data.Sat.machines[1].shiftA,
        sun: data.Sun.machines[1].shiftA,
        total: "",
      },
      {
        prodInfo:"Notes - A",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Beam Number",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Shift B",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Notes B",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Article",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Beam Number",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      
    ],
  },
     {
    machine: "Machine No: 2",
    rows: [
      {
        prodInfo:"Machine 2 Shift A",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Notes - A",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Beam Number",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Shift B",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Notes B",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Article",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Beam Number",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      
    ],
  },
     {
    machine: "Machine No: 3",
    rows: [
      {
        prodInfo:"Machine 3 Shift A",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Notes - A",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Beam Number",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Shift B",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Notes B",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Article",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Beam Number",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      
    ],
  },
     {
    machine: "Machine No: 4",
    rows: [
      {
        prodInfo:"Machine 4 Shift A",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Notes - A",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Beam Number",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Shift B",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Notes B",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Article",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      {
        prodInfo:"Beam Number",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      
    ],
  },{
    
    rows: [
      {
        prodInfo:"Daily  Total",
        mon: "",
        tue: "",
        wed: "",
        thur: "",
        fri: "",
        sat: "",
        sun: "",
        total: "",
      },
      
      
    ],
  },
   
    ]
  }

  

    
  

        
  
return { steps, loading, error };



}
