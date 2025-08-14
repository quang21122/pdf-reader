"use client";

import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Login,
  PersonAdd,
  Logout,
  Dashboard,
  Description,
  Delete,
} from "@mui/icons-material";
import NextLink from "next/link";
import Image from "next/image";
import { useUserMenu } from "@/hooks";
import {
  usePDFStore,
  useOCRStore,
  useUIStore,
  useSettingsStore,
} from "@/stores";

export default function Navigation() {
  const {
    anchorEl,
    isMenuOpen,
    handleMenuOpen,
    handleMenuClose,
    handleSignOut,
    handleProfile,
    handleDashboard,
    user,
    loading,
    getUserDisplayName,
    getUserEmail,
    getUserInitials,
  } = useUserMenu();

  // Navigation hooks available if needed
  // const { goToLogin, goToRegister, goToUpload } = useNavigation();

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "white",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        color: "#1e293b",
      }}
    >
      <Toolbar sx={{ paddingX: { xs: 2, lg: 4 } }}>
        {/* Logo and Title */}
        <NextLink
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginRight: 32,
            textDecoration: "none",
          }}
        >
          <Image src="/icon-app.svg" alt="PDF Reader" width={40} height={40} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#1e293b",
              display: { xs: "none", sm: "block" },
            }}
          >
            PDF Reader
          </Typography>
        </NextLink>

        {/* Navigation Links */}
        <Box
          sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 2 }}
        >
          {user && (
            <>
              <NextLink href="/dashboard" passHref>
                <Button
                  startIcon={<Dashboard />}
                  sx={{
                    color: "#64748b",
                    textTransform: "none",
                    "&:hover": {
                      color: "#dc2626",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  Dashboard
                </Button>
              </NextLink>
              <NextLink href="/upload" passHref>
                <Button
                  startIcon={<Description />}
                  sx={{
                    color: "#64748b",
                    textTransform: "none",
                    "&:hover": {
                      color: "#dc2626",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  Upload PDF
                </Button>
              </NextLink>
              <NextLink href="/trash" passHref>
                <Button
                  startIcon={<Delete />}
                  sx={{
                    color: "#64748b",
                    textTransform: "none",
                    "&:hover": {
                      color: "#dc2626",
                      backgroundColor: "transparent",
                    },
                  }}
                >
                  Trash
                </Button>
              </NextLink>
            </>
          )}
        </Box>

        {/* User Menu or Auth Buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {loading ? (
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: "#e2e8f0",
                animation: "pulse 2s infinite",
              }}
            />
          ) : user ? (
            <>
              {/* User Menu */}
              <IconButton
                onClick={handleMenuOpen}
                sx={{ padding: 0.5 }}
                aria-label="user menu"
              >
                <Avatar
                  src={user.user_metadata?.avatar_url}
                  alt={user.email}
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#dc2626",
                    color: "white",
                  }}
                >
                  {getUserInitials()}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                className="mt-2"
                sx={{
                  "& .MuiPaper-root": {
                    backgroundColor: "white",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    borderRadius: 2,
                    minWidth: 200,
                  },
                }}
              >
                <Box className="px-4 py-2 border-b border-gray-200">
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: "#1e293b",
                    }}
                  >
                    {getUserDisplayName()}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#64748b",
                    }}
                  >
                    {getUserEmail()}
                  </Typography>
                </Box>

                <MenuItem
                  onClick={handleDashboard}
                  sx={{
                    color: "#1e293b",
                    "&:hover": {
                      backgroundColor: "#f8fafc",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "#64748b" }}>
                    <Dashboard fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    sx={{
                      "& .MuiListItemText-primary": {
                        color: "#1e293b",
                        fontWeight: 500,
                      },
                    }}
                  >
                    Dashboard
                  </ListItemText>
                </MenuItem>

                <Divider />

                <MenuItem
                  onClick={handleSignOut}
                  sx={{
                    color: "#dc2626",
                    "&:hover": {
                      backgroundColor: "#fef2f2",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "#dc2626" }}>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    sx={{
                      "& .MuiListItemText-primary": {
                        color: "#dc2626",
                        fontWeight: 500,
                      },
                    }}
                  >
                    Sign Out
                  </ListItemText>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              {/* Auth Buttons */}
              <NextLink href="/login" passHref>
                <Button
                  startIcon={<Login />}
                  variant="outlined"
                  sx={{
                    borderColor: "#dc2626",
                    color: "#dc2626",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#fef2f2",
                      borderColor: "#b91c1c",
                    },
                  }}
                >
                  Sign In
                </Button>
              </NextLink>
              <NextLink href="/register" passHref>
                <Button
                  startIcon={<PersonAdd />}
                  variant="contained"
                  sx={{
                    backgroundColor: "#dc2626",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#b91c1c",
                    },
                  }}
                >
                  Sign Up
                </Button>
              </NextLink>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
