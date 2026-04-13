import { excerptHtml } from '@/lib/html';
import { motion } from 'framer-motion';

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
};

type Props = {
    project: Project;
};

const categoryColorMap: Record<string, string> = {
    'text-green-100':
        'bg-green-100 text-green-800 ring-1 ring-inset ring-green-200',
    'bg-green-100':
        'bg-green-100 text-green-800 ring-1 ring-inset ring-green-200',
    'text-blue-100':
        'bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200',
    'bg-blue-100': 'bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200',
    'text-yellow-100':
        'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-200',
    'bg-yellow-100':
        'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-200',
    'text-purple-100':
        'bg-purple-100 text-purple-800 ring-1 ring-inset ring-purple-200',
    'bg-purple-100':
        'bg-purple-100 text-purple-800 ring-1 ring-inset ring-purple-200',
};

export default function PostsCard({ project }: Props) {
    const categoryBadgeClass =
        categoryColorMap[project.category?.color] ??
        'bg-muted text-muted-foreground ring-1 ring-inset ring-border';
    const descriptionPreview = excerptHtml(project.description, 80);

    return (
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <div className="bg-neutral-primary-soft border-default block w-full overflow-hidden rounded-2xl border bg-[rgba(10,14,25,0.55)] p-0 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-md hover:shadow-xl hover:shadow-cyan-800">
                <a href={`/projects/${project.slug}`}>
                    <div className="relative overflow-hidden">
                        <img
                            className="h-50 w-full object-cover"
                            src="wallpaper.jpg"
                            alt=""
                        />
                        <a
                            href={`/projects?category=${project.category.slug}`}
                            className={`absolute top-4 left-4 inline-flex rounded-full px-3 py-1 font-mono text-xs opacity-40 ${categoryBadgeClass}`}
                        >
                            {project.category?.name}
                        </a>
                    </div>

                    <div className="flex min-h-fit flex-col gap-2 pt-2 pl-6">
                        <a
                            href={`/projects/${project.slug}`}
                            className="line-clamp-2 max-w-full text-sm leading-tight font-semibold tracking-tight break-words text-white"
                        >
                            {project.title}
                        </a>

                        <p className="line-clamp-2 min-h-14 font-sans text-base leading-7 text-white/75">
                            {descriptionPreview ||
                                'Project description belum tersedia.'}
                        </p>

                        <a
                            href={`/projects/${project.slug}`}
                            className="text-body bg-neutral-secondary-medium border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading rounded-base mt-auto mb-2 box-border inline-flex w-fit items-center border px-4 py-0 text-sm leading-5 font-medium shadow-xs"
                        >
                            Read more
                            <svg
                                className="ms-1.5 -me-0.5 h-4 w-4 rtl:rotate-180"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 12H5m14 0-4 4m4-4-4-4"
                                />
                            </svg>
                        </a>
                    </div>
                </a>
            </div>
        </motion.div>
    );
}
