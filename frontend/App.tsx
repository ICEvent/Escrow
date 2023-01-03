import React from "react"
import {
  BrowserRouter,
  Routes,
  Route,

} from "react-router-dom";
import Header from './header'


import { makeStyles } from "@mui/material";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Store from "./components/Store";
import { Link, Slider, styled } from '@mui/material'
import { Profile } from "./pages/Profile"
import { Home } from "./pages/Home";


export default () => {


  const Root = styled('div')`
  padding: 1% 2% 10vh 2%;
  width: 100%;
  min-height: 95vh;
  display: flex;
  justify-content: center;
  align-items: center;

  & a {
    text-decoration: none;
    color: ${({ theme: { palette } }) => palette.primary.main};
  }
`
  return (
    <BrowserRouter>
      <Store>
        <Root>
          <Header/>
          <ToastContainer />
          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Root>
      </Store>
    </BrowserRouter>


  )
}

