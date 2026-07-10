import AccountTreeIcon from '@mui/icons-material/AccountTree';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../api/errors';
import { WorkflowBadges } from '../features/workflow/components/WorkflowBadges';
import { useWorkflowByMessage } from '../features/workflow/hooks/useWorkflow';
import { useAppTitle } from '../hooks/useAppTitle';

export function WorkflowsPage() {
  useAppTitle('Task | Workflows');

  const navigate = useNavigate();
  const [workflowId, setWorkflowId] = useState('');
  const [messageId, setMessageId] = useState('');
  const [submittedMessageId, setSubmittedMessageId] = useState<string | null>(null);
  const workflowByMessageQuery = useWorkflowByMessage(submittedMessageId);

  const handleWorkflowSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedWorkflowId = workflowId.trim();

    if (trimmedWorkflowId) {
      navigate(`/workflows/${encodeURIComponent(trimmedWorkflowId)}`);
    }
  };

  const handleMessageSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedMessageId = messageId.trim();

    if (trimmedMessageId) {
      setSubmittedMessageId(trimmedMessageId);
    }
  };

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: { xs: 2.25, md: 2.75 }, borderRadius: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
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
              <AccountTreeIcon />
            </Box>
            <Box>
              <Typography variant="h4" gutterBottom>
                Workflows
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 700 }}>
                Inspect execution sequence, critical path, blockers, and downstream impact for workflow-aware tasks.
              </Typography>
            </Box>
          </Stack>
          <Button component={RouterLink} to="/messages/mock" variant="contained" endIcon={<OpenInNewIcon />}>
            Message Console
          </Button>
        </Stack>
      </Paper>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
        <Paper component="form" onSubmit={handleWorkflowSubmit} sx={{ p: 2.5, borderRadius: 2.5 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <SearchIcon color="primary" />
              <Typography variant="h6">Open by Workflow ID</Typography>
            </Stack>
            <TextField
              label="Workflow ID"
              value={workflowId}
              onChange={(event) => setWorkflowId(event.target.value)}
              fullWidth
              size="small"
            />
            <Button type="submit" variant="contained" disabled={!workflowId.trim()} sx={{ alignSelf: 'flex-start' }}>
              Open Workflow
            </Button>
          </Stack>
        </Paper>

        <Paper component="form" onSubmit={handleMessageSubmit} sx={{ p: 2.5, borderRadius: 2.5 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <MailOutlineIcon color="primary" />
              <Typography variant="h6">Find by Message ID</Typography>
            </Stack>
            <TextField
              label="Message ID"
              value={messageId}
              onChange={(event) => setMessageId(event.target.value)}
              fullWidth
              size="small"
            />
            <Button type="submit" variant="outlined" disabled={!messageId.trim() || workflowByMessageQuery.isFetching} sx={{ alignSelf: 'flex-start' }}>
              Find Workflow
            </Button>
          </Stack>
        </Paper>
      </Box>

      {submittedMessageId ? (
        <Paper sx={{ p: 2.5, borderRadius: 2.5 }}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
              <Box>
                <Typography variant="h6">Message Lookup Result</Typography>
                <Typography variant="body2" color="text.secondary">
                  Message {submittedMessageId}
                </Typography>
              </Box>
              {workflowByMessageQuery.isFetching ? <Chip label="Searching" size="small" /> : null}
            </Stack>
            <Divider />
            {workflowByMessageQuery.isError ? (
              <Alert severity="warning">
                {getApiErrorMessage(workflowByMessageQuery.error, 'Workflow not found for this message.')}
              </Alert>
            ) : workflowByMessageQuery.data ? (
              <Stack spacing={1.5}>
                <WorkflowBadges summary={workflowByMessageQuery.data.summary} />
                <Typography variant="body2" color="text.secondary">
                  Workflow {workflowByMessageQuery.data.workflowId} · {workflowByMessageQuery.data.tasks.length} linked tasks
                </Typography>
                <Button
                  component={RouterLink}
                  to={`/workflows/${workflowByMessageQuery.data.workflowId}`}
                  variant="contained"
                  endIcon={<OpenInNewIcon />}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Open Workflow
                </Button>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Submit a message ID to load its workflow.
              </Typography>
            )}
          </Stack>
        </Paper>
      ) : null}
    </Stack>
  );
}
