import { Group, Stack, Tooltip, UnstyledButton, rem } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { googleLogout } from '@react-oauth/google';
import { IconHome2, IconLogout, IconUserCircle } from '@tabler/icons-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useTokenStore } from '../store/tokenStore';
import { useUserStore } from '../store/userStore';
import classes from './Navbar.module.css';

const data = [
  {
    link: ROUTES.HOME,
    label: 'Home',
    icon: IconHome2,
  },
];
interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  link?: string;
  active?: boolean;
  onClick?(): void;
}

function MobileNavbarLink({
  icon: Icon,
  label,
  link,
  onClick,
}: NavbarLinkProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={(event) => {
          event.preventDefault();
          if (link) navigate(link);
          if (onClick) onClick();
        }}
        className={classes.linkMobile}
        data-active={location.pathname === link ? true : undefined}
      >
        <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const Navbar = () => {
  const [active, setActive] = useState('Billing');
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 36em)');

  const { setAccessToken } = useTokenStore();
  const { setProfile } = useUserStore();
  const navigate = useNavigate();

  const logout = () => {
    googleLogout();
    setAccessToken('');
    setProfile(null);
    navigate(ROUTES.LOGIN);
  };

  const desktopLinks = data.map((item) => (
    <a
      className={`${classes.linkDesktop}`}
      data-active={location.pathname === item.link ? true : undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
        navigate(item.link);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  const mobileLinks = data.map((link) => (
    <MobileNavbarLink
      {...link}
      key={link.label}
      link={link.link}
      active={link.label === active}
      onClick={() => setActive(link.label)}
    />
  ));

  console.log(classes.navbarMainDesktop)
  return (
    <>
      <nav
        className={`${isMobile ? classes.navbarMobile : classes.navbarDesktop}`}
      >
        <div
          className={`${
            isMobile ? classes.navbarMainMobile : classes.navbarMainDesktop
          }`}
        >
          {isMobile ? (
            <></>
          ) : (
            <Group className={classes.header} justify="space-between">
              CS4221 Leaderboard
            </Group>
          )}
          {isMobile ? (
            <Stack justify="center" gap={0}>
              {mobileLinks}
            </Stack>
          ) : (
            desktopLinks
          )}
        </div>

        {isMobile ? (
          <Stack justify="center" gap={0}>
            <MobileNavbarLink
              icon={IconLogout}
              label="Logout"
              onClick={logout}
            />
          </Stack>
        ) : (
          <div className={classes.footer}>
            <a
              href="#"
              className={classes.linkDesktop}
              onClick={(event) => {
                event.preventDefault();
                navigate(ROUTES.PROFILE);
              }}
              data-active={location.pathname === ROUTES.PROFILE || undefined}
            >
              <IconUserCircle className={classes.linkIcon} stroke={1.5} />
              <span>Profile</span>
            </a>

            <a className={`${classes.linkDesktop}`} onClick={logout}>
              <IconLogout className={classes.linkIcon} stroke={1.5} />
              <span>Logout</span>
            </a>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
