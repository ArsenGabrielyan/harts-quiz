import { useEffect } from "react";

export default function useUnsavedChangesWarning(condition: boolean){
     useEffect(() => {
          const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
               if(condition){
                    event.preventDefault()
               }
          }
          window.addEventListener("beforeunload", beforeUnloadHandler)
          return () => {
               window.removeEventListener("beforeunload", beforeUnloadHandler)
          }
     },[condition])
}