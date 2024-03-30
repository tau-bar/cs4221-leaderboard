import React, { useState } from 'react';
import { Button, Container, Loader, TextInput, Textarea } from '@mantine/core';
import { CreateQuestionDto } from '../types/question';
import { createQuestion } from '../api/questions';
import { notifications } from '@mantine/notifications';


const AddQuestion = () => {
  const [password, setPassword] = useState<string>("");
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [incorrectPassword, setIncorrectPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<CreateQuestionDto>({
    question_name: '',
    schema_name: '',
    description: '',
    question_schema: '',
    question_data: '',
    sample_answer: '',
    answer_data: '',
    max_timeout: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const question = await createQuestion(formData);
      if (question.success) {
        notifications.show({
          title: 'Success',
          message: 'Question has been created successfully',
          color: 'green',
        });

        setFormData({
          question_name: '',
          schema_name: '',
          description: '',
          question_schema: '',
          question_data: '',
          sample_answer: '',
          answer_data: '',
          max_timeout: 0,
        });
        
      } else {
        notifications.show({
          title: 'Error',
          message: question.error,
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create question. Please try again later.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (key: keyof CreateQuestionDto, value: string | number) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handlePasswordSubmit = () => {
    if (password === "abc") {
      setAuthenticated(true);
    } else {
      setIncorrectPassword(true);
    }
  };

  return (
    <>
    {!authenticated &&
    <Container size="sm">
        <h1>You need to be authorised to add questions to the database</h1>
          <TextInput
            label="Password"
            type="password"
            placeholder="Enter password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={incorrectPassword ? 'Incorrect password' : null}
            style={{ marginBottom: '15px' }}
          />
          <Button onClick={() => handlePasswordSubmit()}>Submit</Button>
      </Container>
    }

    {authenticated && (loading ? <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Loader />
          </div> : 
    <Container size="sm">
    <h1>Create Question</h1>
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      <TextInput
        label="Question Name"
        placeholder="Enter question name"
        required
        value={formData.question_name}
        onChange={(e) => handleChange('question_name', e.target.value)}
        style={{ marginBottom: '15px' }}
      />
      <TextInput
        label="Schema Name"
        placeholder="Enter schema name"
        required
        value={formData.schema_name}
        onChange={(e) => handleChange('schema_name', e.target.value)}
        style={{ marginBottom: '15px' }}
      />
      <Textarea
        label="Description"
        placeholder="Enter description"
        required
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        style={{ marginBottom: '15px' }}
      />
      <Textarea
        label="Create Table Statements"
        placeholder="Enter question schema"
        required
        value={formData.question_schema}
        onChange={(e) => handleChange('question_schema', e.target.value)}
        style={{ marginBottom: '15px' }}
      />
      <TextInput
        label="Insert Value Statements"
        placeholder="Enter question data"
        required
        value={formData.question_data}
        onChange={(e) => handleChange('question_data', e.target.value)}
        style={{ marginBottom: '15px' }}
      />
      <TextInput
        label="Sample Answer Query"
        placeholder="Enter a query that will retrieve the correct answers"
        required
        value={formData.sample_answer}
        onChange={(e) => handleChange('sample_answer', e.target.value)}
        style={{ marginBottom: '15px' }}
      />
      <TextInput
        label="Sample Answer Data"
        placeholder="Enter answer data as an array of JSON objects"
        required
        value={formData.answer_data}
        onChange={(e) => handleChange('answer_data', e.target.value)}
        style={{ marginBottom: '15px' }}
      />
      <TextInput
        label="Max Timeout"
        type="number"
        placeholder="Enter max timeout"
        required
        value={formData.max_timeout}
        onChange={(e) => handleChange('max_timeout', Number(e.target.value))}
        style={{ marginBottom: '15px' }}
      />
      <Button type="submit" style={{ marginTop: '15px' }}>Submit</Button>
    </form>
  </Container>)
  }

  </>
  );
};

export default AddQuestion;
