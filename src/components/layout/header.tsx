
'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  Calculator,
  BookOpen,
  Headset,
  Menu,
  Shield,
  DollarSign,
  UserPlus,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Logo from '@/components/icons/logo';

const navItems = [
  { href: '/member', label: 'Member Dashboard', icon: LayoutDashboard },
  { href: '/commission-calculator', label: 'Calculator', icon: Calculator },
  { href: '/training', label: 'Training', icon: BookOpen },
  { href: '/support', label: 'Support', icon: Headset },
];

const adminNavItems = [
    { href: '/', label: 'Admin Dashboard', icon: Shield },
    { href: '/record-sale', label: 'Record Sale', icon: DollarSign },
    { href: '/add-user', label: 'Add User', icon: UserPlus },
];

export default function Header() {
  const pathname = usePathname();
  // TODO: Add back admin role check
  const isAdmin = true;
  const allNavItems = isAdmin ? [...adminNavItems, ...navItems] : navItems;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Logo className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Abhaya</span>
            </Link>
            {allNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground',
                  {
                    'text-foreground': pathname === item.href,
                  }
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
