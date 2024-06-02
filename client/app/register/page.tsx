"use client";
import axiosInstance from "@/config/axios";
import styles from "@/styles/styles.module.css";
import { theme } from "@/themes";
import { TAccessToken, TResponse } from "@/types/axios";
import { ErrorMessage } from "@hookform/error-message";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Snackbar,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const boxSx: SxProps = {
  borderRadius: 1,
  borderWidth: 1.5,
  borderStyle: "solid",
  borderColor: theme.palette.grey[300],
  padding: 2,
  width: "100%",
  maxWidth: "300px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

type Inputs = {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage = () => {
  const router = useRouter();
  const {
    getValues,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>({});

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [submitError, setSubmitError] = useState({
    open: false,
    message: "",
  });

  const onSubmit: SubmitHandler<Inputs> = () => {
    if (!Object.keys(errors).length) {
      registerSubmit();
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();
  };

  const registerSubmit = async () => {
    const { name, username, password, email } = getValues();
    const body = { name, username, password, email };
    try {
      const res = await axiosInstance.post<TResponse & TAccessToken>(
        "/signup",
        body
      );
      if (res.status === 201) {
        router.replace("/login");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
        setSubmitError({ open: true, message: error.response?.data.message });
      }
    }
  };

  const handleClose = () => {
    setSubmitError({ open: false, message: "" });
  };

  return (
    <div className={styles.container}>
      <Box sx={boxSx}>
        <Typography
          variant="h6"
          color={theme.palette.grey[600]}
          fontWeight={600}
          mb={2}
        >
          USER REGISTER
        </Typography>
        <Box mb={2} width="100%">
          <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={1.5} mb={2}>
              <Box>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="outlined-name">Name</InputLabel>
                  <OutlinedInput
                    label="Name"
                    fullWidth
                    required
                    color="info"
                    error={errors.name ? true : false}
                    {...register("name", {
                      required: "This field is required",
                    })}
                  />
                </FormControl>
                <ErrorMessage
                  errors={errors}
                  name="name"
                  render={({ message }) => (
                    <FormHelperText error>{message}</FormHelperText>
                  )}
                />
              </Box>

              <Box>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="outlined-email">Username</InputLabel>
                  <OutlinedInput
                    label="Username"
                    fullWidth
                    required
                    color="info"
                    error={errors.username ? true : false}
                    {...register("username", {
                      required: "This field is required",
                    })}
                  />
                </FormControl>
                <ErrorMessage
                  errors={errors}
                  name="username"
                  render={({ message }) => (
                    <FormHelperText error>{message}</FormHelperText>
                  )}
                />
              </Box>

              <Box>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="outlined-email">Email</InputLabel>
                  <OutlinedInput
                    label="Email"
                    fullWidth
                    required
                    color="info"
                    error={errors.email ? true : false}
                    {...register("email", {
                      required: "This field is required",
                      pattern: {
                        value:
                          /[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}/gm,
                        message: "Invalid email",
                      },
                    })}
                  />
                </FormControl>
                <ErrorMessage
                  errors={errors}
                  name="email"
                  render={({ message }) => (
                    <FormHelperText error>{message}</FormHelperText>
                  )}
                />
              </Box>

              <Box>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    required
                    error={errors.password ? true : false}
                    {...register("password", {
                      required: "This field is required",
                    })}
                  />
                </FormControl>
                <ErrorMessage
                  errors={errors}
                  name="password"
                  render={({ message }) => (
                    <FormHelperText error>{message}</FormHelperText>
                  )}
                />
              </Box>

              <Box>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Confirm Password
                  </InputLabel>
                  <OutlinedInput
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    required
                    error={errors.confirmPassword ? true : false}
                    {...register("confirmPassword", {
                      required: "This field is required",
                      validate: {
                        value: (value) => {
                          const { password } = getValues();
                          return (
                            password === value || "Passwords should match!"
                          );
                        },
                      },
                    })}
                  />
                </FormControl>
                <ErrorMessage
                  errors={errors}
                  name="confirmPassword"
                  render={({ message }) => (
                    <FormHelperText error>{message}</FormHelperText>
                  )}
                />
              </Box>
            </Stack>

            <Button variant="contained" type="submit" fullWidth>
              REGISTER
            </Button>
          </form>
        </Box>

        <Button
          variant="outlined"
          fullWidth
          onClick={() => router.push("/register")}
        >
          BACK
        </Button>
      </Box>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={submitError.open}
        onClose={handleClose}
        message={submitError.message}
      />
    </div>
  );
};

export default RegisterPage;
