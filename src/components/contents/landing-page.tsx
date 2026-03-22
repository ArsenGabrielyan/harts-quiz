"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Award, GraduationCap, PlayCircle, Search, Users } from "lucide-react";
import Logo from "../logo";

export function LandingPage(){
     return (
          <>
          <div className="min-h-screen primary-main-bg p-4 w-full flex items-center justify-center">
               <div className="max-w-[1440px] flex flex-col items-center justify-center text-center gap-6 w-full h-full">
                    <Logo width={210} height={95}/>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">Հայկական վերջնական վիկտորինայի մարտահրավերը</h1>
                    <p className="text-base md:text-lg max-w-5xl">Կապվեք ընկերների և սփյուռքի հետ ամբողջ աշխարհում: Ստուգեք ձեր գիտելիքները մշակույթի, պատմության, աշխարհագրության և լեզվի վերաբերյալ իրական ժամանակի մարտերում:</p>
                    <div className="flex gap-2 flex-wrap">
                         <Button asChild className="flex-1">
                              <Link href="/play">
                                   <PlayCircle/>
                                   Խաղալ
                              </Link>
                         </Button>
                         <Button variant="outline" asChild className="flex-1">
                              <Link href="/explore">
                                   <Search/>
                                   Ուսումնասիրել
                              </Link>
                         </Button>
                    </div>
               </div>
          </div>
          <section className="max-w-[1440px] min-h-[50vh] px-4 py-8 w-full flex flex-col items-center justify-center text-center gap-2 bg-background text-foreground">
               <h2 className="text-primary text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold">Կառուցված համայնքի համար</h2>
               <p className="text-muted-foreground">Փորձեք ամենահետաքրքիր վիկտորինայի հարթակը, որը հատուկ մշակված է գիտելիքները բարձրացնելու համար:</p>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-8 w-full mt-2">
                    <div className="p-6 bg-card text-card-foreground rounded-md border shadow-md text-center md:text-left flex flex-col gap-3 justify-between items-center md:items-start">
                         <div className="bg-secondary border text-secondary-foreground flex items-center justify-center size-14 rounded-xl">
                              <Users className="size-7"/>
                         </div>
                         <h2 className="lg md:text-xl lg:text-[21px] font-semibold">Խաղացեք ընկերների հետ</h2>
                         <p className="text-muted-foreground text-center sm:text-left">Ստեղծեք մասնավոր սենյակներ և մարտահրավեր նետեք ձեր ընտանիքին և ընկերներին</p>
                    </div>
                    <div className="p-6 bg-card text-card-foreground rounded-md border shadow-md text-left flex flex-col gap-3 justify-between items-center md:items-start">
                         <div className="bg-secondary border text-secondary-foreground flex items-center justify-center size-14 rounded-xl">
                              <GraduationCap className="size-7"/>
                         </div>
                         <h2 className="lg md:text-xl lg:text-[21px] font-semibold">Ստուգեք ձեր գիտելիքները</h2>
                         <p className="text-muted-foreground text-center sm:text-left">5000+ ընտրված հարցեր՝ պատմության, աշխարհագրության, արվեստի և տեխնոլոգիայի վերաբերյալ։</p>
                    </div>
                    <div className="p-6 bg-card text-card-foreground rounded-md border shadow-md text-left flex flex-col gap-3 justify-between items-center md:items-start">
                         <div className="bg-secondary border text-secondary-foreground flex items-center justify-center size-14 rounded-xl">
                              <Award className="size-7"/>
                         </div>
                         <h2 className="lg md:text-xl lg:text-[21px] font-semibold">Շահեք մրցանակներ</h2>
                         <p className="text-muted-foreground text-center sm:text-left">Բարձրացեք շաբաթական վարկանիշային աղյուսակում և շահեք բացառիկ թվային նշաններ և իրական աշխարհի պարգևներ:</p>
                    </div>
               </div>
          </section>
          </>
     )
}