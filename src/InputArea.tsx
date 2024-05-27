import { Container, IconButton, TextField, styled } from '@mui/material'
import React, { memo } from 'react'
import type { PropsWithChildren, FC } from 'react'
import { IConversation } from './types/conversation'
import { IConfigure } from './types/configure'

interface IInputAreaProps {
  configure: IConfigure
  onSend?: (conversation: IConversation) => void
  onChange: (conversation: IConversation) => void
}

const generateUUID = () => Math.random().toString(16).slice(2)

const InputAreaContainer = styled('div')(({ theme }) => ({
  height: 64,
  '.MuiTextField-root': {
    width: '100%'
  },
  '.animate-spin': {
    animation: 'spin 1s linear infinite'
  },
  '@keyframes spin': {
    '0%': {
      transform: 'rotate(0deg)'
    },
    '100%': {
      transform: 'rotate(360deg)'
    }
  }
}))

const InputArea: FC<PropsWithChildren<IInputAreaProps>> = (props) => {
  const { configure, onChange, onSend } = props
  const [isPending, setIsPending] = React.useState(false)

  const inputRef = React.useRef<HTMLInputElement>(null)

  const sendMessage = React.useCallback(
    async (title: string) => {
      setIsPending(true)
      const uuid = generateUUID()
      onSend?.({ title, message: '', uuid })
      // 1.请求接口
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${configure.OPENROUTER_API_KEY}`,
          // 'HTTP-Referer': `${YOUR_SITE_URL}`, // Optional, for including your app on openrouter.ai rankings.
          // 'X-Title': `${YOUR_SITE_NAME}`, // Optional. Shows in rankings on openrouter.ai.
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: [{ role: 'user', content: title }],
          stream: true
        })
      }).finally(() => {
        setIsPending(false)
      })

      if (response.body) {
        setIsPending(false)
        const reader = response.body?.getReader() // 获取reader
        const decoder = new TextDecoder('utf-8') // 创建解码器

        // 2.读取数据
        let isDone = false
        let composedMessage = ''
        while (!isDone) {
          const { value: readValue, done } = await reader?.read()
          const text = decoder.decode(readValue).replaceAll(': OPENROUTER PROCESSING', '')
          const jsonList = text.split('data: ').filter((t) => t.startsWith('{'))
          if (done) {
            setIsPending(false)
            isDone = true
            return
          }
          if (!text?.startsWith('data:')) {
            continue
          }

          jsonList.forEach((json) => {
            const data = JSON.parse(json)
            const replyMessage = data.choices?.[0]?.delta?.content
            if (replyMessage) {
              onChange({
                title,
                message: (composedMessage += replyMessage),
                uuid
              })
            }
          })
        }
      }
    },
    [onChange, onSend, configure]
  )

  return (
    <InputAreaContainer>
      <Container maxWidth="md">
        <TextField
          placeholder="给OpenRouter发送消息"
          type="container"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const input = inputRef.current
              const value = input?.value
              if (value) {
                sendMessage(value)
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M9 7a5 5 0 0 1 10 0v8a7 7 0 1 1-14 0V9a1 1 0 0 1 2 0v6a5 5 0 0 0 10 0V7a3 3 0 1 0-6 0v8a1 1 0 1 0 2 0V9a1 1 0 1 1 2 0v6a3 3 0 1 1-6 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            ),
            inputRef,
            endAdornment: (
              <IconButton
                aria-label="delete"
                onClick={() => {
                  const input = inputRef.current
                  const value = input?.value
                  if (value) {
                    sendMessage(value)
                  }
                }}
              >
                {!isPending ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32">
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M15.192 8.906a1.143 1.143 0 0 1 1.616 0l5.143 5.143a1.143 1.143 0 0 1-1.616 1.616l-3.192-3.192v9.813a1.143 1.143 0 0 1-2.286 0v-9.813l-3.192 3.192a1.143 1.143 0 1 1-1.616-1.616z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    className="animate-spin"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="1522"
                    width="32"
                    height="32"
                    fill="currentColor"
                  >
                    <path
                      d="M512 170.666667C323.477333 170.666667 170.666667 323.477333 170.666667 512s152.810667 341.333333 341.333333 341.333333 341.333333-152.810667 341.333333-341.333333h85.333334c0 235.648-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333v85.333334z"
                      p-id="1523"
                    ></path>
                  </svg>
                )}
              </IconButton>
            )
          }}
        />
      </Container>
    </InputAreaContainer>
  )
}

export default memo(InputArea)
