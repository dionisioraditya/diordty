import { usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { url } = usePage();
    const isHome = url === '/';
    const isProjects = url === '/projects';

    const navClass = (isActive: boolean) =>
        [
            'block rounded px-3 py-2 font-mono transition',
            isActive
                ? 'text-fg-brand bg-brand/20 md:bg-transparent border border-brand/40 shadow-[0_0_12px_rgba(0,200,255,0.25)]'
                : 'text-heading hover:text-fg-brand',
        ].join(' ');

    const handleMenuClose = () => setIsOpen(false);

    return (
        <nav className="border-default fixed inset-s-0 top-0 z-20 w-full border-b bg-[rgba(10,14,25,0.55)] shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between p-4">
                <a
                    href="/"
                    className="flex items-center space-x-3 rtl:space-x-reverse"
                >
                    {/* <img
                        src="https://flowbite.com/docs/images/logo.svg"
                        className="h-7"
                        alt="Flowbite Logo"
                    /> */}
                    <span className="text-heading self-center text-xl font-semibold whitespace-nowrap">
                        Diordty
                    </span>
                </a>

                <button
                    type="button"
                    className="text-heading rounded-base hover:border-brand/40 hover:bg-brand/10 hover:text-fg-brand inline-flex items-center border border-transparent p-2 text-sm transition focus:outline-none md:hidden"
                    aria-controls="navbar-mobile"
                    aria-expanded={isOpen}
                    aria-label={
                        isOpen
                            ? 'Close navigation menu'
                            : 'Open navigation menu'
                    }
                    onClick={() => setIsOpen((value) => !value)}
                >
                    <span className="sr-only">
                        {isOpen
                            ? 'Close navigation menu'
                            : 'Open navigation menu'}
                    </span>
                    {isOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </button>

                <div className="mr-50 hidden w-full md:block md:w-auto">
                    <ul className="border-default rounded-base bg-neutral-secondary-soft md:bg-transparent mt-4 flex flex-col border p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:p-0 rtl:space-x-reverse">
                        <li>
                            <a
                                href="/"
                                className={navClass(isHome)}
                                aria-current={isHome ? 'page' : undefined}
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <a
                                href="/projects"
                                className={navClass(isProjects)}
                                aria-current={isProjects ? 'page' : undefined}
                            >
                                Projects
                            </a>
                        </li>
                    </ul>
                </div>

                {isOpen && (
                    <div className="w-full md:hidden" id="navbar-mobile">
                        <ul className="border-default rounded-base mt-4 flex flex-col border bg-[rgba(10,14,25,0.82)] p-4 font-medium shadow-[0_16px_40px_rgba(0,0,0,0.24)] backdrop-blur-md">
                            <li>
                                <a
                                    href="/"
                                    className={navClass(isHome)}
                                    aria-current={isHome ? 'page' : undefined}
                                    onClick={handleMenuClose}
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/projects"
                                    className={navClass(isProjects)}
                                    aria-current={
                                        isProjects ? 'page' : undefined
                                    }
                                    onClick={handleMenuClose}
                                >
                                    Projects
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
}
