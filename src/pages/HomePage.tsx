import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useTokenStore } from '../store/tokenStore';
import { useUserStore } from '../store/userStore';

const HomePage = () => {
  const { setAccessToken } = useTokenStore();
  const { profile, setProfile } = useUserStore();
  const navigate = useNavigate();

  const logOut = () => {
    googleLogout();
    setAccessToken('');
    setProfile(null);
    navigate(ROUTES.LOGIN);
  };

  return (
    <div>
      <h2>React Google Login</h2>
      <br />
      <br />
      {profile ? (
        <div>
          <img src={profile.picture} alt="user image" />
          <h3>User Logged in</h3>
          <p>Name: {profile.name}</p>
          <p>Email Address: {profile.email}</p>
          <br />
          <br />
          <button onClick={logOut}>Log out</button>
        </div>
      ) : (
        <button>Sign in with Google 🚀 </button>
      )}
    </div>
  );
};

export default HomePage;
