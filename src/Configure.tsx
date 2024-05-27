import { Box, Button, Dialog, Stack } from '@mui/material'
import React, { memo } from 'react'
import type { PropsWithChildren, FC } from 'react'
import { useForm } from 'react-hook-form'
import { FormContainer, TextFieldElement } from 'react-hook-form-mui'
import { IConfigure } from './types/configure'

interface IConfigureProps {
  onSubmit?: (data: any) => void
}

const Configure: FC<PropsWithChildren<IConfigureProps>> = (props) => {
  const { onSubmit } = props
  const formContext = useForm<IConfigure>({})
  const { handleSubmit } = formContext
  const [open, setOpen] = React.useState(true)
  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
      <Box
        sx={{
          padding: '32px 16px'
        }}
      >
        <FormContainer
          formContext={formContext}
          handleSubmit={handleSubmit((data) => {
            setOpen(false)
            onSubmit?.(data)
          })}
        >
          <Stack spacing={2}>
            <TextFieldElement name={'OPENROUTER_API_KEY'} label={'OPENROUTER_API_KEY'} variant="filled" required />
            <Button type={'submit'} color={'primary'}>
              提交
            </Button>
          </Stack>
        </FormContainer>
      </Box>
    </Dialog>
  )
}

export default memo(Configure)
