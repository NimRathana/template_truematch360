"use client";

// MUI Imports
import { useTheme } from "@mui/material/styles";
import { Drawer } from "@mui/material";

// Horizontal Menu Imports
import { Menu, MenuItem, SubMenu } from "@menu/horizontal";

// Hooks
import useHorizontalNav from "@menu/hooks/useHorizontalNav";
import { useSettings } from "@core/hooks/useSettings";
import themeConfig from '@configs/themeConfig'

// Components
import VerticalMenu from "./VerticalMenu";
import { MenuData, translateMenuLabels } from "@data/navigation/MenuData";
import { useTranslation } from 'react-i18next'

// Styles
import menuItemStyles from "@core/styles/horizontal/menuItemStyles";
import StyledVerticalNavExpandIcon from '@menu/vertical/styles/StyledVerticalNavExpandIcon'

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
);

const HorizontalMenu = () => {
  const theme = useTheme();
  const { settings } = useSettings();

  const scrollMenu = (container) => {
    const shadow = document.getElementById("menu-scroll-shadow");
    if (!shadow) return;

    const scrollContainer = container?.target || container;
    const scrollTop = scrollContainer?.scrollTop || 0;

    if (scrollTop > 10) {
      shadow.classList.add("scrolled");
    } else {
      shadow.classList.remove("scrolled");
    }
  };

  const {
    isBreakpointReached,
    isToggled,
    toggleVerticalNav,
    transitionDuration,
  } = useHorizontalNav();

  const { t } = useTranslation()

  // Render Menu Items
  const renderMenuItems = (items, parentKey = "") => {
    return items.map((item, index) => {
      const key = `${parentKey}-${item.label}-${index}`;

      if (item.type === "section") {
        return renderMenuItems(item.children || []);
      }

      if (item.type === "submenu") {
        return (
          <SubMenu
            key={key}
            label={item.label}
            icon={item.icon}
            suffix={item.suffix}
          >
            {renderMenuItems(item.children, key)}
          </SubMenu>
        );
      }

      return (
        <MenuItem
          key={key}
          href={item.href}
          icon={item.icon}
          suffix={item.suffix}
          disabled={item.disabled}
        >
          {item.label}
        </MenuItem>
      );
    });
  };

  const translatedMenuData = translateMenuLabels(MenuData, t)

  return (
    <>
      <Drawer
        open={isBreakpointReached && isToggled}
        onClose={() => toggleVerticalNav(false)}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: 280,
            borderRight: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            boxShadow: 8,
          },
        }}
        transitionDuration={transitionDuration}
      >
        <VerticalMenu scrollMenu={scrollMenu} />
      </Drawer>

      {/* ==================== DESKTOP HORIZONTAL MENU ==================== */}
      {!isBreakpointReached && (
        <Menu
          style={{
            paddingInline: `${themeConfig.layoutPadding}px`,
            paddingBlock: "5px",
            transition: 'padding 0.3s ease',
            minHeight: 'calc(var(--header-height) - 5px)',
            display: 'flex',
            alignItems: 'center',
          }}
          menuItemStyles={menuItemStyles(theme, settings?.primaryColor, settings?.skin)}
          renderExpandIcon={RenderExpandIcon}
          subMenuOpenBehavior="hover"
        >
          {renderMenuItems(translatedMenuData)}
        </Menu>
      )}
    </>
  );
};

export default HorizontalMenu;
