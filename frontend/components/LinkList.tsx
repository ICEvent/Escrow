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

import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import Link from '@mui/material/Link';
interface State {
  id: string;
  name: string;
  pfp: string;
  bio: string;
  linkname: String;
  linkurl: String;
}


const LinkList = (props) => {



  const [isexist, setIsexist] = useState(false)
  const [links, setLinks] = useState([])
  const [progress, setProgress] = useState(false);

  const [open, setOpen] = React.useState(false);

  const [values, setValues] = React.useState<State>({
    id: '',
    name: '',
    pfp: '',
    bio: '',
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

  

  const linklist = props.links.map((link, index)=>
    <Tooltip key={index} title={link.url}><Link  href={link.url} target="_blank"><Item >{link.name} </Item></Link></Tooltip>
  )


  
  return (
   
    <Box component="form" sx={{  
      
      maxWidth: '100%' }}>
    
    <Stack spacing={2}>
      {linklist}
    </Stack>
    
  </Box>

  )
}

export { LinkList }
