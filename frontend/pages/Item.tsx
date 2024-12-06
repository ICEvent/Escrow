import * as React from 'react';

import { useParams } from "react-router-dom";

import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import { Tooltip } from '@mui/material';
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
import { useGlobalContext, useEscrow } from '../components/Store';
import { toast } from 'react-toastify';
import moment from 'moment';
import { CURRENCY_ICET, CURRENCY_ICP, LEDGER_E6S, LEDGER_E8S, ORDER_DEFAULT_EXPIRED_DAYS } from '../lib/constants';
import OfferDetail from '../components/offers/OfferDetail';
import { Item } from 'frontend/api/escrow/service.did';
import { Container } from '@mui/system';



export default (props) => {

    const { state: {
        isAuthed,
        principal
    } } = useGlobalContext();
    const escrow = useEscrow();
    const params =  useParams();
    const [loading, setLoading] = React.useState(false);

    const [offer, setOffer] = React.useState<Item|null>();

    React.useEffect(()=>{
        escrow.getItem(BigInt(params.id)).then(res=>{
            setOffer(res[0]);
        }); 
    },[])
  
    return (
        <Container sx={{ mt: 8 }}>
        {offer && <OfferDetail offer={offer}/>}
        </Container>
    );
}