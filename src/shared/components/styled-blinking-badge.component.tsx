import {
  Badge, badgeClasses, type BadgeProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledBlinkingBadge = styled(({ className, ...props }: BadgeProps) => (
  <Badge {...props} classes={{ root: className }} />
))(() => ({
  '@keyframes blinker': {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  [`.${badgeClasses.dot}`]: {
    animation: 'blinker 1s linear(0, 0, 1) infinite',
    animationTimingFunction: '',
  },
}));
