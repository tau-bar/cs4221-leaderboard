import { Anchor, Flex, Pagination, Table, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ROUTES } from '../constants/routes';
import { QuestionDto } from '../types/question';
import { getQuestions } from '../api/questions';

const HomePage = () => {
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // TODO: Fetch questions from the backend once seeding fully implemented
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  useEffect(() => {
    getQuestions(currentPage)
      .then((data) => {
        setQuestions(data);
      })
      .catch((error) => {
        console.error('Error fetching questions:', error);
      });
  }, []);

  // const questions: QuestionDto[] = [
  //   {
  //     id: 1,
  //     name: 'Question 1',
  //     description: 'Description for Question 1',
  //     question_schema: 'Schema for Question 1',
  //     question_data: 'Data for Question 1',
  //     answer_data: 'Answer Data for Question 1',
  //     max_timeout: 60,
  //   },
  //   {
  //     id: 2,
  //     name: 'Question 2',
  //     description: 'Description for Question 2',
  //     question_schema: 'Schema for Question 2',
  //     question_data: 'Data for Question 2',
  //     answer_data: 'Answer Data for Question 2',
  //     max_timeout: 120,
  //   },
  //   {
  //     id: 3,
  //     name: 'Question 3',
  //     description: 'Description for Question 3',
  //     question_schema: 'Schema for Question 3',
  //     question_data: 'Data for Question 3',
  //     answer_data: 'Answer Data for Question 3',
  //     max_timeout: 90,
  //   },
  //   {
  //     id: 4,
  //     name: 'Question 4',
  //     description: 'Description for Question 4',
  //     question_schema: 'Schema for Question 4',
  //     question_data: 'Data for Question 4',
  //     answer_data: 'Answer Data for Question 4',
  //     max_timeout: 45,
  //   },
  //   {
  //     id: 5,
  //     name: 'Question 5',
  //     description: 'Description for Question 5',
  //     question_schema: 'Schema for Question 5',
  //     question_data: 'Data for Question 5',
  //     answer_data: 'Answer Data for Question 5',
  //     max_timeout: 80,
  //   },
  //   {
  //     id: 6,
  //     name: 'Question 6',
  //     description: 'Description for Question 6',
  //     question_schema: 'Schema for Question 6',
  //     question_data: 'Data for Question 6',
  //     answer_data: 'Answer Data for Question 6',
  //     max_timeout: 150,
  //   },
  //   {
  //     id: 7,
  //     name: 'Question 7',
  //     description: 'Description for Question 7',
  //     question_schema: 'Schema for Question 7',
  //     question_data: 'Data for Question 7',
  //     answer_data: 'Answer Data for Question 7',
  //     max_timeout: 100,
  //   },
  //   {
  //     id: 8,
  //     name: 'Question 8',
  //     description: 'Description for Question 8',
  //     question_schema: 'Schema for Question 8',
  //     question_data: 'Data for Question 8',
  //     answer_data: 'Answer Data for Question 8',
  //     max_timeout: 30,
  //   },
  //   {
  //     id: 9,
  //     name: 'Question 9',
  //     description: 'Description for Question 9',
  //     question_schema: 'Schema for Question 9',
  //     question_data: 'Data for Question 9',
  //     answer_data: 'Answer Data for Question 9',
  //     max_timeout: 70,
  //   },
  //   {
  //     id: 10,
  //     name: 'Question 10',
  //     description: 'Description for Question 10',
  //     question_schema: 'Schema for Question 10',
  //     question_data: 'Data for Question 10',
  //     answer_data: 'Answer Data for Question 10',
  //     max_timeout: 110,
  //   },
  // ];

  const rows = questions.map((qn) => (
    <Table.Tr key={qn.id}>
      <Table.Td>{qn.id}</Table.Td>
      <Table.Td>
        <Anchor href={`${ROUTES.QUESTION.replace(':id', qn.id.toString())}`}>
          {qn.name}
        </Anchor>
      </Table.Td>
      <Table.Td>{qn.description}</Table.Td>
      <Table.Td>
        <Anchor href={`${ROUTES.LEADERBOARD.replace(':id', qn.id.toString())}`}>
          View Leaderboard
        </Anchor>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
      <Flex direction={'column'} align={'center'}>
        <Title>Question List</Title>
        <Table
          withTableBorder
          striped
          highlightOnHover
          stickyHeader
          my={10}
          w={'70%'}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        <Pagination
          total={Math.ceil(questions.length / ITEMS_PER_PAGE)}
          value={currentPage}
          onChange={setCurrentPage}
        />
      </Flex>
    </div>
  );
};

export default HomePage;
