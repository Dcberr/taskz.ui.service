import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material';

export function TaskTableSkeleton() {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Skeleton variant="text" width={120} height={32} />
          <Skeleton variant="rectangular" height={280} />
        </Stack>
      </CardContent>
    </Card>
  );
}

export function DashboardSkeleton() {
  return (
    <Stack spacing={2}>
      <Skeleton variant="text" width={220} height={42} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 2 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent>
              <Stack spacing={1}>
                <Skeleton variant="text" width={120} />
                <Skeleton variant="text" width={80} height={52} />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Stack>
  );
}

export function DrawerSkeleton() {
  return (
    <Stack spacing={2}>
      <Skeleton variant="text" width={180} height={42} />
      <Skeleton variant="rectangular" height={120} />
      <Skeleton variant="rectangular" height={160} />
      <Skeleton variant="rectangular" height={160} />
    </Stack>
  );
}
