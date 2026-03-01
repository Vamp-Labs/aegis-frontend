'use client';

import { useAuthStore } from '@/lib/store/authStore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            const isPublicPath = pathname === '/login' || pathname === '/';

            if (!isAuthenticated && !isPublicPath) {
                // Not logged in and trying to access protected route
                router.push('/login');
            } else if (isAuthenticated && isPublicPath) {
                // Logged in and trying to access login/home
                router.replace('/dashboard');
            }
        }
    }, [isAuthenticated, pathname, router, mounted]);

    if (!mounted) {
        // Prevent hydration mismatch
        return null;
    }

    const isPublicPath = pathname === '/login' || pathname === '/';
    if (!isAuthenticated && !isPublicPath) {
        return null; // Do not render protected content while redirecting
    }

    return <>{children}</>;
}
