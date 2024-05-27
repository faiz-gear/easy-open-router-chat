import { Avatar, Typography, styled } from '@mui/material'
import React, { memo } from 'react'

import type { PropsWithChildren, FC } from 'react'
import type { IConversation } from './types/conversation'
import { useThrottleFn } from 'react-use'

interface IConversationListProps {
  conversationList: IConversation[]
}
const ConversationContainer = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  max-height: calc(100% - 64px);
  overflow: auto;
  padding: 32px;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
`

const ConversationItem = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 8px;
  .header {
    display: flex;
    gap: 8px;
    align-items: center;
  }
`

const ConversationList: FC<PropsWithChildren<IConversationListProps>> = (props) => {
  const { conversationList } = props

  const containerRef = React.useRef<HTMLDivElement>(null)

  useThrottleFn<void, [IConversation[]]>(
    () => {
      const container = containerRef.current
      container?.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      })
    },
    300,
    [conversationList]
  )

  return (
    <ConversationContainer ref={containerRef}>
      {conversationList.map((conversation, index) => (
        <ConversationItem key={conversation.uuid}>
          <div className="header">
            <Avatar />
            <Typography variant="h6">{conversation.title}</Typography>
          </div>
          <div className="content">{conversation.message}</div>
        </ConversationItem>
      ))}
    </ConversationContainer>
  )
}

export default memo(ConversationList)
