import React from "react";
import Logo from "./logo";
import { Button } from "./ui/button";
import ThemeSettings from "./themes/theme-changer";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Search, X } from "lucide-react";

import {
     Dialog,
     DialogContent,
     DialogHeader,
     DialogTitle,
     DialogTrigger,
} from "@/components/ui/dialog"
import { subjectList } from "@/data/constants";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "./ui/carousel";

interface PageLayoutProps{
     children: React.ReactNode,
     themeSwitcher?: boolean
     mainClassName?: string,
     searchBox?: {
          search: string,
          setSearch: React.Dispatch<React.SetStateAction<string>>,
     }
}
export default function PageLayout({children,themeSwitcher=false,mainClassName, searchBox}: PageLayoutProps){
     const year = new Date().getFullYear();
     return (
          <>
               <header className="flex justify-between items-center fixed z-20 w-full top-0 left-0 p-4 bg-background text-foreground shadow gap-3 h-[80px]">
                    <div className="flex gap-x-4">
                         <Logo width={100} height={45}/>
                         {searchBox && (
                              <div className="flex sm:hidden items-center">
                                   <Dialog>
                                        <DialogTrigger><Search/></DialogTrigger>
                                        <DialogContent>
                                             <DialogHeader>    
                                                  <DialogTitle>Որոնել Հարցաշար</DialogTitle>
                                             </DialogHeader>
                                             <div className="flex-1 flex gap-x-2 w-full">
                                                  <Input value={searchBox.search} placeholder="Որոնել․․․" onChange={e=>searchBox.setSearch(e.target.value)}/>
                                                  {searchBox.search!=="" && <Button size="icon" variant="outline" onClick={()=>searchBox.setSearch("")}><X/></Button>}
                                             </div>
                                        </DialogContent>
                                   </Dialog>
                              </div>
                         )}
                    </div>
                    {searchBox && (
                         <div className="flex-1 hidden sm:flex gap-x-2 w-full max-w-sm">
                              <Input value={searchBox.search} placeholder="Որոնել․․․" onChange={e=>searchBox.setSearch(e.target.value)}/>
                              {searchBox.search!=="" && <Button size="icon" variant="outline" onClick={()=>searchBox.setSearch("")}><X/></Button>}
                         </div>
                    )}
                    <div className="flex gap-x-2">
                         <Button>Մուտք</Button>
                    </div>
               </header>
               <main className={cn("primary-main-bg min-h-screen mt-[80px] p-3",mainClassName)}>
                    {children}
               </main>
               <footer className="text-center bg-background text-foreground shadow p-5 flex justify-between items-center flex-col md:flex-row gap-2">
                    <Logo width={90} height={40}/>
                    <p>&copy; {year} | Բոլոր իրավունքները պաշտպանված են</p>
                    {themeSwitcher && <ThemeSettings/>}
               </footer>
          </>
     )
}