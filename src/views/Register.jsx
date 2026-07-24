'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from '@/components/Link'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'

// Component Imports
import Illustrations from '@components/Illustrations'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

const Register = ({ mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  // Vars
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  // Hooks
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100dvh',
        position: 'relative',
        p: 6,
      }}
    >
      <Card sx={{ display: 'flex', flexDirection: 'column', width: { sm: 450 } }}>
        <CardContent sx={{ p: { xs: 6, sm: 12 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 6 }}>
            <Link href='/'>
              <Logo />
            </Link>
          </Box>

          <Typography variant="h4" gutterBottom>
            Adventure starts here 🚀
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <Typography sx={{ mb: 1 }}>
              Make your app management easy and fun!
            </Typography>

            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={e => e.preventDefault()}
              sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}
            >
              <TextField autoFocus fullWidth label="Username" />
              <TextField fullWidth label="Email" />
              <TextField
                fullWidth
                label="Password"
                type={isPasswordShown ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        edge="end"
                        onClick={handleClickShowPassword}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <i className={isPasswordShown ? 'ri-eye-off-line' : 'ri-eye-line'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControlLabel
                control={<Checkbox />}
                label={
                  <>
                    <span>I agree to </span>
                    <Box
                      component="a"
                      sx={{ color: 'primary.main', cursor: 'pointer' }}
                    >
                      privacy policy & terms
                    </Box>
                  </>
                }
              />

              <Button fullWidth variant="contained" type="submit">
                Sign Up
              </Button>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Typography>Already have an account?</Typography>
                <Typography
                  component={Link}
                  href="/login"
                  sx={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Sign in instead
                </Typography>
              </Box>

              <Divider>or</Divider>

              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                <IconButton size="small" sx={{ color: '#4267B2' }}>
                  <i className="ri-facebook-fill" />
                </IconButton>
                <IconButton size="small" sx={{ color: '#1DA1F2' }}>
                  <i className="ri-twitter-fill" />
                </IconButton>
                <IconButton size="small">
                  <i className="ri-github-fill" />
                </IconButton>
                <IconButton size="small" sx={{ color: '#DB4437' }}>
                  <i className="ri-google-fill" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Illustrations maskImg={{ src: authBackground }} />
    </Box>
  )
}

export default Register