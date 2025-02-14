"use client"
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link";

export default function NotFoundPage(){
     return (
          <div className="primary-main-bg min-h-screen flex justify-center items-center p-5">
               <Card className="max-w-2xl text-center">
                    <CardHeader className="items-center">
                         <Logo width={100} height={50}/>
                    </CardHeader>
                    <CardContent>
                         <div className="flex flex-col-reverse">
                              <h1>Վայ․․․ Հարցաշարը չի գտնվել</h1>
                              <h2 className="text-9xl font-bold text-primary">404</h2>
                         </div>
                         <p className="mt-5">Ձեր փնտրած հարցաշարը չի գտնվել: Այն կարող է ջնջվել, տեղափոխվել, վերանվանվել կամ ընդհանրապես գոյություն չունենա:</p>
                    </CardContent>
                    <CardFooter>
                         <Button asChild className="w-full">
                              <Link href="/">Գլխավոր էջ</Link>
                         </Button>
                    </CardFooter>
               </Card>
          </div>
     )
}