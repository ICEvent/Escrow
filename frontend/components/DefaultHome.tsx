import React, { useEffect,useState } from "react"

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Button from "@mui/material/Button";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';

interface State {

  linkname: String;
  linkurl: String;
}


const DefaultHome = () => {


  const [values, setValues] = React.useState<State>({
    linkname: '',
    linkurl:''
  });

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    fontWeight: 'bold' ,
    color: theme.palette.text.secondary,
    
  }));

  
  const links = [
    {
    name:"website",
    url:"www"
  },
  {
    name:"twitter",
    url:"www"
  },
  {
    name:"facebook",
    url:"www"
  },
  {
    name:"linkedin",
    url:"www"
  },
  {
    name:"[ ... ]",
    url:"www"
  }
];

  const linklist = links.map((link,index)=>
    <Item key={index}>{link.name} </Item>
  )


  
  return (
   
    
    <Stack spacing={2}>
      {linklist}
    </Stack>

  )
}

export { DefaultHome }
