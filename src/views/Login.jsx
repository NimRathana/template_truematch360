'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from '@/components/Link'
import { useRouter } from 'next/navigation'

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
import { Box } from '@mui/material'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import Illustrations from '@components/Illustrations'

// Config Imports
import themeConfig from '@configs/themeConfig'
import { routes } from '@configs/routes'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

// Service & Auth Imports (Import `api` directly if calling api.post)
import api from '@/services/api' // <-- Added missing import
import { saveAuthSession } from '@/libs/auth'

const Login = ({ mode }) => {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Vars
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  // Hooks
  const router = useRouter()
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  // Submit handler
  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const payload = {
      username: email,
      password,
    }

    try {
      // 1. Make API Call
      const { data } = await api.post('/api/login', payload)

      // 2. Extract token
      const token = data?.accessToken || data?.access_token || data?.token

      if (!token) {
        throw new Error('No access token returned from server')
      }

      // 3. Save auth session (Only reached if token exists)
      saveAuthSession({
        accessToken: token,
        refreshToken: data?.refreshToken || data?.refresh_token,
        userData: data?.user || data?.userData,
        userType: data?.userType || data?.user_type,
      })

      // 4. Redirect user
      const search = typeof window !== 'undefined' ? window.location.search : ''
      const params = new URLSearchParams(search)
      const fallbackPath = params.get('from') || routes.dashboard

      router.replace(fallbackPath)
    } catch (err) {
      // This catches API errors, missing token errors, or connection failures
      console.error('Login Error:', err.status, err.code, err.message)
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center' style={{ minHeight: '100vh', position: 'relative', padding: 24 }}>
      <Card className='flex flex-col sm:w-[450px]'>
        <CardContent sx={{ p: { xs: 6, sm: 12 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 6 }}>
            <Link href='/'>
              <Logo />
            </Link>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <Box>
              <Typography variant="h4">{`Welcome to ${themeConfig.templateName}!👋🏻`}</Typography>
              <Typography sx={{ mb: 1 }}>
                Please sign-in to your account and start the adventure
              </Typography>
            </Box>

            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}
            >
              <TextField
                autoFocus
                fullWidth
                label="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />

              <TextField
                fullWidth
                label="Password"
                id="outlined-adornment-password"
                type={isPasswordShown ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
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
                required
              />

              <Box
                sx={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  gap: 1,
                  flexWrap: 'wrap',
                }}
              >
                <FormControlLabel control={<Checkbox checked={remember} onChange={e => setRemember(e.target.checked)} />} label="Remember me" />
                <Typography
                  sx={{ textAlign: 'right', color: 'primary.main', cursor: 'pointer' }}
                  component={Link}
                  href="/forgot-password"
                >
                  Forgot password?
                </Typography>
              </Box>

              {error && (
                <Typography color="error" sx={{ textAlign: 'center' }}>
                  {error}
                </Typography>
              )}

              <Button fullWidth variant="contained" type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Log In'}
              </Button>

              <Box
                sx={{
                  display: 'flex',
                  justify: 'center',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Typography>New on our platform?</Typography>
                <Typography
                  component={Link}
                  href="/register"
                  sx={{ color: 'primary.main', cursor: 'pointer' }}
                >
                  Create an account
                </Typography>
              </Box>

              <Divider>or</Divider>

              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                <IconButton sx={{ color: '#4267B2' }}>
                  <i className="ri-facebook-fill" />
                </IconButton>
                <IconButton sx={{ color: '#1DA1F2' }}>
                  <i className="ri-twitter-fill" />
                </IconButton>
                <IconButton>
                  <i className="ri-github-fill" />
                </IconButton>
                <IconButton sx={{ color: '#DB4437' }}>
                  <i className="ri-google-fill" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Illustrations maskImg={{ src: authBackground }} />
    </div>
  )
}

export default Login