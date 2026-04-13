import Navbar from '@/components/mycomponents/Navbar';
import Hero from '@/components/mycomponents/Hero';
import TechstackRotation from '@/components/mycomponents/TechStackRotation';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import ConnectwtMe from '@/components/mycomponents/ConnectMe';

type Category = {
    id: number;
    name: string;
    slug: string;
    color?: string;
};
type Techstack = {
    id: number;
    name: string;
    slug: string;
    icon: string;
};
type Props = {
    categories: Category[];
    techstack: Techstack[];
};

export default function Home({ categories, techstack }: Props) {
    return (
        <>
            <Head title="Home" />
            <div className="min-h-screen bg-background text-foreground lg:h-screen lg:snap-y lg:snap-mandatory lg:[scroll-padding-top:6rem] lg:overflow-y-auto">
                <Navbar />
                <div className="overflow-x-hidden lg:min-h-screen lg:snap-start">
                    <motion.section
                        initial={{ opacity: 0.0, x: -500 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{
                            type: 'spring',
                            stiffness: 50,
                            damping: 7,
                        }}
                        className="py-0 lg:flex lg:min-h-screen lg:items-center"
                    >
                        <div className="mx-auto flex max-w-7xl justify-center px-4 pt-24 pb-10 sm:px-6 lg:px-8 lg:pt-28">
                            <Hero categories={categories} />
                        </div>
                    </motion.section>
                </div>

                <div className="overflow-x-hidden lg:min-h-screen lg:snap-start">
                    <motion.section
                        initial={{ opacity: 0.0, x: 500 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{
                            type: 'spring',
                            stiffness: 50,
                            damping: 7,
                        }}
                        className="py-24 lg:flex lg:min-h-screen lg:items-center"
                    >
                        <TechstackRotation techstack={techstack} />
                    </motion.section>
                </div>

                <div className="overflow-x-hidden lg:min-h-screen lg:snap-start">
                    <motion.section
                        initial={{ opacity: 0.0, x: -500 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{
                            type: 'spring',
                            stiffness: 50,
                            damping: 7,
                        }}
                        className="pt-0 pb-24 lg:flex lg:min-h-screen lg:items-center"
                    >
                        <ConnectwtMe />
                    </motion.section>
                </div>
            </div>
        </>
    );
}
