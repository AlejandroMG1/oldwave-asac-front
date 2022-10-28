/* eslint-disable no-console */
import React, { useRef, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Alert,
  IconButton,
  Collapse,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'hooks/useLocalStorage';
import useUserState from 'hooks/useUserState';

const steps = ['Nombre y apellido', 'Documento', 'Nacimiento', 'Contacto'];

export default function FormNewUser() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [showAlert, setShowAlert] = useState(false);
  const { user, handleUserCreated } = useUserState();
  const { item: userToCreate, saveItem: saveUserToCreate } = useLocalStorage(
    'USER_V1',
    [
      {
        name: '',
        lastName: '',
        documentType: '',
        documentNumber: '',
        birthDate: '',
        gender: '',
        phone: '',
      },
    ]
  );

  const nameNewUser = useRef();
  const lastNameNewUser = useRef();
  const documentTypeNewUser = useRef();
  const documentNumberNewUser = useRef();
  const birthDateNewUser = useRef();
  const genderNewUser = useRef();
  const phoneNewUser = useRef();

  function isStepOptional(step) {
    return step === 3;
  }

  function isStepSkipped(step) {
    return skipped.has(step);
  }

  const handleNext = () => {
    const next = () => {
      setShowAlert(false);
      let newSkipped = skipped;
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    };

    switch (activeStep) {
      case 0:
        if (nameNewUser.current.value && lastNameNewUser.current.value) {
          const newUser = [...userToCreate];
          newUser[0].name = nameNewUser.current.value;
          newUser[0].lastName = lastNameNewUser.current.value;
          saveUserToCreate(newUser);
          next();
        } else {
          setShowAlert(true);
        }
        break;

      case 1:
        if (
          documentTypeNewUser.current.value &&
          documentNumberNewUser.current.value
        ) {
          const newUser = [...userToCreate];
          newUser[0].documentType = documentTypeNewUser.current.value;
          newUser[0].documentNumber = documentNumberNewUser.current.value;
          next();
        } else {
          setShowAlert(true);
        }
        break;

      case 2:
        if (birthDateNewUser.current.value && genderNewUser.current.value) {
          const newUser = [...userToCreate];
          newUser[0].birthDate = birthDateNewUser.current.value;
          newUser[0].gender = genderNewUser.current.value;
          next();
        } else {
          setShowAlert(true);
        }
        break;

      case 3:
        if (phoneNewUser.current.value) {
          const newUser = [...userToCreate];
          newUser[0].phone = phoneNewUser.current.value;
        }
        next();
        handleNewUser();
        break;

      default:
        break;
    }
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const coursesRedirection = () => {
    navigate('/courses');
    window.location.reload();
  };

  const profileRedirection = () => {
    navigate('/profile');
    window.location.reload();
  };

  const handleNewUser = () => {
    const createNewUser = async () => {
      const options = {
        method: 'POST',
        url: 'https://udea-open-door-back-git-develop-cristiancastano852.vercel.app/createUser',
        headers: { 'Content-Type': 'application/json' },
        data: {
          userEmail: user.email,
          name: userToCreate[0].name,
          lastName: userToCreate[0].lastName,
          documentType: userToCreate[0].documentType,
          documentNumber: userToCreate[0].documentNumber,
          birthDate: userToCreate[0].birthDate,
          gender: userToCreate[0].gender,
          phone: userToCreate[0].phone,
        },
      };

      await axios
        .request(options)
        .then((response) => {
          handleUserCreated(response.data.userId);
        })
        .catch((error) => {
          console.error(error);
        });
    };
    createNewUser();
  };

  const getStepComponent = (step) => {
    switch (step) {
      case 0:
        return (
          <div>
            <TextField
              style={{ width: '100%', margin: '10px' }}
              type='text'
              label='Nombre'
              variant='outlined'
              required
              inputRef={nameNewUser}
            />
            <TextField
              style={{ width: '100%', margin: '10px' }}
              type='text'
              label='Apellido'
              variant='outlined'
              required
              inputRef={lastNameNewUser}
            />
          </div>
        );
      case 1:
        return (
          <div>
            <InputLabel id='demo-simple-select-label'>Age</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              label='Tipo de documento'
              inputRef={documentTypeNewUser}
            >
              <MenuItem value='CC'>CC</MenuItem>
              <MenuItem value='TI'>TI</MenuItem>
              <MenuItem value='CE'>CE</MenuItem>
            </Select>
            <TextField
              style={{ width: '100%', margin: '10px' }}
              type='number'
              label='Número de documento'
              variant='outlined'
              required
              inputRef={documentNumberNewUser}
            />
          </div>
        );
      case 2:
        return (
          <div>
            <DesktopDatePicker
              label='Date desktop'
              inputFormat='MM/DD/YYYY'
              renderInput={(params) => <TextField {...params} />}
              inputRef={birthDateNewUser}
            />
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              label='Sexo'
              inputRef={genderNewUser}
            >
              <MenuItem value='M'>M</MenuItem>
              <MenuItem value='F'>F</MenuItem>
            </Select>
          </div>
        );
      case 3:
        return (
          <div>
            <TextField
              style={{ width: '100%', margin: '10px' }}
              type='number'
              label='Número de telefono'
              variant='outlined'
              required
              inputRef={phoneNewUser}
            />
          </div>
        );

      default:
        return 'Unknown step';
    }
  };

  const handleAlert = () => (
    <Collapse in={showAlert}>
      <Alert
        severity='error'
        action={
          <IconButton
            aria-label='close'
            color='inherit'
            size='small'
            onClick={() => {
              setShowAlert(false);
            }}
          >
            <CloseIcon fontSize='inherit' />
          </IconButton>
        }
        sx={{ mb: 2 }}
      >
        Has de llenar todos los campos
      </Alert>
    </Collapse>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <div className='hidden md:block'>
        <Stepper activeStep={activeStep}>
          {/* Map through the steps array and create a step for each one in the top of the form */}
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant='caption'>Optional</Typography>
              );
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </div>
      {activeStep === steps.length ? (
        <>
          <Typography sx={{ mt: 2, mb: 1 }}>
            Haz creado con éxito tu perfil
          </Typography>
          <Button onClick={coursesRedirection}>Ir a Cursos</Button>
          <Button onClick={profileRedirection}>Ir a Perfil</Button>
        </>
      ) : (
        <>
          {getStepComponent(activeStep)}
          {showAlert ? handleAlert() : null}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep === steps.length - 1
              ? null
              : isStepOptional(activeStep) && (
                  <Button color='inherit' onClick={handleSkip} sx={{ mr: 1 }}>
                    Saltar
                  </Button>
                )}
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
