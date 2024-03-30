import { useParams } from 'react-router-dom';
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
} from '@mantine/core';
import Podium from '../components/podium';
import { LeaderboardEntry, getLeaderboard } from '../api/leaderboard';
import { useUserStore } from '../store/userStore';

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

  useEffect(() => {
    if (!id || !profile) return;
    getLeaderboard(
      profile.id,
      Number.parseInt(id),
      currentPage,
      ITEMS_PER_PAGE,
    ).then((leaderboard) => {
      setData(leaderboard.leaderboardEntries);
      setCurrentStudent(leaderboard.curr_student);
      setTotal(leaderboard.total);
      if (currentPage === 1) {
        // slice the top 3 entries for the podium
        setTopThree(leaderboard.leaderboardEntries.slice(0, 3));
      }
    });
  }, [id, profile, currentPage]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pagedData = data.slice(startIndex, endIndex);

  const getHighlightColor = () => {
    if (colorScheme === 'dark') {
      return '#243441';
    }
    return '#e8f3fc';
  };

  return (
    <Container>
      <Title>Leaderboard for question {id}</Title>
      {current_student ? (
        <Card mt={5}>
          <Text>Your submission:</Text>
          <Text>
            Rank <b>{current_student?.rank}</b>, Total Time:{' '}
            {current_student?.totalTime} sec
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
            {pagedData.map((entry) => (
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
                <Table.Td>{entry.submittedDate}</Table.Td>
                <Table.Td>{entry.executionTime} sec</Table.Td>
                <Table.Td>{entry.planningTime} sec</Table.Td>
                <Table.Td>{entry.totalTime} sec</Table.Td>
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
