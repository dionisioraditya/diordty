import {
    forwardRef,
    useImperativeHandle,
    useState,
} from 'react';
import type { CommandItem } from './editor.constants';

export type SlashCommandListRef = {
    onKeyDown: (props: { event: KeyboardEvent }) => boolean;
};

type Props = {
    items: CommandItem[];
    command: (item: CommandItem) => void;
};

export const SlashCommandList = forwardRef<SlashCommandListRef, Props>(
    ({ items, command }, ref) => {
        const [selectedIndex, setSelectedIndex] = useState(0);
        const [prevItems, setPrevItems] = useState(items);

        if (items !== prevItems) {
            setPrevItems(items);
            setSelectedIndex(0);
        }

        useImperativeHandle(ref, () => ({
            onKeyDown: ({ event }) => {
                if (event.key === 'ArrowUp') {
                    setSelectedIndex((prev) =>
                        items.length ? (prev + items.length - 1) % items.length : 0,
                    );

                    return true;
                }

                if (event.key === 'ArrowDown') {
                    setSelectedIndex((prev) =>
                        items.length ? (prev + 1) % items.length : 0,
                    );

                    return true;
                }

                if (event.key === 'Enter') {
                    if (items[selectedIndex]) {
                        command(items[selectedIndex]);

                        return true;
                    }
                }

                return false;
            },
        }));

        if (!items.length) {
            return (
                <div className="rounded-lg border border-border bg-popover p-3 text-xs text-muted-foreground shadow-md">
                    No matching block
                </div>
            );
        }

        return (
            <div className="z-50 max-h-72 w-64 overflow-y-auto rounded-xl border border-border bg-popover/95 p-1.5 shadow-2xl backdrop-blur-md">
                <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                    Basic Blocks
                </div>
                {items.map((item, index) => {
                    const Icon = item.icon;
                    const isSelected = index === selectedIndex;

                    return (
                        <button
                            key={item.title}
                            type="button"
                            onClick={() => command(item)}
                            className={`flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                                isSelected
                                    ? 'bg-accent text-accent-foreground'
                                    : 'text-popover-foreground hover:bg-accent/60'
                            }`}
                        >
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/60 bg-background/80">
                                <Icon className="h-3.5 w-3.5 text-foreground" />
                            </div>
                            <div className="flex min-w-0 flex-col">
                                <span className="font-medium leading-tight">
                                    {item.title}
                                </span>
                                <span className="truncate text-[10px] text-muted-foreground">
                                    {item.description}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        );
    },
);

SlashCommandList.displayName = 'SlashCommandList';
