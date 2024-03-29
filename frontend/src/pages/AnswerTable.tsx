import { Table } from '@mantine/core';

export function AnswerTable({ data = [] }: { data: Record<string, string>[] }) {
  const headers = Object.keys(data[0]);
  const rows = data.map((row, index) => (
    <Table.Tr key={index}>
      {headers.map((header) => (
        <Table.Td key={header}>{row[header]}</Table.Td>
      ))}
    </Table.Tr>
  ));

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          {headers.map((header) => (
            <Table.Th key={header}>{header}</Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
