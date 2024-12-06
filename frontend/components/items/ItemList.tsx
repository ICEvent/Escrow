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
import { Item } from '../../api/escrow/service.did';


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
                    <ListItem
                        key={Number(item.id)}
                        onClick={() => onItemClick?.(item)}
                        sx={{
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                        }}
                    >
                        {item.image ? (
                            <Avatar
                                src={item.image}
                                variant="rounded"
                                sx={{ width: 60, height: 60, mr: 2 }}
                            />
                        ) : (
                            <Avatar
                                variant="rounded"
                                sx={{ width: 60, height: 60, mr: 2, bgcolor: 'grey.200' }}
                            >
                                <ImageIcon sx={{ color: 'grey.400' }} />
                            </Avatar>
                        )}
                        <Box sx={{ width: '100%' }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <ListItemText
                                    primary={item.name}
                                    secondary={`${item.price} ${Object.getOwnPropertyNames(item.currency)[0]}`}
                                />
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Chip
                                        label={Object.getOwnPropertyNames(item.itype)[0]}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                    <Typography variant="body1">

                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {moment.unix(Number(item.listime) / 1000000000).format('MMM DD, YYYY')}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};
export default ItemList;
