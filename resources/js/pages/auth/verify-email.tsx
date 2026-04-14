// Components
import { Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { logout } from '@/routes';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="Email verification" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    A new verification link has been sent to the email address
                    you provided during registration.
                </div>
            )}

            <div className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground">
                    Email verification is no longer required for new accounts.
                    Sign in and complete Google Authenticator setup instead.
                </p>

                <TextLink href={logout()} className="mx-auto block text-sm">
                    Log out
                </TextLink>
            </div>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Authenticator setup required',
    description:
        'Complete Google Authenticator setup to activate your account.',
};
