import { useCurrentUser } from "@/hooks/use-current-user";
import { redirect } from "next/navigation";

export default function LibraryPage(){
     const user = useCurrentUser();
     if(user?.accountType==="student") redirect("/");
     return (
          <>
               TODO: Recreate Library Page
          </>
     )
}