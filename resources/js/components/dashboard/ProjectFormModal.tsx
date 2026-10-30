import React from 'react';
import { NotionEditor } from '@/components/editor/NotionEditor';
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

type Category = { id: number; name: string; slug: string; color: string };
type Techstack = { id: number; name: string; slug: string; icon?: string | null };

type ProjectFormModalProps = {
    isOpen: boolean;
    onClose: () => void;
    editingProjectId: number | null;
    projectForm: any;
    categories: Category[];
    techstacks: Techstack[];
    projectImageUpload: { maxMegabytesLabel: string };
    projectImageUploading: boolean;
    projectImageError: string | null;
    currentProjectImagePreview: string | null;
    handleProjectImageSelection: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    toggleTechstackSelection: (id: string) => void;
    onSubmit: (e: React.FormEvent) => void;
};

export function ProjectFormModal({
    isOpen,
    onClose,
    editingProjectId,
    projectForm,
    categories,
    techstacks,
    projectImageUpload,
    projectImageUploading,
    projectImageError,
    currentProjectImagePreview,
    handleProjectImageSelection,
    toggleTechstackSelection,
    onSubmit,
}: ProjectFormModalProps) {
    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
void onClose();
}
            }}
        >
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>
                        {editingProjectId ? 'Update project' : 'Create project'}
                    </DialogTitle>
                    <DialogDescription>
                        Kelola seluruh field project beserta category, techstack, dan deskripsi block ala Notion.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="project-title">Title</Label>
                        <Input
                            id="project-title"
                            value={projectForm.data.title}
                            onChange={(e) => projectForm.setData('title', e.target.value)}
                        />
                        {projectForm.errors.title && (
                            <p className="text-sm text-destructive">{projectForm.errors.title}</p>
                        )}
                    </div>

                    <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="project-image">Image</Label>
                        <Input
                            id="project-image"
                            type="file"
                            accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                            onChange={(e) => void handleProjectImageSelection(e)}
                        />
                        <p className="text-xs text-muted-foreground">
                            PNG, JPG, JPEG up to {projectImageUpload.maxMegabytesLabel}MB. Image is
                            uploaded to temporary storage first, then moved on save.
                        </p>
                        <div className="overflow-hidden rounded-xl border border-dashed border-input bg-muted/20">
                            {currentProjectImagePreview ? (
                                <img
                                    src={currentProjectImagePreview}
                                    alt="Project preview"
                                    className="h-56 w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-56 items-center justify-center px-4 text-center text-sm text-muted-foreground">
                                    Image preview will appear here.
                                </div>
                            )}
                        </div>
                        {projectImageUploading && (
                            <p className="text-sm text-muted-foreground">Uploading image...</p>
                        )}
                        {(projectImageError || projectForm.errors.image) && (
                            <p className="text-sm text-destructive">
                                {projectImageError ?? projectForm.errors.image}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label>Category</Label>
                        <Select
                            value={projectForm.data.category_id || '__none__'}
                            onValueChange={(val) =>
                                projectForm.setData('category_id', val === '__none__' ? '' : val)
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="__none__">No category</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={String(cat.id)}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Techstacks</Label>
                        <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border border-input p-3">
                            {techstacks.map((tech) => (
                                <label key={tech.id} className="flex items-center gap-2 text-sm">
                                    <Checkbox
                                        checked={projectForm.data.techstack_ids.includes(String(tech.id))}
                                        onCheckedChange={() => toggleTechstackSelection(String(tech.id))}
                                    />
                                    <span>{tech.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="project-demo-link">Demo link</Label>
                        <Input
                            id="project-demo-link"
                            value={projectForm.data.demo_link}
                            onChange={(e) => projectForm.setData('demo_link', e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="project-github-link">Github link</Label>
                        <Input
                            id="project-github-link"
                            value={projectForm.data.github_link}
                            onChange={(e) => projectForm.setData('github_link', e.target.value)}
                        />
                    </div>

                    <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="project-video-link">Video link</Label>
                        <Input
                            id="project-video-link"
                            value={projectForm.data.video_link}
                            onChange={(e) => projectForm.setData('video_link', e.target.value)}
                        />
                    </div>

                    {/* Notion-Style Block Editor */}
                    <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="project-description-editor">Deskripsi Project (Notion-Style Editor)</Label>
                        <NotionEditor
                            id="project-description-editor"
                            value={projectForm.data.description || ''}
                            onChange={(val) => projectForm.setData('description', val)}
                            placeholder="Mulai ketik deskripsi project atau gunakan '/' untuk memilih blok..."
                        />
                    </div>

                    <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="project-info">Extra info</Label>
                        <textarea
                            id="project-info"
                            value={projectForm.data.info}
                            onChange={(e) => projectForm.setData('info', e.target.value)}
                            rows={3}
                            className="min-h-20 rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => void onClose()}>
                        Cancel
                    </Button>
                    <Button
                        onClick={onSubmit}
                        disabled={projectForm.processing || projectImageUploading}
                    >
                        {editingProjectId ? 'Update' : 'Create'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
