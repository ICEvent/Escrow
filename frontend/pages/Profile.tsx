import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";

import moment from "moment";

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';


import Card from '@mui/material/Card';

import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { LinkList } from "../components/LinkList";
import { useOneblock } from "../components/Store";

interface State {
  id: string;
  name: string;
  pfp: string;
  bio: string;
  createtime: string;
}


const Profile = () => {


  const oneblock = useOneblock()
  const [links, setLinks] = useState([])

  const [values, setValues] = React.useState<State>({
    id: '',
    name: '',
    pfp: '',
    bio: '',
    createtime: ''
  });
  let params = useParams();

  useEffect(() => {

    oneblock.getProfile(params.id).then(res => {
      if (res[0]) {
        setLinks(res[0].links);
        setValues({
          ...values,
          id: res[0].id,
          name: res[0].name,
          pfp: res[0].pfp,
          bio: res[0].bio,
          createtime: (moment.unix(Number(res[0].createtime)/1000000000)).format("MMM Do YYYY, h:mm a")
        });

      };

    });
  }, []);




  return (

      <Container maxWidth="md">
        <Box 
        m={10}

        >
        <Card >
          {values.pfp &&<CardMedia
            component="img"
            height="140"
            image={values.pfp}
            alt=""
          />}
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              @{values.id}
            </Typography>
            <Typography gutterBottom variant="h4" component="div">
              {values.name}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              since {values.createtime}
            </Typography>
            <Typography variant="body2" color="text.secondary">
             {values.bio}
            </Typography>
          </CardContent>

        </Card>
        </Box>
        <LinkList links={links} />

        </Container>
  )
}

export { Profile }
