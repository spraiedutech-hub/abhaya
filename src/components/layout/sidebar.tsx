
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Logo from '@/components/icons/logo';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { decode } from 'jsonwebtoken';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/commission-calculator', label: 'Calculator', icon: Calculator },
  { href: '/training', label: 'Training', icon: BookOpen },
  { href: '/support', label: 'Support', icon: Headset },
];

const adminNavItems = [
  { href: '/record-sale', label: 'Record Sale', icon: DollarSign },
  { href: '/admin', label: 'Admin', icon: Shield },
];

const ADMIN_EMAIL = 'alice@example.com';


export default function Sidebar() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const session = Cookies.get('session');
    if (session) {
      try {
        const decodedToken = decode(session);
        if (typeof decodedToken === 'object' && decodedToken !== null && 'email' in decodedToken) {
          setIsAdmin(decodedToken.email === ADMIN_EMAIL);
        }
      } catch (e) {
        console.error("Failed to decode token", e);
      }
    }
  }, []);

  const allNavItems = isAdmin ? [...navItems, ...adminNavItems] : navItems;

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
