import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { CURRENCY_ICET, CURRENCY_ICP, LEDGER_E6S, LEDGER_E8S, LISTITEM_STATUS_LIST, LIST_ITEM_COIN, LIST_ITEM_MERCHANDISE, LIST_ITEM_NFT, LIST_ITEM_OTHER, LIST_ITEM_SERVICE } from '../../lib/constants';
import { Button, Grid } from '@mui/material';
import ImageListItem from '@mui/material/ImageListItem';
import { toast } from 'react-toastify';

export default function ListItemForm(props) {


    const [values, setValues] = React.useState({
        name: "",
        description: "",
        image: "",
        itype: props.itype,
        price: 0,
        currency: CURRENCY_ICP,
        status: LISTITEM_STATUS_LIST
    });

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const list = () => {
        if (!values.name || values.name == "") { toast.warn("name is required") }
        else if (values.price <= 0) { toast.warn("Price is not correct") }
        else {
            const currency = values.currency == CURRENCY_ICET ? { "ICET": null } : { "ICP": null };
            const listype = values.itype == LIST_ITEM_NFT ? {"nft": null}:
                            values.itype == LIST_ITEM_COIN ? {"coin": null}:
                            values.itype == LIST_ITEM_MERCHANDISE ? {"merchandise": null}:
                            values.itype == LIST_ITEM_SERVICE ? {"service": null}:{"other": null}
            
            let i = {
                name: values.name,
                description: values.description,
                image: values.image,
                itype: listype,
                price: BigInt(values.price * (values.currency == CURRENCY_ICET ? LEDGER_E6S : LEDGER_E8S)),
                currency: currency,
                status: { "list": null }
            };
            props.submit(i);

        }

    };

    return (
        <Box padding={2}>
            <Grid container spacing={2}>
                {/* <Grid item xs={12}>
                    <ImageListItem>
                        <img src={values.image} />
                    </ImageListItem>
                </Grid> */}
                 <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>

                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={values.itype}
                            name="itype"
                            label="Type"
                            onChange={handleChange}
                        >
                            <MenuItem value={LIST_ITEM_NFT}>{LIST_ITEM_NFT}</MenuItem>
                            <MenuItem value={LIST_ITEM_COIN}>{LIST_ITEM_COIN}</MenuItem>
                            <MenuItem value={LIST_ITEM_MERCHANDISE}>{LIST_ITEM_MERCHANDISE}</MenuItem>
                            <MenuItem value={LIST_ITEM_SERVICE}>{LIST_ITEM_SERVICE}</MenuItem>
                            <MenuItem value={LIST_ITEM_OTHER}>{LIST_ITEM_OTHER}</MenuItem>

                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <FormControl fullWidth >
                        <TextField
                            id="outlined-name"
                            label="Name"
                            name="name"
                            value={values.name}
                            onChange={handleChange}

                        />
                    </FormControl>
                </Grid>
 

               
                <Grid item xs={12} sm={6} >
                    <FormControl fullWidth >
                        <TextField
                            name="price"
                            id="outlined-name"
                            label="Price"
                            type="number"
                            value={values.price}
                            onChange={handleChange}

                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>

                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={values.currency}
                            name="currency"
                            label="Currency"
                            onChange={handleChange}
                        >
                            <MenuItem value={CURRENCY_ICP}>{CURRENCY_ICP}</MenuItem>
                            <MenuItem value={CURRENCY_ICET}>{CURRENCY_ICET}</MenuItem>

                        </Select>
                    </FormControl>
                </Grid>
                {values.itype == LIST_ITEM_NFT && <Grid item xs={12}>
                    <FormControl fullWidth >
                        <TextField
                            id="outlined-name"
                            name="image"
                            label="NFT url"
                            value={values.image}
                            onChange={handleChange}

                        />
                    </FormControl>
                </Grid>}
                <Grid item xs={12}>
                    <FormControl fullWidth >
                        <TextField
                            name="description"
                            id="outlined-name"
                            label="Description"
                            value={values.description}
                            onChange={handleChange}

                        />
                    </FormControl>
                </Grid>
                <Grid item width={12} justifyContent={"center"} alignSelf="center" textAlign={"center"} alignItems={"center"}>
                    <FormControl >
                        <Button onClick={list} disabled={!values.name || values.price == 0} variant="contained" >List</Button>
                    </FormControl>
                </Grid>
            </Grid>
        </Box>

    );
}