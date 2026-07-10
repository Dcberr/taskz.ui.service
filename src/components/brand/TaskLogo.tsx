import { Box } from '@mui/material';

type TaskLogoProps = {
  size?: number;
};

export function TaskLogo({ size = 40 }: TaskLogoProps) {
  return (
    <Box
      component="span"
      aria-hidden="true"
      sx={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        display: 'block',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
        bgcolor: '#020617',
        boxShadow: '0 12px 28px rgba(16, 185, 129, 0.22)',
      }}
    >
      <Box
        component="img"
        src="/taskz-logo.png"
        alt=""
        draggable={false}
        sx={{
          width: '100%',
          height: '100%',
          display: 'block',
          objectFit: 'cover',
          transform: 'scale(1.58)',
          transformOrigin: 'center',
          userSelect: 'none',
        }}
      />
    </Box>
  );
}
