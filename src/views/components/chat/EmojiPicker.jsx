import { Card, ClickAwayListener, Popper } from '@mui/material';
import EmojiPickerReact from 'emoji-picker-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@core/hooks/useSettings'

const EmojiPicker = ({ 
  onSelect, 
  onClose,
  anchorEl = null,
  placement = 'top-start',
  width = 350,
  height = 400
}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  const { settings } = useSettings();

  const handleEmojiClick = (emojiData) => {
    onSelect(emojiData.emoji);
  };

  const handleClickAway = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement={placement}
      style={{ zIndex: 9999 }}
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [0, 10],
          },
        },
      ]}
    >
      <ClickAwayListener onClickAway={handleClickAway}>
        <Card 
          sx={{ 
            overflow: 'hidden'
          }}
        >
          <EmojiPickerReact
            onEmojiClick={handleEmojiClick}
            width={width}
            height={height}
            theme={settings.mode === 'dark' ? 'dark' : 'light'}
            previewConfig={{
              showPreview: false
            }}
            searchPlaceholder={t('search_emojis')}
            skinTonesDisabled
          />
        </Card>
      </ClickAwayListener>
    </Popper>
  );
};

export default EmojiPicker;
