import { useEffect } from "react"

export default function Timer({time, setTime, initialTime, type=''}){
     useEffect(()=>{
          const interval = setInterval(()=>setTime(time-1),1000);
          if(time<=0) clearInterval(interval);
          return () => {
               if(interval) clearInterval(interval)
          }
          //eslint-disable-next-line
     },[time])
     return <div className={`timer ${type}`}>
          <h2>{time}</h2>
          <div className="progress">
               <div className="bar" style={{width: `${time/initialTime*100}%`}}></div>
          </div>
     </div>
}