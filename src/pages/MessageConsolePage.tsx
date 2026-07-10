import AddIcon from '@mui/icons-material/Add';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SendIcon from '@mui/icons-material/Send';
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
import { useMemo, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { getApiErrorMessage } from '../api/errors';
import { useToast } from '../components/ToastProvider';
import { useMockMessageMutation } from '../features/message/hooks/useMockMessageMutation';
import { WorkflowBadges } from '../features/workflow/components/WorkflowBadges';
import { useWorkflowByMessage } from '../features/workflow/hooks/useWorkflow';
import { useAppTitle } from '../hooks/useAppTitle';
import type { MessageRequest } from '../types/message';
import { formatDateTime } from '../utils/date';

type FormState = {
  sender: string;
  content: string;
  currentMessage: string;
  channelName: string;
  conversationId: string;
  externalMessageId: string;
  conversationMessagesText: string;
};

const defaultFormState: FormState = {
  sender: 'Product Lead',
  content: '',
  currentMessage: '',
  channelName: 'backend',
  conversationId: 'conv-1',
  externalMessageId: 'postman-1',
  conversationMessagesText: '',
};

function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function MessageConsolePage() {
  useAppTitle('Task | Message Console');

  const { showToast } = useToast();
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const [participantInput, setParticipantInput] = useState('');
  const [participants, setParticipants] = useState<string[]>(['Bach', 'An']);
  const [submittedMessageId, setSubmittedMessageId] = useState<string | null>(null);
  const mockMessageMutation = useMockMessageMutation();
  const workflowByMessageQuery = useWorkflowByMessage(submittedMessageId);

  const validationError = useMemo(() => {
    if (!formState.sender.trim()) {
      return 'Sender is required.';
    }
    if (!formState.currentMessage.trim()) {
      return 'Current message is required.';
    }
    if (!formState.content.trim()) {
      return 'Content is required.';
    }
    return null;
  }, [formState.content, formState.currentMessage, formState.sender]);

  const updateField = (field: keyof FormState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const addParticipant = () => {
    const trimmed = participantInput.trim();
    if (!trimmed || participants.includes(trimmed)) {
      return;
    }

    setParticipants((current) => [...current, trimmed]);
    setParticipantInput('');
  };

  const handleParticipantKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addParticipant();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validationError) {
      showToast({ message: validationError, severity: 'warning' });
      return;
    }

    const payload: MessageRequest = {
      sender: formState.sender.trim(),
      content: formState.content.trim(),
      currentMessage: formState.currentMessage.trim(),
      ...(formState.channelName.trim() ? { channelName: formState.channelName.trim() } : {}),
      ...(formState.conversationId.trim() ? { conversationId: formState.conversationId.trim() } : {}),
      ...(formState.externalMessageId.trim() ? { externalMessageId: formState.externalMessageId.trim() } : {}),
      conversationMessages: splitLines(formState.conversationMessagesText),
      participants,
    };

    try {
      const response = await mockMessageMutation.mutateAsync(payload);
      setSubmittedMessageId(response.id);
      showToast({ message: 'Message processed successfully.', severity: 'success' });
    } catch (error) {
      showToast({ message: getApiErrorMessage(error, 'Unable to process message.'), severity: 'error' });
    }
  };

  const response = mockMessageMutation.data;

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: { xs: 2.25, md: 2.75 }, borderRadius: 3 }}>
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
            <MailOutlineIcon />
          </Box>
          <Box>
            <Typography variant="h4" gutterBottom>
              Message Console
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
              Send a mock message into workflow intelligence and inspect the generated message, workflow, and tasks.
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1.15fr) minmax(360px, 0.85fr)' }, gap: 2 }}>
        <Paper component="form" onSubmit={handleSubmit} sx={{ p: 2.5, borderRadius: 2.5 }}>
          <Stack spacing={2.1}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 1.5 }}>
              <TextField label="Sender" value={formState.sender} onChange={(event) => updateField('sender', event.target.value)} required size="small" />
              <TextField
                label="Channel"
                value={formState.channelName}
                onChange={(event) => updateField('channelName', event.target.value)}
                size="small"
              />
              <TextField
                label="Conversation ID"
                value={formState.conversationId}
                onChange={(event) => updateField('conversationId', event.target.value)}
                size="small"
              />
              <TextField
                label="External Message ID"
                value={formState.externalMessageId}
                onChange={(event) => updateField('externalMessageId', event.target.value)}
                size="small"
              />
            </Box>

            <TextField
              label="Current Message"
              value={formState.currentMessage}
              onChange={(event) => updateField('currentMessage', event.target.value)}
              required
              multiline
              minRows={3}
            />

            <TextField
              label="Full Raw Content"
              value={formState.content}
              onChange={(event) => updateField('content', event.target.value)}
              required
              multiline
              minRows={5}
            />

            <Box>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
                <TextField
                  label="Participant"
                  value={participantInput}
                  onChange={(event) => setParticipantInput(event.target.value)}
                  onKeyDown={handleParticipantKeyDown}
                  size="small"
                  fullWidth
                />
                <Button variant="outlined" startIcon={<AddIcon />} onClick={addParticipant} disabled={!participantInput.trim()}>
                  Add
                </Button>
              </Stack>
              <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.75} sx={{ mt: 1.25 }}>
                {participants.map((participant) => (
                  <Chip
                    key={participant}
                    label={participant}
                    onDelete={() => setParticipants((current) => current.filter((item) => item !== participant))}
                    sx={{ borderRadius: 1.5, fontWeight: 700 }}
                  />
                ))}
              </Stack>
            </Box>

            <TextField
              label="Conversation History"
              value={formState.conversationMessagesText}
              onChange={(event) => updateField('conversationMessagesText', event.target.value)}
              multiline
              minRows={4}
              helperText="One previous message per line."
            />

            {validationError ? <Alert severity="info">{validationError}</Alert> : null}

            <Button
              type="submit"
              variant="contained"
              startIcon={<SendIcon />}
              disabled={Boolean(validationError) || mockMessageMutation.isPending}
              sx={{ alignSelf: 'flex-start', minWidth: 156 }}
            >
              Send Message
            </Button>
          </Stack>
        </Paper>

        <Stack spacing={2}>
          <Paper sx={{ p: 2.5, borderRadius: 2.5 }}>
            <Typography variant="h6" gutterBottom>
              Message Response
            </Typography>
            <Divider sx={{ mb: 1.5 }} />
            {mockMessageMutation.isError ? (
              <Alert severity="error">{getApiErrorMessage(mockMessageMutation.error, 'Unable to process message.')}</Alert>
            ) : response ? (
              <Stack spacing={1.15}>
                <Typography variant="body2">
                  <strong>ID:</strong> {response.id}
                </Typography>
                <Typography variant="body2">
                  <strong>Sender:</strong> {response.sender}
                </Typography>
                <Typography variant="body2">
                  <strong>Source:</strong> {response.source ?? '-'}
                </Typography>
                <Typography variant="body2">
                  <strong>Channel:</strong> {response.channelName ?? '-'}
                </Typography>
                <Typography variant="body2">
                  <strong>Processed:</strong> {response.processed ? 'Yes' : 'No'}
                </Typography>
                <Typography variant="body2">
                  <strong>Created:</strong> {formatDateTime(response.createdAt)}
                </Typography>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No message has been submitted yet.
              </Typography>
            )}
          </Paper>

          <Paper sx={{ p: 2.5, borderRadius: 2.5 }}>
            <Typography variant="h6" gutterBottom>
              Generated Workflow
            </Typography>
            <Divider sx={{ mb: 1.5 }} />
            {workflowByMessageQuery.isFetching ? (
              <Typography variant="body2" color="text.secondary">
                Looking for workflow context...
              </Typography>
            ) : workflowByMessageQuery.isError ? (
              <Alert severity="warning">
                {getApiErrorMessage(workflowByMessageQuery.error, 'Workflow not found for this message.')}
              </Alert>
            ) : workflowByMessageQuery.data ? (
              <Stack spacing={1.5}>
                <WorkflowBadges summary={workflowByMessageQuery.data.summary} />
                <Typography variant="body2" color="text.secondary">
                  Workflow {workflowByMessageQuery.data.workflowId} · {workflowByMessageQuery.data.tasks.length} tasks
                </Typography>
                <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.75}>
                  {workflowByMessageQuery.data.tasks.slice(0, 6).map((task, index) => (
                    <Chip
                      key={task.id || `${task.title}-${index}`}
                      label={task.title || task.id || 'Untitled task'}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 1.5, maxWidth: '100%' }}
                    />
                  ))}
                </Stack>
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
                A workflow lookup will run after a successful message response.
              </Typography>
            )}
          </Paper>
        </Stack>
      </Box>
    </Stack>
  );
}
