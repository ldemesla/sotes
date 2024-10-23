import '@/styles/index.css'

import * as Y from 'yjs'

import React, { useRef } from 'react'
import { TableColumnMenu, TableRowMenu } from '@/extensions/Table/menus'

import { ColumnsMenu } from '@/extensions/MultiColumn/menus'
import { ContentItemMenu } from '../menus/ContentItemMenu'
import { EditorContent } from '@tiptap/react'
import { EditorHeader } from './components/EditorHeader'
import ImageBlockMenu from '@/extensions/ImageBlock/components/ImageBlockMenu'
import { LinkMenu } from '@/components/menus'
import { Sidebar } from '@/components/Sidebar'
import { TextMenu } from '../menus/TextMenu'
import { TiptapCollabProvider } from '@hocuspocus/provider'
import { useBlockEditor } from '@/hooks/useBlockEditor'
import { useSidebar } from '@/hooks/useSidebar'

export const BlockEditor = ({
  aiToken,
  ydoc,
  provider,
}: {
  aiToken?: string
  hasCollab: boolean
  ydoc: Y.Doc
  provider?: TiptapCollabProvider | null | undefined
}) => {
  const menuContainerRef = useRef(null)

  const leftSidebar = useSidebar()
  const { editor, users, collabState } = useBlockEditor({ aiToken, ydoc, provider })

  if (!editor || !users) {
    return null
  }

  return (
    <div className="flex h-full" ref={menuContainerRef}>
      <Sidebar isOpen={leftSidebar.isOpen} onClose={leftSidebar.close} editor={editor} />
      <div className="relative flex flex-col flex-1 h-full overflow-hidden">
        <EditorHeader
          editor={editor}
          collabState={collabState}
          users={users}
          isSidebarOpen={leftSidebar.isOpen}
          toggleSidebar={leftSidebar.toggle}
        />
        <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
        <ContentItemMenu editor={editor} />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
      </div>
    </div>
  )
}

export default BlockEditor
