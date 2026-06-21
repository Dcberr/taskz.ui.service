import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material';
import type { DashboardSummary } from '../../../types/dashboard';

type DashboardCardGridProps = {
  summary?: DashboardSummary;
  isLoading: boolean;
};

const cardItems = [
  { key: 'openTasks', label: 'Open Tasks' },
  { key: 'completedTasks', label: 'Completed Tasks' },
  { key: 'blockedTasks', label: 'Blocked Tasks' },
  { key: 'urgentTasks', label: 'Urgent Tasks' },
] as const;

export function DashboardCardGrid({ summary, isLoading }: DashboardCardGridProps) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 2 }}>
      {cardItems.map((item) => (
        <Card key={item.key}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {item.label}
            </Typography>
            <Box sx={{ minHeight: 48, display: 'flex', alignItems: 'center' }}>
              {isLoading ? (
                <Skeleton variant="text" width={80} height={48} />
              ) : (
                <Typography variant="h3" fontWeight={800}>
                  {summary?.[item.key] ?? 0}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
