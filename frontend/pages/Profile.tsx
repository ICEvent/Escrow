import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";

import moment from "moment";

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';


import Card from '@mui/material/Card';

import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';


import { Profile } from "../api/profile/profile.did";

import { useGlobalContext, useOneblock } from "../components/Store";
import { ProfileForm } from "../components/profile/ProfileForm";

const Profile = () => {

  const { state: {
    principal
  } } = useGlobalContext()

  const oneblock = useOneblock();

  const [profile, setProfile] = useState<Profile | null>();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    oneblock.getMyProfile().then(res => {
      console.log(res)
      if (res[0]) {
        setProfile(res[0]);
      };
    });
  };

  return (

    <ProfileForm profile={profile} reload={loadProfile}/>
    // <Card >
    //   {profile &&
    //     <CardMedia
    //       component="img"
    //       height="194"
    //       image={profile.pfp}
    //       alt="PFP"
    //     />
    //   }
    //   <CardContent>
    //     <Typography gutterBottom variant="h5" component="div">
    //       {profile ? profile.name : principal.toString()}
    //     </Typography>

    //     <Typography variant="body2" color="text.secondary">
    //       {profile ? profile.bio : ""}
    //     </Typography>
    //   </CardContent>

    // </Card>

  )
}

export { Profile }
