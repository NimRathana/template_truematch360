import { Box, Typography, Stack, IconButton, Avatar } from '@mui/material';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { useTranslation } from 'react-i18next';

function CallRequestDialog({ callRequest, onDeclinedCall, isCallBusy, BASE_URL }) {
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                position: 'fixed',
                inset: 0,
                zIndex: 1600,
                background: 'var(--mui-palette-background-paper)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 8,
                px: 3,
                textAlign: 'center',
            }}
        >
            {/* Caller Info */}
            <Box sx={{ mt: 5 }}>
                <Box
                    sx={{
                        position: 'relative',
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        mb: 3,
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            inset: -8,
                            borderRadius: '50%',
                            animation: 'pulse 1.8s infinite',
                        },
                        '@keyframes pulse': {
                            '0%': {
                                transform: 'scale(1)',
                                opacity: 0.8,
                            },
                            '70%': {
                                transform: 'scale(1.3)',
                                opacity: 0,
                            },
                            '100%': {
                                opacity: 0,
                            },
                        },
                    }}
                >
                    <Avatar
                        sx={{
                            width: 120,
                            height: 120,
                            fontSize: 42,
                            position: 'relative',
                            zIndex: 1,
                        }}
                        src={`${BASE_URL}/uploads/user/profile/${callRequest.profile_image}`}
                    >
                        {callRequest.username?.charAt(0).toUpperCase()}
                    </Avatar>
                </Box>

                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700,
                        mb: 1,
                    }}
                >
                    {callRequest.username}
                </Typography>

                <Typography
                    variant="body1"
                >
                    {isCallBusy ? t('user_in_another_call', { username: callRequest.username }) : t('calling_to', { username: callRequest.username })}
                </Typography>
            </Box>


            {/* Call Button */}
            <Stack
                direction="row"
                spacing={3}
                sx={{
                    mb: 5,
                }}
            >
                <IconButton
                    onClick={() => onDeclinedCall(callRequest.room_id)}
                    sx={{
                        width: 70,
                        height: 70,
                        bgcolor: (theme) => `${theme.palette.error.main} !important`,
                        color: 'white',
                        transition: '0.2s ease',
                        "&:hover": {
                            transform: "scale(1.1)",
                        },
                    }}
                >
                    <CallEndIcon sx={{ fontSize: 34 }} />
                </IconButton>
            </Stack>
        </Box>
    )
}

export default CallRequestDialog;
