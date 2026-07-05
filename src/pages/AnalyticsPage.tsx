import InsightsIcon from '@mui/icons-material/Insights';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import { Box, Paper, Stack, Typography } from '@mui/material';

export function AnalyticsPage() {
  return (
    <Stack spacing={3}>
      <Paper sx={{ p: { xs: 2.25, md: 2.75 }, borderRadius: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.25,
              display: 'grid',
              placeItems: 'center',
              color: 'primary.dark',
              bgcolor: 'rgba(15, 118, 110, 0.1)',
              flexShrink: 0,
            }}
          >
            <InsightsIcon />
          </Box>
          <Box>
            <Typography variant="h4" gutterBottom>
              Analytics
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 680 }}>
              Reporting widgets will build on the same lightweight chart language introduced on the dashboard.
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.2fr 0.8fr' }, gap: 2 }}>
        <Paper sx={{ p: 2.75, borderRadius: 2.5 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <StackedLineChartIcon color="primary" />
              <Typography variant="h6">Throughput Preview</Typography>
            </Stack>
            <Box sx={{ height: 220, display: 'flex', alignItems: 'flex-end', gap: 1.25 }}>
              {[38, 64, 52, 82, 70, 92, 78, 104].map((height, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    height,
                    borderRadius: '8px 8px 0 0',
                    bgcolor: index % 3 === 0 ? 'secondary.main' : 'primary.main',
                    opacity: 0.85,
                  }}
                />
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary">
              Placeholder chart for completion velocity, backlog movement, and SLA reporting.
            </Typography>
          </Stack>
        </Paper>

        <Paper sx={{ p: 2.75, borderRadius: 2.5 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <QueryStatsIcon color="primary" />
              <Typography variant="h6">Next Metrics</Typography>
            </Stack>
            {['Lead time by priority', 'Requester volume', 'Assignee workload', 'Blocked aging'].map((item) => (
              <Box
                key={item}
                sx={{
                  p: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2.5,
                  bgcolor: '#ffffff',
                }}
              >
                <Typography variant="body2" fontWeight={850}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Box>
    </Stack>
  );
}
