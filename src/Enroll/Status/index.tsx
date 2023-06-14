import { List, ThemeIcon } from '@mantine/core';
import { IconCircleCheck, IconCircleDashed } from '@tabler/icons';
import { Enroll } from '../../FetchData';

export interface MessageStatus {
    id: string;
    status: string;
    message: string;
    enroll: Enroll;
}

// interface StatusProps {
//     enroll: 
//   }

function Status() {
  return (
    <List
      spacing="xs"
      size="sm"
      center
      icon={
        <ThemeIcon color="teal" size={24} radius="xl">
          <IconCircleCheck size="1rem" />
        </ThemeIcon>
      }
    >
      <List.Item>Clone or download repository from GitHub</List.Item>
      <List.Item>Install dependencies with yarn</List.Item>
      <List.Item>To start development server run npm start command</List.Item>
      <List.Item>Run tests to make sure your changes do not break the build</List.Item>
      <List.Item
        icon={
          <ThemeIcon color="blue" size={24} radius="xl">
            <IconCircleDashed size="1rem" />
          </ThemeIcon>
        }
      >
        Submit a pull request once you are done
      </List.Item>
    </List>
  );
}