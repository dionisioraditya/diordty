import { cn } from '@/lib/utils';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

type RichTextEditorProps = {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
};

const toolbarOptions = [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['blockquote', 'code-block', 'link'],
    ['clean'],
];

const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'align',
    'blockquote',
    'code-block',
    'link',
];

export function RichTextEditor({
    id,
    value,
    onChange,
    placeholder,
    className,
}: RichTextEditorProps) {
    return (
        <div className={cn('project-description-editor', className)}>
            <ReactQuill
                id={id}
                theme="snow"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                modules={{ toolbar: toolbarOptions }}
                formats={formats}
            />
        </div>
    );
}
