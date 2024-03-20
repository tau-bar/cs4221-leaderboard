import { Flex, Group, Paper, PaperProps, Text } from '@mantine/core';
import { GoogleLogin } from '@react-oauth/google';

export function AuthenticationForm(props: PaperProps) {
  const responseMessage = (response: any) => {
    console.log(response);
  };
  const errorMessage = () => {
    console.log('Error');
  };
  return (
    <Flex mih={'100vh'} align={'center'} justify={'center'}>
      <Paper radius="md" p="xl" withBorder {...props}>
        <Text size="lg" fw={500}>
          Welcome to CS4221 Leaderboard, login with:
        </Text>

        <Group grow mb="md" mt="md">
          <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
          {/* <GoogleButton radius="xl">Google</GoogleButton> */}
        </Group>
      </Paper>
    </Flex>
  );
}
