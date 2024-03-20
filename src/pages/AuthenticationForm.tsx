import { Flex, Group, Paper, PaperProps, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../api/profile';
import { GoogleButton } from '../components/GoogleButton';
import { ROUTES } from '../constants/routes';
import { useTokenStore } from '../store/tokenStore';
import { useUserStore } from '../store/userStore';
import { OAuthResp } from '../types/oauth';

export function AuthenticationForm(props: PaperProps) {
  const { setAccessToken } = useTokenStore();
  const { setProfile } = useUserStore();
  const navigate = useNavigate();

  const handleLoginError = (error: any) => {
    notifications.show({
      title: 'Login failed',
      message: error?.message ?? 'An error occurred while logging in',
      color: 'red',
    });
  };

  const handleLoginSuccess = async (res: OAuthResp) => {
    try {
      const accessToken = res.access_token;
      const profile = await getProfile(accessToken);
      setAccessToken(accessToken);
      setProfile(profile);

      navigate(ROUTES.HOME);
    } catch (error) {
      console.error('handleLoginSuccess error:', error);
      handleLoginError(error);
    }
  };

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => handleLoginSuccess(codeResponse),
    onError: (error) => handleLoginError(error),
  });

  return (
    <Flex mih={'100vh'} align={'center'} justify={'center'}>
      <Paper radius="md" p="xl" withBorder {...props}>
        <Text size="lg" fw={500}>
          Welcome to CS4221 Leaderboard, login with:
        </Text>

        <Group grow mb="md" mt="md">
          <GoogleButton onClick={() => login()} radius="xl">
            Google
          </GoogleButton>
        </Group>
      </Paper>
    </Flex>
  );
}
