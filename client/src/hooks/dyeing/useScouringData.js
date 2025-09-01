import { useEffect, useState } from "react";
import { 
  getHotwashGPL,
  getScouringChemGPL, 
  getScouringTemperature, 
  getScouringTimeorPH 
} from "../../components/functions/dyeingFunctions";

export default function useScouringData(scouring, selectedColour,dyeingSystem) {
  const [values, setValues] = useState({});
  const [scouringTemp, setScouringTemp] = useState(null);
  const [scouringTime, setScouringTime] = useState(null);
  const [scouringPH, setScouringPH] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hotwashGpl, sethotwashGpl] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!scouring || !selectedColour) return;
      setLoading(true);
      setError(null);

      try {
        const results = {};

        // fetch all chemicals
        for (let pos = 1; pos <= 7; pos++) {
          results[pos] = await getScouringChemGPL(scouring, selectedColour, pos);
        }

        // fetch temperature
        const temp = await getScouringTemperature(scouring, selectedColour);

        // fetch time (column 21)
        const time = await getScouringTimeorPH(scouring, selectedColour, 21);

        // fetch pH (column 22)
        const ph = await getScouringTimeorPH(scouring, selectedColour, 22);

        // fetch gplHotwash (column 9)
        const gplHotwash = await getHotwashGPL(dyeingSystem, selectedColour, 9);

        if (mounted) {
          setValues(results);
          setScouringTemp(temp);
          setScouringTime(time);
          setScouringPH(ph);
          sethotwashGpl(gplHotwash)
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed loading scouring data", err);
        if (mounted) {
          setValues({});
          setScouringTemp("dbErr");
          setScouringTime("dbErr");
          setScouringPH("dbErr");
          setError("Server / DB error");
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [scouring, selectedColour]);

  return { values, scouringTemp, scouringTime, scouringPH, hotwashGpl, loading, error };
}
