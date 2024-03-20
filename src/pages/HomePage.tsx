import { useUserStore } from '../store/userStore';

const HomePage = () => {
  const { profile, } = useUserStore();

  return (
    <div>
      <h2>React Google Login</h2>
      <br />
      <br />
      {profile && (
        <div>
          <img src={profile.picture} alt="user image" />
          <h3>User Logged in</h3>
          <p>Name: {profile.name}</p>
          <p>Email Address: {profile.email}</p>
          <br />
          <br />
        </div>
      )}
    </div>
  );
};

export default HomePage;
