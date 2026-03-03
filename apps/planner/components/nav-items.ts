export type NavItem = {
  href: string;
  label: string;
  shortLabel: string;
};

export const navItems: NavItem[] = [
  { href: "/inbox", label: "Inbox", shortLabel: "Inbox" },
  { href: "/today", label: "Today", shortLabel: "Today" },
  { href: "/week", label: "Week", shortLabel: "Week" },
  { href: "/habits", label: "Habits", shortLabel: "Habits" },
  { href: "/goals", label: "Goals", shortLabel: "Goals" },
  { href: "/review", label: "Review", shortLabel: "Review" },
  { href: "/studio", label: "Studio", shortLabel: "Studio" }
];
