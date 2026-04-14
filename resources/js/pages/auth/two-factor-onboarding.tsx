import { Form, Head } from '@inertiajs/react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Check, Copy, ScanLine } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AlertError from '@/components/alert-error';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { Spinner } from '@/components/ui/spinner';
import { useAppearance } from '@/hooks/use-appearance';
import { useClipboard } from '@/hooks/use-clipboard';
import {
    OTP_MAX_LENGTH,
    useTwoFactorAuth,
} from '@/hooks/use-two-factor-auth';
import { logout } from '@/routes';
import { enable } from '@/routes/two-factor';

function GridScanIcon() {
    return (
        <div className="mb-3 rounded-full border border-border bg-card p-0.5 shadow-sm">
            <div className="relative overflow-hidden rounded-full border border-border bg-muted p-2.5">
                <div className="absolute inset-0 grid grid-cols-5 opacity-50">
                    {Array.from({ length: 5 }, (_, index) => (
                        <div
                            key={`col-${index + 1}`}
                            className="border-r border-border last:border-r-0"
                        />
                    ))}
                </div>
                <div className="absolute inset-0 grid grid-rows-5 opacity-50">
                    {Array.from({ length: 5 }, (_, index) => (
                        <div
                            key={`row-${index + 1}`}
                            className="border-b border-border last:border-b-0"
                        />
                    ))}
                </div>
                <ScanLine className="relative z-20 size-6 text-foreground" />
            </div>
        </div>
    );
}

type Props = {
    hasPendingSetup: boolean;
    requiresConfirmation: boolean;
};

export default function TwoFactorOnboarding({
    hasPendingSetup,
    requiresConfirmation,
}: Props) {
    const { resolvedAppearance } = useAppearance();
    const [copiedText, copy] = useClipboard();
    const [code, setCode] = useState('');
    const [hasRequestedSetup, setHasRequestedSetup] = useState(hasPendingSetup);
    const [hasFetchedSetup, setHasFetchedSetup] = useState(false);
    const {
        qrCodeSvg,
        manualSetupKey,
        errors: setupErrors,
        fetchSetupData,
        clearErrors,
    } = useTwoFactorAuth();

    useEffect(() => {
        if (!hasRequestedSetup || hasFetchedSetup) {
            return;
        }

        void fetchSetupData().finally(() => setHasFetchedSetup(true));
    }, [fetchSetupData, hasFetchedSetup, hasRequestedSetup]);

    const copyIcon = useMemo(
        () => (copiedText === manualSetupKey ? Check : Copy),
        [copiedText, manualSetupKey],
    );
    const CopyIcon = copyIcon;

    return (
        <>
            <Head title="Set up Google Authenticator" />

            <div className="space-y-6">
                <div className="flex flex-col items-center text-center">
                    <GridScanIcon />
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Set up Google Authenticator
                    </h2>
                    <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                        Scan the QR code with Google Authenticator or another
                        TOTP app, then enter the 6-digit code to finish
                        activating your account.
                    </p>
                </div>

                {setupErrors.length > 0 && <AlertError errors={setupErrors} />}

                {!hasRequestedSetup ? (
                    <Form
                        {...enable.form()}
                        onSuccess={() => {
                            clearErrors();
                            setHasRequestedSetup(true);
                            setHasFetchedSetup(false);
                        }}
                        className="space-y-4"
                    >
                        {({ processing }) => (
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                Generate authenticator setup
                            </Button>
                        )}
                    </Form>
                ) : (
                    <>
                        <div className="mx-auto flex max-w-md overflow-hidden">
                            <div className="mx-auto aspect-square w-64 rounded-lg border border-border">
                                <div className="flex h-full w-full items-center justify-center p-5">
                                    {qrCodeSvg ? (
                                        <div
                                            className="aspect-square w-full rounded-lg bg-white p-2 [&_svg]:size-full"
                                            dangerouslySetInnerHTML={{
                                                __html: qrCodeSvg,
                                            }}
                                            style={{
                                                filter:
                                                    resolvedAppearance ===
                                                    'dark'
                                                        ? 'invert(1) brightness(1.5)'
                                                        : undefined,
                                            }}
                                        />
                                    ) : (
                                        <Spinner />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <p className="text-center text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
                                Manual setup key
                            </p>
                            <div className="flex w-full items-stretch overflow-hidden rounded-xl border border-border">
                                <Input
                                    readOnly
                                    value={manualSetupKey ?? ''}
                                    className="border-0 bg-background font-mono tracking-[0.2em] uppercase shadow-none focus-visible:ring-0"
                                />
                                <button
                                    type="button"
                                    className="border-l border-border px-3 hover:bg-muted"
                                    onClick={() =>
                                        manualSetupKey
                                            ? copy(manualSetupKey)
                                            : Promise.resolve(false)
                                    }
                                >
                                    <CopyIcon className="size-4" />
                                </button>
                            </div>
                        </div>

                        <Form
                            action="/register/two-factor-setup"
                            method="post"
                            className="space-y-4"
                            resetOnError
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div className="flex flex-col items-center justify-center space-y-3 text-center">
                                        <p className="text-sm text-muted-foreground">
                                            Enter the authentication code from
                                            your app to verify this account.
                                        </p>
                                        <InputOTP
                                            name="code"
                                            maxLength={OTP_MAX_LENGTH}
                                            value={code}
                                            onChange={setCode}
                                            disabled={processing}
                                            pattern={REGEXP_ONLY_DIGITS}
                                        >
                                            <InputOTPGroup>
                                                {Array.from(
                                                    { length: OTP_MAX_LENGTH },
                                                    (_, index) => (
                                                        <InputOTPSlot
                                                            key={index}
                                                            index={index}
                                                        />
                                                    ),
                                                )}
                                            </InputOTPGroup>
                                        </InputOTP>
                                        <InputError message={errors.code} />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={
                                            processing ||
                                            code.length < OTP_MAX_LENGTH
                                        }
                                    >
                                        {processing && <Spinner />}
                                        Complete setup
                                    </Button>
                                </>
                            )}
                        </Form>
                    </>
                )}

                <div className="space-y-2 text-center text-sm text-muted-foreground">
                    <p>
                        {requiresConfirmation
                            ? 'This verification code activates your account and enables two-factor login for future sign-ins.'
                            : 'Your authenticator app will be required on future sign-ins after setup completes.'}
                    </p>
                    <TextLink href={logout()} className="mx-auto block w-fit">
                        Log out
                    </TextLink>
                </div>
            </div>
        </>
    );
}

TwoFactorOnboarding.layout = {
    title: 'Set up Google Authenticator',
    description:
        'Scan the QR code and enter the 6-digit code from your authenticator app to activate your account.',
};
