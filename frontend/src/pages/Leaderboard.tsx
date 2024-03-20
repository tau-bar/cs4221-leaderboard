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

export interface LeaderboardEntry {
  rank: number;
  studentName: string;
  submittedDate: string;
  executionTime: number; // in seconds
  planningTime: number; // in seconds
  totalTime: number; // in seconds
  isCurrentUser?: boolean; // To identify the current user's submission
}

// Mock data generator
const generateMockData = (): LeaderboardEntry[] => {
  const mockData: LeaderboardEntry[] = [
    // Include some fixed entries, possibly from a backend in a real app
    {
      rank: 1,
      studentName: 'Alice',
      submittedDate: '2024-03-20',
      executionTime: 120,
      planningTime: 300,
      totalTime: 420,
    },
    {
      rank: 2,
      studentName: 'Bob',
      submittedDate: '2024-03-19',
      executionTime: 150,
      planningTime: 350,
      totalTime: 500,
    },
    {
      rank: 3,
      studentName: 'Charlie',
      submittedDate: '2024-03-18',
      executionTime: 200,
      planningTime: 300,
      totalTime: 500,
      isCurrentUser: true,
    },
    {
      rank: 4,
      studentName: 'Bob',
      submittedDate: '2024-03-19',
      executionTime: 150,
      planningTime: 350,
      totalTime: 500,
    },
    {
      rank: 5,
      studentName: 'Charlie',
      submittedDate: '2024-03-18',
      executionTime: 200,
      planningTime: 300,
      totalTime: 500,
    },
    {
      rank: 6,
      studentName: 'Bob',
      submittedDate: '2024-03-19',
      executionTime: 150,
      planningTime: 350,
      totalTime: 500,
    },
    {
      rank: 7,
      studentName: 'Charlie',
      submittedDate: '2024-03-18',
      executionTime: 200,
      planningTime: 300,
      totalTime: 500,
    },
    {
      rank: 8,
      studentName: 'Bob',
      submittedDate: '2024-03-19',
      executionTime: 150,
      planningTime: 350,
      totalTime: 500,
    },
    {
      rank: 9,
      studentName: 'Charlie',
      submittedDate: '2024-03-18',
      executionTime: 200,
      planningTime: 300,
      totalTime: 500,
    },
    {
      rank: 10,
      studentName: 'Bob',
      submittedDate: '2024-03-19',
      executionTime: 150,
      planningTime: 350,
      totalTime: 500,
    },
    // More entries can be added here
  ];

  // Sort by rank for demonstration
  mockData.sort((a, b) => a.rank - b.rank);

  return mockData;
};

const ITEMS_PER_PAGE = 10;

const Leaderboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const { id } = useParams();
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    setData(generateMockData());
  }, []);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pagedData = data.slice(startIndex, endIndex);

  const currentUserSubmission: LeaderboardEntry | undefined = data.find(
    (entry) => entry.isCurrentUser,
  );

  const getHighlightColor = () => {
    if (colorScheme === 'dark') {
      return '#243441';
    }
    return '#e8f3fc';
  };

  return (
    <Container>
      <Title>Leaderboard for question {id}</Title>
      {currentUserSubmission ? (
        <Card mt={5}>
          <Text>Your submission:</Text>
          <Text>
            Rank <b>{currentUserSubmission?.rank}</b>, Total Time:{' '}
            {currentUserSubmission?.totalTime} sec
          </Text>
        </Card>
      ) : (
        <Alert
          color="blue"
          style={{
            position: 'absolute',
            bottom: 10,
            width: 'calc(100% - 20px)',
          }}
        >
          You have not submitted yet!
        </Alert>
      )}
      <Stack align="center">
        <Podium data={data} />

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
            {data.length === 0 && (
              <Alert color="red">No submissions yet!</Alert>
            )}
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
        </Table>
        <Pagination
          total={Math.ceil(data.length / ITEMS_PER_PAGE)}
          value={currentPage}
          onChange={setCurrentPage}
        />
      </Stack>
    </Container>
  );
};

export default Leaderboard;
