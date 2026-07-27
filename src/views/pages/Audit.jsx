import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import api from "../services/api";

const Audit = () => {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);

  const fetchAuditTraces = async () => {
    try {
      const response = await api.get("/audit-trace");
      setRows(response.data || []);
    } catch (err) {
      console.log("Error fetching audit traces:", err);
    }
  };

  useEffect(() => {
    fetchAuditTraces();
  }, []);

  /* ================= Columns ================= */
  const columns = [
    {
      field: "action_datetime",
      headerName: t('action_datetime'),
      flex: 1,
      minWidth: 180,
    },
    {
      field: "user_action",
      headerName: t('user_action'),
      flex: 1,
      minWidth: 150,
    },
    {
      field: "action",
      headerName: t('action'),
      flex: 1,
      minWidth: 120,
    },
    {
      field: "detail_information",
      headerName: t('detail_information'),
      flex: 3,
      minWidth: 250,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "ip",
      headerName: t('ip_address'),
      flex: 0.5,
      minWidth: 120,
    },
  ];

  return (
    <Box
      sx={{
        height: "calc(100vh - 120px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* DataGrid Container */}
      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.pk_id}
          pageSizeOptions={[18, 25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 18, page: 0 } },
          }}
          disableRowSelectionOnClick
          rowHeight={52}
          density="compact"
          getRowHeight={() => "auto"}
        />
      </Box>
    </Box>
  );
};

export default Audit;
