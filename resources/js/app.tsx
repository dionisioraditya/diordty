import { createInertiaApp } from '@inertiajs/react';
import { createElement, StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

let appName =
    typeof document !== 'undefined'
        ? document.title.trim() ||
          document.querySelector('title')?.textContent?.trim() ||
          'Laravel'
        : 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'Home':
                return null;
            case name === 'Projects':
                return null;
            case name === 'Project':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    setup({ el, App, props }) {
        appName =
            typeof props.initialPage.props.name === 'string' &&
            props.initialPage.props.name.trim() !== ''
                ? props.initialPage.props.name
                : appName;

        if (!el) {
            return;
        }

        const app = (
            <StrictMode>
                <TooltipProvider delayDuration={0}>
                    {createElement(App, props)}
                </TooltipProvider>
            </StrictMode>
        );

        if (el.hasAttribute('data-server-rendered')) {
            hydrateRoot(el, app);
            return;
        }

        createRoot(el).render(app);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
if (typeof window !== 'undefined') {
    initializeTheme();
}
