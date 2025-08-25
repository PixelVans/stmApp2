import { useEffect, useState } from "react";


import {  getEndTemp, getEndTimePh } from "../components/functions/endFunctions";
import { getSoapingChemGPL } from "../components/functions/soapingFunctions";

export default function useSoapingData(scouring, selectedColour, dyeingSystem) {
  
  const [endTemp, setendTemp] = useState(null);
  const [endDuration, setendDuration] = useState(null);
  const [endPh, setendPh] = useState(null);
  const [soapingGpl1, setsoapingGpl1] = useState(null);
  const [soapingGpl2, setsoapingGpl2] = useState(null);
 const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
    if (!dyeingSystem || !selectedColour) return;
      setError(null);

      try {
        // fetch temperature (column 20)
        
        
        
         
        const soapingGpl1 = await getSoapingChemGPL(dyeingSystem, selectedColour, 2);
        const soapingGpl2 = await getSoapingChemGPL(dyeingSystem, selectedColour, 3);

        let endTemp = await getEndTemp(scouring, selectedColour, 21, dyeingSystem );
        // fetch time (column 21)
        if (endTemp ) {
         endTemp = String(endTemp).replace("?", "°");
         }
         
        const endDuration =  getEndTimePh(selectedColour, 25, dyeingSystem )
        const endPh =  getEndTimePh(selectedColour, 28, dyeingSystem )
        // fetch pH (column 22)
        

     if (mounted) {
          setsoapingGpl1(soapingGpl1);
          setsoapingGpl2(soapingGpl2);
          setendTemp(endTemp);
          setendDuration(endDuration);
          setendPh(endPh);
          
        }
      } catch (err) {
        console.error("Failed loading end data", err);
        if (mounted) {
          
          setsoapingGpl1("dbErr");
          setsoapingGpl2("dbErr");
          setendTemp("dbErr");
          setendDuration("dbErr");
          setendPh("dbErr");
          
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [dyeingSystem, selectedColour,scouring,]);

  return {  soapingGpl1, soapingGpl2,  };
}
