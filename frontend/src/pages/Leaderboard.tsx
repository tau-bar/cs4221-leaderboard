import { useParams } from 'react-router-dom';

export function Leaderboard() {
  const { id } = useParams();
  return <div>Leaderboard for question {id}</div>;
}
