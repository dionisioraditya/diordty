import PublicHeader from '@/components/public-header';

type PublicLayoutProps = {
    children: React.ReactNode;
    canRegister?: boolean;
};

export default function PublicLayout({
    children,
    canRegister = true,
}: PublicLayoutProps) {
    return (
        <div className="min-h-screen bg-[#f8f6f1] text-slate-950">
            <PublicHeader canRegister={canRegister} />
            <main>{children}</main>
        </div>
    );
}
