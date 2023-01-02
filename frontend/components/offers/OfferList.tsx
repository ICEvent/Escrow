import * as React from 'react';

import Grid from '@mui/material/Grid';

import OfferCard from './OfferCard';

export default (props) => {

    const ol = props.offers && props.offers.map(o => 
       <OfferCard key={o.id} offer={o}/>
    );
    return (
        <Grid
            container
            spacing={2}
            direction="row"
           
            >
            {ol}
        </Grid>
    );
}