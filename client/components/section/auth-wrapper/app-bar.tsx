"use client";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const HeaderAppBar = () => {
  const router = useRouter();

  const handlerLogout = useCallback(() => {
    localStorage.clear();
    router.replace("/login");
  }, [router]);

  return (
    <Box sx={{ flexGrow: 1, marginBottom: 2 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          </Typography>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            onClick={handlerLogout}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default HeaderAppBar;
