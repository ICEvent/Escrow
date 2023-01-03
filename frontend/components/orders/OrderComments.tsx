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
import { Button } from '@mui/material';

import { Comment } from '../../api/escrow/escrow.did';
import moment from 'moment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Comments(props) {

    const [comment, setComment] = React.useState<string | null>();

    const saveComment = () => {
        if (comment) {
            props.submit(comment);
        };
    };
    const cl = props.comments.map(c =>
        <ListItem alignItems="flex-start" key={c.ctime}>
        <ListItemAvatar>
          <AccountCircleIcon />
        </ListItemAvatar>
            <ListItemText
                primary={c.user.toString().slice(0,5) +"..."+ c.user.toString().slice(-5)}
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
                        {c.comment}
                    </React.Fragment>
                }
            />
        </ListItem>
    );
    return (
        <Box>
            <TextField
                id="standard-multiline-static"
                
                defaultValue=""
                variant="standard"
                fullWidth
                onChange={e => setComment(e.target.value)}
            />
            <Button variant='contained' onClick={saveComment} >Comment</Button>
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>

                {cl}
            </List>
        </Box>
    );
}