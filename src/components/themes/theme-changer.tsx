import { ThemeColorToggle } from "./theme-color-toggle";
import { ThemeModeToggle } from "./theme-toggler";

const ThemeSettings = () => (
     <div className="flex w-fit gap-x-1">
          <ThemeColorToggle/>
          <ThemeModeToggle/>
     </div>
)
export default ThemeSettings