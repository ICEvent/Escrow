import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, Grid } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Comment } from '../../api/escrow/service.did';
import moment from 'moment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { useGlobalContext } from '../Store';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


export default function Comments(props) {
    const {state:{
        principal
    }} = useGlobalContext();

    const [comments, setComments] = React.useState([]);
    React.useEffect(()=>{
        setComments(props.comments);
    },[props.comments])
    
    const cl = comments.map(c =>
        <ListItem alignItems="flex-start" key={c.ctime}>
            <ListItemAvatar>
                <AccountCircleIcon />
            </ListItemAvatar>
            <ListItemText
                primary={(c.user.toString() == principal.toString() ? "(you)" :c.user.toString().slice(0, 5) + "..." + c.user.toString().slice(-5))}
                secondary={
                    <React.Fragment>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                            {moment.unix(parseInt(c.ctime) / 1000000000).format("YYYY-MM-DD hh:mm")}
                        </Typography>
                        - {c.comment}
                    </React.Fragment>
                }
            />
        </ListItem>
    );
    return (

        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {cl}
        </List>


    );
}