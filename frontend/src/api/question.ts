import type { QuestionDto } from '../types/question';

export async function getQuestion(id: number): Promise<QuestionDto | null> {
  return {
    id: id,
    name: `Question ${id}`,
    description: `Description for Question ${id}`,
    question_schema: `Schema for Question ${id}`,
    question_data: `Data for Question ${id}`,
    answer_data: `Answer Data for Question ${id}`,
    max_timeout: 60,
  };
  // TODO: backend integration
  // const response = await fetch(`/api/question/${id}`);
  // return response.json();
}

export async function submitQuery(id: number, query: string): Promise<boolean> {
  console.log(`Submitted ${query} for question ${id}`);
  return true;
  // TODO: backend integration
  // const response = await fetch(`/api/question/${id}/submit`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ query }),
  // });
  // return response.ok;
}
