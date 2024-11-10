"use client";

import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import React, { useState } from "react";

const Navigation: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#333" }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, color: "#ccc" }}
        >
          MyApp
        </Typography>
        <Link href="/" passHref>
          <Button sx={{ color: "#ccc", "&:hover": { color: "#fff" } }}>
            Home
          </Button>
        </Link>
        <Link href="/gallery" passHref>
          <Button sx={{ color: "#ccc", "&:hover": { color: "#fff" } }}>
            Gallery
          </Button>
        </Link>
        <Button
          sx={{ color: "#ccc", "&:hover": { color: "#fff" } }}
          onClick={handleClick}
        >
          Profile
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          MenuListProps={{
            sx: {
              backgroundColor: "#444",
              color: "#ccc",
            },
          }}
        >
          <Link href="/profile/my-ipa" passHref>
            <MenuItem
              onClick={handleClose}
              sx={{
                color: "#ccc",
                "&:hover": { backgroundColor: "#555", color: "#fff" },
              }}
            >
              My IPA
            </MenuItem>
          </Link>
          <Link href="/profile/register-ipa" passHref>
            <MenuItem
              onClick={handleClose}
              sx={{
                color: "#ccc",
                "&:hover": { backgroundColor: "#555", color: "#fff" },
              }}
            >
              Register IPA
            </MenuItem>
          </Link>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
