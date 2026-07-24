"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

// MUI Imports
import {
  styled,
  alpha,
  Badge,
  Avatar,
  Popper,
  Fade,
  Card,
  ClickAwayListener,
  MenuList,
  Typography,
  Divider,
  MenuItem,
  Button,
  Box,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

// Styled components for that "Premium" feel
const BadgeContentSpan = styled("span")(({ theme }) => ({
  width: 10,
  height: 10,
  borderRadius: "50%",
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  margin: "0 8px",
  borderRadius: theme.shape.borderRadius,
  padding: "10px 12px",
  transition: "all 0.2s",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    "& .MuiTypography-root": { color: theme.palette.primary.main },
    "& i": { color: theme.palette.primary.main },
  },
}));

const UserDropdown = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const router = useRouter();

  const handleToggle = () => setOpen((prev) => !prev);

  const handleClose = (event, url) => {
    if (url) router.push(url);
    // Prevents closing if clicking the toggle button itself (handled by handleToggle)
    if (anchorRef.current && anchorRef.current.contains(event?.target)) return;
    setOpen(false);
  };

  return (
    <>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={<BadgeContentSpan />}
        onClick={handleToggle}
        sx={{ cursor: "pointer" }}
      >
        <Avatar
          ref={anchorRef}
          alt="John Doe"
          src="/images/avatars/1.png"
          sx={{
            width: 40,
            height: 40,
            transition: "box-shadow 0.2s",
            boxShadow: open
              ? (theme) => `0 0 0 2px ${theme.palette.primary.main}`
              : "none",
          }}
        />
      </Badge>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="bottom-end"
        transition
        disablePortal
        sx={{ zIndex: 1200, mt: 1.5 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={250}>
            <Card sx={{ mt: 1.5 }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                  {/* User Profile Header */}
                  <Box
                    sx={{
                      px: 2,
                      py: 1.5,
                      backgroundColor: (theme) =>
                        alpha(theme.palette.primary.main, 0.02),
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar
                        src="/images/avatars/1.png"
                        sx={{ width: 44, height: 44 }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle2"
                          noWrap
                          sx={{ fontWeight: 600 }}
                        >
                          John Doe
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          admin@example.com
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 1 }} />

                  {/* Menu Items */}
                  {[
                    {
                      label: "My Profile",
                      icon: "ri-user-3-line",
                      url: "/profile",
                    },
                    {
                      label: "Settings",
                      icon: "ri-settings-4-line",
                      url: "/settings",
                    },
                    {
                      label: "Pricing",
                      icon: "ri-money-dollar-circle-line",
                      url: "/pricing",
                    },
                    { label: "FAQ", icon: "ri-question-line", url: "/faq" },
                  ].map((item) => (
                    <StyledMenuItem
                      key={item.label}
                      onClick={(e) => handleClose(e, item.url)}
                    >
                      <ListItemIcon sx={{ minWidth: "32px !important" }}>
                        <i
                          className={item.icon}
                          style={{ fontSize: "1.2rem" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          variant: "body2",
                          fontWeight: 500,
                        }}
                      />
                    </StyledMenuItem>
                  ))}

                  <Divider sx={{ my: 1 }} />

                  {/* Logout Action */}
                  <Box px={2} pb={1.5} pt={0.5}>
                    <Button
                      fullWidth
                      variant='contained'
                      color='error'
                      size='small'
                      endIcon={<i className='ri-logout-box-r-line' />}
                      onClick={e => handleDropdownClose(e, '/login')}
                      sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                    >
                      Logout
                    </Button>
                  </Box>
                </MenuList>
              </ClickAwayListener>
            </Card>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default UserDropdown;
