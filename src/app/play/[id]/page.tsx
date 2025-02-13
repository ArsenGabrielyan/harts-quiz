export default async function OnePlayerQuizPage({
     params
}: {
     params: Promise<{ id: string }>
}){
     const {id} = await params
     return (
          <>
               TODO: Recreate One Player Quiz game {id}
          </>
     )
}