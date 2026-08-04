import AssignmentIcon from "@mui/icons-material/Assignment";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import {
  Box,
  Card,
  Chip,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import api from "../services/api";

/* ================= STAT CARD ================= */
const StatCard = ({ icon, label, value, loading, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      p: 2.5,
      height: "100%",
      cursor: onClick ? "pointer" : "default",
      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": onClick
        ? {
            border: "1px solid var(--mui-palette-primary-main)"
          }
        : {},
    }}
  >
    <Stack direction="row" spacing={2} alignItems="center">
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: "var(--mui-shape-borderRadius)",
          background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 55%, #f97316 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          fontSize={12.5}
          fontWeight={500}
        >
          {label}
        </Typography>

        {loading ? (
          <Skeleton width={56} height={28} sx={{ mt: 0.5 }} />
        ) : (
          <Typography
            fontSize={24}
            fontWeight={800}
            lineHeight={1.2}
            color="primary.main"
          >
            {value ?? 0}
          </Typography>
        )}
      </Box>
    </Stack>
  </Card>
);

/* ================= STATUS CARD ================= */
const StatusCard = ({ title, children, loading }) => (
  <Card
    sx={{
      p: 2.5,
      height: "100%",
    }}
  >
    <Typography
      fontSize={13.5}
      fontWeight={700}
      mb={1.5}
      sx={{
        background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {title}
    </Typography>

    <Divider sx={{ mb: 2 }} />

    {loading ? <Skeleton height={32} /> : children}
  </Card>
);

/* ================= DASHBOARD ================= */
const AdminDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <Box>
      {/* ================= TOP STATS ================= */}
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(5, 1fr)",
        }}
        gap={2.5}
        mb={3.5}
      >
        <StatCard
          icon={<PeopleIcon />}
          label={t("total_users")}
          value={stats?.users?.total}
          loading={loading}
          onClick={() => router.push("/admin/user")}
        />
        <StatCard
          icon={<BusinessIcon />}
          label={t("total_companies")}
          value={stats?.employers?.total}
          loading={loading}
          onClick={() => router.push("/admin/employer")}
        />
        <StatCard
          icon={<WorkIcon />}
          label={t("total_jobs")}
          value={stats?.jobs?.total}
          loading={loading}
          onClick={() => router.push("/admin/jobs")}
        />
        <StatCard
          icon={<PersonIcon />}
          label={t("total_candidates")}
          value={stats?.candidates?.total}
          loading={loading}
          onClick={() => router.push("/admin/candidate")}
        />
        <StatCard
          icon={<AssignmentIcon />}
          label={t("applications_applied")}
          value={stats?.applications?.total}
          loading={loading}
        />
      </Box>

      {/* ================= STATUS SECTION ================= */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }}
        gap={2.5}
      >
        {/* Users Status */}
        <StatusCard title={t("users_status")} loading={loading}>
          <Stack direction="row" spacing={1.2} flexWrap="wrap" useFlexGap>
            <Chip
              label={`${t("active")}: ${stats?.users?.active ?? 0}`}
              sx={{
                fontWeight: 600,
                fontSize: 12,
                height: 28,
                bgcolor: "#10b981",
                color: "#fff",
                "& .MuiChip-label": { px: 1.5 },
              }}
            />
            <Chip
              label={`${t("inactive")}: ${stats?.users?.inactive ?? 0}`}
              sx={{
                fontWeight: 600,
                fontSize: 12,
                height: 28,
                bgcolor: "#f97316",
                color: "#fff",
                "& .MuiChip-label": { px: 1.5 },
              }}
            />
          </Stack>
        </StatusCard>

        {/* Jobs Status */}
        <StatusCard title={t("jobs_status")} loading={loading}>
          <Stack direction="row" spacing={1.2} flexWrap="wrap" useFlexGap>
            <Chip
              label={`${t("open")}: ${stats?.jobs?.open ?? 0}`}
              sx={{
                fontWeight: 600,
                fontSize: 12,
                height: 28,
                bgcolor: "#10b981",
                color: "#fff",
                "& .MuiChip-label": { px: 1.5 },
              }}
            />
            <Chip
              label={`${t("closed")}: ${stats?.jobs?.closed ?? 0}`}
              sx={{
                fontWeight: 600,
                fontSize: 12,
                height: 28,
                bgcolor: "#ef4444",
                color: "#fff",
                "& .MuiChip-label": { px: 1.5 },
              }}
            />
          </Stack>
        </StatusCard>

        {/* Applications Status */}
        <StatusCard title={t("applications_status")} loading={loading}>
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr 1fr", sm: "repeat(2, 1fr)" }}
            gap={1.2}
          >
            <Chip
              label={`${t("pending")}: ${stats?.applications?.pending ?? 0}`}
              sx={{
                width: "100%",
                fontWeight: 600,
                fontSize: 12,
                height: 28,
                bgcolor: "#f97316",
                color: "#fff",
              }}
            />
            <Chip
              label={`${t("shortlisted")}: ${stats?.applications?.shortlisted ?? 0}`}
              sx={{
                width: "100%",
                fontWeight: 600,
                fontSize: 12,
                height: 28,
                bgcolor: "#3b82f6",
                color: "#fff",
              }}
            />
            <Chip
              label={`${t("rejected")}: ${stats?.applications?.rejected ?? 0}`}
              sx={{
                width: "100%",
                fontWeight: 600,
                fontSize: 12,
                height: 28,
                bgcolor: "#ef4444",
                color: "#fff",
              }}
            />
            <Chip
              label={`${t("accepted")}: ${stats?.applications?.accepted ?? 0}`}
              sx={{
                width: "100%",
                fontWeight: 600,
                fontSize: 12,
                height: 28,
                bgcolor: "#10b981",
                color: "#fff",
              }}
            />
          </Box>
        </StatusCard>
      </Box>
    </Box>
  );
};

export default AdminDashboard;