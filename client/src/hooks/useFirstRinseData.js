import { useEffect, useState } from "react";

import { getFirstrinseTempTimePh } from "../components/functions/firstRinseFunctions";

export default function useFirstRinseData(scouring, selectedColour, dyeingSystem) {
  
  const [firstRinseTemp, sefirstRinseTemp] = useState(null);
  const [firstRinseDuration, setfirstRinseDuration] = useState(null);
  const [firstRinsePh, setfirstRinsePh] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
    if (!dyeingSystem || !selectedColour) return;
      setError(null);

      try {
        // fetch temperature (column 20)
        
        let firstRinseTemp = await getFirstrinseTempTimePh(scouring, selectedColour, 20, );
        const firstRinsePh = await getFirstrinseTempTimePh(scouring, selectedColour, 22, );
        const firstRinseDuration = await getFirstrinseTempTimePh(scouring, selectedColour, 21, );
        
        if (firstRinseTemp ) {
         firstRinseTemp = String(firstRinseTemp).replace("?", "°");
         }
         
        

     if (mounted) {
          sefirstRinseTemp(firstRinseTemp);
          setfirstRinseDuration(firstRinseDuration);
          setfirstRinsePh(firstRinsePh);
          
        }
      } catch (err) {
        console.error("Failed loading end data", err);
        if (mounted) {
          
          setendGpl1("dbErr");
          sefirstRinseTemp("dbErr");
          setfirstRinseDuration("dbErr");
          setfirstRinsePh("dbErr");
          
          
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [dyeingSystem, selectedColour,scouring,]);

  return { firstRinseTemp, firstRinsePh, firstRinseDuration };
}
