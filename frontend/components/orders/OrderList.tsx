import * as React from 'react';


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { Button, Dialog ,DialogContent,DialogTitle,IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { toast } from 'react-toastify';

import { useEscrow } from '../Store';
import OrderListItem from './OrderListItem';
import OrderForm from './OrderForm';
import { NewOrder, NewSellOrder } from '../../api/escrow/escrow.did';

export interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
}

export default () => {
    const escrow = useEscrow();
    const [orders, setOrders] = React.useState([])
    const [loading, setLoading]= React.useState(false)
    const [page, setPage] = React.useState(1)

    const [openOrderForm, setOpenOrderForm] = React.useState(false);

    React.useEffect(() => {
        loadProcessingOrders();
    }, []);

    function loadProcessingOrders(){
        setLoading(true)
        escrow.getOrders().then(os => {
            setOrders(os)
            setLoading(false)
        })
    };
    
    function loadAllOrders(){
        setLoading(true)
        escrow.getAllOrders(BigInt(page)).then(os => {
            console.log(os)
            setOrders(os)
            setPage(page+1)
            setLoading(false)
        })
    };

    function buy(newOrder: NewOrder){
        try{
            setLoading(true)
            escrow.buy(newOrder).then(res=>{
                setLoading(false);
                if(res["ok"]){
                    toast.success("your order has created!")
                    
                }else{
                    toast.error(res["err"].toString());
                }
                
            });
            setOpenOrderForm(false);
        }catch(err){
            toast.error(err.toString())
        };
        
    };

    function sell(newOrder: NewSellOrder){
        try{
            setLoading(true)
            escrow.sell(newOrder).then(res=>{
                setLoading(false);
                if(res["ok"]){
                    toast.success("your order has created!")
                    
                }else{
                    toast.error(res["err"].toString());
                }
                
            });
            setOpenOrderForm(false);
        }catch(err){
            toast.error(err.toString())
        };
       
    };
    function BootstrapDialogTitle(props: DialogTitleProps) {
        const { children, onClose, ...other } = props;

        return (
            <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
                {children}
                {onClose ? (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </DialogTitle>
        );
    }
    let ol = orders.map(o =>
        <OrderListItem key={o.id} order={o} />
    )
    return (
        <>
        <Button variant='contained' onClick={()=>setOpenOrderForm(true)}>Create An Order</Button>
        <Button variant='contained' onClick={loadAllOrders}>All Orders ({page})</Button>
            {!loading && <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                             <TableCell>ID</TableCell>
                            <TableCell>Order Item</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell align="right">Order Time</TableCell>
                            <TableCell align="right"></TableCell>

                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ol}
                    </TableBody>
                </Table>
            </TableContainer>}

            {loading && <Box sx={{ minWidth: 650 }}>
                <Skeleton />
                <Skeleton animation="wave" />

            </Box>}

            <Dialog 
            maxWidth="md"
            fullWidth
            onClose={() => setOpenOrderForm(false)} open={openOrderForm}>
                <BootstrapDialogTitle id="customized-dialog-title" onClose={() => setOpenOrderForm(false)}>
                        New Escrow Contract
                    </BootstrapDialogTitle>
                    <DialogContent>
                    <OrderForm buy={buy} sell={sell}/>
                    </DialogContent>
           
            </Dialog>

        </>
    )
}