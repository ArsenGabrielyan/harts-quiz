import { BtnLink } from "@/components/formComponents/button";
import Image from "next/image";

export default function NotFound(){
     return <div className="error-container">
          <div className="error">
               <Image src="/logos/logo-colorful.svg" alt="harts" width={100} height={50} priority className="logo"/>
               <div className="err-info">
                    <h1>Վայ․․․ Էջը չի գտնվել</h1>
                    <h2>404</h2>
               </div>
               <p>Ձեր փնտրած էջը չի գտնվել: Այն կարող է ջնջվել, տեղափոխվել, վերանվանվել կամ ընդհանրապես գոյություն չունենա:</p>
               <BtnLink btnStyle="outline-blue" href="/feed">Գլխավոր էջ</BtnLink>
          </div>
     </div>
}