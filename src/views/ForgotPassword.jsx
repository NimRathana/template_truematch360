'use client'

// Next Imports
import Link from '@/components/Link'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

// Component Imports
import Form from '@components/Form'
import DirectionalIcon from '@components/DirectionalIcon'
import Illustrations from '@components/Illustrations'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

const ForgotPassword = ({ mode }) => {
  // Vars
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  // Hooks
  const authBackground = useImageVariant(mode, lightImg, darkImg)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        position: 'relative',
        p: 6
      }}
    >
      <Card sx={{ display: 'flex', flexDirection: 'column', width: { sm: 450 } }}>
        <CardContent sx={{ p: { xs: 6, sm: 12 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 6 }}>
            <Link href='/'>
              <Logo />
            </Link>
          </Box>

          <Typography variant="h4" sx={{ mb: 2 }}>
            Forgot Password 🔒
          </Typography>

          <Typography sx={{ mb: 5 }}>
            Enter your email and we&apos;ll send you instructions to reset your password
          </Typography>

          <Form noValidate autoComplete="off">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <TextField autoFocus fullWidth label="Email" />

              <Button fullWidth variant="contained" type="submit">
                Send reset link
              </Button>

              <Typography className='flex justify-center items-center' color='primary.main'>
                <Link href='/login' className='flex items-center'>
                  <DirectionalIcon ltrIconClass='ri-arrow-left-s-line' rtlIconClass='ri-arrow-right-s-line' />
                  <span>Back to Login</span>
                </Link>
              </Typography>
            </Box>
          </Form>
        </CardContent>
      </Card>

      <Illustrations maskImg={{ src: authBackground }} />
    </Box>
  )
}

export default ForgotPassword