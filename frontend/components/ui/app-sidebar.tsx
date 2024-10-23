import { Bot, Calendar, Check, DollarSign, Home, Inbox, LetterText, Receipt, ReceiptText, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Cautare Companie",
    url: "/search",
    icon: Search,
  },
  {
    title: "Bilant",
    url: "/bilant",
    icon: LetterText,
  },
  {
    title: "Curs Valutar",
    url: "/curs",
    icon: DollarSign,
  },
  {
    title: "Validari CIF, CNP, IBAN ",
    url: "/validari",
    icon: Check,
  },
  {
    title: "EFactura",
    url: "/efactura",
    icon: ReceiptText,
  },
  {
    title: "ChatBot",
    url: "/chatbot",
    icon: Bot,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
