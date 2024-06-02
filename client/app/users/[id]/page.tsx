"use client";
import axiosInstance from "@/config/axios";
import { UserResponse } from "@/types/users";
import { Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

interface IParams {
  id: string;
}

type User = null | UserResponse;

const Users = ({ params }: { params: IParams }) => {
  const [user, setUser] = useState<User>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/users/${params.id}`);
      setUser(response.data);
    } catch (error) {
      console.log({ error });
    }
  }, [params]);

  useEffect(() => {
    const debouncing = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(debouncing);
  }, [fetchData]);
  return (
    <div>
      <Typography variant="h5">id: {user?.id}</Typography>
      <p>name: {user?.name}</p>
      <p>username: {user?.username}</p>
      <p>phone: {user?.phone}</p>
      <p>email: {user?.email}</p>
      <p>website: {user?.website}</p>
    </div>
  );
};

export default Users;
