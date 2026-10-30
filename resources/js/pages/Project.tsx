import { Head } from '@inertiajs/react';
import { useState } from 'react';
import Navbar from '@/components/mycomponents/Navbar';
import PublicFooter from '@/components/mycomponents/PublicFooter';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

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
    if (!image) {
return null;
}

    if (image.startsWith('http://') || image.startsWith('https://')) {
return image;
}

    if (image.startsWith('/')) {
return image;
}

    return `/storage/${image}`;
}

export default function Project({ project }: Props) {
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
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
                            <main className="w-full max-w-3xl min-w-0">
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

                                <article className="prose prose-invert prose-blue max-w-none pt-4 text-base leading-relaxed text-white/80 prose-headings:font-heading prose-headings:text-white prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-8 prose-a:text-blue-400 prose-a:underline-offset-4 hover:prose-a:text-blue-300 prose-blockquote:border-l-primary prose-blockquote:text-white/70 prose-blockquote:italic prose-code:rounded-md prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-2xl prose-pre:border prose-pre:border-white/10 prose-pre:bg-black/40 prose-img:rounded-2xl prose-hr:border-white/10">
                                    {description ? (
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: description,
                                            }}
                                        />
                                    ) : (
                                        <p className="italic text-white/50">
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
                                            <Dialog
                                                open={isImageDialogOpen}
                                                onOpenChange={
                                                    setIsImageDialogOpen
                                                }
                                            >
                                                <DialogTrigger asChild>
                                                    <button
                                                        type="button"
                                                        aria-label="View full image"
                                                        className="group block w-full cursor-zoom-in overflow-hidden"
                                                    >
                                                        <img
                                                            src={imageSrc}
                                                            alt={title}
                                                            className="h-56 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                                                        />
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent
                                                    className="border-white/10 bg-[rgba(5,8,16,0.98)] p-2 shadow-2xl sm:p-3"
                                                    style={{
                                                        width: '50vw',
                                                        maxWidth: '90vw',
                                                    }}
                                                >
                                                    <DialogTitle className="sr-only">
                                                        {title} image preview
                                                    </DialogTitle>
                                                    <DialogDescription className="sr-only">
                                                        Full-size preview for{' '}
                                                        {title}.
                                                    </DialogDescription>
                                                    <div className="flex h-fit items-center justify-center overflow-hidden rounded-2xl bg-black/40">
                                                        <img
                                                            src={imageSrc}
                                                            alt={title}
                                                            className="h-full w-full object-contain"
                                                        />
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
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

                <PublicFooter />
            </div>
        </>
    );
}
