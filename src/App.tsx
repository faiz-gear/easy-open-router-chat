import * as React from 'react'
import Container from '@mui/material/Container'
import InputArea from './InputArea'

import type { IConversation } from './types/conversation'
import ConversationList from './ConversationList'
import { Grid } from '@mui/material'
import Configure from './Configure'
import { IConfigure } from './types/configure'

export default function App() {
  const [configure, setConfigure] = React.useState<IConfigure>({
    OPENROUTER_API_KEY: process.env.REACT_APP_OPENROUTER_API_KEY!
  })
  const [conversationList, setConversationList] = React.useState<IConversation[]>([])

  const handleChange = React.useCallback((conversation: IConversation) => {
    setConversationList((prev) => {
      const newConversationList = [...prev]
      const index = newConversationList.findIndex((item) => item.uuid === conversation.uuid)
      if (index !== -1) {
        newConversationList[index] = conversation
      }
      return newConversationList
    })
  }, [])

  const handleOnSend = React.useCallback((conversation: IConversation) => {
    setConversationList((prev) => [...prev, conversation])
  }, [])
  return (
    <Container maxWidth="md">
      <Grid
        container
        flexDirection={'column'}
        sx={{
          height: '100vh',
          paddingY: 2
        }}
      >
        <Configure
          onSubmit={(data) => {
            console.log('🚀 ~ file: App.tsx ~ line 40 ~ App ~ data', data)
            setConfigure(data)
          }}
        />
        <ConversationList conversationList={conversationList} />
        <InputArea configure={configure} onChange={handleChange} onSend={handleOnSend} />
      </Grid>
    </Container>
  )
}
