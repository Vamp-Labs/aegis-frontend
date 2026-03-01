'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Shield, ShieldCheck, Activity } from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Sentinel', href: '/sentinel', icon: Shield },
    { name: 'Registry', href: '/registry', icon: ShieldCheck },
    { name: 'Oracle', href: '/oracle', icon: Activity },
];

export function Sidebar() {
    const pathname = usePathname();

    // Hide sidebar on the login page
    if (pathname === '/' || pathname === '/login') return null;

    return (
        <aside className="w-64 bg-gray-900 border-r border-gray-800 hidden md:flex flex-col shrink-0">
            <div className="h-16 flex items-center px-6 border-b border-gray-800">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    Aegis Protocol
                </h1>
            </div>
            <nav className="flex-1 py-6 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-600/10 text-blue-400'
                                    : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
