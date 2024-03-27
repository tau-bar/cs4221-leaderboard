import { Anchor, Flex, Pagination, Table, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { ROUTES } from '../constants/routes';
import { QuestionDto } from '../types/question';
import { getQuestions } from '../api/questions';

const HomePage = () => {
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
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

  const rows = questions.map((qn) => (
    <Table.Tr key={qn.id}>
      <Table.Td>
        <Anchor href={`${ROUTES.QUESTION.replace(':id', qn.id.toString())}`}>
          {qn.name}
        </Anchor>
      </Table.Td>
      <Table.Td>{qn.description}</Table.Td>
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
              <Table.Th>Name</Table.Th>
              <Table.Th>Description</Table.Th>
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
