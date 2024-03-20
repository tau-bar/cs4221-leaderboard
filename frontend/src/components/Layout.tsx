import React from 'react';
import {
  ActionIcon,
  AppShell,
  Flex,
  Group,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { IconLogout, IconMoonStars, IconSun } from '@tabler/icons-react';
import { googleLogout } from '@react-oauth/google';
import { NavLink as RouterLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useTokenStore } from '../store/tokenStore';
import { useUserStore } from '../store/userStore';

export function Layout(props: { children: React.ReactNode }) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const { setAccessToken } = useTokenStore();
  const { setProfile } = useUserStore();
  const navigate = useNavigate();

  const logout = () => {
    googleLogout();
    setAccessToken('');
    setProfile(null);
    navigate(ROUTES.LOGIN);
  };

  return (
    <AppShell header={{ height: 70 }} padding="md">
      <AppShell.Header>
        <Flex h="100%" align="center" justify="space-between" w="100%" px="md">
          <RouterLink
            to={ROUTES.HOME}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Title>Leaderboard</Title>
          </RouterLink>
          <Group>
            <ActionIcon
              size="lg"
              variant="default"
              onClick={toggleColorScheme}
              title={dark ? 'Light mode' : 'Dark mode'}
            >
              {dark ? <IconSun /> : <IconMoonStars />}
            </ActionIcon>
            <ActionIcon size="lg" variant="default" onClick={logout}>
              <IconLogout />
            </ActionIcon>
          </Group>
        </Flex>
      </AppShell.Header>
      <AppShell.Main>{props.children}</AppShell.Main>
    </AppShell>
  );
}
