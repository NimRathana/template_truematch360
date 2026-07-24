// MUI Imports
import { lighten } from '@mui/material/styles'

// Util Imports
import { menuClasses } from '@menu/utils/menuClasses'

const menuItemStyles = (theme, primaryColor, skin = 'default') => {
  const mainColor = primaryColor || theme.palette.primary.main
  const lightColor = lighten(mainColor, 0.5)
  const contentBorder = skin === 'bordered' ? 'var(--mui-palette-divider)' : 'transparent'

  return {
    root: {
      [`&.${menuClasses.subMenuRoot}.${menuClasses.open} > .${menuClasses.button}`]: {
        backgroundColor: 'var(--mui-palette-action-selected)',
      },

      [`&.${menuClasses.disabled} > .${menuClasses.button}`]: {
        color: 'var(--mui-palette-text-disabled)',
        cursor: 'default',
        '& .icon': {
          color: 'inherit'
        }
      },

      [`&.${menuClasses.menuItemRoot} > .${menuClasses.button}.${menuClasses.active}`]: {
        color: 'var(--mui-palette-primary-contrastText)',
        background: `linear-gradient(90deg, ${mainColor}, ${lightColor})`,
        '& .icon': {
          color: 'inherit'
        }
      }
    },

    button: ({ level, isSubmenu }) => ({
      padding: isSubmenu ? (level > 0 ? '10px 18px' : '10px 16px') : '12px 20px',
      borderRadius: '50px',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap',

      '&:hover': {
        backgroundColor: 'var(--mui-palette-action-hover)',
      },

      '&[aria-expanded="true"]': {
        backgroundColor: 'var(--mui-palette-action-selected)',
      }
    }),

    icon: {
      fontSize: '1.35rem',
      marginRight: '10px',
      transition: 'color 0.2s ease',
      '& > i, & > svg': {
        fontSize: 'inherit'
      }
    },

    label: {
      flex: 1,
    },

    prefix: {
      marginRight: '10px',
    },

    suffix: {
      marginLeft: 'auto',
    },

    subMenuExpandIcon: {
      fontSize: '1.375rem',
      marginInlineStart: theme.spacing(2),
      '& i, & svg': {
        fontSize: 'inherit'
      },
    },

    subMenuContent: {
      border: `1px solid ${contentBorder}`,
      borderRadius: '5px',
      backgroundColor: 'var(--mui-palette-background-paper)',
      boxShadow: '0 24px 80px rgba(15, 23, 42, 0.16)',
      overflow: 'hidden',
    },
  }
}

export default menuItemStyles