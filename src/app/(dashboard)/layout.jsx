// Layout Imports
import LayoutWrapper from '@layouts/LayoutWrapper'
import VerticalLayout from '@layouts/VerticalLayout'
import HorizontalLayout from '@layouts/HorizontalLayout'

// Providers
import Providers from '@components/Providers'

// VERTICAL Specific Components
import VerticalNavigation from '@components/layout/vertical/Navigation'
import VerticalNavbar from '@components/layout/vertical/Navbar'
import VerticalFooter from '@components/layout/vertical/Footer'

// HORIZONTAL Specific Components
import HorizontalNavbar from '@components/layout/horizontal/Navbar'
import HorizontalNavigation from '@components/layout/horizontal/Navigation'
import HorizontalNav from '@menu/horizontal/HorizontalNav'

const Layout = async ({ children }) => {
  return (
    <Providers>
      <LayoutWrapper
        verticalLayout={
          <VerticalLayout 
            navigation={<VerticalNavigation />} 
            navbar={<VerticalNavbar />} 
            footer={<VerticalFooter />}
          >
            {children}
          </VerticalLayout>
        }
        horizontalLayout={
          <HorizontalNav customBreakpoint='800px'>
            <HorizontalLayout 
              navbar={<HorizontalNavbar />} 
              navigation={<HorizontalNavigation />} 
              footer={<VerticalFooter />}
            >
              {children}
            </HorizontalLayout>
          </HorizontalNav>
        }
      />
    </Providers>
  )
}

export default Layout