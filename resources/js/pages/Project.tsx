import { Head } from '@inertiajs/react';
import Navbar from '@/components/mycomponents/Navbar';

type Techstack = {
    id: number;
    name: string;
    slug: string;
    icon?: string | null;
};
type Project = {
    title?: string | null;
    slug?: string | null;
    description?: string | null;
    image?: string | null;
    demo_link: string | null;
    github_link?: string | null;
    video_link?: string | null;
    techstacks?: Techstack[];
};

type Props = {
    project: Project;
};

function normalizeImagePath(image?: string | null) {
    if (!image) return null;
    if (image.startsWith('http://') || image.startsWith('https://'))
        return image;
    if (image.startsWith('/')) return image;

    return `/storage/${image}`;
}

export default function Project({ project }: Props) {
    const title = project.title?.trim() || 'Untitled project';
    const description = project.description?.trim();
    const imageSrc = project.image;
    const hasLinks = Boolean(project.github_link || project.video_link);
    const techstacks = project.techstacks ?? [];

    return (
        <>
            <Head title={title} />

            <div className="min-h-screen bg-background text-foreground">
                <Navbar />

                <div className="mt-10 pt-8 pb-16 lg:pt-16 lg:pb-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start xl:gap-14">
                            <main className="mx-auto w-full max-w-3xl">
                                <a
                                    href="/projects"
                                    className="text-xs font-medium text-blue-500 hover:underline"
                                >
                                    &laquo; Back to all projects
                                </a>

                                <header className="my-4 mb-8 border-b border-white/10 pb-6">
                                    <p className="mb-3 text-xs font-semibold tracking-[0.28em] text-white/45 uppercase">
                                        Project detail
                                    </p>
                                    <h1 className="text-3xl leading-tight font-extrabold text-gray-900 lg:text-5xl dark:text-white">
                                        {title}
                                    </h1>
                                </header>

                                <article className="text-base leading-8 text-white/70">
                                    {description ? (
                                        <div
                                            className="[&_.ql-align-center]:text-center [&_.ql-align-justify]:text-justify [&_.ql-align-right]:text-right [&_.ql-indent-1]:pl-6 [&_.ql-indent-2]:pl-12 [&_.ql-indent-3]:pl-18 [&_a]:font-medium [&_a]:text-blue-400 [&_a]:underline [&_a]:decoration-blue-400/40 [&_a]:underline-offset-4 [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-white/15 [&_blockquote]:pl-5 [&_blockquote]:text-white/60 [&_blockquote]:italic [&_code]:rounded-md [&_code]:bg-white/8 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_em]:italic [&_h1]:mt-10 [&_h1]:mb-4 [&_h1]:text-4xl [&_h1]:leading-tight [&_h1]:font-extrabold [&_h1]:text-white [&_h2]:mt-9 [&_h2]:mb-4 [&_h2]:text-3xl [&_h2]:leading-tight [&_h2]:font-bold [&_h2]:text-white [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-white [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-3xl [&_img]:border [&_img]:border-white/10 [&_img]:shadow-lg [&_li]:text-white/70 [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:my-5 [&_p]:text-base [&_p]:leading-8 [&_p]:text-white/70 [&_pre]:my-8 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:border [&_pre]:border-white/10 [&_pre]:bg-black/30 [&_pre]:p-4 [&_pre]:text-sm [&_strong]:font-semibold [&_strong]:text-white [&_ul]:my-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6"
                                            dangerouslySetInnerHTML={{
                                                __html: description,
                                            }}
                                        />
                                    ) : (
                                        <p>
                                            Project description belum tersedia.
                                            Anda bisa isi konten utama di
                                            halaman ini kapan saja.
                                        </p>
                                    )}
                                </article>
                            </main>

                            <aside className="w-full lg:sticky lg:top-28">
                                <div className="rounded-4xl border border-white/10 bg-[rgba(10,14,25,0.7)] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-md">
                                    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                                        {imageSrc ? (
                                            <img
                                                src={imageSrc}
                                                alt={imageSrc}
                                                className="h-56 w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-56 items-center justify-center bg-linear-to-br from-white/8 to-white/3 px-6 text-center text-sm text-white/45">
                                                Preview image akan tampil di
                                                sini
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-5 space-y-5">
                                        <section>
                                            <p className="text-xs font-semibold tracking-[0.24em] text-white/40 uppercase">
                                                Quick links
                                            </p>
                                            <div className="mt-3 flex flex-col gap-3">
                                                {project.github_link && (
                                                    <a
                                                        href={
                                                            project.github_link
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                                                    >
                                                        Open GitHub
                                                    </a>
                                                )}

                                                {project.video_link && (
                                                    <a
                                                        href={
                                                            project.video_link
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                                                    >
                                                        Watch demo
                                                    </a>
                                                )}

                                                {!hasLinks && (
                                                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/3 px-4 py-3 text-sm text-white/45">
                                                        Link project bisa Anda
                                                        tambahkan di card ini.
                                                    </div>
                                                )}
                                            </div>
                                        </section>
                                        <section>
                                            <p className="text-xs font-semibold tracking-[0.24em] text-white/40 uppercase">
                                                Tech Stack
                                            </p>
                                            {techstacks.length > 0 ? (
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {techstacks.map((item) => (
                                                        <span
                                                            key={item.id}
                                                            className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium text-white/80"
                                                        >
                                                            {item.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="mt-4 text-white/35">
                                                    Belum ada tech stack yang
                                                    terhubung ke project ini.
                                                </p>
                                            )}
                                        </section>
                                        <section>
                                            <p className="text-xs font-semibold tracking-[0.24em] text-white/40 uppercase">
                                                Extra info
                                            </p>
                                            <div className="mt-3 rounded-2xl border border-dashed border-white/10 bg-white/3 p-4 text-sm leading-6 text-white/45">
                                                <p>
                                                    Area ini disiapkan untuk
                                                    info tambahan seperti stack,
                                                    status, role, atau CTA lain.
                                                </p>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
