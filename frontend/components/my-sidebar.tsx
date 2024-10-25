import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/aceternity/sidebar"; // Import new sidebar components
import {
  Home,
  Search,
  LetterText,
  DollarSign,
  Check,
  ReceiptText,
  Bot,
} from "lucide-react";

const items = [
  { title: "Home", url: "/", icon: <Home /> },
  { title: "Cautare Companie", url: "/search", icon: <Search /> },
  // { title: "Bilant", url: "/bilant", icon: <LetterText /> },
  { title: "Curs Valutar", url: "/curs", icon: <DollarSign /> },
  { title: "Validari CIF, CNP, IBAN", url: "/validari", icon: <Check /> },
  { title: "EFactura", url: "/efactura", icon: <ReceiptText /> },
  { title: "ChatBot", url: "/chatbot", icon: <Bot /> },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarBody>
        {items.map((item) => (
          <SidebarLink key={item.title} link={{ label: item.title, href: item.url, icon: item.icon }} />
        ))}
      </SidebarBody>
    </Sidebar>
  );
}
