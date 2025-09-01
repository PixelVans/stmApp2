import { useEffect, useState } from "react";

import { getFinalRinseTempTimePh } from "../../components/functions/finalRinseFunctions";

export default function useFinalRinseData(scouring, selectedColour,) {
  
  const [finalRinseTemp, setfinalRinseTemp] = useState(null);
  const [finalRinseDuration, setfinalRinseDuration] = useState(null);
  const [finalRinsePh, setfinalRinsePh] = useState(null);
  

  useEffect(() => {
    let mounted = true;

    async function load() {
    if (!scouring || !selectedColour) return;
      

      try {
        // fetch temperature (column 20)
        

        let finalRinseTemp = await getFinalRinseTempTimePh(selectedColour, 20, scouring );
        // fetch time (column 21)
        if (finalRinseTemp ) {
         finalRinseTemp = String(finalRinseTemp).replace("?", "°");
         }
         
        const finalRinseDuration =  getFinalRinseTempTimePh(selectedColour, 21, scouring )
        const finalRinsePh =  getFinalRinseTempTimePh(selectedColour, 22, scouring )
        // fetch pH (column 22)
        

     if (mounted) {
          setfinalRinseTemp(finalRinseTemp);
          setfinalRinseDuration(finalRinseDuration);
          setfinalRinsePh(finalRinsePh);
          
        }
      } catch (err) {
        console.error("Failed loading final rinse data", err);
        if (mounted) {
          
          setfinalRinseTemp("dbErr");
          setfinalRinseDuration("dbErr");
          setfinalRinsePh("dbErr");
          
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [selectedColour,scouring,]);

  return {finalRinseTemp,finalRinseDuration ,finalRinsePh };
}
