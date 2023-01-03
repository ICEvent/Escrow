import * as React from 'react';

import Grid from '@mui/material/Grid';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import OfferCard from './OfferCard';
import { Button, Divider } from '@mui/material';
import ListItemForm from './ListItemForm';
import { toast } from 'react-toastify';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { useEscrow, useLoading } from '../Store';


export default (props) => {

    const escrow = useEscrow();
    const [loading, setLoading] = React.useState(false)
    const [openListForm, setOpenListForm] = React.useState(false)
    const [offers, setOffers] = React.useState(props.offers)

    const saveList = (data) => {
        setOpenListForm(false)
        setLoading(true);
        escrow.listItem(data).then(res => {
            if (res["ok"]) {
                toast.success("Item has been listed")
            } else {
                toast.error(res["err"])
            };
           
            setLoading(false)
        });
    }

    const ol = props.offers && props.offers.map(o => 
        <OfferCard key={o.id} offer={o}/>
     );
    return (
        <>
        
        <Button variant='contained' onClick={()=> setOpenListForm(true)}>List NFT</Button>
        <Divider/>
        
        <Grid
            container
            spacing={2}
            direction="row"
           
            >
                
            {ol}

             <Dialog 
             maxWidth="md"
             fullWidth
             onClose={()=>setOpenListForm(false)} open={openListForm}>
                <DialogTitle>List NFT</DialogTitle>
                <ListItemForm submit={saveList}/>
            </Dialog>
            
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Grid>
        </>
    );
}