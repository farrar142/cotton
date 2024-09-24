import { TextField, TextFieldProps } from '@mui/material';
import { useMemo } from 'react';

export type ErrorTypeMap = {
  [key: string]: string[];
};
const TextInput: React.FC<TextFieldProps & { errors?: ErrorTypeMap }> = ({
  errors,
  name,
  ...e
}) => {
  const error = useMemo<string[] | undefined>(
    () => (errors || {})[name || ''],
    [name, errors]
  );
  console.log(error);
  return (
    <TextField {...e} name={name} error={Boolean(error)} helperText={error} />
  );
};

export default TextInput;
