import { router } from '@inertiajs/react';
import { useState } from 'react';
import { index as projectsIndex } from '@/actions/App/Http/Controllers/ProjectsController';

type Category = {
    id: number;
    name: string;
    slug: string;
};

type SearchBarProps = {
    categories: Category[];
    search: string;
    category: string;
};

export default function SearchBar({
    categories,
    search,
    category,
}: SearchBarProps) {
    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(category);
    const [query, setQuery] = useState(search);

    const selectedCategoryLabel =
        categories.find((item) => item.slug === selectedCategory)?.name ??
        'All categories';

    const submitFilters = (nextCategory: string, nextQuery: string) => {
        router.get(
            projectsIndex.url({
                query: {
                    search: nextQuery || undefined,
                    category: nextCategory || undefined,
                },
            }),
        );
    };

    return (
        <form
            className="mx-auto max-w-2xl"
            onSubmit={(e) => {
                e.preventDefault();
                submitFilters(selectedCategory, query);
            }}
        >
            <div className="rounded-base relative flex gap-1.5 -space-x-0.5 shadow-xs">
                {/* Dropdown Button */}
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="border-default-medium bg-neutral-secondary-medium text-body rounded-s-base hover:bg-neutral-tertiary-medium hover:text-heading z-10 inline-flex shrink-0 items-center border px-4 py-2.5 text-sm leading-5 font-medium focus:outline-none"
                >
                    {selectedCategoryLabel}
                    <svg className="ms-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                            stroke="currentColor"
                            strokeWidth="2"
                            d="m19 9-7 7-7-7"
                        />
                    </svg>
                </button>

                {/* Dropdown */}
                {open && (
                    <div className="border-default-medium rounded-base absolute top-full left-0 z-50 mt-2 w-44 border bg-[rgba(10,14,25,0.55)] shadow-[0_10px_30px_rgba(0,0,0,0.18)] shadow-lg backdrop-blur-md">
                        <ul className="text-body p-2 text-sm font-medium">
                            <li>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedCategory('');
                                        setOpen(false);
                                        submitFilters('', query);
                                    }}
                                    className="hover:bg-neutral-tertiary-medium hover:text-heading block w-full rounded-md p-2 text-left"
                                >
                                    All categories
                                </button>
                            </li>
                            {categories.map((item) => (
                                <li key={item.id}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedCategory(item.slug);
                                            setOpen(false);
                                            submitFilters(item.slug, query);
                                        }}
                                        className="hover:bg-neutral-tertiary-medium hover:text-heading block w-full rounded-md p-2 text-left"
                                    >
                                        {item.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Input */}
                <input
                    type="search"
                    className="border-default-medium text-heading placeholder:text-body d w-full border bg-[rgba(10,14,25,0.55)] px-3 py-2.5 text-sm shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-md"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />

                {/* Button */}
                <button
                    type="submit"
                    className="bg-brand rounded-e-base hover:bg-brand-strong inline-flex items-center px-4 py-2.5 text-sm font-medium text-white focus:outline-none"
                >
                    <svg className="me-1.5 h-4 w-4" viewBox="0 0 24 24">
                        <path
                            stroke="currentColor"
                            strokeWidth="2"
                            d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                        />
                    </svg>
                    Search
                </button>
            </div>
        </form>
    );
}
