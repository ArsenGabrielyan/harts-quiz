import {Grid} from "react-loader-spinner"

export default function Loader(){
     return <div className="loader">
          <Grid height={120} width={120} color="#fafafa"/>
          <h1>Խնդրում ենք սպասել․․․</h1>
     </div>
}