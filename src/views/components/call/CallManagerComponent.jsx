'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Box, Avatar, Typography, Stack, IconButton } from '@mui/material'
import CallIcon from '@mui/icons-material/Call'
import CallEndIcon from '@mui/icons-material/CallEnd'
import CallRoom from '../chat/CallRoom'
import useAuthStore from '@views/store/useAuthStore'
import { useGlobalWebSocket } from '@views/hooks/useGlobalWebSocket'

export default function CallManagerComponent() {
    const [incomingCall, setIncomingCall] = useState(null)
    const [activeCallRoom, setActiveCallRoom] = useState(null)
    const [userData, setUserData] = useState(null)
    const [remoteParticipants, setRemoteParticipants] = useState([])
    const [firstData, setFirstData] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const ringtoneRef = useRef(null)
    const userId = useAuthStore((s) => s.user_data?.pk_id)
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
    const ringtone = '/sounds/ringing1.mp3';

    const handleGlobalEvent = useCallback((data) => {
        switch (data.type) {
            case "call.incoming":
                setIncomingCall({
                    roomId: data.roomId,
                    fromUserId: data.fromUserId,
                    fromUsername: data.fromUsername,
                    profileImage: data.fromProfileImage,
                    mode: data.mode || "video"
                })
                setUserData({
                    username: data.fromUsername,
                    profileImage: data.fromProfileImage,
                    mode: data.mode || "video"
                })
                setRemoteParticipants([{
                    userId: data.fromUserId,
                    username: data.fromUsername,
                    profileImage: data.fromProfileImage,
                    mic: true,
                    cam: true
                }])
                setFirstData(data.mode || "video")
                break

            case "call.accepted":
                setIncomingCall(null)
                setActiveCallRoom({ roomId: data.roomId, mode: data.mode })
                setUserData({
                    username: data.fromUsername,
                    profileImage: data.fromProfileImage,
                    mode: data.mode || "video"
                })
                setRemoteParticipants([{
                    userId: data.fromUserId,
                    username: data.fromUsername,
                    mic: true,
                    cam: true
                }])
                setFirstData(data.mode || "video")
                break

            case "call.restore":
                setIncomingCall(null)
                setActiveCallRoom({ roomId: data.roomId, mode: data.mode })
                setUserData({
                    username: data.fromUsername,
                    profileImage: data.fromProfileImage,
                    mode: data.mode
                })
                setRemoteParticipants([{
                    userId: data.fromUserId,
                    username: data.fromUsername,
                    profileImage: data.fromProfileImage,
                    mic: true,
                    cam: true
                }])
                setFirstData(data.mode)
                break

            case "call.declined":
            case "call.missed":
            case "call.ended":
                setIncomingCall(null)
                setActiveCallRoom(null)
                break

            case "call.toggle":
                const { mic, cam, fromUserId } = data
                setRemoteParticipants((prev) =>
                    prev.map((p) =>
                        p.userId === fromUserId ? { ...p, mic, cam } : p
                    )
                )
                if (cam) setFirstData(null)
                break

            default:
                break
        }
    }, [])

    const { send } = useGlobalWebSocket(handleGlobalEvent)

    const acceptCall = () => {
        if (!incomingCall || isProcessing) return
        setIsProcessing(true)
        send({
            type: "call.accept",
            payload: { room_id: incomingCall.roomId, mode: incomingCall.mode }
        })
        setActiveCallRoom(incomingCall)
        setIncomingCall(null)
        setIsProcessing(false)
    }

    const declineCall = () => {
        if (!incomingCall || isProcessing) return
        setIsProcessing(true)
        send({
            type: "call.decline",
            payload: { room_id: incomingCall.roomId }
        })
        setIncomingCall(null)
        setIsProcessing(false)
    }

    const endCall = () => {
        if (!activeCallRoom) return
        send({
            type: "call.end",
            payload: { room_id: activeCallRoom.roomId }
        })
        setActiveCallRoom(null)
        setIncomingCall(null)
    }

    // Ringtone setup
    useEffect(() => {
        if (incomingCall === null) return;

        ringtoneRef.current = new Audio(ringtone)
        ringtoneRef.current.loop = true
    }, [])

    useEffect(() => {
        if (incomingCall === null) return;

        const unlockAudio = () => {
            if (ringtoneRef.current) {
                ringtoneRef.current.play().then(() => {
                    ringtoneRef.current.pause()
                    ringtoneRef.current.currentTime = 0
                })
            }
            window.removeEventListener("click", unlockAudio)
        }
        window.addEventListener("click", unlockAudio)
        return () => window.removeEventListener("click", unlockAudio)
    }, [])

    useEffect(() => {
        if (incomingCall === null) return;

        if (!ringtoneRef.current) return
        if (incomingCall && !activeCallRoom) {
            ringtoneRef.current.play().catch(() => { })
        } else {
            ringtoneRef.current.pause()
            ringtoneRef.current.currentTime = 0
        }
    }, [incomingCall, activeCallRoom])

    return (
        <>
            {activeCallRoom && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1600,
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#676767b0',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 2,
                    }}
                >
                    <CallRoom
                        roomId={activeCallRoom.roomId}
                        userId={userId}
                        mode={userData?.mode}
                        onEndCall={endCall}
                        userData={userData}
                        send={send}
                        remoteParticipants={remoteParticipants}
                        firstData={firstData}
                        BASE_URL={BASE_URL}
                    />
                </Box>
            )}

            {incomingCall && !activeCallRoom && (
                <Box
                    sx={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 1600,
                        background: 'linear-gradient(180deg, #303030 0%, #111 100%)',
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: 'center',
                        py: 8,
                        px: 3,
                    }}
                >
                    <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box
                            sx={{
                                position: 'relative',
                                width: 130,
                                height: 130,
                                mb: 3,
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    inset: -10,
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255,255,255,0.15)',
                                    animation: 'pulse 1.8s infinite',
                                },
                                '@keyframes pulse': {
                                    '0%': { transform: 'scale(1)', opacity: 0.8 },
                                    '70%': { transform: 'scale(1.35)', opacity: 0 },
                                    '100%': { opacity: 0 },
                                },
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 130,
                                    height: 130,
                                    fontSize: 45,
                                    border: '4px solid rgba(255,255,255,0.25)',
                                    backgroundColor: '#555',
                                    position: 'relative',
                                    zIndex: 1,
                                }}
                                src={`${BASE_URL}/uploads/user/profile/${incomingCall.profileImage}`}
                            >
                                {incomingCall.fromUsername.charAt(0).toUpperCase()}
                            </Avatar>
                        </Box>
                        <Typography variant="h5" fontWeight={700} mb={1}>
                            {incomingCall.fromUsername}
                        </Typography>
                        <Typography variant="body1" color="rgba(255,255,255,0.75)" fontSize={16}>
                            {incomingCall.mode === "video" ? "Incoming Video Call" : "Incoming Audio Call"}
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={5} mb={5}>
                        <Box textAlign="center">
                            <IconButton
                                onClick={acceptCall}
                                disabled={isProcessing}
                                sx={{
                                    width: 75,
                                    height: 75,
                                    backgroundColor: '#22c55e',
                                    color: 'white',
                                    boxShadow: '0 8px 25px rgba(34,197,94,0.45)',
                                    '&:hover': { backgroundColor: '#16a34a', transform: 'scale(1.05)' },
                                    transition: '0.2s ease',
                                }}
                            >
                                <CallIcon sx={{ fontSize: 36 }} />
                            </IconButton>
                            <Typography variant="caption" display="block" mt={1} color="rgba(255,255,255,0.7)">
                                Accept
                            </Typography>
                        </Box>
                        <Box textAlign="center">
                            <IconButton
                                onClick={declineCall}
                                disabled={isProcessing}
                                sx={{
                                    width: 75,
                                    height: 75,
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    boxShadow: '0 8px 25px rgba(239,68,68,0.45)',
                                    '&:hover': { backgroundColor: '#dc2626', transform: 'scale(1.05)' },
                                    transition: '0.2s ease',
                                }}
                            >
                                <CallEndIcon sx={{ fontSize: 36 }} />
                            </IconButton>
                            <Typography variant="caption" display="block" mt={1} color="rgba(255,255,255,0.7)">
                                Decline
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            )}
        </>
    )
}
