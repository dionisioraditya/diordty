import type { Editor, Range } from '@tiptap/core';
import {
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Minus,
    Quote,
    Type
    
} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';

export type CommandItem = {
    title: string;
    description: string;
    icon: LucideIcon;
    command: (props: { editor: Editor; range: Range }) => void;
};

export const SLASH_COMMAND_ITEMS: CommandItem[] = [
    {
        title: 'Text',
        description: 'Plain text paragraph block',
        icon: Type,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).setParagraph().run();
        },
    },
    {
        title: 'Heading 1',
        description: 'Large section heading',
        icon: Heading1,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode('heading', { level: 1 })
                .run();
        },
    },
    {
        title: 'Heading 2',
        description: 'Medium sub-section heading',
        icon: Heading2,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode('heading', { level: 2 })
                .run();
        },
    },
    {
        title: 'Heading 3',
        description: 'Small subsection heading',
        icon: Heading3,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setNode('heading', { level: 3 })
                .run();
        },
    },
    {
        title: 'Bullet List',
        description: 'Simple bulleted list',
        icon: List,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
    },
    {
        title: 'Numbered List',
        description: 'Ordered sequential list',
        icon: ListOrdered,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
    },
    {
        title: 'Quote',
        description: 'Capture a quote or callout thought',
        icon: Quote,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleBlockquote().run();
        },
    },
    {
        title: 'Code Block',
        description: 'Syntax-ready code snippet block',
        icon: Code,
        command: ({ editor, range }) => {
            editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
        },
    },
    {
        title: 'Divider',
        description: 'Visually separate sections with horizontal rule',
        icon: Minus,
        command: ({ editor, range }) => {
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setHorizontalRule()
                .run();
        },
    },
];
