import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Badge, Stack, Table, Title } from '@mantine/core';

import { useUserStore } from '../store/userStore';
import type { SubmissionDto } from '../types/question';
import { QuestionStatus, getSubmissions } from '../api/question';

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
