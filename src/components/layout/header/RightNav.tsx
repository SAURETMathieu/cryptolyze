import ProfilMenu from "@/src/components/layout/header/ProfilMenu";

import { ThemeToggle } from "../../buttons";
import LanguageSection from "../../buttons/languageSelect";
import BackOfficeLink from "./BackOfficeLink";

export function RightNav() {
  return (
    <div className="flex flex-1 items-center justify-end space-x-4">
      <nav className="flex items-center space-x-1 self-end">
        <BackOfficeLink />
        <ThemeToggle />
        <LanguageSection />
        <ProfilMenu />
      </nav>
    </div>
  );
}
