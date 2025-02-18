"use client";
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useThemeContext } from "@/context/theme-data-provider";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { ThemeColors } from "@/data/types";

const availableThemeColors = [
  { name: "Zinc", light: "bg-zinc-900", dark: "bg-zinc-700", title: "Սև / Սպիտակ"},
  { name: "Rose", light: "bg-rose-600", dark: "bg-rose-700", title: "Վարդագույն"},
  { name: "Blue", light: "bg-blue-600", dark: "bg-blue-700", title: "Կապույտ"},
  { name: "Green", light: "bg-green-600", dark: "bg-green-500", title: "Կանաչ"},
  { name: "Orange", light: "bg-orange-500", dark: "bg-orange-700", title: "Նարնջագույն"},
];

export function ThemeColorToggle() {
  const { themeColor, setThemeColor } = useThemeContext();
  const { theme } = useTheme();

  const createSelectItems = () => {
    return availableThemeColors.map(({ name, light, dark, title }) => (
      <SelectItem key={name} value={name}>
        <div className="flex item-center justify-center space-x-3">
          <div
            className={cn(
              "rounded-full",
              "w-[20px]",
              "h-[20px]",
              theme === "light" ? light : dark,
            )}
          ></div>
          <div className="text-sm">{title}</div>
        </div>
      </SelectItem>
    ));
  };

  return (
    <Select
      onValueChange={(value) => setThemeColor(value as ThemeColors)}
      defaultValue={themeColor}
    >
      <SelectTrigger className="w-[180px] ring-offset-transparent focus:ring-transparent">
        <SelectValue placeholder="Ընտրել Գույն" />
      </SelectTrigger>
      <SelectContent className="border-muted">
        {createSelectItems()}
      </SelectContent>
    </Select>
  );
}