import Logo from "@/components/logo";

interface HeaderProps{
     label: string
}
export function Header({label}: HeaderProps){
     return (
          <div className="w-full flex flex-col gap-y-4 items-center justify-center">
               <Logo width={130} height={60}/>
               <p className="text-muted-foreground text-sm">{label}</p>
          </div>
     )
}