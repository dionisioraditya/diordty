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
    image_url?: string | null;
    demo_link?: string | null;
    github_link?: string | null;
    video_link?: string | null;
    info?: string | null;
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
    const imageSrc = project.image_url || normalizeImagePath(project.image);
    const hasLinks = Boolean(project.github_link || project.video_link);
    const techstacks = project.techstacks ?? [];
    const videoLink = project.video_link
        ? project.video_link.replace(
              'https://youtu.be/',
              'https://www.youtube.com/embed/',
          )
        : null;
    const videoEmbed = videoLink ? (
        <iframe
            className="aspect-video h-full w-full rounded-3xl"
            src={videoLink}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
        />
    ) : null;

    return (
        <>
            <Head title={title} />

            <div className="min-h-screen bg-background text-foreground">
                <Navbar />

                <div className="mt-10 pt-8 pb-16 lg:pt-16 lg:pb-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start xl:gap-14">
                            <main className="min-w-0 w-full max-w-3xl">
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
                                    <h1 className="font-heading text-3xl leading-tight font-extrabold text-gray-900 lg:text-5xl dark:text-white">
                                        {title}
                                    </h1>
                                </header>
                                {videoEmbed && (
                                    <div className="mb-8 hidden lg:block">
                                        {videoEmbed}
                                    </div>
                                )}

                                <article className="min-w-0 break-words pt-5 text-base leading-8 text-white/70">
                                    {description ? (
                                        <div
                                            className="min-w-0 break-words font-mono [&_.ql-align-center]:text-center [&_.ql-align-justify]:text-justify [&_.ql-align-right]:text-right [&_.ql-indent-1]:pl-6 [&_.ql-indent-2]:pl-12 [&_.ql-indent-3]:pl-18 [&_a]:break-words [&_a]:font-medium [&_a]:text-blue-400 [&_a]:underline [&_a]:decoration-blue-400/40 [&_a]:underline-offset-4 [&_blockquote]:my-8 [&_blockquote]:overflow-wrap-anywhere [&_blockquote]:border-l-4 [&_blockquote]:border-white/15 [&_blockquote]:pl-5 [&_blockquote]:text-white/60 [&_blockquote]:italic [&_code]:break-words [&_code]:rounded-md [&_code]:bg-white/8 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_em]:italic [&_h1]:mt-10 [&_h1]:mb-4 [&_h1]:overflow-wrap-anywhere [&_h1]:text-4xl [&_h1]:leading-tight [&_h1]:font-extrabold [&_h1]:text-white [&_h2]:mt-9 [&_h2]:mb-4 [&_h2]:overflow-wrap-anywhere [&_h2]:text-3xl [&_h2]:leading-tight [&_h2]:font-bold [&_h2]:text-white [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:overflow-wrap-anywhere [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-white [&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-3xl [&_img]:border [&_img]:border-white/10 [&_img]:shadow-lg [&_li]:overflow-wrap-anywhere [&_li]:text-white/70 [&_ol]:my-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_p]:my-5 [&_p]:overflow-wrap-anywhere [&_p]:text-base [&_p]:leading-8 [&_p]:text-white/70 [&_pre]:my-8 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:border [&_pre]:border-white/10 [&_pre]:bg-black/30 [&_pre]:p-4 [&_pre]:text-sm [&_strong]:font-semibold [&_strong]:text-white [&_ul]:my-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6"
                                            dangerouslySetInnerHTML={{
                                                __html: description,
                                            }}
                                        />
                                    ) : (
                                        <p>
                                            Project description belum tersedia.
                                        </p>
                                    )}
                                </article>

                                {videoEmbed && (
                                    <div className="mt-8 lg:hidden">
                                        {videoEmbed}
                                    </div>
                                )}
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
                                            <div className="flex hidden h-56 items-center justify-center bg-linear-to-br from-white/8 to-white/3 px-6 text-center text-sm text-white/45">
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

                                                {project.demo_link && (
                                                    <a
                                                        href={project.demo_link}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                                                    >
                                                        Watch demo
                                                    </a>
                                                )}

                                                {!hasLinks && (
                                                    <div className="hidden rounded-2xl border border-dashed border-white/10 bg-white/3 px-4 py-3 text-sm text-white/45">
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
                                                            {item.icon && (
                                                                <img
                                                                    title={
                                                                        item.name
                                                                    }
                                                                    src={
                                                                        item.icon
                                                                    }
                                                                    alt={
                                                                        item.name
                                                                    }
                                                                    className="h-5 w-5"
                                                                />
                                                            )}
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
                                                <p>{project.info}</p>
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
