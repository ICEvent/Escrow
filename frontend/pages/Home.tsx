import React, { useState } from "react"
import { useEffect } from "react"
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Identity } from "@dfinity/agent";


import { HOST } from "../lib/canisters";
import { ONE_WEEK_NS, IDENTITY_PROVIDER } from "../lib/constants";

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

import { useOneblock, useSetAgent, useGlobalContext, useEscrow } from "../components/Store";
import { Profile } from "frontend/api/profile/profile.did";
import { Itype } from "frontend/api/escrow/escrow.did"
import Navbar from "../components/Navbar";



const Home = () => {

  const oneblock = useOneblock();
  const escrow = useEscrow();
  const setAgent = useSetAgent();
  const { state: { isAuthed, principal } } = useGlobalContext();
  const [openProfile, setOpenProfile] = useState(false);

  const [profile, setProfile] = useState<Profile>();
  const [authClient, setAuthClient] = useState<AuthClient>(null);

  const [value, setValue] = useState(0);
  const [message, setMessage] = useState();

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
    escrow.searchItems(sitype, BigInt(1)).then(res => {
      console.log(res)
      setOffers(res)
    })
  };

  return (

    <Box sx={{ flexGrow: 1 }}>

      <Navbar />
 
      <Container
        sx={{ textAlign: "center" }}
        maxWidth="md"
      >


        <Stack direction="row"
          justifyContent="center"
          alignItems="center" spacing={2}>
          <Button onClick={()=>setItemType("NFT")}>NFTs</Button>
          <Button onClick={()=>setItemType("coin")}>Crypto Currencies</Button>
          <Button onClick={()=>setItemType("service")}>Services</Button>
          <Button onClick={()=>setItemType("merchandise")}>Merchandises</Button>
          <Button onClick={()=>setItemType("other")}>Others</Button>
        </Stack>
        <OfferList offers={offers} />
      </Container>
      
    </Box>

  )
}

export { Home }
