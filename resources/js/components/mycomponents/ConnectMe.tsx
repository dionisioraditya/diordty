import { Instagram, Linkedin, Mail, MessageCircleMore } from 'lucide-react';

const contactLinks = [
    {
        label: 'Instagram',
        href: 'https://www.instagram.com/diordty/',
        icon: Instagram,
        external: true,
        accent: 'from-pink-500/20 via-fuchsia-500/10 to-transparent',
    },
    {
        label: 'WhatsApp',
        href: 'https://wa.me/628558598886',
        icon: MessageCircleMore,
        external: true,
        accent: 'from-emerald-500/20 via-green-500/10 to-transparent',
    },
    {
        label: 'Email',
        href: 'mailto:dio.prasmada@gmail.com',
        icon: Mail,
        external: false,
        accent: 'from-cyan-500/20 via-sky-500/10 to-transparent',
    },
    {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/dionisio-raditya-prasmada-4a57661a4/',
        icon: Linkedin,
        external: true,
        accent: 'from-blue-500/20 via-indigo-500/10 to-transparent',
    },
] as const;
export default function ConnectwtMe() {
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(92,225,230,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(79,70,229,0.12),transparent_26%),rgba(7,11,20,0.86)] px-6 py-8 shadow-[0_25px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:px-8 lg:px-10 lg:py-10">
                <div className="pointer-events-none absolute -top-16 left-10 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="pointer-events-none absolute right-6 bottom-0 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl" />

                <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-[11px] font-semibold tracking-[0.28em] text-cyan-100/70 uppercase">
                            Connect
                        </p>
                        <h2 className="font-heading mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                            Connect with me
                        </h2>
                        <p className="mt-3 text-sm leading-7 text-white/65 sm:text-base">
                            Reach out through the channel that works best for
                            you. I am open to collaborations, project
                            discussions, and interesting ideas around AI,
                            robotics, and software systems.
                        </p>
                    </div>

                    <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-medium text-white/78 backdrop-blur-md">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.75)]" />
                        Available on 4 channels
                    </div>
                </div>

                <div className="relative mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {contactLinks.map((item) => {
                        const Icon = item.icon;

                        return (
                            <a
                                key={item.label}
                                href={item.href}
                                target={item.external ? '_blank' : undefined}
                                rel={
                                    item.external
                                        ? 'noreferrer noopener'
                                        : undefined
                                }
                                className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/7 hover:shadow-[0_18px_45px_rgba(0,0,0,0.24)]"
                            >
                                <div
                                    className={`pointer-events-none absolute inset-0 bg-linear-to-br ${item.accent} opacity-70 transition-opacity duration-300 group-hover:opacity-100`}
                                />
                                <div className="relative flex min-h-32 flex-col justify-between gap-5">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-black/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                                        <Icon className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <p className="text-lg font-semibold text-white">
                                            {item.label}
                                        </p>
                                        <p className="mt-1 text-sm text-white/55">
                                            Open {item.label}
                                        </p>
                                    </div>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
