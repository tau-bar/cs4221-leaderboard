import { Card, Text, Group, Stack, Title } from '@mantine/core';
import { LeaderboardEntry } from '../api/leaderboard';

interface PodiumProps {
  data: LeaderboardEntry[];
}

const Podium = ({ data }: PodiumProps) => {
  const [first, second, third] = data;

  return (
    <Group
      //   position="center"
      //   spacing="xl"
      justify="center"
      style={{ marginTop: 40 }}
    >
      {/* Second place */}
      {second && (
        <Card
          shadow="sm"
          p="lg"
          style={{
            backgroundColor: '#B4B4B4',
            height: 260,
            width: 150,
            zIndex: 1,
            color: 'black',
          }}
        >
          <Stack align="center" gap="md">
            <Title>2nd</Title>
            <Text size="xl" lineClamp={1}>
              {second.studentName}
            </Text>
            <Text size="md">{second.totalTime} ms</Text>
            <Text style={{ fontSize: 60, marginTop: -10 }}>🥈</Text>
          </Stack>
        </Card>
      )}

      {/* First place */}
      {first && (
        <Card
          shadow="sm"
          p="lg"
          style={{
            backgroundColor: '#FFD700',
            height: 300,
            width: 150,
            zIndex: 2,
            color: 'black',
          }}
        >
          <Stack align="center" gap="lg">
            <Title>1st</Title>
            <Text size="xl" lineClamp={1}>
              {first.studentName}
            </Text>
            <Text size="md">{first.totalTime} ms</Text>
            <Text style={{ fontSize: 60, marginTop: -10 }}>🥇</Text>
          </Stack>
        </Card>
      )}

      {/* Third place */}
      {third && (
        <Card
          shadow="sm"
          p="lg"
          style={{
            backgroundColor: '#CD7F32',
            height: 230,
            width: 150,
            zIndex: 1,
            color: 'black',
          }}
        >
          <Stack align="center" gap="xs">
            <Title>3rd</Title>
            <Text size="xl" lineClamp={1}>
              {third.studentName}
            </Text>
            <Text size="md">{third.totalTime} ms</Text>
            <Text style={{ fontSize: 60, marginTop: -10 }}>🥉</Text>
          </Stack>
        </Card>
      )}
    </Group>
  );
};

export default Podium;
