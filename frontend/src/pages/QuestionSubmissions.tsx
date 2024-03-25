import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Badge,
  Button,
  Code,
  Popover,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCopy } from '@tabler/icons-react';

import { useUserStore } from '../store/userStore';
import type { SubmissionDto } from '../types/question';
import { QuestionStatus, getSubmissions } from '../api/question';

function QueryDisplay({ query }: { query: string }) {
  const [opened, { close, open }] = useDisclosure(false);

  const handleClick = () => {
    navigator.clipboard.writeText(query);
    notifications.show({ message: 'Copied to clipboard' });
  };

  return (
    <Popover withArrow shadow="lg" opened={opened}>
      <Popover.Target>
        <Button
          variant="transparent"
          onMouseEnter={open}
          onMouseLeave={close}
          p={0}
          rightSection={<IconCopy color="grey" />}
          onClick={handleClick}
        >
          <Text truncate maw="300px">
            <Code>{query}</Code>
          </Text>
        </Button>
      </Popover.Target>
      <Popover.Dropdown style={{ pointerEvents: 'none' }}>
        <Code styles={{ root: { fontSize: 16 } }}>{query}</Code>
      </Popover.Dropdown>
    </Popover>
  );
}

export default function QuestionSubmissions() {
  const { profile } = useUserStore();
  const { id } = useParams();
  const [submissions, setSubmissions] = useState<SubmissionDto[]>([]);

  useEffect(() => {
    if (!id || !profile) return;
    getSubmissions(Number.parseInt(id), Number.parseInt(profile.id)).then(
      (submissions) => {
        setSubmissions(submissions);
      },
    );
  }, [id, profile]);

  const rows = submissions.map((submission) => (
    <Table.Tr key={submission.submission_time.toString()}>
      <Table.Td>
        <QueryDisplay query={submission.query} />
      </Table.Td>
      <Table.Td>{submission.submission_time.toISOString()}</Table.Td>
      <Table.Td>
        <Badge
          color={
            submission.status === QuestionStatus.PENDING ? 'yellow' : 'green'
          }
          variant="light"
          style={{
            fontWeight: 'bold',
            textTransform: 'uppercase',
            fontSize: 14,
          }}
        >
          {submission.status}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Badge
          color={submission.is_correct ? 'green' : 'red'}
          variant="light"
          style={{
            fontWeight: 'bold',
            textTransform: 'uppercase',
            fontSize: 14,
          }}
        >
          {submission.is_correct ? '✅ Correct' : '❌ Incorrect'}
        </Badge>
      </Table.Td>
      <Table.Td>{submission.planning_time} ms</Table.Td>
      <Table.Td>{submission.execution_time} ms</Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack align="center" flex={1}>
      <Title order={2}>Question Submissions</Title>
      <Table
        withTableBorder
        striped
        highlightOnHover
        stickyHeader
        my={10}
        w={'70%'}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Query</Table.Th>
            <Table.Th>Submission Time</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Correctness</Table.Th>
            <Table.Th>Planning Time</Table.Th>
            <Table.Th>Execution Time</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Stack>
  );
}
