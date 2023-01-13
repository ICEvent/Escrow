import React, { useState } from "react"
import { useEffect } from "react"
import { HOST } from "../lib/canisters";
import { ONE_WEEK_NS, IDENTITY_PROVIDER, MENU_HOME, MENU_ORDERS, MENU_PROFILE, LIST_ITEM_NFT, LIST_ITEM_COIN, LIST_ITEM_MERCHANDISE, LIST_ITEM_SERVICE, LIST_ITEM_OTHER } from "../lib/constants";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Grid, Stack } from "@mui/material";


import { ProfileForm } from "../components/profile/ProfileForm";
import { LinkDialog } from "../components/LinkDialog";
import { DefaultHome } from "../components/DefaultHome";
import OfferList from "../components/offers/OfferList";

import { useOneblock, useSetAgent, useGlobalContext, useEscrow, useLoading, useMenu } from "../components/Store";



import { Profile } from "./Profile";
import OrderList from "../components/orders/OrderList";



const Home = () => {

  const escrow = useEscrow();
  const setAgent = useSetAgent();
  const { menu } = useMenu();
  const { setLoading } = useLoading()
  const { state: { isAuthed, principal } } = useGlobalContext();


 
  return (
    <Container 
      sx={{ mt: 8 }}
    >
   

        {!menu || menu == MENU_HOME && <OfferList  />}
        {menu == MENU_ORDERS && <OrderList />}
        {menu == MENU_PROFILE && <Profile />}
    
    </Container>
  )
}

export { Home }
