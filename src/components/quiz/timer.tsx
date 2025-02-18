import { useEffect } from "react"
import { Progress } from "../ui/progress";
import { cn } from "@/lib/utils";

interface TimerProps{
     time: number,
     onTimeChange: (value: number) => void;
     initialTime: number,
     isInQuizQuestion?: boolean
}
export default function Timer({time, onTimeChange, initialTime, isInQuizQuestion=false}:TimerProps){
     useEffect(()=>{
          const interval = setInterval(()=>{
               onTimeChange(time-1);
          },1000)
          if(time<=0) clearInterval(interval);
          return () => {
               if(interval) clearInterval(interval)
          }
          // eslint-disable-next-line
     },[time])
     return (
          <div className={cn("flex items-center justify-between gap-4",isInQuizQuestion && "mt-6")}>
               <h2 className="text-2xl md:text-3xl font-semibold">{time}</h2>
               <Progress value={(time/initialTime)*100}/>
          </div>
     )
}