import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { dashboard, login, register } from '@/routes';

type PublicHeaderProps = {
    canRegister?: boolean;
};

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
];

export default function PublicHeader({
    canRegister = true,
}: PublicHeaderProps) {
    const [open, setOpen] = useState(false);
    const { auth } = usePage().props as {
        auth: {
            user?: {
                id: number;
                name: string;
                email: string;
            } | null;
        };
    };

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
            <nav className="px-4 py-3 lg:px-6">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-3 text-slate-950"
                    >
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                            D
                        </span>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                                Portfolio
                            </span>
                            <span className="text-lg font-semibold tracking-tight">
                                Diordty
                            </span>
                        </div>
                    </Link>

                    <div className="hidden items-center gap-8 lg:flex">
                        <ul className="flex items-center gap-7 text-sm font-medium text-slate-600">
                            {navItems.map((item) => (
                                <li key={item.label}>
                                    {item.href.startsWith('#') ? (
                                        <a
                                            href={item.href}
                                            className="transition hover:text-slate-950"
                                        >
                                            {item.label}
                                        </a>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className="transition hover:text-slate-950"
                                        >
                                            {item.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <div className="flex items-center gap-2">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="rounded-full bg-slate-950 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="rounded-full bg-orange-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-orange-500"
                                        >
                                            Get started
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setOpen((value) => !value)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-100 lg:hidden"
                        aria-controls="public-mobile-menu"
                        aria-expanded={open}
                        aria-label={open ? 'Close menu' : 'Open menu'}
                    >
                        {open ? classNameIcon(<X className="h-5 w-5" />) : classNameIcon(<Menu className="h-5 w-5" />)}
                    </button>
                </div>

                {open && (
                    <div
                        id="public-mobile-menu"
                        className="mx-auto mt-4 max-w-7xl rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:hidden"
                    >
                        <ul className="flex flex-col gap-2 text-sm font-medium text-slate-700">
                            {navItems.map((item) => (
                                <li key={item.label}>
                                    {item.href.startsWith('#') ? (
                                        <a
                                            href={item.href}
                                            className="block rounded-2xl px-4 py-3 transition hover:bg-slate-100"
                                            onClick={() => setOpen(false)}
                                        >
                                            {item.label}
                                        </a>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className="block rounded-2xl px-4 py-3 transition hover:bg-slate-100"
                                            onClick={() => setOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-4 flex flex-col gap-2 border-t border-slate-200 pt-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="rounded-2xl bg-slate-950 px-4 py-3 text-center text-sm font-medium text-white"
                                    onClick={() => setOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="rounded-2xl px-4 py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                                        onClick={() => setOpen(false)}
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="rounded-2xl bg-orange-600 px-4 py-3 text-center text-sm font-medium text-white"
                                            onClick={() => setOpen(false)}
                                        >
                                            Get started
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}

function classNameIcon(icon: React.ReactNode) {
    return icon;
}
