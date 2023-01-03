import React, { useState } from "react"
import { useEffect } from "react"
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Identity } from "@dfinity/agent";

import { ToastContainer, toast } from 'react-toastify';
import { HOST } from "../lib/canisters";
import { ONE_WEEK_NS, IDENTITY_PROVIDER, MENU_HOME, MENU_ORDERS, MENU_PROFILE } from "../lib/constants";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Stack } from "@mui/material";
import { Item } from "frontend/api/escrow/escrow.did";

import { ProfileForm } from "../components/ProfileForm";
import { LinkDialog } from "../components/LinkDialog";
import { DefaultHome } from "../components/DefaultHome";
import OfferList from "../components/offers/OfferList";

import Tooltip from '@mui/material/Tooltip';

import { useOneblock, useSetAgent, useGlobalContext, useEscrow,useLoading,useMenu } from "../components/Store";

import { Itype } from "../api/escrow/escrow.did"
import Navbar from "../components/Navbar";
import { Profile } from "./Profile";
import OrderList from "../components/orders/OrderList";


const Home = () => {

  const escrow = useEscrow();
  const setAgent = useSetAgent();
  const { menu } = useMenu();
  const { setLoading } = useLoading()
  const { state: { isAuthed, principal } } = useGlobalContext();

  const [itemType, setItemType] = useState("NFT")
  const [offers, setOffers] = useState<Item[]>();

  useEffect(() => {   
    loadOffers();
  }, [itemType]);

  

  const loadOffers = () => {
    let sitype: Itype = { "nft": null };
    switch (itemType) {
      case "NFT":
        sitype = { "nft": null };
        break;
      case "coin":
        sitype = { "coin": null };
        break;
      case "merchandise":
        sitype = { "merchandise": null };
        break;
      case "service":
        sitype = { "service": null };
        break;
      case "other":
        sitype = { "other": null };
        break;
    };
    setLoading(true)
    escrow.searchItems(sitype, BigInt(1)).then(res => {
      console.log(res)
      setLoading(false)
      setOffers(res)
    })
  };

  return (
      <Container
        sx={{ flexGrow: 1 , mt:8 }}
        maxWidth="md"
      >
        {/* <Stack direction="row"
          justifyContent="center"
          // alignItems="center" 
          spacing={2}>
          <Button onClick={()=>setItemType("NFT")}>NFTs</Button>
          <Button onClick={()=>setItemType("coin")}>Crypto Currencies</Button>
          <Button onClick={()=>setItemType("service")}>Services</Button>
          <Button onClick={()=>setItemType("merchandise")}>Merchandises</Button>
          <Button onClick={()=>setItemType("other")}>Others</Button>
        </Stack> */}
        {menu == MENU_HOME && <OfferList offers={offers} />}
        {menu == MENU_ORDERS && <OrderList />}
        {menu == MENU_PROFILE && <Profile />}
      </Container>
      
  )
}

export { Home }
