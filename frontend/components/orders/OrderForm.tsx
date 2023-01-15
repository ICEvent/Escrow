import * as React from 'react';
import { Principal } from '@dfinity/principal';

import Paper from '@mui/material/Paper';
import moment from 'moment';
import {
    Button, Dialog, DialogTitle, Grid, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, InputLabel, Select, MenuItem, Alert,
    Box, Stepper, Step, StepLabel

} from '@mui/material';

import OrderDetail from './OrderDetail';
import { CURRENCY_ICET, CURRENCY_ICP, LEDGER_E6S, LEDGER_E8S, ORDER_DEFAULT_EXPIRED_DAYS } from '../../lib/constants';
import { useGlobalContext } from '../Store';

export default (props) => {


    const { state: {
        principal
    } } = useGlobalContext()
    // const [openOrder, setOpenOrder] = React.useState(false)
    // const currency = Object.getOwnPropertyNames(props.order.currency)[0];
    // let es = currency == "ICP" ? 100000000 : 1000000;

    const [state, setState] = React.useState({
        item: "",
        yourside: "buyer",
        buyer: principal.toText(),
        seller: "",
        amount: 0,
        currency: CURRENCY_ICP,


    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let name = e.target.name;
        let value = e.target.value;
        console.log(e.target.name)
        console.log(e.target.value)

        if (name == "yourside") {
            if (value == "buyer") {
                setState({ ...state, "yourside": value, "buyer": principal.toText(), "seller": "" });
            } else {
                setState({ ...state, "yourside": value, "seller": principal.toText(), "buyer": "" });
            }
        } else {
            setState({ ...state, [name]: value });
        }
    }

    function createOrder() {
        let currency = state.currency == CURRENCY_ICP ? {"ICP": null}: {"ICET": null};
        let amount = state.currency == CURRENCY_ICP ? Number(state.amount * LEDGER_E8S): Number(state.amount * LEDGER_E6S)
        if(state.yourside == "buyer"){
            let order =
            {
                seller: Principal.fromText(state.seller),
                memo: state.item,
                amount: amount,
                currency: currency,
                expiration: BigInt(moment().add(ORDER_DEFAULT_EXPIRED_DAYS, "days").unix())
            }
            console.log(order)
            props.buy? props.buy(order): null;
        }else{
            let order =
            {
                buyer: Principal.fromText(state.buyer),
                memo: state.item,
                amount: amount,
                currency: currency,
                expiration: BigInt(moment().add(ORDER_DEFAULT_EXPIRED_DAYS, "days").unix())
            }
            console.log(order)
            props.sell? props.sell(order): null;
        };

        
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Alert severity="success">
                    Create a custom order to guard your fund with your buyer/seller in escrow smart contract.(e.g. house rental deposit, sale deposit... )
                
                <Box sx={{ width: '100%' }}>
                    <Stepper activeStep={1} alternativeLabel>

                        <Step key="deposit">
                            <StepLabel>Deposit Fund in Escrow</StepLabel>
                        </Step>
                        <Step key="deliver">
                            <StepLabel>Seller Deliver Item</StepLabel>
                        </Step>
                        <Step key="receive">
                            <StepLabel>Buyer Receive Item</StepLabel>
                        </Step>
                        <Step key="release">
                            <StepLabel>Release Fund to Seller</StepLabel>
                        </Step>

                    </Stepper>
                </Box>
                </Alert>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    autoFocus
                    margin="dense"
                    name="item"
                    label="Describe your orderring item"
                    fullWidth
                    variant="standard"
                    onChange={handleChange}
                    value={state.item}
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">Are you ?</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="yourside"
                        onChange={handleChange}
                    >

                        <FormControlLabel value="buyer" control={<Radio checked={state.yourside == "buyer"} />} label="Buyer" />
                        <FormControlLabel value="seller" control={<Radio checked={state.yourside == "seller"} />} label="Seller" />

                    </RadioGroup>
                </FormControl>
            </Grid>
            {state.yourside == "seller" && <Grid item xs={12} sm={8}>
                <TextField
                    autoFocus
                    margin="dense"
                    name="buyer"
                    label="the principal of buyer"
                    fullWidth
                    variant="standard"
                    onChange={handleChange}
                    value={state.buyer}
                />
            </Grid>}
            {state.yourside == "buyer" && <Grid item xs={12} sm={8}>
                <TextField
                    autoFocus
                    margin="dense"
                    name="seller"
                    label="the principal of seller"
                    fullWidth
                    variant="standard"
                    onChange={handleChange}
                    value={state.seller}
                />
            </Grid>}
            <Grid item xs={12} sm={6}>
                <TextField
                    autoFocus
                    margin="dense"
                    name="amount"
                    label="the amount of order"
                    fullWidth
                    variant="standard"
                    onChange={handleChange}
                    value={state.amount}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Currency</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        name="currency"
                        value={state.currency}
                        label="Currency"
                        onChange={handleChange}
                    >
                        <MenuItem selected={state.currency == CURRENCY_ICP} value={CURRENCY_ICP}>{CURRENCY_ICP}</MenuItem>
                        <MenuItem selected={state.currency == CURRENCY_ICET} value={CURRENCY_ICET}>{CURRENCY_ICET}</MenuItem>
                        <MenuItem disabled>USDT</MenuItem>
                        <MenuItem disabled>USDC</MenuItem>
                        <MenuItem disabled>BTC</MenuItem>
                        <MenuItem disabled>ETH</MenuItem>


                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <Button variant='contained' onClick={createOrder}>Create</Button>
            </Grid>
        </Grid>
    )
}