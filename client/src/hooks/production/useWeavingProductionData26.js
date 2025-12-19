import { useEffect, useState } from "react";
import { getMachineKnottingCountCount26 } from "../../components/functions/production/weavingProductionFunctions";

export default function useWeavingData26(selectedWeek, selectedYear) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!selectedWeek || !selectedYear) {
        setLoading(false);
        setData(null);
        setError(false);
        setEmpty(false);
        return;
      }

      setLoading(true);
      setData(null);
      setError(false);
      setEmpty(false);

      try {
        const res = await fetch(
          `/api/weaving-production26/week/${selectedWeek}?year=${selectedYear}`
        );

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const rows = await res.json();

        if (!rows || rows.length === 0) {
          if (mounted) {
            setEmpty(true);
            setLoading(false);
          }
          return;
        }

        const structured = {};
        const beamCache = {}; // prevent duplicate warping hits

        // 🔑 only show when BOTH beam + knotting exist
        const formatBeam = async (beam) => {
          if (!beam) return "";

          if (beamCache[beam] !== undefined) {
            return beamCache[beam];
          }

          try {
            const count = await getMachineKnottingCountCount26(beam);

            if (!count || count === 0) {
              beamCache[beam] = "";
              return "";
            }

            const formatted = `${beam} @ ${Number(count).toLocaleString()}`;
            beamCache[beam] = formatted;
            return formatted;
          } catch {
            beamCache[beam] = "";
            return "";
          }
        };

        // sequential by design (DB-safe)
        for (const row of rows) {
          const day = row.Day || "Unknown";
          const machineNo = row.MachineNo;

          if (!structured[day]) {
            structured[day] = { machines: {} };
          }

          if (!structured[day].machines[machineNo]) {
            structured[day].machines[machineNo] = {
              shiftA: 0,
              shiftB: 0,
              beamA: "",
              beamB: "",
              notesA: "",
              notesB: "",
              article: row.Article || "",
              counter: row.Counter || 0,
            };
          }

          const formattedBeam = await formatBeam(row.Beam);

          if (row.Shift === "A") {
            structured[day].machines[machineNo].shiftA =
              row.UnitsProduced || 0;
            structured[day].machines[machineNo].beamA = formattedBeam;
            structured[day].machines[machineNo].notesA =
              row.Notes || "";
          }

          if (row.Shift === "B") {
            structured[day].machines[machineNo].shiftB =
              row.UnitsProduced || 0;
            structured[day].machines[machineNo].beamB = formattedBeam;
            structured[day].machines[machineNo].notesB =
              row.Notes || "";
          }
        }

        if (mounted) {
          setData(structured);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed loading weaving data", err);
        if (mounted) {
          setError(true);
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [selectedWeek, selectedYear]); // 🔥 YEAR NOW MATTERS

  return { data, loading, error, empty };
}
