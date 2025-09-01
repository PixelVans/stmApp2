import { useEffect, useState } from "react";


import { getEndChemGPL, getEndTemp, getEndTimePh } from "../../components/functions/endFunctions";

export default function useEndData(scouring, selectedColour, dyeingSystem) {
  
  const [endTemp, setendTemp] = useState(null);
  const [endDuration, setendDuration] = useState(null);
  const [endPh, setendPh] = useState(null);
  const [endGpl1, setendGpl1] = useState(null);
  const [endGpl2, setendGpl2] = useState(null);
 const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
    if (!dyeingSystem || !selectedColour) return;
      setError(null);

      try {
        // fetch temperature (column 20)
        
        
        
         
        const endGpl1 = await getEndChemGPL(dyeingSystem, selectedColour, 6);
        const endGpl2 = await getEndChemGPL(dyeingSystem, selectedColour, 8);

        let endTemp = await getEndTemp(scouring, selectedColour, 21, dyeingSystem );
        // fetch time (column 21)
        if (endTemp ) {
         endTemp = String(endTemp).replace("?", "°");
         }
         
        const endDuration =  getEndTimePh(selectedColour, 25, dyeingSystem )
        const endPh =  getEndTimePh(selectedColour, 28, dyeingSystem )
        // fetch pH (column 22)
        

     if (mounted) {
          setendGpl1(endGpl1);
          setendGpl2(endGpl2);
          setendTemp(endTemp);
          setendDuration(endDuration);
          setendPh(endPh);
          
        }
      } catch (err) {
        console.error("Failed loading end data", err);
        if (mounted) {
          
          setendGpl1("dbErr");
          setendGpl2("dbErr");
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

  return {  endGpl1, endGpl2, endTemp, endDuration, endPh };
}
