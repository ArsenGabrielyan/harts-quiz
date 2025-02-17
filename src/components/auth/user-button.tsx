"use client"
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuTrigger,
     DropdownMenuLabel,
     DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
     Avatar,
     AvatarImage,
     AvatarFallback
} from "@/components/ui/avatar"
import { useCurrentUser } from "@/hooks/use-current-user"
import { LogoutButton } from "./logout-button"
import { User, LogOut, Settings, Files } from "lucide-react"
import Link from "next/link"

export const UserButton = () => {
     const user = useCurrentUser();
     return (
          <DropdownMenu>
               <DropdownMenuTrigger>
                    <Avatar>
                         <AvatarImage src={user?.image || ""}/>
                         <AvatarFallback className="bg-primary">
                              <User className="text-primary-foreground"/>
                         </AvatarFallback>
                    </Avatar>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                    <DropdownMenuLabel className="pb-0">{user?.name}</DropdownMenuLabel>
                    <p className="font-normal px-2 text-sm pb-1.5">{user?.email}</p>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem asChild className="cursor-pointer">
                         <Link href={`/users/${user?.id}`}>
                              <User/> Իմ պրոֆիլը
                         </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                         <Link href="/settings">
                              <Settings/> Կարգավորումներ
                         </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                         <Link href="/library">
                              <Files/> Բոլոր հարցաշարերը
                         </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <LogoutButton>
                         <DropdownMenuItem className="cursor-pointer text-destructive">
                              <LogOut className="h-4 w-4 mr-2"/>
                              Դուրս գալ
                         </DropdownMenuItem>
                    </LogoutButton>
               </DropdownMenuContent>
          </DropdownMenu>
     )
}