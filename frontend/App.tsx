import React from "react"
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import * as profile from "./api/profile";
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';

import Store from "./components/Store";

import { Profile } from "./pages/Profile"
import { Home } from "./pages/Home";

export default () => {


  return (
    <BrowserRouter>      
      <Store>
       {/* <NotificationContainer/> */}
        <Routes>
          <Route path="/:id" element={<Profile />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Store>
    </BrowserRouter>


  )
}

