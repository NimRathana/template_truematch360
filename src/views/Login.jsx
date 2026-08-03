'use client'

// React Imports
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// Next Imports
import Link from '@/components/Link'
import { useRouter } from 'next/navigation'

// MUI Imports
import Alert from '@mui/material/Alert'
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
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import Stack from '@mui/material/Stack'
import Snackbar from '@mui/material/Snackbar'
import { Alert as MuiAlert, Box } from '@mui/material'

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
  const [showRobotCheck, setShowRobotCheck] = useState(false)
  const [isHuman, setIsHuman] = useState(false)
  const [robotAnswer, setRobotAnswer] = useState([])
  const [robotError, setRobotError] = useState(false)
  const [robotOptions, setRobotOptions] = useState([])
  const [robotType, setRobotType] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('error')

  // Vars
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'
  const ROBOT_POOL = [
    { label: '🍎 Apple', type: 'fruit' },
    { label: '🍌 Banana', type: 'fruit' },
    { label: '🍇 Grape', type: 'fruit' },
    { label: '🍊 Orange', type: 'fruit' },
    { label: '🍓 Strawberry', type: 'fruit' },
    { label: '🍍 Pineapple', type: 'fruit' },
    { label: '🥭 Mango', type: 'fruit' },
    { label: '🍉 Watermelon', type: 'fruit' },
    { label: '🍒 Cherry', type: 'fruit' },
    { label: '🥝 Kiwi', type: 'fruit' },
    { label: '🐶 Dog', type: 'animal' },
    { label: '🐱 Cat', type: 'animal' },
    { label: '🐭 Mouse', type: 'animal' },
    { label: '🐰 Rabbit', type: 'animal' },
    { label: '🐼 Panda', type: 'animal' },
    { label: '🦁 Lion', type: 'animal' },
    { label: '🐯 Tiger', type: 'animal' },
    { label: '🐵 Monkey', type: 'animal' },
    { label: '🚗 Car', type: 'vehicle' },
    { label: '🚕 Taxi', type: 'vehicle' },
    { label: '🚙 SUV', type: 'vehicle' },
    { label: '🚌 Bus', type: 'vehicle' },
    { label: '🏍️ Motorcycle', type: 'vehicle' },
    { label: '🚲 Bicycle', type: 'vehicle' },
    { label: '✈️ Plane', type: 'vehicle' },
    { label: '🚀 Rocket', type: 'vehicle' },
    { label: '📱 Phone', type: 'electronics' },
    { label: '💻 Laptop', type: 'electronics' },
    { label: '⌚ Watch', type: 'electronics' },
    { label: '📺 TV', type: 'electronics' },
  ]

  // Hooks
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const TYPE_MAP = {
    [t('fruits')]: 'fruit',
    [t('animals')]: 'animal',
    [t('vehicles')]: 'vehicle',
    [t('electronics')]: 'electronics',
  }

  const generateRobotOptions = () => {
    const readableTypes = Object.keys(TYPE_MAP)
    const randomReadableType = readableTypes[Math.floor(Math.random() * readableTypes.length)]
    const poolType = TYPE_MAP[randomReadableType]

    setRobotType(randomReadableType)

    const correctItems = ROBOT_POOL.filter(item => item.type === poolType)
    const wrongItems = ROBOT_POOL.filter(item => item.type !== poolType)

    const selectedCorrect = correctItems
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)

    const selectedWrong = wrongItems
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)

    const mixedOptions = [...selectedCorrect, ...selectedWrong]
      .sort(() => 0.5 - Math.random())
      .map((item, index) => ({
        id: index + 1,
        label: item.label,
        isCorrect: item.type === poolType,
      }))

    setRobotOptions(mixedOptions)
  }

  const toggleRobotOption = id => {
    setRobotError(false)
    setRobotAnswer(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const showSnackbar = (message, severity = 'error') => {
    setSnackbarMessage(message)
    setSnackbarSeverity(severity)
    setSnackbarOpen(true)
  }

  const verifyHuman = () => {
    const correct = robotOptions
      .filter(option => option.isCorrect)
      .map(option => option.id)
      .sort()

    const selected = [...robotAnswer].sort()

    if (JSON.stringify(correct) !== JSON.stringify(selected)) {
      setRobotError(true)
      return
    }

    setIsHuman(true)
    setShowRobotCheck(false)
    setRobotAnswer([])
    setRobotError(false)
  }

  // Submit handler
  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)

    if (showRobotCheck && !isHuman) {
      const message = t ? t('complete_security_check') : 'Please complete the security check'
      setError(message)
      showSnackbar(message, 'warning')
      return
    }

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

      setShowRobotCheck(false)
      setIsHuman(false)
      setRobotAnswer([])
      setRobotError(false)
      setRobotOptions([])
      setRobotType('')
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
        setShowRobotCheck(true)
        generateRobotOptions()
        setIsHuman(false)
        const message = err.response.data.detail || (t ? t('complete_security_check') : 'Please complete the security check')
        setError(message)
        showSnackbar(message, 'warning')
      } else if (err.response?.status === 404 && err.response.data?.detail === 'Email not found') {
        const message = t ? t('email_not_found') : 'Email not found'
        setError(message)
        showSnackbar(message, 'error')
      } else if (err.response?.status === 400 && err.response.data?.detail === 'Invalid password') {
        const message = t ? t('invalid_password') : 'Invalid password'
        setError(message)
        showSnackbar(message, 'error')
      } else {
        const message = err.response?.data?.detail || err.message || (t ? t('login_failed') : 'Login failed')
        setError(message)
        showSnackbar(message, 'error')
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

              <Collapse in={showRobotCheck} sx={{ border: '2px solid var(--mui-palette-primary-main)', borderRadius: "var(--mui-shape-borderRadius)" }}>
                <Box sx={{ p: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    {t('security_check')}
                  </Typography>

                  <Typography variant="body2" color="primary.main" sx={{ mb: 2 }}>
                    {t('select')} {robotType}
                  </Typography>

                  <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
                    {robotOptions.map(option => {
                      const selected = robotAnswer.includes(option.id)

                      return (
                        <Chip
                          key={option.id}
                          label={option.label}
                          clickable
                          size="small"
                          color={selected ? 'primary' : 'default'}
                          variant={selected ? 'filled' : 'outlined'}
                          onClick={() => toggleRobotOption(option.id)}
                        />
                      )
                    })}
                  </Stack>

                  {robotError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {t('incorrect_selection')}
                    </Alert>
                  )}

                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    onClick={verifyHuman}
                    disabled={robotAnswer.length === 0}
                  >
                    {t('verify')}
                  </Button>
                </Box>
              </Collapse>

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

              <Button fullWidth variant="contained" type="submit" disabled={loading || (showRobotCheck && !isHuman)}>
                {loading ? t('login')+'...' || 'Signing in...' : t('login') || 'Log In'}
              </Button>

              <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                <MuiAlert
                  onClose={() => setSnackbarOpen(false)}
                  severity={snackbarSeverity}
                  variant="filled"
                  sx={{ width: '100%' }}
                >
                  {snackbarMessage}
                </MuiAlert>
              </Snackbar>

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
