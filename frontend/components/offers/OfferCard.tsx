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
import { Tooltip } from '@mui/material';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import Alert from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { Principal } from "@dfinity/principal";

import { useGlobalContext, useEscrow } from '../Store';
import OfferList from './OfferList';
import { toast } from 'react-toastify';
import moment from 'moment';
import { ORDER_DEFAULT_EXPIRED_DAYS } from '../../lib/constants';

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default (props) => {

    const { state: {
        isAuthed,
        principal
    } } = useGlobalContext();
    const escrow = useEscrow();

    const [loading, setLoading] = React.useState(false);
    const currency = props.offer.currency["ICP"] ? "ICP" : "ICET";

    const price = currency == "ICP" ? parseInt(props.offer.price) / 100000000 : parseInt(props.offer.price) / 1000000;

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
        <Grid item xs={12} sm={6} md={3} >
            <Card>
                <CardHeader
                    subheader={props.offer.name}
                />
                <Tooltip title={props.offer.description}>
                    <CardMedia
                        component="img"
                        height="194"
                        image={props.offer.image}
                        alt="no image"
                    />
                </Tooltip>
                <CardActions disableSpacing>
                    ${currency} {price}
                    {!loading && props.offer.owner.toString() != principal.toString() && <IconButton aria-label="put in order"
                        onClick={buyit}
                        disabled={loading}
                    >
                        <ShoppingCartIcon />
                    </IconButton>}
                    {props.offer.owner.toString() == principal.toString() &&
                    <Tooltip title="unlist item"><IconButton onClick={unlist}>
                        <FilterListOffIcon/>
                    </IconButton></Tooltip>
                    }
                    {loading && <Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                    </Box>}
                    <Tooltip title={props.offer.owner.toString()}>
                        <IconButton>
                            <PersonIcon />
                        </IconButton>
                    </Tooltip>
                </CardActions>

            </Card>


        </Grid>
    );
}