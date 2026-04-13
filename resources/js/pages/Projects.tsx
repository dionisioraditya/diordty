import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '@/components/mycomponents/Navbar';
import PostsCard from '@/components/mycomponents/PostsCard';
import SearchBar from '@/components/mycomponents/Searchbar';

type Category = {
    id: number;
    name: string;
    slug: string;
    color: string;
};
type Project = {
    id: number;
    title: string;
    slug: string;
    category: Category;
    description: string;
    image?: string | null;
};

type PaginatedProjects = {
    data: Project[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
};

type Filters = {
    search: string;
    category: string;
};

type Props = {
    projects: PaginatedProjects;
    categories: Category[];
    filters: Filters;
};

export default function Projects({ projects, categories, filters }: Props) {
    return (
        <>
            <Head title="Projects" />

            <div className="min-h-screen bg-background text-foreground">
                <Navbar />

                <div className="pt-25">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2.0 }}
                    >
                        <SearchBar
                            categories={categories}
                            search={filters.search}
                            category={filters.category}
                        />
                    </motion.div>

                    {projects.data.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: -100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.0 }}
                        >
                            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 px-4 pt-10 sm:grid-cols-2 lg:grid-cols-3">
                                {projects.data.map((project) => (
                                    <PostsCard
                                        key={project.id}
                                        project={project}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="mx-auto max-w-7xl px-4 pt-10">
                            <div className="rounded-base border-default bg-neutral-primary-soft p-8 text-center">
                                <h2 className="text-heading text-xl font-semibold">
                                    No projects found
                                </h2>
                                <p className="text-body mt-2">
                                    Try a different keyword or category to find
                                    matching projects.
                                </p>
                            </div>
                        </div>
                    )}
                    <div className="mt-8 flex items-center justify-center gap-4 pb-5">
                        {projects.prev_page_url && (
                            <Link
                                href={projects.prev_page_url}
                                className="rounded-lg border border-border px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                            >
                                Previous
                            </Link>
                        )}

                        <span className="text-sm text-muted-foreground">
                            Page {projects.current_page} of {projects.last_page}
                        </span>

                        {projects.next_page_url && (
                            <Link
                                href={projects.next_page_url}
                                className="rounded-lg border border-border px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                            >
                                Next
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
