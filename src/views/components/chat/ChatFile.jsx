import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getFileIcon } from './FileIcon';

export default function ChatFile({ fileUrl, isOwn, maxWidth = 300 }) {
  const { t } = useTranslation();
  const [hasError, setHasError] = useState(false);
  const fileName = fileUrl ? fileUrl.split('/').pop() : t('unknown_file');

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        maxWidth,
      }}
    >
      {/* File Icon */}
      <Box
        sx={{
          p: 1,
          backgroundColor: 'action.selected',
          borderRadius: '50%',
          height: { sm: 45 },
          width: { sm: 50 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {getFileIcon(fileUrl)}
      </Box>

      {/* File Link or Error */}
      <Typography
        variant="body2"
        sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
        onClick={(e) => e.stopPropagation()}
        underline="hover"
      >
        {fileUrl && !hasError ? (
          <Box
            component="a"
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'text.primary',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' }
            }}

            onError={() => setHasError(true)}
          >
            {fileName}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: 'red' }}>
            {t('file_not_found')}
          </Typography>
        )}
      </Typography>
    </Box>
  );
}
