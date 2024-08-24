import Image from "next/image";

export default function NotFound(){
     return <div className="error-container">
          <div className="error">
               <Image src="/logos/logo.svg" alt="harts" width={100} height={50} priority className="logo"/>
               <div className="err-info">
                    <h1>Վայ․․․ Սխալ առաջացավ</h1>
                    <h2>500</h2>
               </div>
               <p>Ներողություն, բայց մեր սերվերում սխալ առաջացավ և չկարողացավ կատարել ձեր հարցումը։ Խնդրում ենք թարմացնել էջը կամ ազատորեն կապվեք, եթե սխալը շարունակվում է։</p>
          </div>
     </div>
}