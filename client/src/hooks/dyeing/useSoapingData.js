import { useEffect, useState } from "react";



import { getSoapingChemGPL, getSoapingTemp, getSoapingTimePh } from "../../components/functions/soapingFunctions";

export default function useSoapingData(scouring, selectedColour, dyeingSystem) {
  
  const [soapingTemp, setsoapingTemp] = useState(null);
  const [soapingDuration, setsoapingDuration] = useState(null);
  const [soapingPh, setsoapingPh] = useState(null);
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

        let soapingTemp = await getSoapingTemp(scouring, selectedColour, 20, dyeingSystem );
        // fetch time (column 21)
        if (soapingTemp ) {
         soapingTemp = String(soapingTemp).replace("?", "°");
         }
         
        const soapingDuration =  getSoapingTimePh(selectedColour, 21, dyeingSystem )
        const soapingPh =  getSoapingTimePh(selectedColour, 22, dyeingSystem )
        // fetch pH (column 22)
        

     if (mounted) {
          setsoapingGpl1(soapingGpl1);
          setsoapingGpl2(soapingGpl2);
          setsoapingTemp(soapingTemp);
          setsoapingDuration(soapingDuration);
          setsoapingPh(soapingPh);
          
        }
      } catch (err) {
        console.error("Failed loading soaping data", err);
        if (mounted) {
          
          setsoapingGpl1("dbErr");
          setsoapingGpl2("dbErr");
          setsoapingTemp("dbErr");
          setsoapingDuration("dbErr");
          setsoapingPh("dbErr");
          
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [dyeingSystem, selectedColour,scouring,]);

  return {  soapingGpl1, soapingGpl2,soapingTemp,soapingDuration ,soapingPh };
}
