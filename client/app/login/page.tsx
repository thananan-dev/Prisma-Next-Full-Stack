"use client";
import axiosInstance from "@/config/axios";
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
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styles from "@/styles/styles.module.css";
import { headers } from "next/headers";

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
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const {
    getValues,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>({});

  const onSubmit: SubmitHandler<Inputs> = () => {
    if (!Object.keys(errors).length) {
      loginSubmit();
    }
  };

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();
  };

  const loginSubmit = async () => {
    const body = getValues();
    try {
      const res = await axiosInstance.post<TResponse & TAccessToken>(
        "/login",
        body
      );
      if (res.status === 200) {
        localStorage.setItem("accessToken", res.data.accessToken);
        router.replace("/");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
        if (error.response?.data.message === "User not found") {
          setError(
            "email",
            { message: error.response?.data.message },
            {
              shouldFocus: true,
            }
          );
        }
        if (error.response?.data.message === "Wrong Password") {
          setError(
            "password",
            { message: error.response?.data.message },
            {
              shouldFocus: true,
            }
          );
        }
      }
    }
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
          USER LOGIN
        </Typography>
        <Box mb={2} width="100%">
          <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={1.5} mb={2}>
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
            </Stack>

            <Button variant="contained" type="submit" fullWidth>
              LOGIN
            </Button>
          </form>
        </Box>

        <Button
          variant="outlined"
          fullWidth
          onClick={() => router.push("/register")}
        >
          REGISTER
        </Button>
      </Box>
    </div>
  );
};

export default LoginPage;
