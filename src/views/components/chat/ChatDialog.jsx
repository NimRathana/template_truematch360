import { Box } from '@mui/material'
import ChatPage from '../../pages/ChatPage'

function ChatDialog({ open, onClose, initialChat = null }) {
    if (!open) return null

    return (
        <Box
            open={open}
            sx={{
                position: 'fixed',
                right: 0,
                top: 60,
            }}
        >
            <ChatPage onClose={onClose} initialChat={initialChat}/>
        </Box>
    )
}

export default ChatDialog
