'use client'
import React, { useEffect, useState, useRef } from 'react'
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

// Define the sanitizeContent function before using it
const sanitizeContent = (content: string): string => {
  return content
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/<p><br><\/p>/g, '<p></p>')
    .replace(/\n\s*\n/g, '\n')
    .trim()
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  content,
  onChange,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const isUserTyping = useRef(false)
  const lastContentRef = useRef(content)

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          paragraph: {
            HTMLAttributes: {
              class: 'mb-4',
            },
          },
          heading: {
            levels: [2, 3],
            HTMLAttributes: {
              class: 'font-bold',
              level: {
                2: 'text-2xl mb-4',
                3: 'text-xl mb-3',
              },
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
      content: sanitizeContent(content),
      editorProps: {
        attributes: {
          class:
            'prose dark:prose-invert max-w-none min-h-[400px] p-4 focus:outline-none bg-white',
        },
      },
      onUpdate: ({ editor }) => {
        const html = editor.getHTML()
        if (html !== lastContentRef.current) {
          lastContentRef.current = html
          onChange(html)
        }
      },
      immediatelyRender: false,
    },
    []
  )

  useEffect(() => {
    if (editor && content !== lastContentRef.current && !isUserTyping.current) {
      lastContentRef.current = content
      editor.commands.setContent(content)
    }
  }, [content, editor])

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
    return React.createElement('div', {
      className: 'min-h-[400px] border rounded-lg',
    })
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

  return React.createElement(
    'div',
    { className: 'border rounded-lg overflow-hidden flex flex-col' },
    [
      React.createElement(
        'div',
        {
          key: 'toolbar',
          className: 'border-b bg-gray-50 p-2 flex gap-2 flex-wrap',
        },
        [
          React.createElement(
            Button,
            {
              key: 'bullet-list',
              type: 'button',
              variant: 'ghost',
              size: 'sm',
              onClick: handleToolbarClick(() =>
                editor.chain().focus().toggleBulletList().run()
              ),
              className: editor.isActive('bulletList') ? 'bg-gray-200' : '',
            },
            React.createElement(List, { className: 'h-4 w-4' })
          ),

          React.createElement(
            Button,
            {
              key: 'ordered-list',
              type: 'button',
              variant: 'ghost',
              size: 'sm',
              onClick: handleToolbarClick(() =>
                editor.chain().focus().toggleOrderedList().run()
              ),
              className: editor.isActive('orderedList') ? 'bg-gray-200' : '',
            },
            React.createElement(ListOrdered, { className: 'h-4 w-4' })
          ),

          React.createElement(
            Button,
            {
              key: 'link',
              type: 'button',
              variant: 'ghost',
              size: 'sm',
              onClick: addLink,
              className: editor.isActive('link') ? 'bg-gray-200' : '',
            },
            React.createElement(LinkIcon, { className: 'h-4 w-4' })
          ),

          React.createElement(
            Button,
            {
              key: 'blockquote',
              type: 'button',
              variant: 'ghost',
              size: 'sm',
              onClick: handleToolbarClick(() =>
                editor.chain().focus().toggleBlockquote().run()
              ),
              className: editor.isActive('blockquote') ? 'bg-gray-200' : '',
            },
            React.createElement(Quote, { className: 'h-4 w-4' })
          ),

          React.createElement(
            Button,
            {
              key: 'h2',
              type: 'button',
              variant: 'ghost',
              size: 'sm',
              onClick: handleToolbarClick(() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              ),
              className: editor.isActive('heading', { level: 2 })
                ? 'bg-gray-200'
                : '',
            },
            React.createElement(Heading2, { className: 'h-4 w-4' })
          ),

          React.createElement(
            Button,
            {
              key: 'h3',
              type: 'button',
              variant: 'ghost',
              size: 'sm',
              onClick: handleToolbarClick(() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              ),
              className: editor.isActive('heading', { level: 3 })
                ? 'bg-gray-200'
                : '',
            },
            React.createElement(Heading3, { className: 'h-4 w-4' })
          ),

          React.createElement(
            Button,
            {
              key: 'image',
              type: 'button',
              variant: 'ghost',
              size: 'sm',
              onClick: addImage,
              className: editor?.isActive('image') ? 'bg-gray-200' : '',
            },
            React.createElement(ImageIcon, { className: 'h-4 w-4' })
          ),
        ]
      ),

      React.createElement(
        'div',
        {
          key: 'editor',
          className:
            'min-h-[200px] h-[200px] flex-grow bg-white resize-y overflow-auto',
        },
        React.createElement(EditorContent, {
          editor: editor,
          className: 'h-full',
        })
      ),
    ]
  )
}

export default dynamic(() => Promise.resolve(MarkdownEditor), {
  ssr: false,
})
