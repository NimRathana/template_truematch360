// MUI Imports
import { lighten } from '@mui/material/styles'

// Util Imports
import { menuClasses } from '@menu/utils/menuClasses'

const menuItemStyles = (theme, primaryColor, isCollapsed) => {
  const mainColor = primaryColor || theme.palette.primary.main
  const lightColor = lighten(mainColor, 0.5)
  return {
    root: {
      marginBlockStart: theme.spacing(1.5),
      [`&.${menuClasses.subMenuRoot}.${menuClasses.open} > .${menuClasses.button}, &.${menuClasses.subMenuRoot} > .${menuClasses.button}.${menuClasses.active}`]:
        {
          backgroundColor: 'var(--mui-palette-action-selected) !important'
        },
      [`&.${menuClasses.disabled} > .${menuClasses.button}`]: {
        color: 'var(--mui-palette-text-disabled)',
        [`& .${menuClasses.icon}`]: {
          color: 'inherit'
        }
      },
      [`&:not(.${menuClasses.subMenuRoot}) > .${menuClasses.button}.${menuClasses.active}`]: {
        color: 'var(--mui-palette-primary-contrastText)',
        background:
          theme.direction === 'ltr'
            ? `linear-gradient(270deg, ${mainColor}, ${lightColor} 100%)`
            : `linear-gradient(270deg, ${lightColor}, ${mainColor} 100%)`,
        [`& .${menuClasses.icon}`]: {
          color: 'inherit'
        }
      }
    },
    button: ({ active }) => ({
      paddingBlock: theme.spacing(2),
      paddingInlineStart: isCollapsed ? theme.spacing(2) : theme.spacing(5.5),
      paddingInlineEnd: isCollapsed ? theme.spacing(2) : theme.spacing(3.5),
      justifyContent: isCollapsed ? 'center' : 'flex-start',
      borderStartEndRadius: 50,
      borderEndEndRadius: 50,
      ...(isCollapsed && {
        [`& .${menuClasses.label}`]: {
          display: 'none'
        }
      }),
      ...(!active && {
        '&:hover, &:focus-visible': {
          backgroundColor: 'var(--mui-palette-action-hover)'
        },
        '&[aria-expanded="true"]': {
          backgroundColor: 'var(--mui-palette-action-selected)'
        }
      })
    }),
    icon: ({ level }) => ({
      ...(level === 0 && {
        fontSize: '1.375rem',
      }),
      ...(level > 0 && {
        fontSize: '0.75rem',
        color: 'var(--mui-palette-text-secondary)',
      }),
      marginInlineEnd: isCollapsed ? 0 : theme.spacing(level === 0 ? 2 : 3.5),
      ...(level === 1 && !isCollapsed && {
        marginInlineStart: theme.spacing(1.5)
      }),

      ...(level > 1 && !isCollapsed && {
        marginInlineStart: theme.spacing(1.5 + 2.5 * (level - 1))
      }),
      '& > i, & > svg': {
        fontSize: 'inherit'
      }
    }),
    prefix: {
      marginInlineEnd: theme.spacing(2),
      ...(isCollapsed && { display: 'none' })
    },
    suffix: {
      marginInlineStart: theme.spacing(2),
      ...(isCollapsed && { display: 'none' })
    },
    subMenuExpandIcon: {
      fontSize: '1.375rem',
      marginInlineStart: theme.spacing(2),
      '& i, & svg': {
        fontSize: 'inherit'
      },
      ...(isCollapsed && {
        display: 'none'
      }),
    },
    subMenuContent: {
      backgroundColor: 'transparent'
    },
  }
}

export default menuItemStyles
