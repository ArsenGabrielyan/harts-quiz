"use client"
import { useCurrentTheme } from "@/hooks/use-current-theme"
import setGlobalColorTheme, { getSavedThemeColor } from "@/lib/theme-colors"
import { ThemeColors, ThemeColorStateParams } from "@/lib/types"
import { useTheme } from "next-themes"
import { ThemeProviderProps } from "next-themes"
import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext<ThemeColorStateParams>(
     {} as ThemeColorStateParams
)

export default function ThemeDataProvider({children}: ThemeProviderProps){
     const [themeColor, setThemeColor] = useState<ThemeColors>(getSavedThemeColor())
     const [isMounted, setIsMounted] = useState(false);
     const theme = useCurrentTheme()

     useEffect(()=>{
          localStorage.setItem("themeColor",themeColor)
          setGlobalColorTheme(theme || "light", themeColor);
          if(!isMounted) setIsMounted(true)
     },[themeColor,theme,isMounted])

     if(!isMounted) return null
     return <ThemeContext.Provider value={{themeColor,setThemeColor}}>
          {children}
     </ThemeContext.Provider>
}

export const useThemeContext = () => useContext(ThemeContext)