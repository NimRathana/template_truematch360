'use client';

import React from 'react';
import Grid from '@mui/material/Grid';
import {
  Autocomplete,
  Button,
  Checkbox,
  Fab,
  TextField,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Rating,
  ToggleButtonGroup,
  ToggleButton,
  Avatar,
  Badge,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Alert,
  LinearProgress,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Breadcrumbs,
  Link as MuiLink,
  BottomNavigation,
  BottomNavigationAction,
  Stepper,
  Step,
  StepLabel,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Box,
  Container,
  Stack,
  ImageList,
  ImageListItem,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme
} from '@mui/material';

import {
  Add as AddIcon,
  Edit as EditIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  ExpandMore as ExpandMoreIcon,
  Share as ShareIcon,

} from '@mui/icons-material';
import { useSettings } from '@core/hooks/useSettings';
import { useTranslation } from 'react-i18next';
import useVerticalNav from '@menu/hooks/useVerticalNav'

const StyleDemo = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const [slider, setSlider] = React.useState(65);
  const [rating, setRating] = React.useState(4.5);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [selectVal, setSelectVal] = React.useState(20);
  const [bottomNav, setBottomNav] = React.useState(0);
  const [toggleAlignment, setToggleAlignment] = React.useState('center');
  const { settings } = useSettings();
  const theme = useTheme();
  const { t } = useTranslation();
  const { isToggled, updateVerticalNavState } = useVerticalNav()

  const primaryColor = settings.primaryColor || theme.palette.primary.main;

  const speedDialActions = [
    { icon: <EditIcon />, name: 'Edit' },
    { icon: <FavoriteIcon />, name: 'Favorite' },
    { icon: <ShareIcon />, name: 'Share' },
  ];

  return (
    <Box>
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {[
          { title: 'Total Users', value: '12,458', change: '+18%', trend: 'up', color: primaryColor },
          { title: 'Revenue', value: '$84,920', change: '-2.4%', trend: 'down', color: '#FF4D4D' },
          { title: 'Projects', value: '237', change: '+31%', trend: 'up', color: '#4CAF50' },
        ].map((stat, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">{stat.title}</Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ mt: 1 }}>{stat.value}</Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: stat.color + '20', color: stat.color }}>
                    {stat.trend === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                  </Avatar>
                </Stack>
                <Typography variant="body2" sx={{ mt: 2, color: stat.trend === 'up' ? 'success.main' : 'error.main' }}>
                  {stat.change} from last month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={5}>

        {/* Inputs & Controls */}
        <Grid size={12}>
          <Card sx={{ borderRadius: 3 }}>
            <CardHeader 
              title="Inputs & Controls" 
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              sx={{ bgcolor: primaryColor, py: 3 }}
            />
            <CardContent>
              <Grid container spacing={6} sx={{ pt: 3 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField label="Full Name" fullWidth defaultValue="BRO" variant="outlined" sx={{ mb: 4 }} />
                  
                  <FormControl fullWidth>
                    <InputLabel>Experience Level</InputLabel>
                    <Select 
                      value={selectVal} 
                      onChange={(e) => setSelectVal(Number(e.target.value))}
                      label="Experience Level"
                    >
                      <MenuItem value={10}>Beginner</MenuItem>
                      <MenuItem value={20}>Intermediate</MenuItem>
                      <MenuItem value={30}>Advanced</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Autocomplete
                    sx={{ mt: 4 }}
                    freeSolo
                    options={['Dashboard', 'Analytics', 'Users', 'Projects', 'Settings']}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        placeholder="Search (Ctrl + K)" 
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography gutterBottom sx={{ fontWeight: 500 }}>Volume</Typography>
                  <Slider value={slider} onChange={(_, v) => setSlider(v)} sx={{ color: primaryColor }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">0</Typography>
                    <Typography variant="body2" color="text.secondary">100</Typography>
                  </Box>
                  <Stack direction="row" spacing={3} flexWrap="wrap" sx={{ mt: 4 }}>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => updateVerticalNavState({ isToggled: !isToggled })}>
                      Create New
                    </Button>
                    <Button variant="outlined" onClick={() => setDialogOpen(true)}>
                      Preview Changes
                    </Button>
                    <Fab color="primary" size="medium" onClick={() => setDialogOpen(true)}>
                      <AddIcon />
                    </Fab>
                  </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack spacing={4}>
                    <FormControlLabel control={<Switch defaultChecked color="primary" />} label="Enable Notifications" />
                    <FormControlLabel control={<Checkbox defaultChecked sx={{ color: primaryColor }} />} label="Remember my preferences" />
                    
                    <Box>
                      <Typography gutterBottom sx={{ fontWeight: 500 }}>Rating</Typography>
                      <Rating value={rating} onChange={(_, v) => setRating(v || 0)} precision={0.5} size="large" sx={{ color: primaryColor }} />
                    </Box>

                    <ToggleButtonGroup
                      value={toggleAlignment}
                      exclusive
                      onChange={(_, v) => v && setToggleAlignment(v)}
                      aria-label="text alignment"
                    >
                      <ToggleButton value="left">Left</ToggleButton>
                      <ToggleButton value="center">Center</ToggleButton>
                      <ToggleButton value="right">Right</ToggleButton>
                    </ToggleButtonGroup>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile + Quick Navigation + Feedback */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardHeader title="Profile Overview" titleTypographyProps={{ variant: 'h6', fontWeight: 600 }} />
            <CardContent sx={{ textAlign: 'center', pt: 3 }}>
              <Avatar sx={{ width: 110, height: 110, mx: 'auto', bgcolor: primaryColor, fontSize: 44, fontWeight: 700 }}>BRO</Avatar>
              <Typography variant="h6" sx={{ mt: 3 }}>{t('welcome')}, BRO 👋</Typography>
              <Typography color="text.secondary">Premium User • Level 12</Typography>

              <Stack direction="row" justifyContent="center" spacing={5} sx={{ mt: 6 }}>
                <Badge badgeContent={12} color="error" overlap="circular">
                  <Avatar sx={{ width: 68, height: 68, bgcolor: primaryColor }}>🔔</Avatar>
                </Badge>
                <Chip icon={<StarIcon />} label="VIP Member" color="primary" variant="filled" sx={{ px: 3, py: 1.5 }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardHeader title="Quick Navigation" titleTypographyProps={{ variant: 'h6', fontWeight: 600 }} />
            <CardContent>
              <List>
                {['Dashboard', 'Analytics', 'Projects', 'Users', 'Settings', 'Billing'].map((text) => (
                  <ListItem key={text} sx={{ borderRadius: 2, mb: 1 }} secondaryAction={<IconButton edge="end" size="small"><EditIcon fontSize="small" /></IconButton>}>
                    <ListItemIcon><AccountCircleIcon sx={{ color: primaryColor }} /></ListItemIcon>
                    <ListItemText primary={text} primaryTypographyProps={{ fontWeight: 500 }} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Feedback & Progress */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardHeader title="Feedback & Status" titleTypographyProps={{ variant: 'h6', fontWeight: 600 }} />
            <CardContent>
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>Operation completed successfully!</Alert>
              <Alert severity="info" sx={{ borderRadius: 2 }}>System update available</Alert>

              <Box sx={{ my: 5 }}>
                <Typography variant="body2" gutterBottom sx={{ fontWeight: 500 }}>Project Completion</Typography>
                <LinearProgress variant="determinate" value={82} sx={{ height: 5, borderRadius: 5, bgcolor: '#E6E8F0', '& .MuiLinearProgress-bar': { bgcolor: primaryColor } }} />
              </Box>

              <Stack direction="row" spacing={7} justifyContent="center">
                <CircularProgress size={40} sx={{ color: primaryColor }} thickness={5} />
                <CircularProgress size={40} color="secondary" thickness={5} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Accordion + Table */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, mb: 5 }}>
            <CardHeader title="FAQ / Accordion" />
            <CardContent>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  What is Materio?
                </AccordionSummary>
                <AccordionDetails>
                  A beautiful and powerful Material-UI admin dashboard template built with Next.js.
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>

          {/* Simple Table */}
          <Card sx={{ borderRadius: 3 }}>
            <CardHeader title="Recent Users" />
            <CardContent>
              <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell align="right">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {['John Doe', 'Sarah Chen', 'Mike Ross'].map((name, i) => (
                      <TableRow key={i}>
                        <TableCell>{name}</TableCell>
                        <TableCell>Developer</TableCell>
                        <TableCell align="right">
                          <Chip label="Active" color="primary" size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Tabs + Gallery + Stepper */}
        <Grid size={12}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ mb: 5 }}>
                <Tab label="Overview" />
                <Tab label="Components" />
                <Tab label="Gallery" />
              </Tabs>

              <Breadcrumbs sx={{ mb: 4 }}>
                <MuiLink underline="hover" color="inherit" href="#">Home</MuiLink>
                <MuiLink underline="hover" color="inherit" href="#">Demos</MuiLink>
                <Typography color="primary">Materio Style</Typography>
              </Breadcrumbs>

              <Typography variant="h6" gutterBottom>Image Gallery</Typography>
              <ImageList variant="masonry" cols={3} gap={16} sx={{ mb: 6 }}>
                {[1015, 133, 870, 106, 201, 28].map((id, i) => (
                  <ImageListItem key={i} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <img src={`https://picsum.photos/id/${id}/600/420`} alt={`img-${i}`} loading="lazy" style={{ borderRadius: '12px' }} />
                  </ImageListItem>
                ))}
              </ImageList>

              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>Progress Stepper</Typography>
              <Stepper activeStep={2} sx={{ mb: 6 }}>
                {['Planning', 'Design', 'Development', 'Testing', 'Launch'].map((label) => (
                  <Step key={label}><StepLabel>{label}</StepLabel></Step>
                ))}
              </Stepper>

              <BottomNavigation value={bottomNav} onChange={(_, v) => setBottomNav(v)} showLabels sx={{ borderRadius: 3 }}>
                <BottomNavigationAction label="Home" icon={<HomeIcon />} />
                <BottomNavigationAction label="Search" icon={<SearchIcon />} />
                <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
              </BottomNavigation>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Floating SpeedDial */}
      <SpeedDial ariaLabel="SpeedDial" sx={{ position: 'fixed', bottom: 40, right: 40 }} icon={<SpeedDialIcon />}>
        {speedDialActions.map((action) => (
          <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} />
        ))}
      </SpeedDial>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>This is a clean Materio-style component showcase.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: primaryColor }} onClick={() => { setDialogOpen(false); setSnackbarOpen(true); }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={() => setSnackbarOpen(false)} message="✅ Action completed successfully" anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />
    </Box>
  );
};

export default StyleDemo;