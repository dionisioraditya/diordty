import LogoLoop from '@/components/mycomponents/LogoLoop';

type Techstack = {
    id: number;
    name: string;
    slug: string;
    icon: string;
};
type Props = {
    techstack: Techstack[];
};
export default function TechstackRotation({ techstack }: Props) {
    const hasTechstack = techstack.length > 0;
    return (
        <section className="relative overflow-hidden px-4 pt-8 pb-16 sm:px-6 lg:px-8 lg:pt-12 lg:pb-24">
            <div className="pointer-events-none absolute top-10 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-cyan-400/8 blur-3xl" />
            <div className="pointer-events-none absolute right-20 bottom-0 h-48 w-48 rounded-full bg-blue-500/8 blur-3xl" />

            <div className="relative mx-auto max-w-7xl">
                <div className="rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(72,208,183,0.1),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_28%),rgba(7,11,20,0.82)] px-6 py-8 shadow-[0_25px_90px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:px-8 lg:px-10 lg:py-10">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-[11px] font-semibold tracking-[0.28em] text-cyan-100/70 uppercase">
                                Tech Stack
                            </p>
                            <h2 className="font-heading mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                                Tools I Work With
                            </h2>
                            <p className="mt-3 text-sm leading-7 text-white/65 sm:text-base">
                                A curated set of technologies I use to build
                                intelligent software, automation pipelines,
                                robotics workflows, and reliable
                                production-ready interfaces.
                            </p>
                        </div>

                        <div className="inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-medium text-white/78 backdrop-blur-md">
                            <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.75)]" />
                            {hasTechstack
                                ? `${techstack.length} technologies`
                                : 'Stack showcase coming soon'}
                        </div>
                    </div>

                    <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] px-4 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md sm:px-6 lg:px-8">
                        {hasTechstack ? (
                            <LogoLoop
                                logos={techstack.map((item) => ({
                                    src: item.icon,
                                    alt: item.name,
                                    href: '',
                                    title: item.name,
                                }))}
                                speed={72}
                                direction="left"
                                logoHeight={56}
                                gap={48}
                                hoverSpeed={18}
                                scaleOnHover
                                fadeOut
                                fadeOutColor="rgba(7,11,20,0.92)"
                                ariaLabel="Technology stack showcase"
                            />
                        ) : (
                            <div className="flex min-h-28 items-center justify-center rounded-[1.25rem] border border-dashed border-white/12 bg-white/3 px-6 text-center text-sm text-white/50">
                                Belum ada tech stack yang ditambahkan.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
