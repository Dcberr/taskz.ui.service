import { Box, Paper, Skeleton, Stack, Typography } from '@mui/material';

type DistributionDatum = {
  label: string;
  value: number;
  color: string;
};

type DashboardChartsProps = {
  statusDistribution: DistributionDatum[];
  priorityDistribution: DistributionDatum[];
  isLoading: boolean;
};

function totalValue(items: DistributionDatum[]): number {
  return items.reduce((total, item) => total + item.value, 0);
}

function buildConicGradient(items: DistributionDatum[]): string {
  const total = totalValue(items);

  if (total === 0) {
    return '#e2e8f0';
  }

  let cursor = 0;
  const segments = items.map((item) => {
    const start = cursor;
    const end = cursor + (item.value / total) * 100;
    cursor = end;
    return `${item.color} ${start}% ${end}%`;
  });

  return `conic-gradient(${segments.join(', ')})`;
}

export function DashboardCharts({ statusDistribution, priorityDistribution, isLoading }: DashboardChartsProps) {
  const statusTotal = totalValue(statusDistribution);
  const priorityTotal = totalValue(priorityDistribution);
  const maxPriority = Math.max(...priorityDistribution.map((item) => item.value), 1);

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '0.9fr 1.1fr' }, gap: 2.25 }}>
      <Paper sx={{ p: 2.75, borderRadius: 2.5, bgcolor: '#ffffff' }}>
        <Stack spacing={2.25}>
          <Box>
            <Typography variant="h6">Status Distribution</Typography>
            <Typography variant="body2" color="text.secondary">
              Current task mix across the workspace.
            </Typography>
          </Box>
          {isLoading ? (
            <Skeleton variant="circular" width={164} height={164} />
          ) : (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.75} alignItems="center">
              <Box
                sx={{
                  width: 164,
                  height: 164,
                  borderRadius: '50%',
                  background: buildConicGradient(statusDistribution),
                  position: 'relative',
                  flexShrink: 0,
                  boxShadow: 'inset 0 0 0 1px rgba(15, 23, 42, 0.06)',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: 28,
                    borderRadius: '50%',
                    bgcolor: '#ffffff',
                    boxShadow: '0 0 0 1px rgba(15, 23, 42, 0.08)',
                  },
                }}
              >
                <Stack
                  spacing={0}
                  alignItems="center"
                  justifyContent="center"
                  sx={{ position: 'absolute', inset: 0, zIndex: 1 }}
                >
                  <Typography variant="h4">{statusTotal}</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={800}>
                    tasks
                  </Typography>
                </Stack>
              </Box>
              <Stack spacing={1} sx={{ width: '100%' }}>
                {statusDistribution.map((item) => (
                  <Stack key={item.label} direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                      <Typography variant="body2" fontWeight={750}>
                        {item.label}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" fontWeight={800}>
                      {item.value}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          )}
        </Stack>
      </Paper>

      <Paper sx={{ p: 2.75, borderRadius: 2.5, bgcolor: '#ffffff' }}>
        <Stack spacing={2.25}>
          <Box>
            <Typography variant="h6">Priority Load</Typography>
            <Typography variant="body2" color="text.secondary">
              Volume by priority, computed from open and completed tasks.
            </Typography>
          </Box>
          {isLoading ? (
            <Stack spacing={1.5}>
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} variant="rounded" height={34} />
              ))}
            </Stack>
          ) : (
            <Stack spacing={1.5}>
              {priorityDistribution.map((item) => {
                const width = priorityTotal === 0 ? 0 : Math.max((item.value / maxPriority) * 100, item.value > 0 ? 8 : 0);

                return (
                  <Stack key={item.label} spacing={0.75}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" fontWeight={800}>
                        {item.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={800}>
                        {item.value}
                      </Typography>
                    </Stack>
                    <Box sx={{ height: 10, borderRadius: 999, bgcolor: '#e2e8f0', overflow: 'hidden' }}>
                      <Box
                        sx={{
                          height: '100%',
                          width: `${width}%`,
                          minWidth: item.value > 0 ? 12 : 0,
                          borderRadius: 999,
                          bgcolor: item.color,
                        }}
                      />
                    </Box>
                  </Stack>
                );
              })}
            </Stack>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
