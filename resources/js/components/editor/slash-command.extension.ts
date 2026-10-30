import { Extension } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import Suggestion from '@tiptap/suggestion';
import type {SuggestionOptions} from '@tiptap/suggestion';
import tippy from 'tippy.js';
import type {Instance as TippyInstance} from 'tippy.js';
import { SLASH_COMMAND_ITEMS  } from './editor.constants';
import type {CommandItem} from './editor.constants';
import { SlashCommandList  } from './SlashCommandList';
import type {SlashCommandListRef} from './SlashCommandList';

export const SlashCommandExtension = Extension.create({
    name: 'slashCommand',

    addOptions() {
        return {
            suggestion: {
                char: '/',
                command: ({
                    editor,
                    range,
                    props,
                }: {
                    editor: any;
                    range: any;
                    props: CommandItem;
                }) => {
                    props.command({ editor, range });
                },
            },
        };
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ];
    },
});

export const createSuggestionOptions = (): Omit<
    SuggestionOptions<CommandItem>,
    'editor'
> => ({
    char: '/',
    items: ({ query }: { query: string }) => {
        return SLASH_COMMAND_ITEMS.filter((item) =>
            item.title.toLowerCase().includes(query.toLowerCase()),
        );
    },
    render: () => {
        let component: ReactRenderer<SlashCommandListRef> | null = null;
        let popup: TippyInstance[] | null = null;

        return {
            onStart: (props) => {
                component = new ReactRenderer(SlashCommandList, {
                    props,
                    editor: props.editor,
                });

                if (!props.clientRect) {
return;
}

                popup = tippy('body', {
                    getReferenceClientRect: props.clientRect as () => DOMRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                });
            },

            onUpdate: (props) => {
                component?.updateProps(props);

                if (!props.clientRect) {
return;
}

                popup?.[0]?.setProps({
                    getReferenceClientRect: props.clientRect as () => DOMRect,
                });
            },

            onKeyDown: (props) => {
                if (props.event.key === 'Escape') {
                    popup?.[0]?.hide();

                    return true;
                }

                return component?.ref?.onKeyDown(props) ?? false;
            },

            onExit: () => {
                popup?.[0]?.destroy();
                component?.destroy();
            },
        };
    },
});
