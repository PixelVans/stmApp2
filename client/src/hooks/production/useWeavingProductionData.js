import { useEffect, useState } from "react";
import { getMachineWeavingData } from "../../components/functions/production/weavingProductionFunctions";

export default function useWeavingData(selectedWeek) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!selectedWeek) return;

      // reset state immediately when week changes
      setLoading(true);
      setData(null);
      setError(null);

      try {
        const weavingRows = await getMachineWeavingData(selectedWeek);

        if (mounted) {
          const structured = {};

          weavingRows.forEach((row, index) => {
            const day = row.Day || `Day${index + 1}`;
            structured[day] = {
              machines: {
                1: {
                  shiftA: row.Mach1ShiftA ?? 0,
                  shiftB: row.Mach1ShiftB ?? 0,
                  beamA: row.Beam1A ?? 0,
                  beamB: row.Beam1B ?? 0,
                  notesA: row.Notes1A ?? "",
                  notesB: row.Notes1B ?? "",
                  article: row.Article1 ?? "",
                },
                2: {
                  shiftA: row.Mach2ShiftA ?? 0,
                  shiftB: row.Mach2ShiftB ?? 0,
                  beamA: row.Beam2A ?? 0,
                  beamB: row.Beam2B ?? 0,
                  notesA: row.Notes2A ?? "",
                  notesB: row.Notes2B ?? "",
                  article: row.Article2 ?? "",
                },
                3: {
                  shiftA: row.Mach3ShiftA ?? 0,
                  shiftB: row.Mach3ShiftB ?? 0,
                  beamA: row.Beam3A ?? 0,
                  beamB: row.Beam3B ?? 0,
                  notesA: row.Notes3A ?? "",
                  notesB: row.Notes3B ?? "",
                  article: row.Article3 ?? "",
                },
                4: {
                  shiftA: row.Mach4ShiftA ?? 0,
                  shiftB: row.Mach4ShiftB ?? 0,
                  beamA: row.Beam4A ?? 0,
                  beamB: row.Beam4B ?? 0,
                  notesA: row.Notes4A ?? "",
                  notesB: row.Notes4B ?? "",
                  article: row.Article4 ?? "",
                },
              },
            };
          });

          setData(structured);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed loading weaving data", err);
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [selectedWeek]);

  return { data, loading, error };
}
