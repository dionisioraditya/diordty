import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Techstack = { id: number; name: string; slug: string; icon?: string | null };
type Category = { id: number; name: string; slug: string; color: string };
type Project = {
    id: number;
    title: string;
    slug: string;
    image?: string | null;
    description?: string | null;
    demo_link?: string | null;
    github_link?: string | null;
    video_link?: string | null;
    info?: string | null;
    category_id?: number | null;
    category?: Category | null;
    techstacks?: Techstack[];
};

type PageProps = {
    techstacks: Techstack[];
    categories: Category[];
    projects: Project[];
    errors: Record<string, string>;
};

type DeleteState =
    | null
    | { type: 'techstack' | 'category' | 'project'; id: number; label: string };

const emptyTechstackForm = { name: '', icon: '' };
const emptyCategoryForm = { name: '', color: 'bg-blue-100' };
const emptyProjectForm = {
    title: '',
    image: '',
    description: '',
    demo_link: '',
    github_link: '',
    video_link: '',
    info: '',
    category_id: '',
    techstack_ids: [] as string[],
};

function DashboardPanel({
    title,
    description,
    action,
    children,
}: {
    title: string;
    description: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-xl border border-sidebar-border/70 bg-background/60 p-5 dark:border-sidebar-border">
            <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
                {action}
            </div>
            {children}
        </section>
    );
}

function DashboardListItem({
    title,
    subtitle,
    badge,
    onEdit,
    onDelete,
}: {
    title: string;
    subtitle?: string;
    badge?: React.ReactNode;
    onEdit: () => void;
    onDelete: () => void;
}) {
    return (
        <div className="flex items-start justify-between gap-3 rounded-lg border border-sidebar-border/60 bg-background/80 p-3 dark:border-sidebar-border">
            <div className="min-w-0">
                <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{title}</p>
                    {badge}
                </div>
                {subtitle && (
                    <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
                )}
            </div>

            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={onEdit}>
                    <Pencil className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onDelete}>
                    <Trash2 className="size-4" />
                </Button>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { techstacks, categories, projects, errors } =
        usePage<PageProps>().props;

    const [techstackDialogOpen, setTechstackDialogOpen] = useState(false);
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const [projectDialogOpen, setProjectDialogOpen] = useState(false);
    const [deleteState, setDeleteState] = useState<DeleteState>(null);
    const [editingTechstackId, setEditingTechstackId] = useState<number | null>(null);
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
    const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

    const techstackForm = useForm(emptyTechstackForm);
    const categoryForm = useForm(emptyCategoryForm);
    const projectForm = useForm(emptyProjectForm);

    const latestProjects = useMemo(() => projects.slice(0, 8), [projects]);

    useEffect(() => {
        if (!techstackDialogOpen) techstackForm.clearErrors();
    }, [techstackDialogOpen]);

    useEffect(() => {
        if (!categoryDialogOpen) categoryForm.clearErrors();
    }, [categoryDialogOpen]);

    useEffect(() => {
        if (!projectDialogOpen) projectForm.clearErrors();
    }, [projectDialogOpen]);

    const openCreateTechstack = () => {
        setEditingTechstackId(null);
        techstackForm.reset();
        techstackForm.setData(emptyTechstackForm);
        setTechstackDialogOpen(true);
    };

    const openEditTechstack = (techstack: Techstack) => {
        setEditingTechstackId(techstack.id);
        techstackForm.setData({
            name: techstack.name,
            icon: techstack.icon ?? '',
        });
        setTechstackDialogOpen(true);
    };

    const openCreateCategory = () => {
        setEditingCategoryId(null);
        categoryForm.reset();
        categoryForm.setData(emptyCategoryForm);
        setCategoryDialogOpen(true);
    };

    const openEditCategory = (category: Category) => {
        setEditingCategoryId(category.id);
        categoryForm.setData({
            name: category.name,
            color: category.color,
        });
        setCategoryDialogOpen(true);
    };

    const openCreateProject = () => {
        setEditingProjectId(null);
        projectForm.reset();
        projectForm.setData(emptyProjectForm);
        setProjectDialogOpen(true);
    };

    const openEditProject = (project: Project) => {
        setEditingProjectId(project.id);
        projectForm.setData({
            title: project.title,
            image: project.image ?? '',
            description: project.description ?? '',
            demo_link: project.demo_link ?? '',
            github_link: project.github_link ?? '',
            video_link: project.video_link ?? '',
            info: project.info ?? '',
            category_id: project.category_id ? String(project.category_id) : '',
            techstack_ids: project.techstacks?.map((item) => String(item.id)) ?? [],
        });
        setProjectDialogOpen(true);
    };

    const submitTechstack = () => {
        const url = editingTechstackId
            ? `/dashboard/techstacks/${editingTechstackId}`
            : '/dashboard/techstacks';
        const action = editingTechstackId ? techstackForm.patch : techstackForm.post;

        action(url, {
            preserveScroll: true,
            onSuccess: () => {
                setTechstackDialogOpen(false);
                setEditingTechstackId(null);
                techstackForm.reset();
            },
        });
    };

    const submitCategory = () => {
        const url = editingCategoryId
            ? `/dashboard/categories/${editingCategoryId}`
            : '/dashboard/categories';
        const action = editingCategoryId ? categoryForm.patch : categoryForm.post;

        action(url, {
            preserveScroll: true,
            onSuccess: () => {
                setCategoryDialogOpen(false);
                setEditingCategoryId(null);
                categoryForm.reset();
            },
        });
    };

    const submitProject = () => {
        const url = editingProjectId
            ? `/dashboard/projects/${editingProjectId}`
            : '/dashboard/projects';
        const action = editingProjectId ? projectForm.patch : projectForm.post;

        action(url, {
            preserveScroll: true,
            onSuccess: () => {
                setProjectDialogOpen(false);
                setEditingProjectId(null);
                projectForm.reset();
            },
        });
    };

    const confirmDelete = () => {
        if (!deleteState) return;

        router.delete(`/dashboard/${deleteState.type}s/${deleteState.id}`, {
            preserveScroll: true,
            onSuccess: () => setDeleteState(null),
        });
    };

    const toggleTechstackSelection = (techstackId: string) => {
        projectForm.setData(
            'techstack_ids',
            projectForm.data.techstack_ids.includes(techstackId)
                ? projectForm.data.techstack_ids.filter((id) => id !== techstackId)
                : [...projectForm.data.techstack_ids, techstackId],
        );
    };

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {errors.category_delete && (
                    <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {errors.category_delete}
                    </div>
                )}

                <div className="grid auto-rows-min gap-4 xl:grid-cols-3">
                    <DashboardPanel
                        title="Techstack"
                        description="Kelola daftar tech stack yang bisa dipakai project."
                        action={
                            <Button size="sm" onClick={openCreateTechstack}>
                                <Plus className="size-4" />
                                Create
                            </Button>
                        }
                    >
                        <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                            {techstacks.length > 0 ? (
                                techstacks.map((techstack) => (
                                    <DashboardListItem
                                        key={techstack.id}
                                        title={techstack.name}
                                        subtitle={techstack.slug}
                                        badge={
                                            techstack.icon ? (
                                                <span className="rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground">
                                                    icon
                                                </span>
                                            ) : undefined
                                        }
                                        onEdit={() => openEditTechstack(techstack)}
                                        onDelete={() =>
                                            setDeleteState({
                                                type: 'techstack',
                                                id: techstack.id,
                                                label: techstack.name,
                                            })
                                        }
                                    />
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Belum ada techstack.
                                </p>
                            )}
                        </div>
                    </DashboardPanel>

                    <DashboardPanel
                        title="Category"
                        description="Kelola kategori untuk klasifikasi project."
                        action={
                            <Button size="sm" onClick={openCreateCategory}>
                                <Plus className="size-4" />
                                Create
                            </Button>
                        }
                    >
                        <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <DashboardListItem
                                        key={category.id}
                                        title={category.name}
                                        subtitle={category.slug}
                                        badge={
                                            <span className="rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground">
                                                {category.color}
                                            </span>
                                        }
                                        onEdit={() => openEditCategory(category)}
                                        onDelete={() =>
                                            setDeleteState({
                                                type: 'category',
                                                id: category.id,
                                                label: category.name,
                                            })
                                        }
                                    />
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Belum ada category.
                                </p>
                            )}
                        </div>
                    </DashboardPanel>

                    <DashboardPanel
                        title="Projects"
                        description="Ringkasan data project dan aksi create cepat."
                        action={
                            <Button size="sm" onClick={openCreateProject}>
                                <Plus className="size-4" />
                                Create project
                            </Button>
                        }
                    >
                        <div className="space-y-3">
                            <div className="rounded-lg border border-sidebar-border/60 bg-background/80 p-4 dark:border-sidebar-border">
                                <p className="text-sm text-muted-foreground">
                                    Total projects
                                </p>
                                <p className="mt-2 text-3xl font-semibold">
                                    {projects.length}
                                </p>
                            </div>

                            <div className="space-y-2">
                                {projects.slice(0, 3).map((project) => (
                                    <div
                                        key={project.id}
                                        className="rounded-lg border border-sidebar-border/60 bg-background/80 px-3 py-2 text-sm dark:border-sidebar-border"
                                    >
                                        <p className="truncate font-medium">
                                            {project.title}
                                        </p>
                                        <p className="truncate text-muted-foreground">
                                            {project.slug}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DashboardPanel>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-background/60 p-5 dark:border-sidebar-border">
                    <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold">Project List</h2>
                            <p className="text-sm text-muted-foreground">
                                List utama untuk edit dan delete project.
                            </p>
                        </div>
                        <Button onClick={openCreateProject}>
                            <Plus className="size-4" />
                            Create project
                        </Button>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-sidebar-border/60 dark:border-sidebar-border">
                        <div className="grid grid-cols-[1.6fr_1fr_1fr_1.2fr] gap-4 border-b border-sidebar-border/60 bg-muted/30 px-4 py-3 text-sm font-medium dark:border-sidebar-border">
                            <p>Project</p>
                            <p>Category</p>
                            <p>Techstack</p>
                            <p>Actions</p>
                        </div>

                        {latestProjects.length > 0 ? (
                            latestProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className="grid grid-cols-[1.6fr_1fr_1fr_1.2fr] gap-4 border-b border-sidebar-border/40 px-4 py-4 text-sm last:border-b-0 dark:border-sidebar-border"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate font-medium">
                                            {project.title}
                                        </p>
                                        <p className="truncate text-muted-foreground">
                                            {project.slug}
                                        </p>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate">
                                            {project.category?.name ?? '-'}
                                        </p>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate">
                                            {project.techstacks?.length
                                                ? project.techstacks
                                                      .map((item) => item.name)
                                                      .join(', ')
                                                : '-'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEditProject(project)}
                                        >
                                            <Pencil className="size-4" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() =>
                                                setDeleteState({
                                                    type: 'project',
                                                    id: project.id,
                                                    label: project.title,
                                                })
                                            }
                                        >
                                            <Trash2 className="size-4" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-sm text-muted-foreground">
                                Belum ada project untuk ditampilkan.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Dialog open={techstackDialogOpen} onOpenChange={setTechstackDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {editingTechstackId ? 'Update techstack' : 'Create techstack'}
                        </DialogTitle>
                        <DialogDescription>
                            Kelola data techstack yang bisa dipilih pada project.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="techstack-name">Name</Label>
                            <Input
                                id="techstack-name"
                                value={techstackForm.data.name}
                                onChange={(e) =>
                                    techstackForm.setData('name', e.target.value)
                                }
                            />
                            {techstackForm.errors.name && (
                                <p className="text-sm text-destructive">
                                    {techstackForm.errors.name}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="techstack-icon">Icon</Label>
                            <Input
                                id="techstack-icon"
                                value={techstackForm.data.icon}
                                onChange={(e) =>
                                    techstackForm.setData('icon', e.target.value)
                                }
                            />
                            {techstackForm.errors.icon && (
                                <p className="text-sm text-destructive">
                                    {techstackForm.errors.icon}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setTechstackDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={submitTechstack}
                            disabled={techstackForm.processing}
                        >
                            {editingTechstackId ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategoryId ? 'Update category' : 'Create category'}
                        </DialogTitle>
                        <DialogDescription>
                            Kelola kategori untuk klasifikasi project.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="category-name">Name</Label>
                            <Input
                                id="category-name"
                                value={categoryForm.data.name}
                                onChange={(e) =>
                                    categoryForm.setData('name', e.target.value)
                                }
                            />
                            {categoryForm.errors.name && (
                                <p className="text-sm text-destructive">
                                    {categoryForm.errors.name}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="category-color">Color class</Label>
                            <Input
                                id="category-color"
                                value={categoryForm.data.color}
                                onChange={(e) =>
                                    categoryForm.setData('color', e.target.value)
                                }
                            />
                            {categoryForm.errors.color && (
                                <p className="text-sm text-destructive">
                                    {categoryForm.errors.color}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setCategoryDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={submitCategory}
                            disabled={categoryForm.processing}
                        >
                            {editingCategoryId ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingProjectId ? 'Update project' : 'Create project'}
                        </DialogTitle>
                        <DialogDescription>
                            Kelola seluruh field project beserta category dan techstack.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="project-title">Title</Label>
                            <Input
                                id="project-title"
                                value={projectForm.data.title}
                                onChange={(e) =>
                                    projectForm.setData('title', e.target.value)
                                }
                            />
                            {projectForm.errors.title && (
                                <p className="text-sm text-destructive">
                                    {projectForm.errors.title}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="project-image">Image</Label>
                            <Input
                                id="project-image"
                                value={projectForm.data.image}
                                onChange={(e) =>
                                    projectForm.setData('image', e.target.value)
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Category</Label>
                            <Select
                                value={projectForm.data.category_id || '__none__'}
                                onValueChange={(value) =>
                                    projectForm.setData(
                                        'category_id',
                                        value === '__none__' ? '' : value,
                                    )
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="__none__">No category</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={String(category.id)}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Techstacks</Label>
                            <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border border-input p-3">
                                {techstacks.map((techstack) => (
                                    <label
                                        key={techstack.id}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <Checkbox
                                            checked={projectForm.data.techstack_ids.includes(
                                                String(techstack.id),
                                            )}
                                            onCheckedChange={() =>
                                                toggleTechstackSelection(
                                                    String(techstack.id),
                                                )
                                            }
                                        />
                                        <span>{techstack.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="project-demo-link">Demo link</Label>
                            <Input
                                id="project-demo-link"
                                value={projectForm.data.demo_link}
                                onChange={(e) =>
                                    projectForm.setData('demo_link', e.target.value)
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="project-github-link">Github link</Label>
                            <Input
                                id="project-github-link"
                                value={projectForm.data.github_link}
                                onChange={(e) =>
                                    projectForm.setData('github_link', e.target.value)
                                }
                            />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="project-video-link">Video link</Label>
                            <Input
                                id="project-video-link"
                                value={projectForm.data.video_link}
                                onChange={(e) =>
                                    projectForm.setData('video_link', e.target.value)
                                }
                            />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="project-description">Description</Label>
                            <textarea
                                id="project-description"
                                value={projectForm.data.description}
                                onChange={(e) =>
                                    projectForm.setData('description', e.target.value)
                                }
                                rows={6}
                                className="min-h-32 rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                            />
                        </div>

                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="project-info">Extra info</Label>
                            <textarea
                                id="project-info"
                                value={projectForm.data.info}
                                onChange={(e) =>
                                    projectForm.setData('info', e.target.value)
                                }
                                rows={4}
                                className="min-h-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setProjectDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={submitProject}
                            disabled={projectForm.processing}
                        >
                            {editingProjectId ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={Boolean(deleteState)}
                onOpenChange={(open) => !open && setDeleteState(null)}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete item</DialogTitle>
                        <DialogDescription>
                            {deleteState
                                ? `Anda yakin ingin menghapus "${deleteState.label}"?`
                                : 'Pilih item yang ingin dihapus.'}
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteState(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};
