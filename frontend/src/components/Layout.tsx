import React from 'react';
import { AppShell, Burger, Group, NavLink, Stack, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconHome2, IconLogout } from '@tabler/icons-react';
import { googleLogout } from '@react-oauth/google';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useTokenStore } from '../store/tokenStore';
import { useUserStore } from '../store/userStore';

export function Layout(props: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();

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
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title>Leaderboard</Title>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar py="md">
        <Stack h="100%" justify="space-between">
          <NavLink
            label="Home"
            leftSection={<IconHome2 />}
            href={ROUTES.HOME}
            active={location.pathname === ROUTES.HOME}
          />
          <NavLink
            label="Logout"
            leftSection={<IconLogout />}
            onClick={logout}
          />
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>{props.children}</AppShell.Main>
    </AppShell>
  );
}
