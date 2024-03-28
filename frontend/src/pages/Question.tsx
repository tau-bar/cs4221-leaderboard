import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Flex,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { Editor } from '@monaco-editor/react';
import 'monaco-sql-languages/out/esm/pgsql/pgsql.contribution';

import { ROUTES } from '../constants/routes';
import { getQuestion, submitQuery } from '../api/question';
import type { QuestionDto } from '../types/question';
import { IconDownload, IconTrophy } from '@tabler/icons-react';

export default function Question() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState<QuestionDto | null>(null);
  const [query, setQuery] = useState('-- write your query here\n\n');
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    if (!id) return;
    getQuestion(Number.parseInt(id)).then((question) => {
      setQuestion(question);
      setLoading(false);
    });
  }, [id]);

  const handleDownload = (filename: string, data: string) => () => {
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = () => {
    if (!id) {
      notifications.show({ message: 'Question not found', color: 'red' });
      return;
    }

    submitQuery(Number.parseInt(id), query).then((success) => {
      if (success) {
        notifications.show({
          title: 'Query submitted successfully',
          message: 'Redirecting...',
          color: 'green',
        });
        setTimeout(
          () => navigate(ROUTES.QUESTION_SUBMISSIONS.replace(':id', id)),
          1000,
        );
      } else {
        notifications.show({
          message: 'Failed to submit query',
          color: 'red',
        });
      }
    });
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!question) {
    return (
      <div>
        <Text>Question not found</Text>
        <Text>
          Back to <Link to={ROUTES.HOME}>Questions list</Link>
        </Text>
      </div>
    );
  }

  return (
    <Flex align="stretch" h="80vh" gap="md">
      <Stack flex={1} justify="space-between">
        <Stack>
          <Title order={2}>{question.name}</Title>
          <Flex gap="sm">
            <Button
              rightSection={<IconDownload size={14} />}
              variant="light"
              onClick={handleDownload('schema', question.question_schema)}
            >
              Schema
            </Button>
            <Button
              rightSection={<IconDownload size={14} />}
              variant="light"
              onClick={handleDownload('data', question.question_data)}
            >
              Sample data
            </Button>
          </Flex>
          <Text>{question.description}</Text>
          <Text>{question.question_schema}</Text>
          <Text>{question.question_data}</Text>
          <Text>{question.answer_data}</Text>
          <Text>Max timeout: {question.max_timeout}s</Text>
        </Stack>
        <Link to={ROUTES.LEADERBOARD.replace(':id', id ?? '')}>
          <Button color="yellow" leftSection={<IconTrophy />}>
            Leaderboard
          </Button>
        </Link>
      </Stack>
      <Stack flex={1}>
        <Editor
          language="pgsql"
          value={query}
          onChange={(value) => setQuery(value ?? '')}
          theme={colorScheme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            fontSize: 16,
          }}
        />
        <Flex justify="end">
          <Button type="submit" onClick={handleSubmit}>
            Submit
          </Button>
        </Flex>
      </Stack>
    </Flex>
  );
}
