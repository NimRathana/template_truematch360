'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import api from '@/services/api'

const ChangePasswordDialog = ({ open = false, onClose }) => {
  const { t } = useTranslation()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false)
  const [newPasswordVisible, setNewPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('success')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setOldPasswordVisible(false)
      setNewPasswordVisible(false)
      setConfirmPasswordVisible(false)
      setMessage('')
      setSeverity('success')
      setLoading(false)
    }
  }, [open])

  const handleClose = () => {
    if (onClose) onClose()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    if (!oldPassword || !newPassword || !confirmPassword) {
      setSeverity('error')
      setMessage(t('all_fields_required') || 'All fields are required')
      return
    }

    if (newPassword !== confirmPassword) {
      setSeverity('error')
      setMessage(t('passwords_do_not_match') || 'Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await api.post('/user/change-password', {
        old_password: oldPassword,
        new_password: newPassword,
      })

      setSeverity('success')
      setMessage(t('password_changed_success') || 'Password changed successfully')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setSeverity('error')
      if (err.response?.data?.detail === 'Old password is incorrect') {
        setMessage(t('old_password_incorrect') || 'Old password is incorrect')
        return;
      }
      setMessage(err.response?.data?.detail || t('password_change_failed') || 'Unable to change password')
    } finally {
      setLoading(false)
      handleClose()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>{t('change_password')}</DialogTitle>
      <DialogContent>
        {message && (
          <Alert severity={severity} sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <Box component="form" id="change-password-form" onSubmit={handleSubmit}>
          <TextField
            margin="dense"
            label={t('old_password') || 'Old password'}
            type={oldPasswordVisible ? 'text' : 'password'}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setOldPasswordVisible((prev) => !prev)}
                  >
                    {oldPasswordVisible ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            margin="dense"
            label={t('new_password') || 'New password'}
            type={newPasswordVisible ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setNewPasswordVisible((prev) => !prev)}
                  >
                    {newPasswordVisible ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            margin="dense"
            label={t('confirm_password') || 'Confirm password'}
            type={confirmPasswordVisible ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setConfirmPasswordVisible((prev) => !prev)}
                  >
                    {confirmPasswordVisible ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          {t('cancel') || 'Cancel'}
        </Button>
        <Button
          type="submit"
          form="change-password-form"
          variant="contained"
          disabled={loading}
        >
          {loading ? `${t('change_password')}...` : t('change_password')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChangePasswordDialog
