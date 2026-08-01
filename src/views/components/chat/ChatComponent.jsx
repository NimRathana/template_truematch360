import {
    ArrowBack as ArrowBackIcon,
    EmojiEmotions as EmojiEmotionsIcon,
    InsertEmoticon as InsertEmoticonIcon,
} from '@mui/icons-material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CallIcon from '@mui/icons-material/Call';
import CloseIcon from '@mui/icons-material/Close';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import VideocamIcon from '@mui/icons-material/Videocam';
import { Alert, AppBar, Avatar, Box, CircularProgress, IconButton, Paper, Snackbar, TextField, Toolbar, Typography, Button } from "@mui/material";
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import ChatMenuDialog from './dialog/ChatMenuDialog';
import EmojiPicker from './EmojiPicker';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import DeleteDialog from './dialog/DeleteDialog';
import ForwardDialog from './dialog/ForwardDialog';
import MediaPreviewDialog from './dialog/MediaPreviewDialog';
import PinnedMessageComponent from './PinnedMessageComponent';
import imageCompression from "browser-image-compression";
import { saveUpload, getUploads, removeUpload } from '../../hooks/saveUpload';

const FILE_RULES = {
    image: { extensions: new Set(['jpg', 'jpeg', 'png', 'gif', 'webp']) },
    voice: { extensions: new Set(['webm', 'ogg', 'm4a', 'mp3', 'wav']) },
    video: { extensions: new Set(['mp4', 'webm', 'mov', 'mkv', 'avi']) },
    file: { extensions: new Set(['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'zip']) },
};

const MAX_SIZE = 500 * 1024 * 1024; // 500MB

function ChatComponent({ chat, onBack, messages, setMessages, send, currentUserId, isOnline, typingUsers, messagesRef, onScroll, loadingOlderRef, loadingOlder, hasMore, messagesEndRef, pinMessage, reactionsData, onStartCall, blockMessage, scrollToMessage, highlightedMessageId }) {
    const { t } = useTranslation();
    const BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : ''));
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);
    const fileInputRef = useRef(null);

    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [recordTime, setRecordTime] = useState(0);

    const [showContent, setSowContent] = useState(false);
    const emojiButtonRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [popup, setPopup] = useState(false);
    const [editingMessage, setEditingMessage] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);

    const typingTimeoutRef = useRef(null);
    const isTypingRef = useRef(false);
    const prevMessageCountRef = useRef(0);
    const justOpenedChatRef = useRef(false);
    const [error, setError] = useState('');
    const [openConfirm, setOpenConfirm] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);

    const [forwardOpen, setForwardOpen] = useState(false);
    const [forwardMessage, setForwardMessage] = useState(null);
    const [forwardRooms, setForwardRooms] = useState([]);
    const [selectedRooms, setSelectedRooms] = useState(new Set());
    const [loadingRooms, setLoadingRooms] = useState(false);
    const [roomOffset, setRoomOffset] = useState(0);
    const [roomsHasMore, setRoomsHasMore] = useState(true);

    const ROOM_LIMIT = 10;

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewIndex, setPreviewIndex] = useState(0);
    const [previewMedia, setPreviewMedia] = useState('');
    const mediaMessages = messages.filter(msg => {
        if (!['image', 'video'].includes(msg.type)) return false;
        if (!msg.file_url) return false; // skip if no URL
        return true;
    });

    const [uploadingFiles, setUploadingFiles] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const isUploading = isSending || uploadingFiles.length > 0;
    const [deleting, setDeleting] = useState(false);

    const [selectedMessages, setSelectedMessages] = useState([]);
    const [selectMode, setSelectMode] = useState(false);
    const [confirmSelectedDelete, setConfirmSelectedDelete] = useState(false);

    const checkMediaUrl = async (url) => {
        try {
            const res = await fetch(url, { method: 'HEAD' });
            return res.ok;
        } catch {
            return false;
        }
    };

    const handleOpenPreview = async (message) => {
        const validMedia = await Promise.all(mediaMessages.map(async (msg) => {
            const isValid = await checkMediaUrl(`${BASE_URL}${msg.file_url}`);
            return isValid ? msg : null;
        }));
        const filtered = validMedia.filter(Boolean);

        const index = filtered.findIndex(m => m.id === message.id);
        if (index !== -1) {
            setPreviewMedia(filtered); // store only valid media
            setPreviewIndex(index);
            setPreviewOpen(true);
        }
    };

    const handleClosePreview = () => setPreviewOpen(false);

    const handlePrevPreview = () => {
        setPreviewIndex((prev) => (prev > 0 ? prev - 1 : mediaMessages.length - 1));
    }

    const handleNextPreview = () => {
        setPreviewIndex((prev) => (prev < mediaMessages.length - 1 ? prev + 1 : 0));
    }

    const startTyping = () => {
        if (!isTypingRef.current) {
            isTypingRef.current = true;
            send({ type: "typing", is_typing: true });
        }

        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(stopTyping, 1200);
    };

    const stopTyping = () => {
        if (isTypingRef.current) {
            isTypingRef.current = false;
            send({ type: "typing", is_typing: false });
        }
        clearTimeout(typingTimeoutRef.current);
    };

    const onInputChange = (e) => {
        const value = e.target.value;
        setNewMessage(value);

        if (value.trim()) {
            startTyping();
        } else {
            stopTyping();
        }
    };

    useEffect(() => {
        return () => stopTyping();
    }, []);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];
        setIsRecording(true);
        setRecordTime(0);

        timerRef.current = setInterval(() => {
            setRecordTime((t) => t + 1);
        }, 1000);

        mediaRecorderRef.current.ondataavailable = (e) => {
            audioChunksRef.current.push(e.data);
        };

        mediaRecorderRef.current.onstop = () => {
            clearInterval(timerRef.current);
        };

        mediaRecorderRef.current.start();
    };

    const cancelRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        setAudioBlob(null);
        setIsRecording(false);
        clearInterval(timerRef.current);
    };

    // Helper to stop and get blob for sending
    const stopRecordingAndGetBlob = () => {
        return new Promise((resolve) => {
            if (!mediaRecorderRef.current) return resolve(null);

            const recorder = mediaRecorderRef.current;

            recorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                clearInterval(timerRef.current);
                resolve(blob);
            };

            recorder.stop();
            setIsRecording(false);
            clearInterval(timerRef.current);
        });
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth',
        });
    };

    const isNearBottom = (threshold = 50) => {
        const el = messagesRef.current;
        if (!el) return false;

        return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    };

    const replaceTempMessage = (tempId, serverMessage) => {
        setMessages(prev => {
            const exists = prev.some(
                m => m.id === serverMessage.id
            );

            if (exists) {
                return prev.filter(m => m.id !== tempId);
            }

            return prev.map(m =>
                m.id === tempId
                    ? { ...serverMessage, client_id: tempId }
                    : m
            );
        });
    };

    useEffect(() => {
        if (!chat?.room_id) return;

        justOpenedChatRef.current = true;

        const timer = setTimeout(() => {
            scrollToBottom();
            justOpenedChatRef.current = false;
        }, 50);

        return () => clearTimeout(timer);
    }, [chat?.room_id]);

    useEffect(() => {
        const prevCount = prevMessageCountRef.current;
        const currentCount = messages.length;

        if (
            currentCount > prevCount &&
            !loadingOlderRef.current &&
            isNearBottom()
        ) {
            scrollToBottom();
        }

        prevMessageCountRef.current = currentCount;
    }, [messages]);

    const addMessage = (msg) => {
        setMessages(prev => {

            if (prev.some(m => m.id === msg.id)) {
                return prev;
            }

            if (msg.client_id) {
                const tempExists = prev.some(
                    m => m.id === msg.client_id
                );

                if (tempExists) {
                    return prev.map(m =>
                        m.id === msg.client_id
                            ? msg
                            : m
                    );
                }
            }

            return [...prev, msg];
        });

        if (isNearBottom()) {
            setTimeout(scrollToBottom, 50);
        }
    };

    async function resumeUploads() {
        const uploads = (await getUploads()).filter(
            u => u.roomId === chat.room_id
        );

        setMessages(prev => {
            const ids = new Set(prev.map(m => m.id));

            return [
                ...prev,
                ...uploads
                    .filter(item => !ids.has(item.id))
                    .map(item => ({
                        id: item.id,
                        sender_id: currentUserId,
                        type: item.type,
                        file: item.file,
                        preview: item.preview,
                        content: item.file.name,
                        isUploading: true,
                        progress: 0,
                    })),
            ];
        });

        // Upload each file
        for (const item of uploads) {
            try {
                const res = await uploadFileMessage({
                    file: item.file,
                    type: item.type,
                    caption: item.caption,
                    onUploadProgress: (e) => {
                        const progress = Math.round(
                            (e.loaded * 100) / e.total
                        );

                        setMessages(prev =>
                            prev.map(msg =>
                                msg.id === item.id
                                    ? { ...msg, progress }
                                    : msg
                            )
                        );
                    },
                });

                // Replace temporary message with server message
                setMessages(prev =>
                    prev.map(msg =>
                        msg.id === item.id ? res.data : msg
                    )
                );

                await removeUpload(item.id);

            } catch (err) {
                console.error(err);

                setMessages(prev =>
                    prev.map(msg =>
                        msg.id === item.id
                            ? {
                                ...msg,
                                failed: true,
                                isUploading: false,
                            }
                            : msg
                    )
                );
            }
        }
    }

    useEffect(() => {
        if (!chat?.room_id) return;

        resumeUploads();

    }, [chat?.room_id]);

    const compressImage = async (file) => {
        if (!file.type.startsWith("image/")) {
            return file;
        }

        const options = {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1200,
            useWebWorker: true,
            initialQuality: 0.75,
        };

        try {
            const compressed = await imageCompression(file, options);

            return new File(
                [compressed],
                file.name,
                {
                    type: compressed.type || file.type,
                    lastModified: Date.now(),
                }
            );
        } catch (error) {
            console.error("Image compression error:", error);
            return file;
        }
    };

    const handleFileSelect = async (e) => {
        if (isRecording || audioBlob) return;

        const files = Array.from(e.target.files);

        const invalidTypes = files.filter((file) => {
            const ext = file.name.split('.').pop().toLowerCase();
            return !Object.values(FILE_RULES).some((rule) =>
                rule.extensions.has(ext)
            );
        });

        if (invalidTypes.length > 0) {
            const messages = invalidTypes.map(
                (f) => `${f.name} (${t('invalid_type')})`
            );

            setError(t('invalid_files', { files: messages.join(', ') }));
            e.target.value = '';
            return;
        }

        const processedFiles = await Promise.all(
            files.map(file => compressImage(file))
        );

        const oversizedFiles = processedFiles.filter(
            (file) => file.size > MAX_SIZE
        );

        if (oversizedFiles.length > 0) {
            setError(
                t('invalid_files', {
                    files: oversizedFiles.map(f => f.name).join(', ')
                })
            );
            e.target.value = '';
            return;
        }

        const uploads = [];

        for (const file of processedFiles) {
            const upload = {
                id: crypto.randomUUID(),
                roomId: chat.room_id,
                file,
                preview: file.type.startsWith("image/")
                    ? URL.createObjectURL(file)
                    : null,
                type: getFileType(file),
                caption: "",
                status: "pending",
            };

            await saveUpload(upload);
            uploads.push(upload);
        }

        setSelectedFiles(prev => [...prev, ...uploads]);

        e.target.value = '';
    };

    const removeFile = async (id) => {
        await removeUpload(id);

        setSelectedFiles(prev =>
            prev.filter(item => item.id !== id)
        );
    };

    const getFileType = (file) => {
        if (file.type.startsWith('image/')) return 'image';
        if (file.type.startsWith('audio/')) return 'voice';
        if (file.type.startsWith('video/')) return 'video';
        return 'file';
    };

    const uploadFileMessage = async ({ file, type, caption, onUploadProgress, }) => {
        const formData = new FormData();
        formData.append("room_id", chat.room_id);
        formData.append("type", type);  // "image" | "voice"
        if (caption) formData.append("content", caption);
        if (replyingTo) formData.append("reply_to_id", replyingTo.id);
        formData.append("file", file);

        const res = await api.post("/chat/messages/file", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,
        })

        return res;

    }

    const sendTextMessage = async (content) => {
        const res = await api.post("/chat/messages", {
            room_id: chat.room_id,
            content,
            reply_to_id: replyingTo?.id || null,
        });
        return res;
    }

    const handleSend = async () => {
        if (!chat?.room_id || !send || isSending) return;

        setIsSending(true);
        try {
            if (editingMessage) {
                if (!newMessage.trim()) return;

                try {
                    await api.put(`/chat/room/${chat.room_id}/messages/${editingMessage.id}/text`, {
                        content: newMessage.trim()
                    });
                    stopTyping();
                    setEditingMessage(null);
                    setNewMessage('');
                } catch (err) {
                    const errorMessage = err?.response?.data?.message || err.message || err?.response?.data || "Unknown error";
                    console.error(err);
                    setError(t(`Failed to edit message: ${errorMessage}`));
                }
                return;
            }

            if (isRecording) {
                try {
                    const blob = await stopRecordingAndGetBlob();
                    if (blob) {
                        const audioFile = new File([blob], `voice-${Date.now()}.webm`, { type: blob.type });
                        const res = await uploadFileMessage({ file: audioFile, type: 'voice' });
                        addMessage(res.data);
                        setReplyingTo(null);
                        setAudioBlob(null);
                        setRecordTime(0);
                        setTimeout(scrollToBottom, 50);
                    }
                } catch (err) {
                    console.error(err);
                    setError(t("Failed to send recorded audio"));
                }
                return;
            }

            if (audioBlob) {
                const id = `temp-voice-${Date.now()}`;
                setUploadingFiles(prev => [
                    ...prev,
                    { id, sender_id: currentUserId, type: 'voice', isUploading: true, progress: 0 }
                ]);

                try {
                    const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, { type: audioBlob.type });
                    const res = await uploadFileMessage({ file: audioFile, type: 'voice' });
                    addMessage(res.data);
                } catch (err) {
                    const errorMessage = err?.response?.data?.message || err.message || err?.response?.data || "Unknown error";
                    console.error(err);
                    setError(t(`Failed to send audio: ${errorMessage}`));
                } finally {
                    setUploadingFiles(prev => prev.filter(f => f.id !== id));
                    setAudioBlob(null);
                    setRecordTime(0);
                }
                return;
            }

            if (selectedFiles.length > 0) {
                const filesToUpload = [...selectedFiles];

                setSelectedFiles([]);
                setNewMessage('');
                setReplyingTo(null);

                const tempMessages = filesToUpload.map(item => ({
                    id: item.id,
                    client_id: item.id,
                    sender_id: currentUserId,
                    type: item.type,
                    content: item.file.name,
                    file: item.file,
                    preview: item.preview,
                    isUploading: true,
                    progress: 0,
                    created_at: new Date().toISOString(),
                }));

                setMessages(prev => {
                    const existingIds = new Set(prev.map(m => m.id));

                    return [
                        ...prev,
                        ...tempMessages.filter(msg => !existingIds.has(msg.id)),
                    ];
                });

                for (const item of filesToUpload) {
                    try {
                        const res = await uploadFileMessage({
                            file: item.file,
                            type: item.type,
                            caption: newMessage || null,
                            onUploadProgress: (e) => {
                                const progress = Math.round((e.loaded * 100) / e.total);

                                setMessages(prev =>
                                    prev.map(msg =>
                                        msg.id === item.id
                                            ? {
                                                ...msg,
                                                progress,
                                            }
                                            : msg
                                    )
                                );
                            }
                        });

                        replaceTempMessage(item.id, res.data);

                        await removeUpload(item.id);

                        setSelectedFiles(prev =>
                            prev.filter(f => f.id !== item.id)
                        );
                    } catch (err) {
                        const errorMessage = err?.response?.data?.message || err.message || err?.response?.data || "Unknown error";
                        console.error(err);
                        setError(t(`Failed to upload ${item.file.name}: ${errorMessage}`));

                        setMessages(prev =>
                            prev.map(msg =>
                                msg.id === item.id
                                    ? {
                                        ...msg,
                                        isUploading: false,
                                        failed: true,
                                    }
                                    : msg
                            )
                        );
                    } finally {
                        setUploadingFiles(prev => prev.filter(f => f.id !== item.id));
                    }
                }

                return;
            }

            if (newMessage.trim()) {
                try {
                    await sendTextMessage(newMessage.trim());
                    setNewMessage('');
                    setReplyingTo(null);
                    stopTyping();
                    setTimeout(scrollToBottom, 50);
                } catch (err) {
                    const errorMessage = err?.response?.data?.message || err.message || err?.response?.data || "Unknown error";
                    console.error(err);
                    setError(t(`Failed to send message: ${errorMessage}`));
                }
            }

        } finally {
            setIsSending(false);
        }
    };

    const retryUpload = async (message) => {
        if (!message.file) {
            console.error("No file available for retry");
            return;
        }

        setMessages(prev =>
            prev.map(msg =>
                msg.id === message.id
                    ? {
                        ...msg,
                        failed: false,
                        isUploading: true,
                        progress: 0,
                    }
                    : msg
            )
        );

        try {
            const res = await uploadFileMessage({
                file: message.file,
                type: message.type,
                caption: message.caption || null,
                onUploadProgress: (e) => {
                    const progress = Math.round(
                        (e.loaded * 100) / e.total
                    );

                    setMessages(prev =>
                        prev.map(msg =>
                            msg.id === message.id
                                ? {
                                    ...msg,
                                    progress,
                                }
                                : msg
                        )
                    );
                },
            });

            // Replace failed temp message
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === message.id
                        ? res.data
                        : msg
                )
            );

            await removeUpload(message.id);

        } catch (err) {
            console.error(err);

            setMessages(prev =>
                prev.map(msg =>
                    msg.id === message.id
                        ? {
                            ...msg,
                            failed: true,
                            isUploading: false,
                        }
                        : msg
                )
            );
        }
    }

    const handleDeleteMessage = (message) => {
        setMessageToDelete(message);
        setOpenConfirm(true);
    };

    const confirmDelete = async () => {
        if (!messageToDelete) return;

        setOpenConfirm(false);

        try {
            setDeleting(true);
            await api.delete(`/chat/room/${chat.room_id}/messages/${messageToDelete.id}`);

            setMessages(prev =>
                prev.map(msg =>
                    msg.id === messageToDelete.id
                        ? {
                            ...msg,
                            is_deleting: true,
                            content: "",
                        }
                        : msg
                )
            );

            setMessageToDelete(null);
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err.message || err?.response?.data || "Unknown error";
            console.error(err);
            setError(t(`Failed to delete: ${errorMessage}`));
        } finally {
            setDeleting(false);
        }
    };

    const cancelDelete = () => {
        setOpenConfirm(false);
        setMessageToDelete(null);
    };

    const cancelSelectedDelete = () => {
        setConfirmSelectedDelete(false);
        setSelectedMessages([]);
        setSelectMode(false);
    };

    const startSelectMode = (message) => {
        setSelectMode(true);
        setSelectedMessages([message.id]);
    };

    const toggleSelectMessage = (message) => {
        setSelectedMessages(prev => {
            const exists = prev.includes(message.id);

            if (exists) {
                return prev.filter(id => id !== message.id);
            }

            return [...prev, message.id];
        });
    };

    const deleteSelectedMessages = async () => {
        if (selectedMessages.length === 0) return;

        setConfirmSelectedDelete(false);

        try {
            setDeleting(true);

            await api.delete(
                `/chat/room/${chat.room_id}/messages`,
                {
                    data: {
                        message_ids: selectedMessages
                    }
                }
            );

            setMessages(prev =>
                prev.map(msg =>
                    selectedMessages.includes(msg.id)
                        ? {
                            ...msg,
                            is_deleting: true,
                            content: "",
                            edited_at: null,
                        }
                        : msg
                )
            );

            setSelectedMessages([]);
            setSelectMode(false);
        } catch (err) {
            const errorMessage =
                err?.response?.data?.message ||
                err.message ||
                "Unknown error";

            setError(t(`Failed to delete: ${errorMessage}`));

        } finally {
            setDeleting(false);
        }
    }

    const handleEditMessage = (message) => {
        setEditingMessage(message);
        setNewMessage(message.content || '');
    };

    const fetchForwardRooms = async () => {
        if (loadingRooms || !roomsHasMore) return;

        setLoadingRooms(true);

        const res = await api.get(`/chat/${chat.room_id}`, {
            params: {
                limit: ROOM_LIMIT,
                offset: roomOffset,
            },
        });

        setForwardRooms(prev => [...prev, ...res.data.items]);
        setRoomsHasMore(res.data.has_more);
        setRoomOffset(prev => prev + ROOM_LIMIT);
        setLoadingRooms(false);
    };

    useEffect(() => {
        if (forwardOpen) {
            fetchForwardRooms();
        }
    }, [forwardOpen]);

    const handleForwardMessage = (message) => {
        setForwardMessage(message);
        setForwardOpen(true);
        setForwardRooms([]);
        setSelectedRooms(new Set());
        setRoomOffset(0);
        setRoomsHasMore(true);
    }

    const toggleRoomSelection = (roomId) => {
        setSelectedRooms(prev => {
            const copy = new Set(prev);
            copy.has(roomId) ? copy.delete(roomId) : copy.add(roomId);
            return copy;
        });
    };

    const confirmForward = async () => {
        if (!forwardMessage || selectedRooms.size === 0) return;

        const payload = {
            message_id: forwardMessage.id,
            target_room_ids: Array.from(selectedRooms),
        };

        try {
            await api.post("/chat/messages/forward", payload);

            setForwardOpen(false);
            setForwardMessage(null);
            setSelectedRooms(new Set());
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err.message || err?.response?.data || "Unknown error";
            console.error(err);
            setError(t(`Failed to forward ${errorMessage}`));
        }
    };

    const handleReplaceMessage = (message) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = Object.values(FILE_RULES)
            .flatMap(r => [...r.extensions])
            .map(ext => `.${ext}`)
            .join(',');

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const ext = file.name.split('.').pop().toLowerCase();
            const allowed = Object.values(FILE_RULES)
                .some(rule => rule.extensions.has(ext));
            if (!allowed) {
                setError(t('invalid_file_type'));
                return;
            }
            if (file.size > MAX_SIZE) {
                setError(t('file_exceeds_limit'));
                return;
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('file_type', message.type);
            formData.append('caption', message.content || '');

            try {
                const data = await api.put(
                    `/chat/room/${chat.room_id}/messages/${message.id}/file`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                setMessages(prev =>
                    prev.map(m =>
                        m.id === data.id
                            ? { ...m, file_url: data.file_url, type: data.type, edited_at: data.edited_at }
                            : m
                    )
                )

            } catch (err) {
                const errorMessage = err?.response?.data?.message || err.message || err?.response?.data || "Unknown error";
                console.error(err);
                setError(t(`replace_failed ${errorMessage}`));
            }
        };

        input.click();
    };

    const handlePinMessage = async (message) => {
        try {
            await api.post(`/chat/rooms/${chat.room_id}/messages/${message.id}/pin`)
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err.message || err?.response?.data || "Unknown error";
            console.error("Unpin failed", err);
            setError(`Unpin failed: ${errorMessage}`);
        }

    }

    const handleUnpinMessage = async () => {
        try {
            await api.delete(`/chat/rooms/${chat.room_id}/pin`)
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err.message || err?.response?.data || "Unknown error";
            console.error("Unpin failed", err);
            setError(`Unpin failed: ${errorMessage}`);
        }

    }

    const toggleReactMessage = async (message, reactionType) => {
        try {

            await api.post(
                `/chat/rooms/${chat.room_id}/messages/${message.id}/react`,
                { reaction: reactionType }
            );
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err.message || err?.response?.data || "Unknown error";
            console.error("Reaction failed", err);
            setError(`Reaction failed ${errorMessage}`);
        }
    };

    const handleRemoveReact = async (messageId) => {
        try {

            await api.delete(
                `/chat/rooms/${chat.room_id}/messages/${messageId}/react`
            );
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err.message || err?.response?.data || "Unknown error";
            console.error("Reaction failed", err);
            setError(`Reaction failed ${errorMessage}`);
        }
    }

    const isBlocked = blockMessage?.is_blocked ?? false;

    const handleBlockUser = async () => {
        try {
            if (!isBlocked) {
                await api.post(`/chat/rooms/${chat.room_id}/block`);
            } else {
                await api.post(`/chat/rooms/${chat.room_id}/unblock`);
            }
        } catch (e) {
            console.error(`Failed to ${!isBlocked ? 'block' : 'unblock'}`, e);
            setError(`Failed to ${!isBlocked ? 'block' : 'unblock'}`);
        }
    }

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
            }}
        >
            <Snackbar
                open={!!error}
                autoHideDuration={5000}
                onClose={() => setError('')}
                anchorOrigin={{ vertical: 'top', horizontal: 'center', zIndex: 2000 }}
            >
                <Alert
                    severity="error"
                    onClose={() => setError('')}
                    sx={{ bgcolor: '#ef4444', color: 'white' }}
                >
                    {error}
                </Alert>
            </Snackbar>

            {chat !== null ? (
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }}
                >
                    <AppBar
                        position="static"
                        sx={{
                            borderBottom: '1px solid var(--mui-palette-divider)',
                            boxShadow: 'none',
                            bgcolor: 'var(--mui-palette-customColors-chatBg) !important',
                        }}
                        onClick={() => setPopup(true)}
                    >
                        <Toolbar
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: { xs: 1.5, sm: 2.5 },
                                height: 72,           
                                minHeight: 72,
                                px: { xs: 2, sm: 3 },            
                                py: 1,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                <IconButton
                                    sx={{
                                        display: { xs: 'flex', md: 'none' }
                                    }}
                                    onClick={onBack}
                                >
                                    <ArrowBackIcon />
                                </IconButton>

                                <Avatar
                                    sx={{
                                        width: { xs: 38, md: 44 },
                                        height: { xs: 38, md: 44 },
                                        border: 1,
                                        borderColor: 'primary.main',
                                        fontSize: 28
                                    }}
                                    src={`${BASE_URL}/uploads/user/profile/${chat?.profile_image}`}
                                >
                                    {chat?.username?.charAt(0).toUpperCase() || 'P'}
                                </Avatar>

                                <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                                    <Typography variant="h6" fontWeight={600} noWrap>
                                        {chat?.username || t('unknown_user')}
                                    </Typography>

                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: typingUsers[chat?.user_id] ? 'var(--mui-palette-warning-main)' : isOnline ? 'var(--mui-palette-success-main)' : 'var(--mui-palette-text-secondary)',
                                            fontWeight: 'bold'
                                        }}
                                        noWrap
                                    >
                                        {typingUsers[chat?.user_id] ? t('typing') : isOnline ? t('online') : t('offline')}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: { xs: 1, sm: 2 },
                                    alignItems: 'center',
                                }}
                            >
                                <CallIcon
                                    sx={{
                                        fontSize: { xs: 22, md: 26 },
                                        color: isBlocked ? 'var(--mui-palette-action-disabled)' : 'var(--mui-palette-text-primary)',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: isBlocked ? 'none' : 'scale(1.15)',
                                            color: isBlocked ? 'var(--mui-palette-action-disabled)' : 'var(--mui-palette-primary-main)',
                                        },
                                        cursor: isBlocked ? 'not-allowed' : 'pointer'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (isBlocked) return;
                                        onStartCall(chat.room_id, 'voice');
                                    }}
                                />
                                <VideocamIcon
                                    sx={{
                                        fontSize: { xs: 24, md: 30 },
                                        color: isBlocked ? 'var(--mui-palette-action-disabled)' : 'var(--mui-palette-text-primary)',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: isBlocked ? 'none' : 'scale(1.15)',
                                            color: isBlocked ? 'var(--mui-palette-action-disabled)' : 'var(--mui-palette-primary-main)',
                                        },
                                        cursor: isBlocked ? 'not-allowed' : 'pointer'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (isBlocked) return;
                                        onStartCall(chat.room_id, 'video');
                                    }}
                                />
                            </Box>
                        </Toolbar>
                    </AppBar>

                    {pinMessage && (
                        <Paper
                            elevation={0}
                            sx={{
                                flexShrink: 0,
                                zIndex: 10,
                                px: 1.5,
                                py: 1,
                                backgroundColor: 'var(--mui-palette-background-paper)',
                            }}
                        >
                            <PinnedMessageComponent pinMessage={pinMessage} currentUserId={currentUserId} onUnpin={handleUnpinMessage} scrollToMessage={scrollToMessage} />
                        </Paper>
                    )}

                    {selectMode && selectedMessages.length > 0 && (
                        <Box
                            sx={{
                                flexShrink: 0,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                px: 2,
                                py: 1.2,
                                borderBottom: '1px solid var(--mui-palette-divider)',
                            }}
                        >
                            {/* Selected Count */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        px: 2,
                                        py: 1,
                                        borderRadius: "50%",
                                        bgcolor: "primary.main",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {selectedMessages.length}
                                </Box>

                                <span>{selectedMessages.length === 1 ? `${t('message_selected')}` : `${t('messages_selected')}`}</span>
                            </Box>

                            {/* Actions */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <Button
                                    color="error"
                                    size="small"
                                    variant="contained"
                                    onClick={() => setConfirmSelectedDelete(true)}
                                >
                                    {deleting ? `${t('deleting')}` : `${t('delete')}`}
                                </Button>

                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={cancelSelectedDelete}
                                >
                                    {t('clear')}
                                </Button>
                            </Box>
                        </Box>
                    )}

                    <Box
                        sx={{
                            flex: 1,
                            minHeight: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            id='chat-messages-container'
                            ref={messagesRef}
                            onScroll={onScroll}
                            sx={{
                                flex: 1,
                                minHeight: 0,
                                overflowY: 'auto',
                                overscrollBehavior: 'contain',
                                overflowX: 'hidden',
                                px: 2,
                                py: 1,
                                background: 'var(--mui-palette-customColors-chatBg)',
                                position: 'relative',
                            }}
                        >

                            {hasMore && loadingOlder && (
                                <Box
                                    sx={{
                                        py: 1,
                                        mt: 5,
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <CircularProgress size={20} />
                                </Box>
                            )}

                            {messages.length === 0 ? (
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <Typography
                                        variant='h6'
                                        fontWeight={600}
                                    >
                                        {t('say_something_to')}
                                    </Typography>
                                    <Typography variant='h6' fontWeight={600} sx={{ color: 'primary.main' }}>
                                        {chat?.username}
                                    </Typography>
                                </Box>
                            ) : (
                                messages.map((message) => (
                                    <MessageBubble
                                        key={message.id}
                                        message={message}
                                        selectable={selectMode}
                                        selected={selectedMessages.includes(message.id)}
                                        onSelect={() => toggleSelectMessage(message)}
                                        onStartSelect={startSelectMode}
                                        selectedMessages={selectedMessages}
                                        isOwn={message.sender_id === currentUserId}
                                        isForward={message?.forward_from?.sender?.pk_id === currentUserId}
                                        onEdit={handleEditMessage}
                                        onDelete={handleDeleteMessage}
                                        onReply={(msg) => setReplyingTo(msg)}
                                        onForward={handleForwardMessage}
                                        onReplace={handleReplaceMessage}
                                        onPreview={handleOpenPreview}
                                        onPin={handlePinMessage}
                                        isPin={pinMessage?.message?.id === message?.id}
                                        onUnpin={handleUnpinMessage}
                                        onReact={toggleReactMessage}
                                        reactionsData={reactionsData}
                                        onRemoveReact={handleRemoveReact}
                                        onStartCall={() => { onStartCall(chat.room_id, 'video'); }}
                                        isBlocked={isBlocked}
                                        scrollToMessage={scrollToMessage}
                                        highlightedMessageId={highlightedMessageId}
                                        onRetry={retryUpload}
                                    />
                                )))}

                            {uploadingFiles.map((file) => (
                                <MessageBubble
                                    key={file.id}
                                    message={file}
                                    isOwn={true}
                                    isForward={false}
                                    onEdit={handleEditMessage}
                                    onDelete={handleDeleteMessage}
                                    onReply={(msg) => setReplyingTo(msg)}
                                    onForward={handleForwardMessage}
                                    onReplace={handleReplaceMessage}
                                    onPreview={handleOpenPreview}
                                    onPin={handlePinMessage}
                                    isPin={false}
                                    onUnpin={handleUnpinMessage}
                                    onReact={toggleReactMessage}
                                    reactionsData={reactionsData}
                                    onRemoveReact={handleRemoveReact}
                                    onStartCall={() => { onStartCall(chat.room_id, 'video'); }}
                                    isBlocked={isBlocked}
                                    scrollToMessage={scrollToMessage}
                                    highlightedMessageId={highlightedMessageId}
                                />
                            ))}

                            {Object.entries(typingUsers)
                                .filter(([userId, isTyping]) => isTyping && parseInt(userId) !== currentUserId)
                                .map(([userId]) => (
                                    <TypingIndicator
                                        key={userId}
                                        username={chat.username}
                                    />
                                ))}

                            <div ref={messagesEndRef} />
                        </Box>

                        {selectedFiles.length > 0 && !isRecording && !audioBlob && (
                            <Paper
                                elevation={0}
                                sx={{
                                    width: '100%',
                                    p: 1,
                                    px: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    overflowX: 'hidden',
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 1,
                                        flexGrow: 1,
                                        overflowX: 'auto',
                                        py: 1,
                                        scrollSnapType: 'x mandatory',
                                    }}
                                >
                                    {selectedFiles.map((item) => {
                                        const file = item.file;
                                        const isImage = file.type.startsWith("image/");
                                        const uploadingFile = uploadingFiles.find(f => f.id === item.id);
                                        const progress = uploadingFile?.progress || 0;
                                        const isUploading = uploadingFile?.isUploading;

                                        return (
                                            <Paper
                                                key={item.id}
                                                variant="outlined"
                                                sx={{
                                                    flex: '0 0 auto',
                                                    p: 1,
                                                    minWidth: 120,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    position: 'relative',
                                                    borderColor: 'var(--mui-palette-primary-main)',
                                                }}
                                            >
                                                {isImage ? (
                                                    <Box
                                                        component="img"
                                                        src={item.preview}
                                                        alt={file.name}
                                                        sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 'var(--mui-shape-borderRadius)' }}
                                                    />
                                                ) : (
                                                    <Typography
                                                        variant="body2"
                                                        noWrap
                                                        sx={{ maxWidth: 100, textAlign: 'center' }}
                                                    >
                                                        {file.name}
                                                    </Typography>
                                                )}

                                                {isUploading && (
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: '50%',
                                                            left: '50%',
                                                            transform: 'translate(-50%, -50%)',
                                                        }}
                                                    >
                                                        <CircularProgress
                                                            variant={progress ? 'determinate' : 'indeterminate'}
                                                            value={progress}
                                                            size={40}
                                                            thickness={4}
                                                        />
                                                    </Box>
                                                )}

                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => removeFile(item.id)}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 4,
                                                        right: 4,
                                                        bgcolor: (theme) => `${theme.palette.error.main} !important`,
                                                        color: "white",
                                                        "&:hover": {
                                                            transform: "scale(1.1)",
                                                        },
                                                    }}
                                                >
                                                    <CloseIcon sx={{ fontSize: 14 }} />
                                                </IconButton>
                                            </Paper>
                                        );
                                    })}
                                </Box>
                            </Paper>
                        )}

                        {editingMessage && (
                            <Box sx={{
                                width: '100%',
                                p: 1,
                                px: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <Typography sx={{ fontWeight: 600 }}>
                                    {t('editing_message')}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        setEditingMessage(null);
                                        setNewMessage('');
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        )}

                        {replyingTo && (
                            <Box
                                sx={{
                                    width: '100%',
                                    p: 1,
                                    px: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Box sx={{ maxWidth: '80%' }}>
                                    <Typography variant="caption">
                                        {t('replying_to')}
                                    </Typography>
                                    <Typography variant="body2" noWrap>
                                        {replyingTo.content || replyingTo.type}
                                    </Typography>
                                </Box>

                                <IconButton
                                    size="small"
                                    onClick={() => setReplyingTo(null)}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        )}

                        {isBlocked ?
                            (
                                <Box
                                    sx={{
                                        background: 'color-mix(in srgb, var(--mui-palette-error-main) 30%, transparent)',
                                        p: 2,
                                        textAlign: 'center',
                                    }}
                                >
                                    <Typography>
                                        {t('user_not_contactable')}
                                    </Typography>
                                </Box>
                            ) : (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        mx: 1.5,
                                        mb: 1.5,
                                        px: 1.25,
                                        py: 0.75,
                                        borderRadius: 4,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                    }}
                                >
                                    {(isRecording || audioBlob) && (
                                        <>
                                            <IconButton color="error" onClick={cancelRecording}>
                                                <CloseIcon />
                                            </IconButton>

                                            <Typography sx={{ flexGrow: 1 }}>
                                                {isRecording ? t('recording', { seconds: recordTime }) : t('audio_ready')}
                                            </Typography>
                                        </>
                                    )}

                                    {!isRecording && !audioBlob && (
                                        <>
                                            {!showContent && (
                                                <>
                                                    <IconButton component="label">
                                                        <AttachFileIcon />
                                                        <input
                                                            ref={fileInputRef}
                                                            hidden
                                                            type="file"
                                                            multiple
                                                            onChange={handleFileSelect}
                                                            accept={Object.values(FILE_RULES).flatMap(r => [...r.extensions]).map(ext => `.${ext}`).join(',')}
                                                        />
                                                    </IconButton>

                                                    <IconButton
                                                        onMouseDown={startRecording}
                                                        onMouseUp={handleSend}
                                                        onTouchStart={startRecording}
                                                        onTouchEnd={handleSend}
                                                    >
                                                        <MicIcon />
                                                    </IconButton>

                                                    <Box>
                                                        <IconButton
                                                            ref={emojiButtonRef}
                                                            onClick={() => setShowEmojiPicker((v) => !v)}
                                                        >
                                                            {showEmojiPicker ? <EmojiEmotionsIcon /> : <InsertEmoticonIcon />}
                                                        </IconButton>

                                                        {showEmojiPicker && (
                                                            <EmojiPicker
                                                                onSelect={(emoji) =>
                                                                    setNewMessage((prev) => prev + emoji)
                                                                }
                                                                onClose={() => setShowEmojiPicker(false)}
                                                                anchorEl={emojiButtonRef.current}
                                                                placement="top-start"
                                                            />
                                                        )}
                                                    </Box>
                                                </>
                                            )}

                                            <TextField
                                                fullWidth
                                                size="small"
                                                placeholder={t('message_placeholder')}
                                                multiline
                                                value={newMessage}
                                                onChange={onInputChange}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        if (e.shiftKey) {
                                                            const cursorPos = e.target.selectionStart;
                                                            const textBefore = newMessage.slice(0, cursorPos);
                                                            const textAfter = newMessage.slice(cursorPos);
                                                            onInputChange({
                                                                target: { value: textBefore + '\n' + textAfter }
                                                            });
                                                            e.preventDefault();
                                                        } else {
                                                            e.preventDefault();
                                                            stopTyping();
                                                            handleSend();
                                                        }
                                                    }
                                                }}
                                                InputProps={{
                                                    style: {
                                                        overflowY: 'hidden',
                                                    },
                                                }}
                                                onBlur={() => stopTyping()}
                                            />
                                        </>
                                    )}

                                    <IconButton
                                        color="primary"
                                        onClick={handleSend}
                                        disabled={(!newMessage.trim() && !audioBlob && selectedFiles.length === 0 && !isRecording) || isSending}
                                    >
                                        {isUploading ? (<CircularProgress size={24} />) : (<SendIcon />)}
                                    </IconButton>
                                </Paper>
                            )}
                    </Box>
                </Box>
            ) : (
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        variant='h6'
                        fontWeight={600}
                    >
                        {t('tab_chat_to_start')}
                    </Typography>
                </Box>
            )}

            {chat != null && (
                <ChatMenuDialog
                    open={popup}
                    onClose={() => setPopup(false)}
                    user={chat}
                    roomId={chat?.room_id}
                    currentUserId={currentUserId}
                    onBlockUser={handleBlockUser}
                    blockMessage={blockMessage}
                />
            )}

            <DeleteDialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                onCancel={cancelDelete}
                onConfirm={confirmDelete}
                deleting={deleting}
            />

            <DeleteDialog
                open={confirmSelectedDelete}
                onClose={() => setConfirmSelectedDelete(false)}
                onCancel={cancelSelectedDelete}
                onConfirm={deleteSelectedMessages}
                deleting={deleting}
            />

            <ForwardDialog
                open={forwardOpen}
                onClose={() => setForwardOpen(false)}
                onConfirm={confirmForward}
                rooms={forwardRooms}
                selectedRooms={selectedRooms}
                toggleRoom={toggleRoomSelection}
                loadMore={fetchForwardRooms}
                hasMore={roomsHasMore}
                loading={loadingRooms}
            />
            
            <MediaPreviewDialog
                open={previewOpen}
                onClose={handleClosePreview}
                mediaMessages={previewMedia}
                currentIndex={previewIndex}
                onPrev={handlePrevPreview}
                onNext={handleNextPreview}
                BASE_URL={BASE_URL}
            />
        </Box>
    )
}

export default ChatComponent
