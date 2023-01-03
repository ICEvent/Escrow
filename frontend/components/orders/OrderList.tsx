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

import { useEscrow } from '../Store';
import OrderListItem from './OrderListItem';
export default () => {
    const escrow = useEscrow();
    const [orders, setOrders] = React.useState([])
    const [loading, setLoading]= React.useState(false)

    React.useEffect(() => {
        setLoading(true)
        escrow.getOrders().then(os => {
            setOrders(os)
            setLoading(false)
        })
    }, []);

    let ol = orders.map(o =>
        <OrderListItem key={o.id} order={o} />
    )
    return (
        <>
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
        </>
    )
}