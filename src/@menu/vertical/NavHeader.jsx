// Third-party Imports
import styled from '@emotion/styled'

// Util Imports
import { verticalNavClasses } from '../utils/menuClasses'

const StyledNavHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => (props.isCollapsed ? 'center' : 'space-between')};
  transition: all 0.3s ease;
`

const NavHeader = ({ children, isCollapsed = false }) => {
  return <StyledNavHeader className={verticalNavClasses.header} isCollapsed={isCollapsed}>
    {children}
  </StyledNavHeader>
}

export default NavHeader
