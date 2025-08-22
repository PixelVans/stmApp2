import { useEffect, useState } from "react";

import { getDyeingSec1ChemGpl, getDyeingSec1ChemGpl1, getDyeingSec1ChemGpl2, getDyeingSec1Value, getDyeingSec2Temp, getDyeingSec2TimePh, getDyestuffGpl } from "../components/functions/dyeingFunctions";

export default function useDyeingData(selectedColour,  scouring, b26Title, dyeingSystem, saltOptionstep4 , saltOption) {
  
  const [dyeingSec1Chem1Gpl, setdyeingSec1Chem1Gpl] = useState(null);
  const [dyeingSec1Chem2Gpl, setdyeingSec1Chem2Gpl] = useState(null);
  const [dyeingSec1Temp, setdyeingSec1Temp] = useState(null);
  const [dyeingSec1Duration, setdyeingSec1Duration] = useState(null);
  const [dyeingSec1Ph, setdyeingSec1Ph] = useState(null);
  const [dyeingSec2Gpl1, setdyeingSec2Gpl1] = useState(null);
  const [dyeingSec2Gpl2, setdyeingSec2Gpl2] = useState(null);
  const [dyeingSec2Gpl3, setdyeingSec2Gpl3] = useState(null);
  const [dyeingSec2Gpl4, setdyeingSec2Gpl4] = useState(null);
  const [dyeingSec2Gpl5, setdyeingSec2Gpl5] = useState(null);

  const [dyeingSec2Temp1, setdyeingSec2Temp1] = useState(null);
  const [dyeingSec2Temp2, setdyeingSec2Temp2] = useState(null);
  
  const [dyeingSec2Time1, setdyeingSec2Time1] = useState(null);
  const [dyeingSec2Time2, setdyeingSec2Time2] = useState(null);
  const [dyeingSec2Ph, setdyeingSec2Ph] = useState(null);

  

  useEffect(() => {
    let mounted = true;

    async function load() {
    if (!scouring || !selectedColour ) return;
      

      try {
        
        const dyeingSec1Chem1Gpl = await getDyeingSec1ChemGpl1( selectedColour, scouring,)
        const dyeingSec1Chem2Gpl = await getDyeingSec1ChemGpl2( selectedColour, b26Title)
        let dyeingSec1Temp = await getDyeingSec1Value(scouring,  selectedColour,dyeingSystem, 22)
        
        if (dyeingSec1Temp) {
         dyeingSec1Temp = String(dyeingSec1Temp).replace("?", "°");
        }
        const dyeingSec1Duration = await getDyeingSec1Value(scouring,  selectedColour, dyeingSystem, 24)
        const dyeingSec1Ph = await getDyeingSec1Value(scouring,  selectedColour, dyeingSystem, 27)
       
        

        //values for section 2 in step 4
        const dyeingSec2Gpl1 = await getDyestuffGpl(selectedColour, 1)
        const dyeingSec2Gpl2 = await getDyestuffGpl(selectedColour, 2)
        const dyeingSec2Gpl3 = await getDyestuffGpl(selectedColour, 3)
        const dyeingSec2Gpl4 = await getDyestuffGpl(selectedColour, 4)
        const dyeingSec2Gpl5 = await getDyestuffGpl (selectedColour, 6, saltOptionstep4)
         
        //temp for section 2
        let dyeingSec2Temp1 = await getDyeingSec2Temp(scouring, selectedColour, 22, dyeingSystem )
        let dyeingSec2Temp2 = await getDyeingSec2Temp(scouring, selectedColour, 20, dyeingSystem )
        if (dyeingSec2Temp2 && dyeingSec2Temp1) {
         dyeingSec2Temp1 = String(dyeingSec2Temp1).replace("?", "°");
         dyeingSec2Temp2 = String(dyeingSec2Temp2).replace("?", "°");

        }

        let dyeingSec2Time1 = await getDyeingSec2TimePh(selectedColour, 24, dyeingSystem )
        let dyeingSec2Time2 = await getDyeingSec2TimePh(selectedColour, 23, dyeingSystem )
        let dyeingSec2Ph = await getDyeingSec2TimePh(selectedColour, 26, dyeingSystem )
        
       
     if (mounted) {
          setdyeingSec1Chem1Gpl(dyeingSec1Chem1Gpl);
          setdyeingSec1Chem2Gpl(dyeingSec1Chem2Gpl);
          setdyeingSec1Temp(dyeingSec1Temp);
          setdyeingSec1Ph(dyeingSec1Ph);
          setdyeingSec1Duration(dyeingSec1Duration);
          setdyeingSec2Gpl1(dyeingSec2Gpl1);
          setdyeingSec2Gpl2(dyeingSec2Gpl2);
          setdyeingSec2Gpl3(dyeingSec2Gpl3);
          setdyeingSec2Gpl4(dyeingSec2Gpl4);
          setdyeingSec2Gpl5(dyeingSec2Gpl5);

          setdyeingSec2Temp1(dyeingSec2Temp1);
          setdyeingSec2Temp2(dyeingSec2Temp2);

          setdyeingSec2Time1(dyeingSec2Time1);
          setdyeingSec2Time2(dyeingSec2Time2);
          setdyeingSec2Ph(dyeingSec2Ph);
          
        }
      } catch (err) {

        console.error("Failed dyeing sec 1 data", err);

        if (mounted) {
          setdyeingSec1Chem1Gpl("dbErr");
          setdyeingSec1Chem2Gpl("dbErr");
          setdyeingSec1Temp("dbErr");
          setdyeingSec1Ph("dbErr");
          setdyeingSec1Duration("dbErr");
          setdyeingSec2Gpl1("dbErr");
          setdyeingSec2Gpl2("dbErr");
          setdyeingSec2Gpl3("dbErr");
          setdyeingSec2Gpl4("dbErr");
          setdyeingSec2Gpl5("dbErr");
          
          setdyeingSec2Temp1("dbErr");
          setdyeingSec2Temp2("dbErr");

          setdyeingSec2Time1("dbErr");
          setdyeingSec2Time2("dbErr");
          setdyeingSec2Ph("dbErr");
          
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [b26Title, selectedColour, scouring, dyeingSystem, saltOption,saltOptionstep4]);

  return { dyeingSec1Chem1Gpl, dyeingSec1Chem2Gpl, dyeingSec1Temp , dyeingSec1Ph, dyeingSec1Duration,
    dyeingSec2Gpl1, dyeingSec2Gpl2, dyeingSec2Gpl3, dyeingSec2Gpl4, dyeingSec2Gpl5,dyeingSec2Temp1,dyeingSec2Temp2,
    dyeingSec2Time1,dyeingSec2Time2, dyeingSec2Ph
   };
}
