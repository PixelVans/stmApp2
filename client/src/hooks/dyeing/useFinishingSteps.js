import { useEffect, useState } from "react";


import { 
  getFinishingChemGPL1, 
  getFinishingChemGPL2, 
  getFinishingTempTimePh, 
  
} from "../../components/functions/finishingFunctions";

export default function useFinishingData(scouring, selectedColour, softener, liqRatio8,) {
  const [finishingTemp, setFinishingTemp] = useState(null);
  const [finishingDuration, setFinishingDuration] = useState(null);
  const [finishingPh, setFinishingPh] = useState(null);
  const [finishingGpl1, setFinishingGpl1] = useState(null);
  const [finishingGpl2, setFinishingGpl2] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!selectedColour) return;
      setError(null);

      try {
        // fetch finishing GPLs
        const gpl1 = await getFinishingChemGPL1(scouring, selectedColour, softener);
        const gpl2 = await getFinishingChemGPL2(scouring, selectedColour, liqRatio8);

        // fetch temperature (column 20)
        let temp = await getFinishingTempTimePh(selectedColour, 20, scouring );
        if (temp) {
          temp = String(temp).replace("?", "°");
        }

        // fetch time (column 21) and pH (column 22)
        const duration = getFinishingTempTimePh(selectedColour, 21, scouring );
        const ph = getFinishingTempTimePh(selectedColour, 22, scouring );

        if (mounted) {
          setFinishingGpl1(gpl1);
          setFinishingGpl2(gpl2);
          setFinishingTemp(temp);
          setFinishingDuration(duration);
          setFinishingPh(ph);
        }
      } catch (err) {
        console.error("Failed loading finishing data", err);
        if (mounted) {
          setFinishingGpl1("dbErr");
          setFinishingGpl2("dbErr");
          setFinishingTemp("dbErr");
          setFinishingDuration("dbErr");
          setFinishingPh("dbErr");
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [softener, liqRatio8, selectedColour, scouring]);

  return { 
    finishingGpl1, 
    finishingGpl2, 
    finishingTemp, 
    finishingDuration, 
    finishingPh 
  };
}
