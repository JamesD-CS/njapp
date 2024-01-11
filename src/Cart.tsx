import {useState , useEffect, useContext}from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef
} from '@tanstack/react-table'
import { useLocalStorage } from 'usehooks-ts';
import {Api_driver} from "./api_driver";
import { CartContext } from "./cartContext";
import { Item, Order } from "./appTypes";
import cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';

import './App.css';


export default function Cart() {
    //constants and button handler functions go here
    const [data, setData] = useLocalStorage('cart_items', [] as Order[]);

    //const [apiCache, setapiCache] = useLocalStorage('api_cache', []);
    const  cartContext = useContext(CartContext);
    const cartItems = cartContext?.getCartItems();
    const cartTotal = cartContext?.getCartTotal();

    const columnHelper = createColumnHelper<Order>()
    const columns = [
      columnHelper.accessor(data => data.item_name, {
        id:'item_name',
        cell: info => info.getValue(),
      }),

      columnHelper.display({
        id: 'minus',
        cell: props =>  <button type="button">-</button> ,
      }),

    columnHelper.accessor(data=> data.quantity, {
      id:'quantity',
      cell: info => info.getValue(),
    }),

    columnHelper.display({
      id: 'plus',
      cell: props =>  <button type="button">+</button> ,
    }),
    
    columnHelper.display({
      id: 'delete',
      cell: props =>  <button type="button">Remove Item</button> ,
    })
    
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const clearLocalStorage = () =>{
    //setapiCache([]);
  }

  const getCookie = ():string | boolean =>{
    let token:string|undefined = cookies.get('token');
    if (typeof token ==='string' ){
      return token;
    }else{
      return false;
    }

  }

  const clearCart = () =>{
    cartContext?.clearCart();
  }

  const placeOrder = async() => {
    if (getCookie()){
    let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let itemsJSON = JSON.stringify(cartContext?.getCartItems());
    let token:string = cookies.get('token') as string;
    let orderjson = JSON.stringify({ 'items':itemsJSON,
    'order_total':cartContext?.getCartTotal(), 'order_status':'placed', 'order_date':date})
    const requestOptions = {
		  method: 'POST',
		  headers: { 
			  'Content-Type': 'application/json',
          'Accept':'*/*',
          'Authorization': token,   
		  },
		  body: orderjson
		};
    
    try {
      
		  let res = await fetch("http://localhost:9000/order", requestOptions);
		  
		  if (res.status === 201) {
        toast.success("Order placed",{autoClose: 2000,position: "bottom-center"});
        //navigate('/login');
      
		  } else if (res.status===500){
			  alert("Error");
        toast.error("Error placing order");
		  }
		} catch (err) {
		  console.log(err);
		}
    console.log(orderjson);

    }else{
      alert('log in to place order');
    }

  }

  const handleClick = (cell_id:string, order:Order) => {
    console.log(cell_id, order.item_id);
    if (cell_id.includes('delete')){
      cartContext?.removeItem(order.item_id);
    }else if (cell_id.includes('plus')){
      cartContext?.updateQuantity(order.item_id, 1);
    }else if (cell_id.includes('minus')){
      cartContext?.updateQuantity(order.item_id, -1);
    }
  }

  useEffect(() => {
    if (!getCookie()){
      cartContext?.setIsLoggedIn(false);
    }
    console.log('user name from cookie:',cookies.get('user_name'));
    
    }, []);
 
      return (
        <div>
          <ToastContainer autoClose={2000 } position="bottom-center"/>

          <h2>My Cart</h2>

          <table className='styled-table'>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} >
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} onClick={() => handleClick(cell.id, row.original)}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
        <tr>
          <td>Total:</td>
          <td>${cartTotal}</td>
        </tr>
        </tfoot>
        
      </table>
      <button  onClick={clearCart}>Clear Cart</button>
      <br></br>
      <button  onClick={placeOrder}>Place Order</button>

      
          
        </div>
      );
    
  }