import { Anchor, Flex, Loader, Pagination, Table, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ROUTES } from '../constants/routes';
import { QuestionDto } from '../types/question';
import { getQuestionCount, getQuestions } from '../api/questions';

const HomePage = () => {
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const [totalQuestionCount, setTotalQuestionCount] = useState(0);
  const [questions, setQuestions] = useState<QuestionDto[]>([]);
  const [isloading, setLoading] = useState(true);

  useEffect(() => {
    getQuestionCount()
      .then((data) => {
        setTotalQuestionCount(data);
      })
      .catch((error) => {
        console.error('Error fetching question count:', error);
      });
  }, []);

  useEffect(() => {
    getQuestions(currentPage)
      .then((data) => {
        setLoading(false);
        setQuestions(data);
      })
      .catch((error) => {
        console.error('Error fetching questions:', error);
      });
  }, [currentPage]);

  const rows = questions.map((qn) => (
    <Table.Tr key={qn.id}>
      <Table.Td>{qn.id}</Table.Td>
      <Table.Td>
        <Anchor href={`${ROUTES.QUESTION.replace(':id', qn.id.toString())}`}>
          {qn.question_name}
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
          {isloading && (
            <Table.Caption>
              <Loader color="blue" />
            </Table.Caption>
          )}
        </Table>

        <Pagination
          total={Math.ceil(totalQuestionCount / ITEMS_PER_PAGE)}
          value={currentPage}
          onChange={setCurrentPage}
        />
      </Flex>
    </div>
  );
};

export default HomePage;
