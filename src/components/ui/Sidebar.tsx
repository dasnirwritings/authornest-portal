"use client"

import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useState } from 'react';
import { Home, BarChart2, ListChecks, BookOpen, Users, Palette, Globe, UserPlus, Crown, Settings, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const { userProfile } = useUser();
  const [openMenu, setOpenMenu] = useState('');

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? '' : menuName);
  };

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    {
      id: 'insights',
      icon: BarChart2,
      label: 'Insights Board',
      subItems: [
        { href: '/insights-board', label: 'KDP Importer' },
        { href: '/insights-board#ai-grader', label: 'AI Blurb Grader' },
      ]
    },
    { href: '/project-planner', icon: ListChecks, label: 'Project Planner' },
    { href: '/story-forge', icon: BookOpen, label: 'Story Forge' },
    { href: '/arc-hub', icon: Users, label: 'ARC Hub' },
    {
      id: 'design',
      icon: Palette,
      label: 'Design Studio',
      subItems: [
        { href: '/cover-calculator', label: 'Cover Calculator' },
        { href: '/design-studio', label: 'Creative Canvas' },
      ]
    },
    { href: '/website-builder', icon: Globe, label: 'Website Builder' },
    { href: '/team-connect', icon: UserPlus, label: 'Team Connect' },
  ];

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-slate-900 text-slate-100 flex flex-col p-4">
      <div className="text-2xl font-bold text-center mb-10 mt-4 text-white">
        🪶 AuthorNest
      </div>
      <nav className="flex-grow overflow-y-auto">
        <ul>
          {navItems.map((item) => (
            <li key={item.id || item.href} className="mb-2">
              {item.subItems ? (
                <>
                  <div onClick={() => toggleMenu(item.id)} className="flex justify-between items-center p-3 rounded-lg hover:bg-slate-700 cursor-pointer">
                    <div className="flex items-center">
                      <item.icon className="h-5 w-5 mr-3" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", openMenu === item.id && "rotate-180")} />
                  </div>
                  <ul className={cn("pl-8 overflow-hidden transition-all duration-300 ease-in-out", openMenu === item.id ? "max-h-40" : "max-h-0")}>
                    {item.subItems.map(sub => (
                      <li key={sub.href}>
                        <Link href={sub.href} className="block p-2 rounded-lg hover:bg-slate-700 text-slate-300">
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link href={item.href} className="flex items-center p-3 rounded-lg hover:bg-slate-700">
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-4 border-t border-slate-700">
        <Link href="/settings" className="flex items-center p-3 rounded-lg hover:bg-slate-700">
          <Settings className="h-5 w-5 mr-3" />
          <span>Settings</span>
        </Link>
        {userProfile?.role === 'SUPER_ADMIN' && (
          <Link href="/superadmin/dashboard" className="flex items-center p-3 rounded-lg hover:bg-slate-700 text-yellow-400">
            <Crown className="h-5 w-5 mr-3" />
            <span>Super Admin</span>
          </Link>
        )}
      </div>
    </div>
  );
}
