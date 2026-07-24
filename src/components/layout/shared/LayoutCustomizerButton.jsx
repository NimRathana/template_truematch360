'use client'

import { useState } from 'react'
import { useTheme } from '@mui/material/styles'
import ThemeCustomizer from '@components/theme/ThemeCustomizer'

const LayoutCustomizerButton = ({ isVisible = true }) => {
  const [open, setOpen] = useState(false)
  const theme = useTheme()

  if (!isVisible) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="pulse"
        style={{
          position: 'fixed',
          top: 200,
          insetInlineEnd: 0,
          zIndex: theme.zIndex.appBar + 1,
          width: 40,
          height: 40,
          borderStartStartRadius: 20,
          borderEndStartRadius: 20,
          backgroundColor: theme.palette.primary.main,
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
        }}
      >
        <i className="ri-settings-3-line" />
      </button>

      <ThemeCustomizer open={open} onClose={() => setOpen(false)} />
    </>
  )
}

export default LayoutCustomizerButton
