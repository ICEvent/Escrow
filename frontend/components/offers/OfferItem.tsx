import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';

import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import { Tooltip,Dialog } from '@mui/material';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import Alert from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { Principal } from "@dfinity/principal";
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useGlobalContext, useEscrow } from '../Store';
import OfferList from './OfferList';
import { toast } from 'react-toastify';
import moment from 'moment';
import { CURRENCY_ICET, CURRENCY_ICP, LEDGER_E6S, LEDGER_E8S, ORDER_DEFAULT_EXPIRED_DAYS } from '../../lib/constants';

import OfferDetail from "./OfferDetail";

export default (props) => {

    const { state: {
        isAuthed,
    } } = useGlobalContext();
    const escrow = useEscrow();

    const [loading, setLoading] = React.useState(false);
    const [openOfferDetail, setOpenOfferDetail] = React.useState(false);
    const currency = Object.getOwnPropertyNames(props.offer.currency)[0] == CURRENCY_ICP ? CURRENCY_ICP : CURRENCY_ICET;

    const price = currency == CURRENCY_ICP ? parseInt(props.offer.price) / LEDGER_E8S : parseInt(props.offer.price) / LEDGER_E6S;

    const buyit = () => {
        if (!isAuthed) {
            toast.warn("Plseae login first");

        } else {
            setLoading(true)
            escrow.create({
                seller: props.offer.owner,
                memo: props.offer.name,
                amount: props.offer.price,
                currency: props.offer.currency,
                expiration: BigInt(moment().add(ORDER_DEFAULT_EXPIRED_DAYS, "days").unix())
            }).then(res => {
                setLoading(false)
                if (res["ok"]) {
                    toast.success("Your order has been created, check your order list!")
                } else {
                    toast.error(res["err"] ? res["err"] : "check console log for error message")
                };
            });
        }
    };

    const unlist = () => {
        setLoading(true)
        escrow.changeItemStatus(props.offer.id, {"sold": null}).then(res=>{
            if(res["ok"]){
                toast.success("unlist this item")                
            }else{
                toast.error(res["err"])
            };
            setLoading(false)

        })
    };

    return (
        // <Grid item xs={12} sm={6} md={3} >
            <ListItem
            key={props.offer.id}
            secondaryAction={
                <ListItemText>
                    {"$" + currency + " " + price}
                </ListItemText>
            }
            disablePadding
          >
            <ListItemButton role={undefined} onClick={()=>setOpenOfferDetail(true)}   dense>
                <ListItemIcon>
                {loading && <Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                    </Box>}
                </ListItemIcon>
              <ListItemText id={props.offer.id} primary={props.offer.name}/>
            </ListItemButton>

            <Dialog
                maxWidth="md"
                fullWidth
                disableEscapeKeyDown={false}
                onClose={() => setOpenOfferDetail(false)}
                open={openOfferDetail}>
                
                <OfferDetail offer={props.offer} close={()=>setOpenOfferDetail(false)}/>
            </Dialog>
          </ListItem>
          
    );
}