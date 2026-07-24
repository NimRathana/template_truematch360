'use client'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

const CardFacebook = () => {
  return (
    <Card sx={{ overflow: 'hidden' }}>
      <CardContent>

        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          
          {/* User Info */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar src="/images/avatars/1.png" sx={{ width: 48, height: 48 }} />

            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                Eugene Clarke
              </Typography>
              <Typography variant="caption" color="text.secondary">
                2h • 🌍 Public
              </Typography>
            </Box>
          </Stack>

          {/* Actions */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <i className="ri-facebook-fill text-3xl text-[#1877F2]" />
            <IconButton size="small">
              <i className="ri-more-fill text-2xl" />
            </IconButton>
          </Stack>
        </Stack>

        {/* Text */}
        <Typography sx={{ my: 3 }}>
          You've read about the importance of being courageous, rebellious and imaginative.
        </Typography>

        {/* Image */}
        <Box sx={{ mb: 4 }}>
          <img
            src="https://picsum.photos/id/1015/600/340"
            style={{ width: '100%', borderRadius: 12 }}
          />
        </Box>

        {/* Reactions */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          
          <Stack direction="row" spacing={1}>
            <Stack
              direction="row"
              sx={{
                '& > *:not(:first-of-type)': {
                  marginInlineStart: -0.5 // ✅ auto RTL safe
                }
              }}
            >
              <span>👍</span>
              <span>❤️</span>
            </Stack>

            <Typography variant="body2">2.5K</Typography>
          </Stack>

          <Stack direction="row" spacing={3}>
            <Typography variant="body2">124 Comments</Typography>
            <Typography variant="body2">89 Shares</Typography>
          </Stack>
        </Stack>

        <Divider />

        {/* Actions */}
        <Stack direction="row" justifyContent="space-around" mt={1}>
          <ActionButton icon="ri-thumb-up-line" label="Like" />
          <ActionButton icon="ri-chat-3-line" label="Comment" />
          <ActionButton icon="ri-share-line" label="Share" />
        </Stack>

      </CardContent>
    </Card>
  )
}

const ActionButton = ({ icon, label }) => (
  <IconButton sx={{ flex: 1, borderRadius: 2, gap: 1 }}>
    <i className={`${icon} text-2xl`} />
    <Typography variant="body2">{label}</Typography>
  </IconButton>
)

export default CardFacebook