import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { Box, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import type { DashboardSummary } from '../../../types/dashboard';

type DashboardCardGridProps = {
  summary?: DashboardSummary;
  isLoading: boolean;
};

const cardItems = [
  { key: 'openTasks', label: 'Open Tasks', helper: 'Active work queue', color: '#0f766e', icon: TaskAltIcon },
  { key: 'completedTasks', label: 'Completed', helper: 'Closed successfully', color: '#16a34a', icon: CheckCircleIcon },
  { key: 'blockedTasks', label: 'Blocked', helper: 'Needs intervention', color: '#f97316', icon: BlockIcon },
  { key: 'urgentTasks', label: 'Urgent', helper: 'Highest priority', color: '#dc2626', icon: PriorityHighIcon },
] as const;

export function DashboardCardGrid({ summary, isLoading }: DashboardCardGridProps) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 2.25 }}>
      {cardItems.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.key} sx={{ borderRadius: 2.5, overflow: 'hidden' }}>
            <CardContent sx={{ p: 2.75, '&:last-child': { pb: 2.75 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={650}>
                    {item.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.helper}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: 2.25,
                    display: 'grid',
                    placeItems: 'center',
                    color: item.color,
                    bgcolor: `${item.color}18`,
                  }}
                >
                  <Icon fontSize="small" />
                </Box>
              </Stack>
              <Box sx={{ minHeight: 52, display: 'flex', alignItems: 'flex-end', mt: 1.25 }}>
                {isLoading ? (
                  <Skeleton variant="text" width={80} height={48} />
                ) : (
                  <Typography variant="h3" fontWeight={780} lineHeight={1}>
                    {summary?.[item.key] ?? 0}
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}
