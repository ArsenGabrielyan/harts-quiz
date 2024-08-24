import { useState } from "react";

export default function useMultiStep(steps){
     const [current, setCurrent] = useState(0);
     const next = () => setCurrent(i => i>=steps.length-1 ? i : i+1)
     const prev = () => setCurrent(i=> i<=0 ? i : i-1)
     const goTo = i => setCurrent(i);
     return {
          current, step: steps[current],
          goTo,next,prev,steps,
          isFirst: current===0,
          isLast: current===steps.length-1
     }
}