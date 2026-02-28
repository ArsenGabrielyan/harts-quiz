import { useTheme } from "next-themes";

export function useCurrentTheme(): "light" | "dark" | undefined{
     const { theme, systemTheme } = useTheme();
     return theme === "system" ? systemTheme : theme as "light" | "dark";
}