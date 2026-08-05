import { Box, Typography, Paper, Button, Avatar, IconButton, Link, CircularProgress, Snackbar, Alert, Checkbox } from '@mui/material';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { VoiceMessagePlayer } from './VoiceMessagePlayer';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import ReplyIcon from '@mui/icons-material/Reply';
import DownloadIcon from '@mui/icons-material/Download';
import PreviewIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useState, useRef } from 'react';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import { FormatTime } from './FormatTime';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import VideoMessage from './VideoMessagePlayer';
import ChatImage from './ImageComponent';
import ChatFile from './ChatFile';
import ReplyComponent from './ReplyComponent';
import ForwardIcon from '@mui/icons-material/Forward';
import PushPinIcon from '@mui/icons-material/PushPin';
import ReactionComponent from './ReactionComponent';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { useTranslation } from 'react-i18next';
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

function MessageBubble({ message, selectable, selected, onSelect, onStartSelect, selectedMessages, isOwn, isForward, onEdit, onDelete, onReply, onForward, onReplace, onPreview, onPin, isPin, onUnpin, onReact, reactionsData, onRemoveReact, onStartCall, isBlocked, scrollToMessage, highlightedMessageId, onRetry }) {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : ''));

    const [reactionOpen, setReactionOpen] = React.useState(false);
    const [reactionAnchorEl, setReactionAnchorEl] = React.useState(null);
    const [isHovered, setIsHovered] = React.useState(false);
    const [menuHeight, setMenuHeight] = useState(0);
    const menuPaperRef = useRef(null);
    const getMenuPosition = () => {
        if (!anchorEl) return false;

        const anchorRect = anchorEl.getBoundingClientRect();
        const container = document.getElementById("chat-messages-container");
        const containerRect = container?.getBoundingClientRect();

        if (!containerRect) return false;

        const spaceAbove = anchorRect.top - containerRect.top;
        const spaceBelow = containerRect.bottom - anchorRect.bottom;

        return spaceBelow < menuHeight && spaceAbove > menuHeight;
    };

    const openAbove = getMenuPosition();

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const showSnackbar = (message, severity = "success") => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") return;

        setSnackbar((prev) => ({
            ...prev,
            open: false,
        }));
    };

    const handleMenuOpen = (event) => {
        event.preventDefault();

        if (isBlocked) return;
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSave = async () => {
        handleMenuClose();
        try {
            const response = await fetch(`${BASE_URL}${message.file_url}`);
            if (!response.ok) throw new Error('File not found');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = message.file_name || 'file';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);

            showSnackbar(t("download_started"));
        } catch (err) {
            console.error('Download failed:', error);
            showSnackbar(t("download_failed"));
        }
    };

    const handleCopy = async () => {
        handleMenuClose();

        try {
            await navigator.clipboard.writeText(message.content);
            showSnackbar(t("copied"));
        } catch (err) {
            showSnackbar(t("copy_failed"), "error");
        }
    };

    const reactions = [
        { type: "like", emoji: "👍" },
        { type: "love", emoji: "❤️" },
        { type: "laugh", emoji: "😂" },
        { type: "wow", emoji: "😮" },
        { type: "sad", emoji: "😢" },
        { type: "angry", emoji: "😡" },
    ];

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                reactionAnchorEl &&
                !reactionAnchorEl.contains(event.target)
            ) {
                setReactionOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [reactionAnchorEl]);

    useEffect(() => {
        if (menuPaperRef.current) {
            setMenuHeight(menuPaperRef.current.clientHeight);
        }
    }, [open]);

    const isInline = message.type === 'text' && message.content.length < 40 && !message.content.includes('\n');

    const renderMessageContent = (content) => {
        if (!content) return null;

        return content.split("\n").map((line, lineIndex) => (
            <span key={lineIndex}>
                {line.split(/\s+/).map((word, i) => {
                    const urlRegex = /^(https?:\/\/[^\s]+|www\.[^\s]+)/i;

                    if (urlRegex.test(word)) {
                        const href = /^https?:\/\//i.test(word) ? word : `https://${word}`;

                        return (
                            <Link
                                key={i}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    color: isOwn ? "orange" : "primary.main",
                                }}
                            >
                                {word}{" "}
                            </Link>
                        );
                    }

                    return <React.Fragment key={i}>{word} </React.Fragment>;
                })}

                {lineIndex < content.split("\n").length - 1 && <br />}
            </span>
        ));
    };

    return (
        <Box
            id={`message-${message.id}`}
            sx={{
                display: 'flex',
                justifyContent: isOwn ? 'flex-end' : 'flex-start',
                mb: 1,
                gap: 1,
            }}
        >
            <Snackbar
                open={snackbar.open}
                autoHideDuration={2000}
                onClose={handleSnackbarClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{
                        width: "100%",
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {selectable && selectedMessages.length > 0 && isOwn && (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}
                >
                    <Checkbox
                        checked={selected}
                        onChange={() => onSelect(message)}
                    />
                </Box>
            )}

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: isOwn ? 'flex-end' : 'flex-start',
                    alignItems: isOwn ? 'end' : 'start',
                    fontSize: 14
                }}
            >
                {message.forward_from && (
                    <Box
                        sx={{
                            color: isOwn ? 'primary.main' : 'grey',
                            display: 'flex',
                            alignItems: 'center',
                            mb: 0.5
                        }}
                    >
                        <ForwardIcon sx={{ fontSize: 18 }} />
                        {t('forward_from')}
                        {isForward ?
                            (
                                t('you')
                            ) :
                            (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        ml: 0.5
                                    }}
                                >

                                    <Avatar
                                        sx={{
                                            width: 15,
                                            height: 15,
                                            mr: 0.25,
                                            fontSize: 10
                                        }}
                                    >
                                        {message.forward_from.sender.user_name.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Typography>
                                        {message.forward_from.sender.user_name}
                                    </Typography>
                                </Box>
                            )}
                    </Box>
                )}
                <Paper
                    elevation={1}
                    sx={{
                        px: message.type === 'image' || message.type === 'video' ? 0 : 2,
                        py: message.type === 'image' || message.type === 'video' ? 0 : 1,
                        transition: 'box-shadow 0.3s ease',
                        bgcolor: message.type === 'image' || message.type === 'video' ? 'transparent' : isOwn ? 'primary.main' : 'var(--mui-palette-background-paper)',
                        '&:hover': {
                            transition: 'transform 0.2s ease',
                        },
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                    onContextMenu={handleMenuOpen}
                    onClick={(e) => {
                        e.stopPropagation();
                        onPreview?.(message);
                    }}
                    onMouseEnter={() => {
                        setIsHovered(true);
                    }}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {message.reply_to && (
                        <ReplyComponent
                            reply={message.reply_to}
                            isOwn={isOwn}
                            isImage={message.type === 'image' || message.type === 'video'}
                            onScroll={() => scrollToMessage?.(message.reply_to.id)}
                        />
                    )}

                    {message.failed && (
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                bgcolor: isOwn ? 'primary.main' : 'grey.100',
                                backdropFilter: 'blur(2px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                gap: 1,
                                zIndex: 10,
                                borderRadius: 2
                            }}
                        >
                            <Button
                                variant="outlined"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRetry(message);
                                }
                                }
                            >
                                {t('retry')}
                            </Button>
                        </Box>
                    )}

                    {message.isUploading && (
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                bgcolor: isOwn ? 'primary.main' : 'grey.100',
                                backdropFilter: 'blur(2px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                gap: 1,
                                zIndex: 10,
                            }}
                        >
                            <CircularProgress
                                variant="determinate"
                                value={message.progress || 0}
                                size={42}
                                thickness={4}
                            />

                            <Typography
                                variant="caption"
                                sx={{
                                    fontWeight: 600
                                }}
                            >
                                {message.progress || 0}%
                            </Typography>
                        </Box>
                    )}

                    {message.type === 'text' && (
                        isInline ? (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: isOwn ? "var(--mui-palette-primary-contrastText)" : "text.secondary",
                                    whiteSpace: "pre-line",
                                    lineHeight: 1.2,
                                    display: "flex",
                                    flexDirection: 'row',
                                    fontSize: 14
                                }}
                            >
                                {renderMessageContent(message.content)}
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: isOwn ? "flex-end" : "flex-start",
                                        alignItems: "center",
                                        gap: 0.5,
                                        mt: 0.3,
                                        fontSize: 12
                                    }}
                                >
                                    {!message.is_deleting && (
                                        <>
                                            <ReactionComponent
                                                messageId={message.id}
                                                reactionsData={reactionsData}
                                                onRemoveReact={onRemoveReact}
                                                isOwn={isOwn}
                                            />

                                            {isPin && (
                                                <PushPinIcon
                                                    sx={{
                                                        fontSize: 16,
                                                        transform: "rotate(30deg)",
                                                        opacity: 0.7,
                                                    }}
                                                />
                                            )}

                                            <FormatTime time={message.created_at} />

                                            {message.edited_at && (
                                                <Typography variant="caption">
                                                    · {t("edited")}
                                                </Typography>
                                            )}

                                            {isOwn && message.is_read && (
                                                <DoneAllIcon sx={{ fontSize: 16 }} />
                                            )}
                                        </>)}

                                    {message.is_deleting && (
                                        <>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{ fontStyle: "italic" }}
                                            >
                                                {t('deleting')}
                                            </Typography>
                                        </>
                                    )}
                                </Box>
                            </Typography>
                        ) : (
                            <>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: isOwn ? "var(--mui-palette-primary-contrastText)" : "text.secondary",
                                        whiteSpace: "pre-line",
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {renderMessageContent(message.content)}
                                </Typography>

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: isOwn ? "flex-end" : "flex-start",
                                        alignItems: "center",
                                        gap: 0.5,
                                        mt: 0.3,
                                        fontSize: 12
                                    }}
                                >
                                    {!message.is_deleting && (
                                        <>
                                            <ReactionComponent
                                                messageId={message.id}
                                                reactionsData={reactionsData}
                                                onRemoveReact={onRemoveReact}
                                                isOwn={isOwn}
                                            />

                                            {isPin && (
                                                <PushPinIcon
                                                    sx={{
                                                        fontSize: 16,
                                                        transform: "rotate(30deg)",
                                                        opacity: 0.7,
                                                    }}
                                                />
                                            )}

                                            <FormatTime time={message.created_at} />

                                            {message.edited_at && (
                                                <Typography variant="caption">
                                                    · {t("edited")}
                                                </Typography>
                                            )}

                                            {isOwn && message.is_read && (
                                                <DoneAllIcon sx={{ fontSize: 16 }} />
                                            )}
                                        </>)}

                                    {message.is_deleting && (
                                        <>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{ fontStyle: "italic" }}
                                            >
                                                {t('deleting')}
                                            </Typography>
                                        </>
                                    )}
                                </Box>
                            </>
                        ))}

                    {message.type === 'system' && (
                        <Typography
                            variant="caption"
                            sx={{
                                fontStyle: 'italic',
                                color: isOwn ? "var(--mui-palette-primary-contrastText)" : "text.secondary",
                                whiteSpace: 'pre-line',
                                lineHeight: 1.2,
                                textAlign: isOwn ? 'end' : 'start',
                                fontSize: 14
                            }}
                        >
                            {message.content.split('\n').map((line, lineIndex) => (
                                <span key={lineIndex}>
                                    {line.split(/\s+/).map((word, i) => {
                                        const urlRegex = /^(https?:\/\/[^\s]+|www\.[^\s]+)/i;

                                        if (urlRegex.test(word)) {
                                            let href = word;
                                            if (!/^https?:\/\//i.test(word)) {
                                                href = 'https://' + word;
                                            }
                                            return (
                                                <Link
                                                    key={i}
                                                    href={href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{ color: isOwn ? 'orange' : 'primary.main', p: 0 }}
                                                >
                                                    {word}{' '}
                                                </Link>
                                            );
                                        }

                                        return word + ' ';
                                    })}
                                    {lineIndex < message.content.split('\n').length - 1 && <br />}
                                </span>
                            ))}
                        </Typography>
                    )}

                    {message.type === 'voice' && (
                        <VoiceMessagePlayer
                            url={`${BASE_URL}${message.file_url}`}
                            isOwn={isOwn}
                        />
                    )}

                    {message.type === 'video' && (
                        <VideoMessage
                            message={message}
                            isOwn={isOwn}
                            BASE_URL={BASE_URL}
                            isPin={isPin}
                            reactionsData={reactionsData}
                            onRemoveReact={onRemoveReact}
                            isDeleting={message.is_deleting}
                        />
                    )}

                    {message.type === 'file' && (
                        <ChatFile
                            fileUrl={`${BASE_URL}${message.file_url}`}
                            isOwn={isOwn}
                        />
                    )}

                    {message.type === 'call' && (
                        <Box
                            sx={{
                                wordBreak: 'break-word',
                                transition: 'all 0.2s',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    color: isOwn ? "var(--mui-palette-primary-contrastText)" : "text.secondary",
                                }}
                            >
                                {message.content}
                            </Typography>

                            <Button
                                variant="outlined"
                                size='small'
                                sx={{
                                    width: '100%',
                                    wordBreak: 'break-word',
                                    transition: 'all 0.2s',
                                    my: 1,
                                    textTransform: "none",
                                    color: isOwn ? "var(--mui-palette-primary-contrastText)" : "text.secondary",
                                    borderColor: isOwn ? "var(--mui-palette-primary-contrastText)" : "text.secondary",
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onStartCall();
                                }}
                            >
                                {isOwn ? t('call_again') : t('call_back')}
                            </Button>
                        </Box>
                    )}

                    {message.type === 'image' && (
                        <ChatImage
                            src={`${BASE_URL}${message.file_url}`}
                            isOwn={isOwn}
                            created_at={message.created_at}
                            edited_at={message.edited_at}
                            is_read={message.is_read}
                            isPin={isPin}
                            messageId={message.id}
                            reactionsData={reactionsData}
                            onRemoveReact={onRemoveReact}
                            isDeleting={message.is_deleting}
                        />
                    )}

                    <IconButton
                        size="small"
                        sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            color: isOwn ? 'text.primary' : 'text.secondary',
                            opacity: isHovered ? 1 : 0,
                            pointerEvents: isHovered ? 'auto' : 'none',
                            transition: 'opacity 0.2s',
                            '&:hover': { color: 'primary.main', transform: 'scale(1.2)' },
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            setReactionAnchorEl(e.currentTarget);
                            setReactionOpen((prev) => !prev);
                        }}
                    >
                        <EmojiEmotionsIcon fontSize="small" />
                    </IconButton>

                    {(message.type !== 'image' && message.type !== 'video' && message.type !== 'text') && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: isOwn ? 'end' : 'start',
                                gap: 0.5,
                                color: isOwn ? "var(--mui-palette-primary-contrastText)" : "text.secondary",
                            }}
                        >
                            {!message.is_deleting && (
                                <>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            textAlign: 'right',
                                            flexDirection: isOwn ? 'row' : 'row-reverse',
                                            gap: 0.5
                                        }}
                                    >
                                        <ReactionComponent
                                            messageId={message.id}
                                            reactionsData={reactionsData}
                                            onRemoveReact={onRemoveReact}
                                            isOwn={isOwn}
                                        />
                                        {isPin && (
                                            <PushPinIcon
                                                sx={{
                                                    fontSize: 16,
                                                    mr: 0.5,
                                                    transform: 'rotate(30deg)',
                                                    opacity: 0.7,
                                                }}
                                            />
                                        )}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                color: isOwn ? "var(--mui-palette-primary-contrastText)" : "text.secondary",
                                            }}
                                        >
                                            <FormatTime time={message.created_at} />
                                            {message.edited_at && (
                                                <Typography
                                                    variant="caption"
                                                    sx={{ ml: 0.5, opacity: 0.7 }}
                                                >
                                                    · {t('edited')}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Typography>
                                    <Box
                                        sx={{
                                            opacity: 0.7,
                                        }}
                                    >
                                        {message.is_read && isOwn && <DoneAllIcon sx={{ fontSize: 16 }} />}
                                    </Box>
                                </>
                            )}

                            {message.is_deleting && (
                                <>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ fontStyle: "italic" }}
                                    >
                                        {t("deleting")}
                                    </Typography>
                                </>
                            )}
                        </Box>
                    )}
                </Paper>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        borderRadius: "12px",
                        overflow: "visible",
                        mt: -10,
                        position: "relative",
                        width: 200
                    },
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: -55,
                        left: "50%",
                        transform: "translateX(-50%)",
                        bgcolor: "background.paper",
                        borderRadius: "999px",
                        px: 1,
                        py: 0.5,
                        display: "flex",
                        gap: 0.5,
                        boxShadow: 3,
                        zIndex: 1,
                        whiteSpace: "nowrap",
                    }}
                >
                    {reactions.map((reaction) => (
                        <Box
                            key={reaction.type}
                            onClick={() => {
                                onReact?.(message, reaction.type);
                                handleMenuClose();
                            }}
                            sx={{
                                width: 40,
                                height: 40,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 24,
                                cursor: "pointer",
                                transition: "all .18s ease",
                                "&:hover": {
                                    transform: "translateY(-5px) scale(1.2)",
                                },
                                "&:active": {
                                    transform: "scale(.95)",
                                },
                            }}
                        >
                            {reaction.emoji}
                        </Box>
                    ))}
                </Box>

                {message.type !== 'call' && (
                    <MenuItem onClick={() => {
                        handleMenuClose();
                        if (isPin) {
                            onUnpin();
                        } else {
                            onPin?.(message);
                        }
                    }}>
                        <ListItemIcon><PushPinIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>{isPin ? t('unpin') : t('pin')}</ListItemText>
                    </MenuItem>
                )}

                <MenuItem onClick={() => {
                    handleMenuClose();
                    onReply?.(message);
                }}>
                    <ListItemIcon><ReplyIcon fontSize="small" sx={{ mr: 1 }} /></ListItemIcon>
                    <ListItemText>{t('reply')}</ListItemText>
                </MenuItem>

                {message.type !== 'call' && (
                    <MenuItem onClick={() => {
                        handleMenuClose();
                        onForward?.(message);
                    }}>
                        <ListItemIcon><ReplyAllIcon fontSize="small" sx={{ mr: 1 }} /></ListItemIcon>
                        <ListItemText>{t('forward')}</ListItemText>
                    </MenuItem>
                )}

                {isOwn && (message.type === 'image' || message.type === 'video' || message.type === 'file') && (
                    <MenuItem onClick={() => {
                        handleMenuClose();
                        onReplace?.(message);
                    }}>
                        <ListItemIcon><AutorenewIcon fontSize="small" sx={{ mr: 1 }} /></ListItemIcon>
                        <ListItemText>{t('replace')}</ListItemText>
                    </MenuItem>
                )}

                {(message.type === 'image' || message.type === 'video') && (
                    <MenuItem onClick={() => {
                        handleMenuClose();
                        onPreview?.(message);
                    }}>
                        <ListItemIcon><PreviewIcon fontSize="small" sx={{ mr: 1 }} /></ListItemIcon>
                        <ListItemText>{t('preview')}</ListItemText>
                    </MenuItem>
                )}

                {(message.type === 'image' || message.type === 'video' || message.type === 'file' || message.type === 'voice') && (
                    <MenuItem onClick={handleSave}>
                        <ListItemIcon><DownloadIcon fontSize="small" sx={{ mr: 1 }} /></ListItemIcon>
                        <ListItemText>{t('save')}</ListItemText>
                    </MenuItem>
                )}

                {message.type === "text" && (
                    <MenuItem onClick={handleCopy}>
                        <ListItemIcon>
                            <ContentCopyIcon fontSize="small" sx={{ mr: 1 }} />
                        </ListItemIcon>
                        <ListItemText>{t("copy")}</ListItemText>
                    </MenuItem>
                )}

                {isOwn && message.type === 'text' && (
                    <MenuItem onClick={() => {
                        handleMenuClose();
                        onEdit?.(message);
                    }}>
                        <ListItemIcon><EditIcon fontSize="small" sx={{ mr: 1 }} /></ListItemIcon>
                        <ListItemText>{t('edit')}</ListItemText>
                    </MenuItem>
                )}

                {isOwn && (
                    <MenuItem
                        onClick={() => {
                            handleMenuClose();
                            onDelete?.(message);
                        }}
                        sx={{ color: 'error.main' }}
                    >
                        <ListItemIcon sx={{ color: 'error.main' }}>
                            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                        </ListItemIcon>
                        <ListItemText color="error.main" sx={{ color: 'red' }} className='color-red'>{t('delete')}</ListItemText>
                    </MenuItem>
                )}

                {isOwn && (
                    <MenuItem
                        onClick={() => {
                            handleMenuClose();
                            onStartSelect?.(message);
                        }}
                    >
                        <ListItemIcon>
                            <CheckCircleOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                        </ListItemIcon>
                        <ListItemText>{t('select')}</ListItemText>
                    </MenuItem>
                )}
            </Menu>

            <Popper
                open={reactionOpen}
                anchorEl={reactionAnchorEl}
                placement={isOwn ? 'top-end' : 'top-start'}
                transition
                disablePortal={false}
                modifiers={[
                    { name: 'offset', options: { offset: [0, 8] } },
                    { name: 'preventOverflow', options: { padding: 8 } },
                ]}
                sx={{
                    zIndex: 1600,
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        height: '20px',
                    },
                }}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={150}>
                        <Paper
                            sx={{
                                display: 'flex',
                                gap: 1,
                                px: 1.5,
                                py: 0.8,
                            }}
                        >
                            {reactions.map((reaction) => (
                                <Box
                                    key={reaction.type}
                                    onClick={() => {
                                        handleMenuClose();
                                        setReactionOpen(false);
                                        onReact?.(message, reaction.type);
                                    }}
                                    sx={{
                                        cursor: 'pointer',
                                        fontSize: 22,
                                        transition: 'transform 0.15s ease',
                                        '&:hover': { transform: 'scale(1.35)' },
                                    }}
                                >
                                    {reaction.emoji}
                                </Box>
                            ))}
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </Box>
    );
}

export default MessageBubble;
