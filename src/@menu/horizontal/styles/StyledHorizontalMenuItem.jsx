import styled from '@emotion/styled'
import { menuClasses } from '../../utils/menuClasses'

const StyledHorizontalMenuItem = styled.li`
  display: inline-block;
  position: relative;

  > a, > button {
    display: inline-flex;
    align-items: center;
    padding: 5px 20px;
    border-radius: 50px;
    text-decoration: none;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  &:hover > a,
  &:hover > button {
    background-color: var(--mui-palette-action-hover);
  }

  &.${menuClasses.active} > a,
  &.${menuClasses.active} > button {
    background-color: #7C4DFF;
    box-shadow: 0 4px 12px rgba(124, 77, 255, 0.3);
  }

  ${({ menuItemStyles }) => menuItemStyles}
  ${({ rootStyles }) => rootStyles}
`

export default StyledHorizontalMenuItem