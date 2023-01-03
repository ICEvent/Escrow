import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom";

import moment from "moment";

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';


import Card from '@mui/material/Card';

import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

import { useGlobalContext } from "../components/Store";

const Profile = () => {

  const { state : {
    principal
  }} = useGlobalContext()

  return (

        <Card >
          <CardContent>
            <Typography gutterBottom  component="div">
              Principal : {principal.toString()}
            </Typography>
            <Typography gutterBottom  component="div">
              Balance : 0
            </Typography>
          </CardContent>

        </Card>
       
  )
}

export { Profile }
