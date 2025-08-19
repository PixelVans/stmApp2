import { useEffect, useState } from "react";

import { getHotwashTempTimeorPH } from "../components/functions/hotwashFunctions";

export default function useHotwashData(selectedColour, dyeingSystem) {
  
  const [hotwashTemp, sethotwashTemp] = useState(null);
  const [hotwashTime, sethotwashTime] = useState(null);
  const [hotwashPH, sethotwashPH] = useState(null);
  const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
    if (!dyeingSystem || !selectedColour) return;
      setLoading(true);
      setError(null);

      try {
        // fetch temperature (column 20)
        let temp = await getHotwashTempTimeorPH(selectedColour, dyeingSystem,20);
        
    if (temp) {
        temp = String(temp).replace("?", "°");

        }
         
        // fetch time (column 21)
        const time = await getHotwashTempTimeorPH(selectedColour, dyeingSystem, 21);

        // fetch pH (column 22)
        const ph = await getHotwashTempTimeorPH(selectedColour, dyeingSystem,  22);

     if (mounted) {
          sethotwashTemp(temp);
          sethotwashTime(time);
          sethotwashPH(ph);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed loading hotwash data", err);
        if (mounted) {
          
          sethotwashTemp("dbErr");
          sethotwashTime("dbErr");
          sethotwashPH("dbErr");
          setError("Server / DB error");
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [dyeingSystem, selectedColour]);

  return {  hotwashTemp, hotwashTime, hotwashPH, loading, error };
}
