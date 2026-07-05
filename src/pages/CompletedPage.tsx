import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TuneIcon from '@mui/icons-material/Tune';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';

export function CompletedPage() {
  return (
    <Stack spacing={3}>
      <Paper sx={{ p: { xs: 2.25, md: 2.75 }, borderRadius: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Completed Tasks
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 620 }}>
              A dedicated archive for finished work is ready for the next task-management epic.
            </Typography>
          </Box>
          <Chip
            icon={<CheckCircleIcon />}
            label="Coming soon"
            sx={{ borderRadius: 1.5, color: '#166534', bgcolor: 'rgba(22, 101, 52, 0.1)', fontWeight: 850 }}
          />
        </Stack>
      </Paper>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
        {[
          { icon: CheckCircleIcon, title: 'Completion archive', description: 'Review closed tasks with owner, priority, and completion time.' },
          { icon: ScheduleIcon, title: 'Cycle-time insight', description: 'Compare created and completed timestamps once analytics expands.' },
          { icon: TuneIcon, title: 'Advanced filters', description: 'Filter by requester, assignees, priority, source, and completion window.' },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <Paper key={item.title} sx={{ p: 2.75, borderRadius: 2.5 }}>
              <Stack spacing={1.5}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2.25,
                    display: 'grid',
                    placeItems: 'center',
                    color: 'primary.dark',
                    bgcolor: 'rgba(15, 118, 110, 0.1)',
                  }}
                >
                  <Icon fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          );
        })}
      </Box>
    </Stack>
  );
}
