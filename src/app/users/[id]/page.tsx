import { getUserDetails } from "@/actions/user";
import UserInfo from "@/components/client-components/user-info";

export default async function SingleUserPage({
     params
}: {
     params: Promise<{ id: string }>
}){
     const {id} = await params;
     const {user, questions} = await getUserDetails(id)
     return (
          <UserInfo user={user} questions={questions}/>
     )
}