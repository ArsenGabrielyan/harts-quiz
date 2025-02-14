import { getUserDetails } from "@/actions/user";
import UserInfo from "@/components/client-components/user-info";
import { notFound } from "next/navigation";

export default async function SingleUserPage({
     params
}: {
     params: Promise<{ id: string }>
}){
     const {id} = await params;
     const {user, questions} = await getUserDetails(id)
     if(!user) notFound()
     return (
          <UserInfo user={user} questions={questions}/>
     )
}