
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  Calculator,
  BookOpen,
  Headset,
  Shield,
  DollarSign,
  UserPlus,
} from 'lucide-react';
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

export default function Sidebar() {
  const pathname = usePathname();
  // TODO: Add back admin role check
  const isAdmin = true;
  const allNavItems = isAdmin ? [...adminNavItems, ...navItems] : navItems;

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Logo className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Abhaya</span>
          </Link>
          {allNavItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                    {
                      'bg-accent text-accent-foreground': pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/'),
                    }
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </TooltipProvider>
    </aside>
  );
}
