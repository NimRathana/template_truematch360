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
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import Illustrations from '@components/Illustrations'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'

// Service Imports
import api from '@/services/api'

const Register = ({ mode }) => {
  const { t } = useTranslation()
  const router = useRouter()

  // States
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('')
  const [gender, setGender] = useState('')
  const [phone, setPhone] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [address, setAddress] = useState('')
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Vars
  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'

  // Hooks
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const res = await api.post('/user', {
        user_name: userName.trim(),
        email: email.trim(),
        password,
        user_type: Number(userType),
        gender: gender || null,
        phone: phone || null,
        date_of_birth: dateOfBirth || null,
        address: address || null,
      })

      if (res.status === 200) {
        setSuccess(t('register_success') || 'Registration successful')
        setUserName('')
        setEmail('')
        setPassword('')
        setUserType('')
        setGender('')
        setPhone('')
        setDateOfBirth('')
        setAddress('')
        router.push('/login')
        return
      }

      setError(t('register_failed') || 'Registration failed')
    } catch (err) {
      const status = err.response?.status
      const detail = err.response?.data?.detail

      if (status === 400 && detail?.message) {
        setError(detail.message)
      } else {
        setError(t('register_failed') || 'Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

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
      <Card
        sx={{
          width: '100%',
          maxWidth: 620,
        }}
      >
        <CardContent sx={{ p: { xs: 6, sm: 12 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 6 }}>
            <Link href='/'>
              <Logo />
            </Link>
          </Box>

          <Typography variant="h4" gutterBottom sx={{ letterSpacing: 0.4, fontWeight: 700 }}>
            Create your account
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 440 }}>
            Join us and get started today
          </Typography>

          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            {error && (
              <Typography color="error" sx={{ textAlign: 'center' }}>
                {error}
              </Typography>
            )}
            {success && (
              <Typography color="success.main" sx={{ textAlign: 'center' }}>
                {success}
              </Typography>
            )}

            <TextField
              autoFocus
              fullWidth
              label={t('username') || 'Username'}
              value={userName}
              onChange={e => setUserName(e.target.value)}
              required
            />

            <TextField
              fullWidth
              label={t('email') || 'Email'}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <TextField
              fullWidth
              label={t('password') || 'Password'}
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

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                select
                fullWidth
                label={t('user_type') || 'User Type'}
                value={userType}
                onChange={e => setUserType(e.target.value)}
                required
              >
                <MenuItem value="">{t('select_user_type') || 'Select user type'}</MenuItem>
                <MenuItem value="2">{t('employer') || 'Employer'}</MenuItem>
                <MenuItem value="3">{t('candidate') || 'Candidate'}</MenuItem>
              </TextField>

              <TextField
                select
                fullWidth
                label={t('gender') || 'Gender'}
                value={gender}
                onChange={e => setGender(e.target.value)}
              >
                <MenuItem value="">{t('select_gender') || 'Select gender'}</MenuItem>
                <MenuItem value="Male">{t('male') || 'Male'}</MenuItem>
                <MenuItem value="Female">{t('female') || 'Female'}</MenuItem>
              </TextField>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                fullWidth
                label={t('phone') || 'Phone'}
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
              <TextField
                fullWidth
                label={t('date_of_birth') || 'Date of birth'}
                type="date"
                value={dateOfBirth}
                onChange={e => setDateOfBirth(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <TextField
              fullWidth
              label={t('address') || 'Address'}
              value={address}
              onChange={e => setAddress(e.target.value)}
              multiline
              minRows={3}
            />

            <FormControlLabel
              control={<Checkbox required />}
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

            <Button fullWidth variant="contained" type="submit" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1,
                mt: 1,
              }}
            >
              <Typography>{'Already have an account?'}</Typography>
              <Typography
                component={Link}
                href="/login"
                sx={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {'Sign in'}
              </Typography>
            </Box>

            <Divider>{t('or') || 'or'}</Divider>

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
        </CardContent>
      </Card>

      <Illustrations maskImg={{ src: authBackground }} />
    </Box>
  )
}

export default Register
