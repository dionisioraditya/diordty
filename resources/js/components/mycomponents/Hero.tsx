import ProfileCard from '@/components/mycomponents/ProfileCard';
import GlitchText from '@/components/mycomponents/GlitchText';
import { motion } from 'framer-motion';
type HeroCategory = {
    id: number;
    name: string;
    slug: string;
    color?: string;
};

const heroHighlights = [
    'Robotics Systems',
    'Computer Vision',
    'Intelligent Automation',
];

type HeroProps = {
    categories: HeroCategory[];
};

export default function Hero({ categories }: HeroProps) {
    const categoryLabel =
        categories.length > 0
            ? categories.map((category) => category.name).join(', ')
            : 'AI, Robotics, Automation';

    return (
        <section className="relative w-full max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(78,153,255,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(72,208,183,0.14),transparent_26%),rgba(7,11,20,0.92)] px-6 py-10 shadow-[0_25px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-8 lg:px-10 lg:py-14">
            <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
            <div className="pointer-events-none absolute -top-28 left-10 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="pointer-events-none absolute right-0 bottom-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,420px)] lg:gap-14">
                <div className="min-w-0">
                    <div className="inline-flex max-w-full items-center gap-3 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-semibold tracking-[0.26em] text-cyan-100/85 uppercase backdrop-blur-md">
                        <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.8)]" />
                        <span className="break-words">
                            AI, Robotics, Automation
                        </span>
                    </div>

                    <div className="mt-6 max-w-3xl">
                        <GlitchText
                            children={'AI &amp; Robotics Engineer'}
                            speed={3}
                            pauseDuration={1400}
                            glitchDuration={220}
                        />
                        {/* <h1 className="font-heading text-4xl leading-[0.95] font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
                            AI &amp; Robotics Engineer
                        </h1> */}
                        <p className="mt-5 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                            I build intelligent systems that connect software,
                            perception, and hardware into practical automation.
                            My work focuses on robotics workflows, computer
                            vision, and AI-driven products that feel reliable in
                            the real world, not just in demos.
                        </p>
                    </div>

                    <div className="box mt-8 flex flex-wrap gap-5">
                        {categories.map((highlight) => (
                            <motion.div
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.8 }}
                            >
                                <a
                                    href={`/projects?category=${highlight.slug}`}
                                    className="rounded-full border border-white/12 bg-white/7 px-4 py-2 text-sm font-medium text-white/82 backdrop-blur-md"
                                >
                                    {highlight.name}
                                </a>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-md">
                            <p className="text-[11px] font-semibold tracking-[0.24em] text-white/42 uppercase">
                                Focus
                            </p>
                            <p className="mt-2 text-lg font-semibold text-white">
                                Vision + Control
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-md">
                            <p className="text-[11px] font-semibold tracking-[0.24em] text-white/42 uppercase">
                                Stack
                            </p>
                            <p className="mt-2 text-lg font-semibold text-white">
                                AI, Robotics, IoT, and Software
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-md">
                            <p className="text-[11px] font-semibold tracking-[0.24em] text-white/42 uppercase">
                                Goal
                            </p>
                            <p className="mt-2 text-lg font-semibold text-white">
                                Autonomous
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative mx-auto w-full max-w-fit">
                    <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-linear-to-br from-cyan-400/14 via-blue-500/8 to-transparent blur-2xl" />
                    <div className="relative rounded-[2rem] border border-white/10 bg-white/4 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-md">
                        <ProfileCard
                            name="Dionisio Raditya"
                            title="AI & Robotics Engineer"
                            handle="dionisioraditya"
                            status="Open to collaborate"
                            contactText="Contact Me"
                            avatarUrl="myprofile.png"
                            showUserInfo={true}
                            enableTilt={true}
                            enableMobileTilt={true}
                            onContactClick={() =>
                                console.log('Contact clicked')
                            }
                            behindGlowColor="rgba(8, 8, 74, 1)"
                            iconUrl="/assets/demo/iconpattern.png"
                            behindGlowEnabled={false}
                            innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
