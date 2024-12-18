import React, { useState } from "react"

import {    MENU_ORDERS, MENU_PROFILE,MENU_HOME   } from "../lib/constants";

import Container from '@mui/material/Container';

import OfferList from "../components/offers/OfferList";

import {  useSetAgent, useGlobalContext, useEscrow, useLoading, useMenu } from "../components/Store";



import { ProfilePage } from "./Profile";
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
        {menu == MENU_PROFILE && <ProfilePage />}
    
    </Container>
  )
}

export { Home }
