import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import moment from 'moment';
import { Tabs, Tab } from '@mui/material';


import {
    List,
    ListItem,
    ListItemText,
    Typography,
    Chip,
    Box,
    Paper
} from '@mui/material';
import { Item } from '../../api/escrow/escrow.did';
import OfferItem from '../offers/OfferItem';


interface ItemListProps {
    items: Item[];
    onItemClick?: (item: Item) => void;
    defaultFilter?: string; // Optional default filter
}

const ItemList: React.FC<ItemListProps> = ({ items, onItemClick, defaultFilter }) => {
    const [activeFilter, setActiveFilter] = React.useState(defaultFilter || 'all');

    const filteredItems = React.useMemo(() => {
        if (activeFilter === 'all') return items;
        return items.filter(item => Object.getOwnPropertyNames(item.itype)[0].toLowerCase() === activeFilter.toLowerCase());
    }, [items, activeFilter]);
    return (
        <Paper>
            <Tabs
                value={activeFilter}
                onChange={(_, newValue) => setActiveFilter(newValue)}
                sx={{ mb: 2 }}
            >
                <Tab value="all" label="All" />
                <Tab value="nft" label="NFTs" />
                <Tab value="crypto" label="Cryptos" />
                <Tab value="service" label="Services" />
                <Tab value="merchandise" label="Merchandise" />
                <Tab value="other" label="Other" />
            </Tabs>
            <List>
                {filteredItems.map((item) => (
                    <OfferItem key={item.id} offer={item}  />
                ))}
            </List>
        </Paper>
    );
};
export default ItemList;
