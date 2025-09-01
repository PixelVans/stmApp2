import { useEffect, useState } from "react";
import { 
  getChemicalsAmtonHand, 
  getChemicalsCostPerLtorKg, 
  getDyestuffAmtonHand, 
  getDyestuffCostPerLtorKg, 
  getFinishingChemicalsAmtonHand 
} from "../../components/functions/dyeingSummaryFunctions";

export default function useChemicalsinHandData(
  chemical1, chemical2, chemical3, chemical4, chemical5,
  chemical6, chemical7, chemical8, chemical9, chemical10,
  dyeStuff1, dyeStuff2, dyeStuff3, dyeStuff4, dyeingchem5,
  finishingchemical1, finishingchemical2, finishingchemical3,
) {
  // chemicals amount on hand
  const [chem1AmtinHand, setChem1AmtinHand] = useState(null);
  const [chem2AmtinHand, setChem2AmtinHand] = useState(null);
  const [chem3AmtinHand, setChem3AmtinHand] = useState(null);
  const [chem4AmtinHand, setChem4AmtinHand] = useState(null);
  const [chem5AmtinHand, setChem5AmtinHand] = useState(null);
  const [chem6AmtinHand, setChem6AmtinHand] = useState(null);
  const [chem7AmtinHand, setChem7AmtinHand] = useState(null);
  const [chem8AmtinHand, setChem8AmtinHand] = useState(null);
  const [chem9AmtinHand, setChem9AmtinHand] = useState(null);
  const [chem10AmtinHand, setChem10AmtinHand] = useState(null);
  const [dye5AmtinHand, setDye5AmtinHand] = useState(null); // dyeingchem5

  // chemicals cost per L/Kg
  const [chem1Cost, setChem1Cost] = useState(null);
  const [chem2Cost, setChem2Cost] = useState(null);
  const [chem3Cost, setChem3Cost] = useState(null);
  const [chem4Cost, setChem4Cost] = useState(null);
  const [chem5Cost, setChem5Cost] = useState(null);
  const [chem6Cost, setChem6Cost] = useState(null);
  const [chem7Cost, setChem7Cost] = useState(null);
  const [chem8Cost, setChem8Cost] = useState(null);
  const [chem9Cost, setChem9Cost] = useState(null);
  const [chem10Cost, setChem10Cost] = useState(null);
  const [dye5Cost, setDye5Cost] = useState(null); // dyeingchem5 cost

  // dyes amount
  const [dye1AmtinHand, setDye1AmtinHand] = useState(null);
  const [dye2AmtinHand, setDye2AmtinHand] = useState(null);
  const [dye3AmtinHand, setDye3AmtinHand] = useState(null);
  const [dye4AmtinHand, setDye4AmtinHand] = useState(null);

  // dyes cost
  const [dye1Cost, setDye1Cost] = useState(null);
  const [dye2Cost, setDye2Cost] = useState(null);
  const [dye3Cost, setDye3Cost] = useState(null);
  const [dye4Cost, setDye4Cost] = useState(null);

  // finishing chemicals amount
  const [finishingChem1AmtinHand, setFinishingChem1AmtinHand] = useState(null);
  const [finishingChem2AmtinHand, setFinishingChem2AmtinHand] = useState(null);
  const [finishingChem3AmtinHand, setFinishingChem3AmtinHand] = useState(null);

  // finishing chemicals cost
  const [finishingChem1Cost, setFinishingChem1Cost] = useState(null);
  const [finishingChem2Cost, setFinishingChem2Cost] = useState(null);
  const [finishingChem3Cost, setFinishingChem3Cost] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        // fetch amounts
        const chem1 = await getChemicalsAmtonHand(chemical1);
        const chem2 = await getChemicalsAmtonHand(chemical2);
        const chem3 = await getChemicalsAmtonHand(chemical3);
        const chem4 = await getChemicalsAmtonHand(chemical4);
        const chem5 = await getChemicalsAmtonHand(chemical5);
        const chem6 = await getChemicalsAmtonHand(chemical6);
        const chem7 = await getChemicalsAmtonHand(chemical7);
        const chem8 = await getChemicalsAmtonHand(chemical8);
        const chem9 = await getChemicalsAmtonHand(chemical9);
        const chem10 = await getChemicalsAmtonHand(chemical10);
        const chem11 = await getChemicalsAmtonHand(dyeingchem5);

        // fetch chemical costs
        const chem1cost = await getChemicalsCostPerLtorKg(chemical1);
        const chem2cost = await getChemicalsCostPerLtorKg(chemical2);
        const chem3cost = await getChemicalsCostPerLtorKg(chemical3);
        const chem4cost = await getChemicalsCostPerLtorKg(chemical4);
        const chem5cost = await getChemicalsCostPerLtorKg(chemical5);
        const chem6cost = await getChemicalsCostPerLtorKg(chemical6);
        const chem7cost = await getChemicalsCostPerLtorKg(chemical7);
        const chem8cost = await getChemicalsCostPerLtorKg(chemical8);
        const chem9cost = await getChemicalsCostPerLtorKg(chemical9);
        const chem10cost = await getChemicalsCostPerLtorKg(chemical10);
        const chem11cost = await getChemicalsCostPerLtorKg(dyeingchem5);

        // finishing chemicals amounts
        const chem12 = await getFinishingChemicalsAmtonHand(finishingchemical1);
        const chem13 = await getFinishingChemicalsAmtonHand(finishingchemical2);
        const chem14 = await getFinishingChemicalsAmtonHand(finishingchemical3);

        // finishing chemicals costs
        const chem12Cost = await getChemicalsCostPerLtorKg(finishingchemical1);
        const chem13Cost = await getChemicalsCostPerLtorKg(finishingchemical2);
        const chem14Cost = await getChemicalsCostPerLtorKg(finishingchemical3);

        // dyestuff amounts
        const dye1 = await getDyestuffAmtonHand(dyeStuff1);
        const dye2 = await getDyestuffAmtonHand(dyeStuff2);
        const dye3 = await getDyestuffAmtonHand(dyeStuff3);
        const dye4 = await getDyestuffAmtonHand(dyeStuff4);

        // dyestuff costs
        const dye1cost = await getDyestuffCostPerLtorKg(dyeStuff1);
        const dye2cost = await getDyestuffCostPerLtorKg(dyeStuff2);
        const dye3cost = await getDyestuffCostPerLtorKg(dyeStuff3);
        const dye4cost = await getDyestuffCostPerLtorKg(dyeStuff4);

        if (mounted) {
          // set amounts
          setChem1AmtinHand(chem1);
          setChem2AmtinHand(chem2);
          setChem3AmtinHand(chem3);
          setChem4AmtinHand(chem4);
          setChem5AmtinHand(chem5);
          setChem6AmtinHand(chem6);
          setChem7AmtinHand(chem7);
          setChem8AmtinHand(chem8);
          setChem9AmtinHand(chem9);
          setChem10AmtinHand(chem10);
          setDye5AmtinHand(chem11);

          // set costs
          setChem1Cost(chem1cost);
          setChem2Cost(chem2cost);
          setChem3Cost(chem3cost);
          setChem4Cost(chem4cost);
          setChem5Cost(chem5cost);
          setChem6Cost(chem6cost);
          setChem7Cost(chem7cost);
          setChem8Cost(chem8cost);
          setChem9Cost(chem9cost);
          setChem10Cost(chem10cost);
          setDye5Cost(chem11cost);

          // finishing
          setFinishingChem1AmtinHand(chem12);
          setFinishingChem2AmtinHand(chem13);
          setFinishingChem3AmtinHand(chem14);
          setFinishingChem1Cost(chem12Cost);
          setFinishingChem2Cost(chem13Cost);
          setFinishingChem3Cost(chem14Cost);

          // dyes
          setDye1AmtinHand(dye1);
          setDye2AmtinHand(dye2);
          setDye3AmtinHand(dye3);
          setDye4AmtinHand(dye4);
          setDye1Cost(dye1cost);
          setDye2Cost(dye2cost);
          setDye3Cost(dye3cost);
          setDye4Cost(dye4cost);

          setLoading(false);
        }
      } catch (err) {
        console.error("Failed loading chemical amounts", err);
        if (mounted) {
          setError("Server / DB error");
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [
    chemical1, chemical2, chemical3, chemical4, chemical5,
    chemical6, chemical7, chemical8, chemical9, chemical10,
    dyeStuff1, dyeStuff2, dyeStuff3, dyeStuff4, dyeingchem5,
    finishingchemical1, finishingchemical2, finishingchemical3
  ]);

  return {
    // amounts
    chem1AmtinHand, chem2AmtinHand, chem3AmtinHand, chem4AmtinHand, chem5AmtinHand,
    chem6AmtinHand, chem7AmtinHand, chem8AmtinHand, chem9AmtinHand, chem10AmtinHand,
    dye1AmtinHand, dye2AmtinHand, dye3AmtinHand, dye4AmtinHand, dye5AmtinHand,
    finishingChem1AmtinHand, finishingChem2AmtinHand, finishingChem3AmtinHand,

    // costs
    chem1Cost, chem2Cost, chem3Cost, chem4Cost, chem5Cost,
    chem6Cost, chem7Cost, chem8Cost, chem9Cost, chem10Cost,
    dye1Cost, dye2Cost, dye3Cost, dye4Cost, dye5Cost,
    finishingChem1Cost, finishingChem2Cost, finishingChem3Cost,

    loading,
    error,
  };
}
