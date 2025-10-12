"use client";

import { cn } from "@/lib/utils";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";
import { Button } from "./ui/button";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

const MenuBar = ({
  editor,
}: {
  editor: ReturnType<typeof useEditor> | null;
}) => {
  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className='border-b flex flex-wrap gap-1 p-2 bg-muted/50'>
      <Button
        type='button'
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("bold") && "bg-accent text-accent-foreground"
        )}>
        <Bold className='h-4 w-4' />
      </Button>

      <Button
        type='button'
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("italic") && "bg-accent text-accent-foreground"
        )}>
        <Italic className='h-4 w-4' />
      </Button>

      <Button
        type='button'
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("strike") && "bg-accent text-accent-foreground"
        )}>
        <Strikethrough className='h-4 w-4' />
      </Button>

      <div className='w-px h-8 bg-border mx-1' />

      <Button
        type='button'
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("heading", { level: 2 }) &&
            "bg-accent text-accent-foreground"
        )}>
        <Heading2 className='h-4 w-4' />
      </Button>

      <Button
        type='button'
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("bulletList") && "bg-accent text-accent-foreground"
        )}>
        <List className='h-4 w-4' />
      </Button>

      <Button
        type='button'
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("orderedList") && "bg-accent text-accent-foreground"
        )}>
        <ListOrdered className='h-4 w-4' />
      </Button>

      <Button
        type='button'
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("blockquote") && "bg-accent text-accent-foreground"
        )}>
        <Quote className='h-4 w-4' />
      </Button>

      <Button
        type='button'
        variant='ghost'
        size='sm'
        onClick={addLink}
        className={cn(
          "h-8 w-8 p-0",
          editor.isActive("link") && "bg-accent text-accent-foreground"
        )}>
        <Link2 className='h-4 w-4' />
      </Button>

      <div className='w-px h-8 bg-border mx-1' />

      <Button
        type='button'
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className='h-8 w-8 p-0'>
        <Undo className='h-4 w-4' />
      </Button>

      <Button
        type='button'
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className='h-8 w-8 p-0'>
        <Redo className='h-4 w-4' />
      </Button>
    </div>
  );
};

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  maxLength = 10000,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose max-w-none focus:outline-none min-h-[200px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();

      // Only update if within max length
      const textLength = editor.getText().length;
      if (textLength <= maxLength) {
        onChange(html);
      } else {
        // Prevent further input if max length exceeded
        editor.commands.setContent(value);
      }
    },
  });

  const currentLength = editor?.getText().length || 0;

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <div className='px-4 py-2 border-t bg-muted/50 text-xs text-muted-foreground flex justify-between items-center'>
        <span>
          {currentLength}/{maxLength} characters
        </span>
        {currentLength > maxLength * 0.9 && (
          <span className='text-warning'>
            {maxLength - currentLength} characters remaining
          </span>
        )}
      </div>
    </div>
  );
}
