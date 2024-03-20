import { useParams } from 'react-router-dom';

export function Question() {
  const { id } = useParams();

  return <div>Question {id}</div>;
}
