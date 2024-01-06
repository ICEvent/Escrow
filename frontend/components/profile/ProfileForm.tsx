import React, { useEffect, useState } from "react"


import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';

import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';

import { styled } from '@mui/material/styles';
import Button from "@mui/material/Button";
import Alert from '@mui/material/Alert';


import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { useOneblock, useGlobalContext } from "../Store";


interface State {
  id: string;
  name: string;
  pfp: string;
  bio: string;

}


const ProfileForm = (props) => {


  const oneblock = useOneblock();
  const { state:{ principal}} = useGlobalContext();

  const [links, setLinks] = useState([])
  const [progress, setProgress] = useState(false);
  const [message, setMessage] = useState();

  const [open, setOpen] = React.useState(false);

  const [values, setValues] = React.useState<State>({
    id: '',
    name: '',
    pfp: '',
    bio: '',
  });

  useEffect(() => {
    if (props.profile) {
      setValues({
        id: props.profile.id,
        name: props.profile.name,
        pfp: props.profile.pfp,
        bio: props.profile.bio,

      })
    }
  }, [props.profile])

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));


  const linklist = links.map(link =>
    <Item>{link.name} - {link.url}</Item>
  )
  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function createProfile() {
    setMessage(null)
    setProgress(true);
    oneblock.createProfile({
      id: values.id,
      name: values.name,
      pfp: values.pfp,
      bio: values.bio
    }).then(res => {
      console.log(res)
      setProgress(false)
      if (res["ok"]) {
        props.reload ? props.reload() : null;
      } else {
        setMessage(res["err"])
      }


    })
  };


  function saveProfile() {
    setMessage(null);
    setProgress(true)
    oneblock.updateProfile(values.id, {
      name: values.name,
      pfp: values.pfp,
      bio: values.bio
    }).then(res => {
      console.log(res)
      setProgress(false)
      if (res["err"]) {
        setMessage(res["err"])
      } else {

      }

    })
  };


  return (

    <Container>

      {values.pfp &&
        <Card variant="outlined" >

          <CardMedia
            component="img"
            height="140"
            image={values.pfp}
            alt="hello"
          />
        </Card>}


      <Box>
        <TextField
          label="Your principal id"
          required
          fullWidth
          sx={{ m: 1 }}
          value={principal?principal.toString():""}
          
          disabled={true}
          
        />
        <TextField
          label="id(4 charactors or more)"
          required
          fullWidth
          sx={{ m: 1 }}
          value={values.id}
          onChange={handleChange('id')}
          disabled={props.profile ? true : false}
          InputProps={{
            startAdornment: <InputAdornment position="start">@</InputAdornment>,
          }}
        />
        <TextField
          label="name"
          fullWidth
          sx={{ m: 1 }}
          value={values.name}
          onChange={handleChange('name')}
        />
        <TextField
          label="pfp url"
          fullWidth
          sx={{ m: 1 }}
          value={values.pfp}
          onChange={handleChange('pfp')}
        />
        <TextField
          label="bio"
          multiline
          maxRows={5}
          fullWidth
          sx={{ m: 1 }}
          value={values.bio}
          onChange={handleChange('bio')}
        />

        {props.profile && <Button variant="contained" disabled={progress} onClick={saveProfile}>{progress ? <CircularProgress /> : "Save"} </Button>}
        {!props.profile && <Button variant="contained" disabled={progress} onClick={createProfile}>{progress ? <CircularProgress /> : "Create"} </Button>}
        {props.profile && <Link p={2} href={"https://oneblock.page/" + props.profile.id} target={"_blank"}>Open</Link>}
        {message && <Alert severity="warning">{message}</Alert>}
      </Box>
    </Container>

  )
}

export { ProfileForm }
