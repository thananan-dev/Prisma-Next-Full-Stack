"use client";
import axiosInstance from "@/config/axios";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "@/styles/styles.module.css";

export default function Home() {
  const [userLists, setUserList] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/users");
      setUserList(response.data);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    const debouncing = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(debouncing);
  }, []);

  return (
    <Stack spacing={2}>
      {userLists.map(({ id, name, username, phone, email, website }) => {
        return (
          <Card key={id}>
            <Link href={`/users/${id}`} className={styles.unlink}>
              <CardContent>
                <Typography variant="h5">id: {id}</Typography>
                <p>name: {name}</p>
                <p>username: {username}</p>
                <p>phone: {phone}</p>
                <p>email: {email}</p>
                <p>website: {website}</p>
              </CardContent>
            </Link>
          </Card>
        );
      })}
    </Stack>
  );
}
