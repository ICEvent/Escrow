import React from 'react';
import ItemList from './items/ItemList';

export const YourComponent = () => {
  const sampleItems = [
    {
      id: '1',
      name: 'Item 1',
      description: 'Description for item 1',
      price: 100,
      currency: 'ICP',
      category: 'NFT',
      image: 'https://alltracks.icevent.app/192x192.png',
      date: new Date(),
    },
    // ... more items
  ];

  const handleItemClick = (item) => {
    console.log('Clicked item:', item);
    // Handle item click
  };

  return (
    <ItemList 
      items={sampleItems}
      onItemClick={handleItemClick}
    />
  );
};
