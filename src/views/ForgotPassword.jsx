'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'

// Next Imports
import Link from '@/components/Link'

// MUI Imports
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Snackbar from '@mui/material/Snackbar'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import ArrowBack from '@mui/icons-material/ArrowBack'

// Component Imports
import DirectionalIcon from '@components/DirectionalIcon'
import Illustrations from '@components/Illustrations'
import Logo from '@components/layout/shared/Logo'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import api from '@views/services/api'

const ForgotPassword = ({ mode }) => {
  const { t } = useTranslation()
  const router = useRouter()

  const [step, setStep] = useState(0)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [severity, setSeverity] = useState('error')
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const darkImg = '/images/pages/auth-v1-mask-dark.png'
  const lightImg = '/images/pages/auth-v1-mask-light.png'
  const authBackground = useImageVariant(mode, lightImg, darkImg)
  const steps = [t('enter_email'), t('verify_code'), t('reset_password')]

  const showSnackbar = (nextMessage, nextSeverity = 'error') => {
    setSeverity(nextSeverity)
    setMessage(nextMessage)
    setOpenSnackbar(true)
  }

  const handleRequestCode = async () => {
    const normalizedEmail = email.trim()

    if (!normalizedEmail) {
      showSnackbar(t('email_not_found') || 'Email not found', 'error')
      return
    }

    setLoading(true)
    try {
      await api.post('/forgot_password', { email: normalizedEmail })
      setStep(1)
    } catch (err) {
      if (err.response?.status === 404 && err.response?.data?.detail === 'Email not found') {
        showSnackbar(t('email_not_found') || 'Email not found', 'error')
      } else if (err.response?.status === 429 && err.response?.data?.detail === 'System email limit reached for today. Please try again tomorrow.') {
        showSnackbar(t('email_limit_reached') || 'System email limit reached for today. Please try again tomorrow.', 'warning')
      } else {
        showSnackbar(t('error_sending_code') || 'Error sending code. Please try again.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    const normalizedEmail = email.trim()
    const normalizedCode = code.trim()

    if (!normalizedEmail || !normalizedCode) {
      showSnackbar(t('code_email_not_provided') || 'Code and email are required', 'error')
      return
    }

    setLoading(true)
    try {
      await api.post('/forgot_password/verify_code', {
        email: normalizedEmail,
        code: normalizedCode,
      })
      showSnackbar(t('code_verified') || 'Code verified successfully.', 'success')
      setStep(2)
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.detail === 'code and email not provided') {
        showSnackbar(t('code_email_not_provided') || 'Code and email are required', 'error')
      } else if (err.response?.status === 400 && err.response?.data?.detail === 'Invalid email or code') {
        showSnackbar(t('invalid_email_or_code') || 'Invalid email or code', 'error')
      } else if (err.response?.status === 400 && err.response?.data?.detail === 'Code has expired') {
        showSnackbar(t('code_expired') || 'Code has expired', 'error')
      } else {
        showSnackbar(t('error_verifying_code') || 'Error verifying code. Please try again.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    const normalizedEmail = email.trim()
    const normalizedPassword = newPassword.trim()
    const normalizedConfirmPassword = confirmPassword.trim()

    if (!normalizedPassword || !normalizedConfirmPassword) {
      showSnackbar(t('all_fields_required') || 'All fields are required', 'error')
      return
    }

    if (normalizedPassword !== normalizedConfirmPassword) {
      showSnackbar(t('passwords_do_not_match') || 'Passwords do not match', 'error')
      return
    }

    setLoading(true)
    try {
      await api.post('/forgot_password/reset_password', {
        email: normalizedEmail,
        new_password: normalizedPassword,
      })

      showSnackbar(t('password_reset_success') || 'Password reset successfully', 'success')
      setTimeout(() => router.push('/'), 1500)
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.detail === 'Email not found') {
        showSnackbar(t('email_not_found') || 'Email not found', 'error')
      } else {
        showSnackbar(t('error_resetting_password') || 'Error resetting password. Please try again.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (step === 0) {
      router.push('/')
      return
    }

    setStep(prevStep => Math.max(0, prevStep - 1))
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
        p: 6,
      }}
    >
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={severity} variant="filled">
          {message}
        </Alert>
      </Snackbar>

      <Card sx={{ display: 'flex', flexDirection: 'column', width: { sm: 450 } }}>
        <CardContent sx={{ p: { xs: 6, sm: 12 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 6 }}>
            <Link href='/'>
              <Logo />
            </Link>
          </Box>

          <Typography variant="h4" sx={{ mb: 2 }}>
            {t('forgot_password') || 'Forgot Password'} 🔒
          </Typography>

          <Stepper activeStep={step} alternativeLabel sx={{ mb: 3 }}>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {step === 0 && (
            <Box
              component='form'
              onSubmit={e => {
                e.preventDefault()
                handleRequestCode()
              }}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                autoFocus
                fullWidth
                label={t('email') || 'Email'}
                required
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Button type='submit' variant='contained' disabled={loading}>
                {loading ? <CircularProgress size={22} color='inherit' /> : t('send_code') || 'Send code'}
              </Button>
            </Box>
          )}

          {step === 1 && (
            <Box
              component='form'
              onSubmit={e => {
                e.preventDefault()
                handleVerifyCode()
              }}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                fullWidth
                label={t('verification_code') || 'Verification code'}
                required
                value={code}
                onChange={e => setCode(e.target.value)}
              />
              <Button type='submit' variant='contained' disabled={loading}>
                {loading ? <CircularProgress size={22} color='inherit' /> : t('verify') || 'Verify'}
              </Button>
            </Box>
          )}

          {step === 2 && (
            <Box
              component='form'
              onSubmit={e => {
                e.preventDefault()
                handleResetPassword()
              }}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                fullWidth
                label={t('new_password') || 'New password'}
                required
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={() => setShowPassword(show => !show)} edge='end'>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label={t('confirm_password') || 'Confirm password'}
                required
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={() => setShowPassword(show => !show)} edge='end'>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button type='submit' variant='contained' disabled={loading}>
                {loading ? <CircularProgress size={22} color='inherit' /> : t('reset_password') || 'Reset password'}
              </Button>
            </Box>
          )}

          <Box mt={3} display='flex' justifyContent='center' alignItems='center'>
            <Typography color='primary.main' width='100%'>
              <Button
                fullWidth
                onClick={handleBack}
                className='flex items-center'
                variant='text'
                color='primary'
                startIcon={
                  <DirectionalIcon ltrIconClass='ri-arrow-left-s-line' rtlIconClass='ri-arrow-right-s-line' />
                }
              >
                {t('back') || 'Back'}
              </Button>
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Illustrations maskImg={{ src: authBackground }} />
    </Box>
  )
}

export default ForgotPassword
