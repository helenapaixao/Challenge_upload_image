/* eslint-disable react/no-unused-prop-types */
import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  title: string;
  description: string;
  url: string;
}

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: 'Please select an image',
      validate: {
        // eslint-disable-next-line consistent-return
        lessThan10Mb: value => {
          if (value.size > 10485760) {
            return 'Image must be less than 10MB';
          }
        },
      },
      // TODO REQUIRED, LESS THAN 10 MB AND ACCEPTED FORMATS VALIDATIONS
    },
    title: {
      required: 'Min and max length of title is between 3 and 30',
      minLength: {
        value: 3,
        message: 'Min length of title is 3',
      },
      maxLenght: {
        value: 30,
        message: 'Max length of title is 30',
      },
      // TODO REQUIRED, MIN AND MAX LENGTH VALIDATIONS
    },
    description: {
      required: 'Min and max length of description is between 3 and 30',
      maxLenght: {
        value: 60,
      },
      // TODO REQUIRED, MAX LENGTH VALIDATIONS
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    // TODO MUTATION API POST REQUEST,
    async (formAddImageProps: FormAddImageProps) => {
      const { data } = await api.post('/api/images', {
        title: formAddImageProps.title,
        description: formAddImageProps.description,
        url: imageUrl,
      });
      return data;
    },
    {
      // TODO ONSUCCESS MUTATION
      onSuccess: () => queryClient.invalidateQueries('images'),
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data): Promise<void> => {
    try {
      // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS

      if (!imageUrl) {
        toast({
          title: 'Image is required',
          description: 'Please select an image',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
      // TODO EXECUTE ASYNC MUTATION

      const response = await mutation.mutateAsync(data);
      // TODO SHOW SUCCESS TOAST

      if (response.status === 201) {
        toast({
          title: 'Image added successfully',
          description: 'Image added successfully',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch {
      // TODO SHOW ERROR TOAST IF SUBMIT FAILED

      toast({
        title: 'Error',
        description: 'Error adding image',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      // TODO CLEAN FORM, STATES AND CLOSE MODAL

      reset();
      setImageUrl('');
      setLocalImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          // TODO SEND IMAGE ERRORS
          /*  error={errors.image} */
          // TODO REGISTER IMAGE INPUT WITH VALIDATIONS
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          /*    error={errors.title} */
          type="text"
          // TODO SEND TITLE ERRORS
          // TODO REGISTER TITLE INPUT WITH VALIDATIONS
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          /*  error={errors.description} */
          // TODO SEND DESCRIPTION ERRORS
          // TODO REGISTER DESCRIPTION INPUT WITH VALIDATIONS
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
