"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createRoot } from "react-dom/client";
import html2pdf from "html2pdf.js";
import useAuthStore from "@views/store/useAuthStore";
import api from "@/services/api";
import { useTranslation } from "react-i18next";
import ChangePasswordDialog from '@views/components/ChangePasswordDialog';

// CV Templates
import BlueSidebarModern from "@views/pages/cv_template/BlueSidebarModern";
import ClassicSoftwareCV from "@views/pages/cv_template/ClassicCV";
import SidebarTechTemplate from "@views/pages/cv_template/SidebarTechTemplate";

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
  Collapse,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

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
  const [openCv, setOpenCv] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const anchorRef = useRef(null);
  const router = useRouter();
  const { t } = useTranslation();
  const { user_data, clearAccessToken } = useAuthStore();

  const profileFilename = user_data?.user_data?.profile_image;
  const profileUrl = profileFilename && profileFilename !== 'null' && profileFilename !== 'undefined' ? `${(process.env.VITE_API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : ''))}/uploads/user/profile/${profileFilename}` : undefined;
  const userName = user_data?.user_data?.user_name || user_data?.user_data?.email || "User";
  const userEmail = user_data?.user_data?.email || "—";
  const userType = user_data?.user_data?.user_type;

  // Same CV templates as Topbar
  const cvTemplates = [
    { name: t("blue_sidebar_modern"), id: "blue-sidebar-modern" },
    { name: t("sidebar_tech_template"), id: "sidebar-tech-template" },
    { name: t("classic_software_cv"), id: "classic-software" },
  ];

  const cvTemplateMap = {
    "blue-sidebar-modern": BlueSidebarModern,
    "sidebar-tech-template": SidebarTechTemplate,
    "classic-software": ClassicSoftwareCV,
  };

  const handleOpenChangePassword = () => {
    setOpen(false);
    setOpenChangePassword(true);
  };

  const handleCloseChangePassword = () => {
    setOpenChangePassword(false);
  };

  const handleToggle = () => setOpen((prev) => !prev);

  const handleClose = (event, url) => {
    if (url) router.push(url);
    if (anchorRef.current && anchorRef.current.contains(event?.target)) return;
    setOpen(false);
    setOpenCv(false);
  };

  const handleLogout = async (event, url) => {
    event?.preventDefault();
    const token = useAuthStore.getState().access_token || (typeof window !== "undefined" ? window.localStorage.getItem("access_token") : null);

    try {
      clearAccessToken();
    } catch (err) {
      console.warn("clearAccessToken failed", err);
    }

    setOpen(false);
    setOpenCv(false);

    if (url) router.push(url);

    try {
      await api.post("/user/logout", null, {
        headers: token ? { Authorization: "Bearer " + token } : {},
      });
    } catch (err) {
      console.warn("Logout API failed (ignored):", err?.message || err);
    }
  };

  const DownloadCvTemplate = async (template) => {
    try {
      const [candidateRes, profileRes] = await Promise.all([
        api.get("/candidate/me"),
        api.get("/user/profile"),
      ]);

      const candidate = candidateRes.data || {};
      const profile = profileRes.data || {};
      const mergedData = { ...candidate, ...profile };

      const TemplateComponent = cvTemplateMap[template.id];
      if (!TemplateComponent) throw new Error("Template not found");

      exportPdfFromComponent(
        TemplateComponent,
        mergedData,
        `cv-${template.id}.pdf`,
      );
    } catch (error) {
      console.error("Error downloading CV template:", error);
    }
  };

  const exportPdfFromComponent = (Component, data, filename = "cv.pdf") => {
    const tempDiv = document.createElement("div");
    const root = createRoot(tempDiv);
    root.render(<Component candidate={data} />);

    setTimeout(() => {
      html2pdf()
        .set({
          margin: 0,
          filename,
          html2canvas: { scale: 2, useCORS: true },
          pagebreak: { mode: "avoid-all" },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(tempDiv)
        .save()
        .then(() => {
          root.unmount();
          tempDiv.remove();
        })
        .catch((err) => console.error("PDF export failed:", err));
    }, 50);
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
          alt={userName}
          src={profileUrl}
          sx={{
            width: 40,
            height: 40,
            transition: "box-shadow 0.2s",
            boxShadow: open ? (theme) => `0 0 0 2px ${theme.palette.primary.main}` : "none",
          }}
        >
          {!profileUrl && userName?.[0]?.toUpperCase()}
        </Avatar>
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
            <Card sx={{ mt: 1.5, minWidth: 240, maxWidth: 320 }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                  {/* User Profile Header */}
                  <Box
                    sx={{
                      px: 2,
                      py: 1.5,
                      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.02),
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar src={profileUrl} sx={{ width: 44, height: 44 }}>
                        {!profileUrl && userName?.[0]?.toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          noWrap
                          sx={{ fontWeight: 600 }}
                        >
                          {userName}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          {userEmail}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 1 }} />

                  {/* Update Profile */}
                  <StyledMenuItem onClick={(e) => handleClose(e, "/update_profile")}>
                    <ListItemIcon sx={{ minWidth: "32px !important" }}>
                      <i
                        className="ri-user-3-line"
                        style={{ fontSize: "1.2rem" }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={t("update_profile")}
                      primaryTypographyProps={{
                        variant: "body2",
                        fontWeight: 500,
                      }}
                    />
                  </StyledMenuItem>

                  {/* CV Templates (only for Candidate - user_type 3) */}
                  {userType === 3 && (
                    <StyledMenuItem onClick={() => setOpenCv((prev) => !prev)}>
                      <ListItemIcon sx={{ minWidth: "32px !important" }}>
                        <i
                          className="ri-file-list-3-line"
                          style={{ fontSize: "1.2rem" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={t("cv_templates")}
                        primaryTypographyProps={{
                          variant: "body2",
                          fontWeight: 500,
                        }}
                      />
                      {openCv ? (
                        <ExpandLess fontSize="small" />
                      ) : (
                        <ExpandMore fontSize="small" />
                      )}
                    </StyledMenuItem>
                  )}

                  {userType === 3 && (
                    <Collapse in={openCv} timeout="auto" unmountOnExit>
                      <Box sx={{ pl: 2, pr: 1, pb: 0.5 }}>
                        {cvTemplates.map((template) => (
                          <StyledMenuItem
                            key={template.id}
                            onClick={() => {
                              DownloadCvTemplate(template);
                              setOpen(false);
                              setOpenCv(false);
                            }}
                          >
                            <ListItemText
                              primary={template.name}
                              primaryTypographyProps={{
                                variant: "body2",
                                fontSize: "0.875rem",
                              }}
                            />
                          </StyledMenuItem>
                        ))}
                      </Box>
                    </Collapse>
                  )}

                  {/* Change Password */}
                  <StyledMenuItem onClick={handleOpenChangePassword}>
                    <ListItemIcon sx={{ minWidth: "32px !important" }}>
                      <i
                        className="ri-lock-password-line"
                        style={{ fontSize: "1.2rem" }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={t("change_password")}
                      primaryTypographyProps={{
                        variant: "body2",
                        fontWeight: 500,
                      }}
                    />
                  </StyledMenuItem>

                  <Divider sx={{ my: 1 }} />
 
                  {/* Logout */}
                  <Box px={2} pb={1.5} pt={0.5}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="error"
                      size="small"
                      endIcon={<i className="ri-logout-box-r-line" />}
                      onClick={(e) => handleLogout(e, "/login")}
                      sx={{
                        "& .MuiButton-endIcon": { marginInlineStart: 1.5 },
                      }}
                    >
                      {t("logout")}
                    </Button>
                  </Box>
                </MenuList>
              </ClickAwayListener>
            </Card>
          </Fade>
        )}
      </Popper>

      <ChangePasswordDialog
        open={openChangePassword}
        onClose={handleCloseChangePassword}
      />
    </>
  );
};
export default UserDropdown;
