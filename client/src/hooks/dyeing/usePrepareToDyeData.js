import { useEffect, useState } from "react";
import { getPrepareToDyeChem1GPL, getPrepareToDyeChem2GPL, getPrepareToDyeChem3GPL, 
  getPrepareToDyePhorTime, getPrepareToDyeTemperature } from "../../components/functions/prepareToDyeFunctions";

export default function usePrepareToDyeData(selectedColour, dyeingSystem, scouring, ) {
  
  const [prepareToDyeChem1Gpl, setprepareToDyeChem1Gpl] = useState(null);
  const [prepareToDyeChem2Gpl, setprepareToDyeChem2Gpl] = useState(null);
  const [prepareToDyeChem3Gpl, setprepareToDyeChem3Gpl] = useState(null);
  const [prepareToDyeTemp, setprepareToDyeTemp] = useState(null);
  const [prepareToDyePh, setprepareToDyePh] = useState(null);
  const [prepareToDyeTime, setprepareToDyeTime] = useState(null);
  

  useEffect(() => {
    let mounted = true;

    async function load() {
    if (!dyeingSystem || !selectedColour) return;
      

      try {
        
        const prepareToDyeChem1Gpl = await getPrepareToDyeChem1GPL(selectedColour, dyeingSystem, );
        const prepareToDyeChem2Gpl = await getPrepareToDyeChem2GPL(selectedColour, dyeingSystem, scouring);
        const prepareToDyeChem3Gpl = await getPrepareToDyeChem3GPL(selectedColour, dyeingSystem, scouring);
        const prepareToDyeTime = await getPrepareToDyePhorTime(selectedColour, dyeingSystem, 21)
        const prepareToDyePh = await getPrepareToDyePhorTime(selectedColour, dyeingSystem, 22)
        let prepareToDyeTemp = await getPrepareToDyeTemperature(selectedColour, dyeingSystem, scouring)

        if (prepareToDyeTemp) {
        prepareToDyeTemp = String(prepareToDyeTemp).replace("?", "°");

        }
        
     if (mounted) {
          setprepareToDyeChem1Gpl(prepareToDyeChem1Gpl);
          setprepareToDyeChem2Gpl(prepareToDyeChem2Gpl);
          setprepareToDyeChem3Gpl(prepareToDyeChem3Gpl);
          setprepareToDyeTime(prepareToDyeTime);
          setprepareToDyePh(prepareToDyePh);
          setprepareToDyeTemp(prepareToDyeTemp);
        }
      } catch (err) {

        console.error("Failed loading prepare to dye data", err);

        if (mounted) {
          setprepareToDyeChem1Gpl("dbErr");
          setprepareToDyeChem2Gpl("dbErr");
          setprepareToDyeChem3Gpl("dbErr");
          setprepareToDyeTime("dbErr");
          setprepareToDyePh("dbErr");
          setprepareToDyeTemp("dbErr");
          
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [dyeingSystem, selectedColour, scouring]);

  return {  prepareToDyeChem1Gpl, prepareToDyeChem2Gpl,prepareToDyeChem3Gpl, prepareToDyeTime, prepareToDyePh, prepareToDyeTemp  };
}
