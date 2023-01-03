import React, { FC, useState } from 'react'

import DarkModeToggle from './DarkModeToggle'

import { useEffect } from "react"
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Identity } from "@dfinity/agent";


import { HOST } from "../lib/canisters";
import { ONE_WEEK_NS, IDENTITY_PROVIDER, MENU_ORDERS, MENU_PROFILE, MENU_HOME } from "../lib/constants";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ListItemIcon } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import LinearProgress from '@mui/material/LinearProgress';
import Person from '@mui/icons-material/Person';

import { useOneblock, useSetAgent, useGlobalContext, useEscrow, useLoading,useMenu } from "../components/Store";

import OrderList from "../components/orders/OrderList";
import { Profile } from '../pages/Profile';
const Header: FC = () => {

  const oneblock = useOneblock();
  const escrow = useEscrow();
  const setAgent = useSetAgent();
  const {menu,setMenu} = useMenu()
  const { state: { isAuthed, principal, loading } } = useGlobalContext();

  const [authClient, setAuthClient] = useState<AuthClient>(null);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const openOrders = () => {
    handleClose();
    setMenu(MENU_ORDERS)
  }

  const openProfile = () => {
    handleClose();
    setMenu(MENU_PROFILE)
  }
  useEffect(() => {
    if(!menu) setMenu(MENU_HOME);
    
    (async () => {
      const authClient = await AuthClient.create(
        {
          idleOptions: {
            disableIdle: true,
            disableDefaultIdleCallback: true
          }
        }
      );
      setAuthClient(authClient);

      if (await authClient.isAuthenticated()) {
        handleAuthenticated(authClient);

      }


    })();

  }, []);

  const handleAuthenticated = async (authClient: AuthClient) => {

    const identity: Identity = authClient.getIdentity();
    setAgent({
      agent: new HttpAgent({
        identity,
        host: HOST,
      }),
      isAuthed: true,

    });

  };

  const login = async () => {
    authClient.login({
      identityProvider: IDENTITY_PROVIDER,
      maxTimeToLive: ONE_WEEK_NS,
      onSuccess: () => handleAuthenticated(authClient),
    });
  };

  const logout = async () => {
    handleClose();
    await authClient.logout();
    setAgent({ agent: null });
  };


  return (
    <AppBar color="secondary" position='fixed' sx={{ mb: 2 }}>
      <Toolbar >
        <DarkModeToggle />
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >

        </IconButton>
        <Typography  variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={()=>setMenu(MENU_HOME)}>
          ICEscrow
        </Typography>

        {isAuthed && <Button color="inherit" onClick={handleClick}>
          <Person />
        </Button>}
        {!isAuthed && <Button color="inherit" onClick={login}>Login</Button>}
        {/* {principal && <Tooltip title={principal.toString()}><Button color="inherit" onClick={logout}>{principal.toString().slice(0, 5) + "..." + principal.toString().slice(-5)}</Button></Tooltip>} */}

      </Toolbar>
      {loading && <LinearProgress color="success" />}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={openProfile}>

          <ListItemIcon><Person /></ListItemIcon>

          Profile</MenuItem>

        <MenuItem onClick={openOrders}>
          <ListItemIcon><ShoppingCart /></ListItemIcon>
          Orders</MenuItem>

        <MenuItem onClick={logout}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          Logout</MenuItem>
      </Menu>

     
    </AppBar>
  )
}

export default Header
