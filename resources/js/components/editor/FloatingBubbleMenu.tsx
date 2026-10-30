import type { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import {
    Bold,
    Code,
    Heading2,
    Heading3,
    Italic,
    Link as LinkIcon,
    Strikethrough,
} from 'lucide-react';

type Props = {
    editor: Editor;
};

export function FloatingBubbleMenu({ editor }: Props) {
    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL Tautan:', previousUrl);

        if (url === null) {
return;
}

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();

            return;
        }

        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url })
            .run();
    };

    return (
        <BubbleMenu
            editor={editor}
            className="flex items-center gap-0.5 rounded-xl border border-border/70 bg-popover/90 p-1 shadow-xl backdrop-blur-md"
        >
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`rounded-md p-1.5 transition-colors ${
                    editor.isActive('bold')
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                }`}
                title="Bold"
            >
                <Bold className="h-3.5 w-3.5" />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`rounded-md p-1.5 transition-colors ${
                    editor.isActive('italic')
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                }`}
                title="Italic"
            >
                <Italic className="h-3.5 w-3.5" />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`rounded-md p-1.5 transition-colors ${
                    editor.isActive('strike')
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                }`}
                title="Strikethrough"
            >
                <Strikethrough className="h-3.5 w-3.5" />
            </button>

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`rounded-md p-1.5 transition-colors ${
                    editor.isActive('code')
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                }`}
                title="Inline Code"
            >
                <Code className="h-3.5 w-3.5" />
            </button>

            <button
                type="button"
                onClick={setLink}
                className={`rounded-md p-1.5 transition-colors ${
                    editor.isActive('link')
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                }`}
                title="Link"
            >
                <LinkIcon className="h-3.5 w-3.5" />
            </button>

            <div className="mx-1 h-3.5 w-px bg-border" />

            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={`rounded-md p-1.5 transition-colors ${
                    editor.isActive('heading', { level: 2 })
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                }`}
                title="Heading 2"
            >
                <Heading2 className="h-3.5 w-3.5" />
            </button>

            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={`rounded-md p-1.5 transition-colors ${
                    editor.isActive('heading', { level: 3 })
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                }`}
                title="Heading 3"
            >
                <Heading3 className="h-3.5 w-3.5" />
            </button>
        </BubbleMenu>
    );
}
