import { Route, Routes, NavLink, HashRouter } from "react-router-dom";
import {useState, useEffect, useContext, createContext} from  'react';
import { useLocalStorage } from 'usehooks-ts';

import Home from "./Home";
import About from "./About";
import Contact from "./Contact";
import Signup from "./Signup";
import Login from  "./Login";
import User from "./User";
import CreateOrder from "./Order";
import Cart from "./Cart";
import { CartContext } from "./cartContext";
import './App.css';

export default function App(){
    const [isLoggedin, setIsloggedin] = useState(false);
    const  cartContext = useContext(CartContext);
    const cartCount = cartContext?.getItemCount();
    

    useEffect(() => {
      //let count = cartContext?.getItemCount() as number;
      //setItemcount(count);

      }, []);
  
    return (
      <HashRouter>
        <div className="App">
          <h1>Food Ordering App</h1>
          <ul className="header">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
            <li><NavLink to="/signup2">Signup</NavLink></li>
            <li><NavLink to="/login">Login</NavLink></li>
            <li><NavLink to="/order">Order</NavLink></li>
            <li><NavLink to="/cart">Cart</NavLink></li>
            <p>Cart:{cartCount} items</p>


          </ul>
          <div className="content">
            <Routes>
              <Route  path="/" element={<Home />}></Route>
              <Route  path="/about" element={<About />}></Route>
              <Route  path="/contact" element={<Contact />}></Route>
              <Route  path="/signup" element={<Signup />}></Route>
              <Route  path="/login" element={<Login />}></Route>
              <Route  path="/user" element={<User />}></Route>
              <Route  path="/order" element={<CreateOrder />}></Route>
              <Route  path="/cart" element={<Cart />}></Route>



            </Routes>
          </div>
        </div>
      </HashRouter>
    );
  
  }
