'use client'
import { useEffect, useState, useRef } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Link as TiptapLink } from '@tiptap/extension-link'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import {
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  Heading2,
  Heading3,
  Image as ImageIcon,
} from 'lucide-react'
import Image from '@tiptap/extension-image'

interface MarkdownEditorProps {
  content: string
  onChange: (markdown: string) => void
  id?: string
  name?: string
}

const MarkdownEditor = ({ content, onChange }: MarkdownEditorProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const isUserTyping = useRef(false)
  const lastContentRef = useRef(content)

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [2, 3],
            HTMLAttributes: {
              class: 'text-2xl font-bold',
              2: { class: 'text-2xl font-bold mb-4' },
              3: { class: 'text-xl font-bold mb-3' },
            },
          },
          bulletList: {
            HTMLAttributes: {
              class: 'list-disc list-inside mb-4',
            },
          },
          orderedList: {
            HTMLAttributes: {
              class: 'list-decimal list-inside mb-4',
            },
          },
          listItem: {
            HTMLAttributes: {
              class: 'mb-1',
            },
          },
          blockquote: {
            HTMLAttributes: {
              class: 'border-l-4 border-gray-300 pl-4 italic my-4',
            },
          },
        }),
        TiptapLink.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-blue-500 hover:text-blue-700 underline',
          },
        }),
        Image.configure({
          HTMLAttributes: {
            class: 'max-w-full h-auto rounded-lg',
          },
        }),
      ],
      content,
      editorProps: {
        attributes: {
          class:
            'prose dark:prose-invert max-w-none min-h-[400px] p-4 focus:outline-none bg-white',
        },
      },
      onUpdate: ({ editor }) => {
        if (!isUserTyping.current) return
        const html = editor.getHTML()
        lastContentRef.current = html
        onChange(html)
      },
    },
    []
  )

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Only sync content when it changes externally
  useEffect(() => {
    if (editor && content !== lastContentRef.current && !isUserTyping.current) {
      lastContentRef.current = content
      editor.commands.setContent(content)
    }
  }, [content, editor])

  const handleToolbarClick =
    (callback: () => boolean) => (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      isUserTyping.current = true
      callback()
      editor?.commands.focus()
      isUserTyping.current = false
    }

  if (!isMounted) {
    return <div className="min-h-[400px] border rounded-lg" />
  }

  if (!editor) {
    return null
  }

  const addLink = (e: React.MouseEvent) => {
    e.preventDefault()
    const url = window.prompt('URL')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  const addImage = (e: React.MouseEvent) => {
    e.preventDefault()
    const url = window.prompt('Image URL')
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden flex flex-col">
      <div className="border-b bg-gray-50 p-2 flex gap-2 flex-wrap">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleToolbarClick(() =>
            editor.chain().focus().toggleBulletList().run()
          )}
          className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleToolbarClick(() =>
            editor.chain().focus().toggleOrderedList().run()
          )}
          className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addLink}
          className={editor.isActive('link') ? 'bg-gray-200' : ''}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleToolbarClick(() =>
            editor.chain().focus().toggleBlockquote().run()
          )}
          className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleToolbarClick(() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          )}
          className={
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
          }
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleToolbarClick(() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          )}
          className={
            editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''
          }
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addImage}
          className={editor?.isActive('image') ? 'bg-gray-200' : ''}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="min-h-[200px] h-[200px] flex-grow bg-white resize-y overflow-auto">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(MarkdownEditor), {
  ssr: false,
}) as typeof MarkdownEditor
