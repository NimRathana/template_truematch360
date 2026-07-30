'use client'

// React Imports
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

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

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

// Service & Auth Imports (Import `api` directly if calling api.post)
import api from '@views/services/api'
import useAuthStore from '@views/store/useAuthStore'

const Login = ({ mode }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { setAccessToken, setUserType, setUserData } = useAuthStore()

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
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  // Submit handler
  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data } = await api.post('/user/login', {
        email: email.trim(),
        password,
      })

      const token = data?.accessToken || data?.access_token || data?.token
      if (!token) {
        throw new Error(t ? t('login_failed') : 'Login failed')
      }

      setAccessToken(token)
      setUserType(data?.userType || data?.user_type)
      setUserData(data)

      setEmail('')
      setPassword('')
      setRemember(false)

      switch (data?.user_type || data?.userType) {
        case 1:
          router.replace('/admin/dashboard')
          break
        case 2:
          router.replace('/employer')
          break
        case 3:
          router.replace('/update_profile')
          break
        default:
          router.replace('/')
      }
    } catch (err) {
      if (err.response?.status === 429) {
        setError(err.response.data.detail || (t ? t('complete_security_check') : 'Please complete the security check'))
      } else if (err.response?.status === 404 && err.response.data?.detail === 'Email not found') {
        setError(t ? t('email_not_found') : 'Email not found')
      } else if (err.response?.status === 400 && err.response.data?.detail === 'Invalid password') {
        setError(t ? t('invalid_password') : 'Invalid password')
      } else {
        setError(err.response?.data?.detail || err.message || (t ? t('login_failed') : 'Login failed'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center' style={{ minHeight: '100vh', position: 'relative', padding: 24 }}>
      <Card 
        sx={{
          width: '100%',
          maxWidth: 450,
          p: { xs: 3, sm: 6 }
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 6 }}>
            <Link href='/'>
              <Logo />
            </Link>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
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
                label={t('email') || 'Email'}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />

              <TextField
                fullWidth
                label={t('password') || 'Password'}
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
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 1,
                  flexWrap: 'wrap',
                }}
              >
                <FormControlLabel control={<Checkbox checked={remember} onChange={e => setRemember(e.target.checked)} />} label={t('remember_me') || 'Remember me'} />
                <Typography
                  sx={{ textAlign: 'right', color: 'primary.main', cursor: 'pointer' }}
                  component={Link}
                  href="/forgot-password"
                >
                  {t('forgot_password') || 'Forgot password?'}
                </Typography>
              </Box>

              {error && (
                <Typography color="error" sx={{ textAlign: 'center' }}>
                  {error}
                </Typography>
              )}

              <Button fullWidth variant="contained" type="submit" disabled={loading}>
                {loading ? t('login')+'...' || 'Signing in...' : t('login') || 'Log In'}
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
                <Typography>{t('dont_have_account')+'?' || "Don't have an account?"}</Typography>
                <Typography
                  component={Link}
                  href="/register"
                  sx={{ color: 'primary.main', cursor: 'pointer' }}
                >
                  {t('create_account') || 'Create an account'}
                </Typography>
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
