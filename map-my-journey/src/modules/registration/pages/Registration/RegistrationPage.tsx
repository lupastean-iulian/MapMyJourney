import React from 'react';
import { Box } from '@mui/material';
import { RegistrationForm } from '../../components/RegistrationForm/RegistrationForm';

export const RegistrationPage: React.FC<React.PropsWithChildren> = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <RegistrationForm />
    </Box>
  );
}

