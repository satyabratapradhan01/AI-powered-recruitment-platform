import React from 'react';
import ErrorState from './ui/ErrorState';

const ErrorMessage = ({ message }) => {
  return <ErrorState message={message} />;
};

export default ErrorMessage;
