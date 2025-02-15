import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LibraryPage(){
     const user = await currentUser();
     if(user?.accountType==="student") redirect("/");
     return (
          <>
               TODO: Recreate Library Page
          </>
     )
}