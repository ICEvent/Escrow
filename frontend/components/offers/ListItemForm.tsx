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
import { CURRENCY_ICET, CURRENCY_ICP, LEDGER_E6S, LEDGER_E8S, LISTITEM_STATUS_LIST } from '../../lib/constants';
import { Button } from '@mui/material';
import ImageListItem from '@mui/material/ImageListItem';
import { toast } from 'react-toastify';

export default function ListItemForm(props) {

    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const [values, setValues] = React.useState({
        name: "",
        description: "",
        image: "",
        itype: "",
        price: 0,
        currency: CURRENCY_ICET,
        status: LISTITEM_STATUS_LIST
    });

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const list = () => {
        if(!values.name ||  values.name == ""){toast.warn("name is required")}
        else if(values.price <= 0){toast.warn("Price is not correct")}
        else{
            props.submit({
                name: values.name,
                description: values.description,
                image: values.image,
                itype: { "nft": null },
                price: BigInt(values.price * (values.currency == CURRENCY_ICET ? LEDGER_E6S : LEDGER_E8S)),
                currency: values.currency == CURRENCY_ICET ? { "ICET": null } : { "ICP": null },
                status: { "list": null }
            });
            
        }        
       
    };

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <div>
                <ImageListItem>
                    <img src={values.image} />
                </ImageListItem>

                <FormControl fullWidth sx={{ m: 1 }}>
                    <TextField
                        id="outlined-name"
                        label="Name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}

                    />
                </FormControl>
                <FormControl fullWidth sx={{ m: 1 }}>
                    <TextField
                        id="outlined-name"
                        name="image"
                        label="NFT url"
                        value={values.image}
                        onChange={handleChange}

                    />
                </FormControl>
                <FormControl fullWidth sx={{ m: 1 }}>
                    <TextField
                        name="price"
                        id="outlined-name"
                        label="Price"
                        type="number"
                        value={values.price}
                        onChange={handleChange}

                    />
                </FormControl>
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
                <FormControl fullWidth sx={{ m: 1 }}>
                    <TextField
                        name="description"
                        id="outlined-name"
                        label="Description"
                        value={values.description}
                        onChange={handleChange}

                    />
                </FormControl>

                <FormControl fullWidth sx={{ m: 1 }}>
                    <Button onClick={list} variant="contained" >List</Button>
                </FormControl>
            </div>
            
        </Box>
    );
}