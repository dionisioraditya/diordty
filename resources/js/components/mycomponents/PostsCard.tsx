import GlitchText from '@/components/mycomponents/GlitchText';
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

    return (
        <div className="bg-neutral-primary-soft border-default rounded-4xl shadow-xs block max-w-sm border bg-[rgba(10,14,25,0.55)] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.18)] shadow-lg backdrop-blur-md hover:shadow-[0_0_20px_5px_rgba(79,70,229,0.6)]">
            <a href={`/projects/${project.slug}`}>
                <div className="rounded-base h-38 w-full overflow-hidden">
                    <img
                        className="rounded-4xl h-full w-full object-cover"
                        src="wallpaper.jpg"
                        alt=""
                    />
                </div>

                <div className="pt-5 opacity-40">
                    <a
                        href={`/projects?category=${project.category.slug}`}
                        className={`inline-flex rounded-full px-3 py-1 text-xs ${categoryBadgeClass}`}
                    >
                        {project.category?.name}
                    </a>
                </div>

                <a href="#">
                    <h5 className="text-heading mb-2 mt-6 text-2xl font-semibold tracking-tight">
                        {project.title}
                    </h5>
                </a>

                <p className="text-body mb-6">
                    {project.description.slice(0, 100)}
                </p>

                <a
                    href="#"
                    className="text-body bg-neutral-secondary-medium border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading rounded-base shadow-xs box-border inline-flex items-center border px-4 py-2.5 text-sm font-medium leading-5"
                >
                    Read more
                    <svg
                        className="-me-0.5 ms-1.5 h-4 w-4 rtl:rotate-180"
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
            </a>
        </div>
    );
}
