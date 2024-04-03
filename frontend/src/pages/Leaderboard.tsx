import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Table,
  Pagination,
  Text,
  Alert,
  Container,
  Stack,
  Card,
  Title,
  useMantineColorScheme,
  Button,
  Flex,
} from '@mantine/core';
import Podium from '../components/podium';
import { LeaderboardEntry, getLeaderboard } from '../api/leaderboard';
import { useUserStore } from '../store/userStore';
import { getQuestion } from '../api/question';
import { QuestionDto } from '../types/question';
import { IconArrowLeft } from '@tabler/icons-react';
import { ROUTES } from '../constants/routes';

const ITEMS_PER_PAGE = 10;

const Leaderboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [current_student, setCurrentStudent] =
    useState<LeaderboardEntry | null>(null);
  const [topThree, setTopThree] = useState<LeaderboardEntry[]>([]);
  const { id } = useParams();
  const { colorScheme } = useMantineColorScheme();
  const { profile } = useUserStore();
  const [question, setQuestion] = useState<QuestionDto | null>();

  useEffect(() => {
    if (!id) return;
    getQuestion(parseInt(id)).then((question) => {
      setQuestion(question);
    });
  }, [id]);

  useEffect(() => {
    getLeaderboardQuery();
  }, [id, profile, currentPage]);

  const getLeaderboardQuery = async () => {
    if (!id || !profile) return;

    const leaderboard = await getLeaderboard(
      profile.id,
      Number.parseInt(id),
      currentPage,
      ITEMS_PER_PAGE,
    );
    console.log('Setting leaderboard data for page', currentPage, leaderboard);
    setData(leaderboard.leaderboardEntries);
    setCurrentStudent(leaderboard.curr_student);
    setTotal(leaderboard.total);
    if (currentPage === 1) {
      // slice the top 3 entries for the podium
      setTopThree(leaderboard.leaderboardEntries.slice(0, 3));
    }
  };

  const getHighlightColor = () => {
    if (colorScheme === 'dark') {
      return '#243441';
    }
    return '#e8f3fc';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Correctly typed options for TypeScript
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // use user's timezone
    };

    // Using toLocaleString to combine date and time formatting in one go
    let formattedDate = date.toLocaleString('en-US', options);

    // Custom rearrangement to DD-MM-YYYY TIME AM/PM format
    // Extract parts using regex from the formatted string
    const matches = formattedDate.match(
      /(\d{2})\/(\d{2})\/(\d{4}), (\d{2}:\d{2}:\d{2}) (AM|PM)/,
    );
    if (matches) {
      // Reorder and format the date string as per requirement
      formattedDate = `${matches[2]}-${matches[1]}-${matches[3]} ${matches[4]} ${matches[5]}`;
    }

    return formattedDate;
  };
  return (
    <Container>
      <Flex gap="sm">
        <Link to={ROUTES.QUESTION.replace(':id', id ?? '')}>
          <Button variant="default" leftSection={<IconArrowLeft />}>
            Question
          </Button>
        </Link>
        <Title order={2}>
          Leaderboard for #{id} {question?.question_name}
        </Title>
      </Flex>
      {current_student ? (
        <Card mt={5}>
          <Text>Your submission:</Text>
          <Text>
            Rank <b>{current_student?.rank}</b>, Total Time:{' '}
            {current_student?.totalTime} ms
          </Text>
        </Card>
      ) : (
        <Alert color="blue" mt={2}>
          You have not submitted a correct query yet!
        </Alert>
      )}
      <Stack align="center">
        <Podium data={topThree} />

        <Table striped highlightOnHover stickyHeader my={10}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Rank</Table.Th>
              <Table.Th>Student Name</Table.Th>
              <Table.Th>Submitted Date</Table.Th>
              <Table.Th>Execution Time</Table.Th>
              <Table.Th>Planning Time</Table.Th>
              <Table.Th>Total Time</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((entry) => (
              <Table.Tr
                key={entry.rank}
                style={{
                  backgroundColor: entry.isCurrentUser
                    ? getHighlightColor()
                    : '',
                }}
              >
                <Table.Td>{entry.rank}</Table.Td>
                <Table.Td>{entry.studentName}</Table.Td>
                <Table.Td>{formatDate(entry.submittedDate)}</Table.Td>
                <Table.Td>{entry.executionTime} ms</Table.Td>
                <Table.Td>{entry.planningTime} ms</Table.Td>
                <Table.Td>{entry.totalTime} ms</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
          {data.length === 0 && (
            <Table.Caption>No submissions yet!</Table.Caption>
          )}
        </Table>
        <Pagination
          total={Math.ceil(total / ITEMS_PER_PAGE)}
          value={currentPage}
          onChange={setCurrentPage}
        />
      </Stack>
    </Container>
  );
};

export default Leaderboard;
