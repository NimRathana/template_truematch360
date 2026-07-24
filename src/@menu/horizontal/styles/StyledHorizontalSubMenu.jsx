import styled from '@emotion/styled'
import { menuClasses } from '../../utils/menuClasses'
import { lighten } from '@mui/material/styles'

const StyledHorizontalSubMenu = styled.li(({ theme }) => {
  const mainColor = theme.palette.primary.main;
  const lightColor = lighten(mainColor, 0.5);

  return `
    position: relative;
    display: inline-block;
    list-style: none;
    overflow: visible;

    > .${menuClasses.button} {
      display: flex;
      align-items: center;
      padding: 5px 20px;
      border-radius: 50px;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      white-space: nowrap;
      transition: all 0.2s ease-in-out;

      &:hover {
        background-color: var(--mui-palette-action-hover);
      }
    }

    &.${menuClasses.active} > .${menuClasses.button} {
      color: ${theme.palette.primary.contrastText};
      background: linear-gradient(90deg, ${mainColor}, ${lightColor});
      & .icon {
        color: inherit;
      }
    }

    .${menuClasses.subMenuExpandIcon} {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }
      
    .${menuClasses.icon} {
      display: flex;
      align-items: center;
    }

    ${({ menuItemStyles }) => menuItemStyles}
    ${({ rootStyles }) => rootStyles}
  `
});

export default StyledHorizontalSubMenu