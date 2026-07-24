"use client";

// React Imports
import { useState, useEffect } from "react";

// Third-party Imports
import classnames from "classnames";
import styled from "@emotion/styled";
// MUI Imports
import { Box } from "@mui/material";

// Component Imports
import LayoutContent from "./components/horizontal/LayoutContent";
import { useSettings } from "@core/hooks/useSettings";
import themeConfig from "@configs/themeConfig";
import StyledHeader from '@layouts/styles/horizontal/StyledHeader'
import StyledMain from '@layouts/styles/shared/StyledMain'

// Util Imports
import { horizontalLayoutClasses } from "./utils/layoutClasses";

const HorizontalLayout = (props) => {
  const { navbar, footer, navigation, children, overrideStyles } = props;
  const { settings } = useSettings();
  const [scrolled, setScrolled] = useState(false)
  // Navbar config
  const navbarConfig = themeConfig.navbar || {}
  const isFixed = navbarConfig.type === 'fixed'
  const isFloating = navbarConfig.floating
  const isDetached = navbarConfig.detached
  const hasBlur = navbarConfig.blur
  const isContentCompact = settings.contentWidth === "compact";
  // Scroll detection for blur/shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const StyledCompactWrapper = styled.div`
    width: 100%;
    margin-inline: auto;
    ${({ isContentCompact }) =>
      isContentCompact &&
      `
        max-inline-size: ${themeConfig.compactContentWidth}px;
    `}
  `;

  return (
    <div className={classnames(horizontalLayoutClasses.root, "flex flex-col min-h-screen")}>
      <StyledHeader
        overrideStyles={overrideStyles}
        isContentCompact={isContentCompact}
        isFloating={isFloating}
        skin={settings.skin || 'default'}
        isBlur={hasBlur}
        scrolled={scrolled}
        isFixed={isFixed}
        isHorizontal={settings.layout == 'horizontal'}
        style={{
          position: isFixed ? 'sticky' : 'relative',
          top: 0,
          insetInlineStart: 0,
          insetInlineEnd: 0,
          transition: 'all 0.3s ease',
        }}
      >
        {navbar || null}

        <StyledCompactWrapper isContentCompact={isContentCompact}>
          {navigation}
        </StyledCompactWrapper>
      </StyledHeader>
      
      {/* Main */}
      <LayoutContent>{children}</LayoutContent>

      {/* Footer */}
      {footer}
    </div>
  );
};

export default HorizontalLayout;
