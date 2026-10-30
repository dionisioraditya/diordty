import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold,
    Code,
    Heading1,
    Heading2,
    Italic,
    List,
    ListOrdered,
    Quote,
    Redo2,
    Undo2,
} from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { FloatingBubbleMenu } from './FloatingBubbleMenu';
import {
    createSuggestionOptions,
    SlashCommandExtension,
} from './slash-command.extension';

export type NotionEditorProps = {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
};

export function NotionEditor({
    id,
    value,
    onChange,
    placeholder = "Tulis deskripsi project atau ketik '/' untuk memilih perintah...",
    className,
}: NotionEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                codeBlock: { HTMLAttributes: { class: 'notion-code-block' } },
                blockquote: { HTMLAttributes: { class: 'notion-blockquote' } },
            }),
            Placeholder.configure({
                placeholder,
                emptyEditorClass: 'is-editor-empty',
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline underline-offset-4 cursor-pointer',
                },
            }),
            SlashCommandExtension.configure({
                suggestion: createSuggestionOptions(),
            }),
        ],
        content: value || '',
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert prose-sm sm:prose-base focus:outline-none min-h-[220px] max-w-none px-4 py-3 leading-relaxed',
            },
        },
        onUpdate: ({ editor: currentEditor }) => {
            const html = currentEditor.getHTML();
            onChange(currentEditor.isEmpty ? '' : html);
        },
    });

    useEffect(() => {
        if (!editor) {
return;
}

        const currentHtml = editor.getHTML();
        const incomingValue = value || '';

        if (currentHtml !== incomingValue && (editor.isEmpty ? '' : currentHtml) !== incomingValue) {
            editor.commands.setContent(incomingValue);
        }
    }, [value, editor]);

    if (!editor) {
        return (
            <div className="flex h-56 items-center justify-center rounded-xl border border-border bg-card text-xs text-muted-foreground">
                Memuat editor...
            </div>
        );
    }

    return (
        <div
            id={id}
            className={cn(
                'group relative rounded-xl border border-input bg-background/50 transition-all focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20',
                className,
            )}
        >
            <FloatingBubbleMenu editor={editor} />

            {/* Quick Helper Toolbar */}
            <div className="flex flex-wrap items-center justify-between border-b border-border/60 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
                <div className="flex flex-wrap items-center gap-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={cn('rounded px-1.5 py-1 hover:bg-accent', editor.isActive('heading', { level: 1 }) && 'bg-accent text-accent-foreground font-bold')}
                        title="Heading 1"
                    >
                        <Heading1 className="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={cn('rounded px-1.5 py-1 hover:bg-accent', editor.isActive('heading', { level: 2 }) && 'bg-accent text-accent-foreground font-bold')}
                        title="Heading 2"
                    >
                        <Heading2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={cn('rounded px-1.5 py-1 hover:bg-accent', editor.isActive('bold') && 'bg-accent text-accent-foreground')}
                        title="Bold"
                    >
                        <Bold className="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={cn('rounded px-1.5 py-1 hover:bg-accent', editor.isActive('italic') && 'bg-accent text-accent-foreground')}
                        title="Italic"
                    >
                        <Italic className="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={cn('rounded px-1.5 py-1 hover:bg-accent', editor.isActive('bulletList') && 'bg-accent text-accent-foreground')}
                        title="Bullet List"
                    >
                        <List className="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={cn('rounded px-1.5 py-1 hover:bg-accent', editor.isActive('orderedList') && 'bg-accent text-accent-foreground')}
                        title="Numbered List"
                    >
                        <ListOrdered className="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={cn('rounded px-1.5 py-1 hover:bg-accent', editor.isActive('codeBlock') && 'bg-accent text-accent-foreground')}
                        title="Code Block"
                    >
                        <Code className="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={cn('rounded px-1.5 py-1 hover:bg-accent', editor.isActive('blockquote') && 'bg-accent text-accent-foreground')}
                        title="Blockquote"
                    >
                        <Quote className="h-3.5 w-3.5" />
                    </button>
                </div>

                <div className="flex items-center gap-1.5">
                    <span className="hidden text-[11px] font-mono text-muted-foreground/70 sm:inline">
                        Ketik <kbd className="rounded border bg-background px-1 text-[10px]">/</kbd> untuk menu
                    </span>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        className="rounded p-1 hover:bg-accent disabled:opacity-40"
                        title="Undo"
                    >
                        <Undo2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        className="rounded p-1 hover:bg-accent disabled:opacity-40"
                        title="Redo"
                    >
                        <Redo2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            {/* Editable Content */}
            <EditorContent editor={editor} />
        </div>
    );
}
