import { useEffect, useContext}from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useLocalStorage } from 'usehooks-ts';
import { ToastContainer, toast } from 'react-toastify';
import { CartContext } from "./cartContext";
import { Item } from "./appTypes";
import cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import './App.css';

export default function CreateOrder() {
    const [data, setData] = useLocalStorage('data', []);
    const  cartContext = useContext(CartContext);
    const navigate = useNavigate();
    const cartTotal = cartContext?.getCartTotal();   
    const columnHelper = createColumnHelper<Item>()
    
    const columns = [
      columnHelper.accessor(info => info.item_name, {
        id:'Name',
        cell: info => info.getValue(),
      }),

      columnHelper.accessor(info=> info.item_description, {
        id:'Description',
        cell: info => info.getValue(),
      }),

      columnHelper.accessor(info=> info.price, {
        id:'Price',
        cell: info => info.getValue(),
      }),

      columnHelper.display({
        id: 'actions',
        cell: props =>  <button type="button" className='button-1'>Add</button> ,
      })
    ];

    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
    })
    
    const getCart=()=>{
        
        console.log("cart context",cartContext?.getCartItems());
        navigate('/cart', { replace: true });
    };

    const addItem=(item:Item)=>{
      cartContext?.addToCart(item);
      toast.info('added '+ item.item_name + " to order");
      
  };

    const clearCart=()=>{
      
      cartContext?.clearCart();
      toast.info("Order reset");
    };

  
    /* Load menu items from api in useEffect hook. Passing an empty array will load items from api
    on page render */
    useEffect(() => {
      setData([]);
      const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'Accept':'*/*'
        },
        
      };
      console.log('fetching items');
      fetch("http://localhost:9000/items", requestOptions).then((response) => {
        if(!response.ok) throw new Error(response.status.toString() );
        else return response.json();
      })
      .then((data) => {
        console.log(data);
        setData(data);
      })
      .catch((error) => {
        console.log('error: ' + error);
      });
      let token:string | undefined = cookies.get('token');
      console.log('cookie is', token);
      return () => {
        
      };
    }, []);
    

    return (
      <div>
        <ToastContainer autoClose={2000 } position="bottom-center"/>
        <h2>Order</h2>

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
            <tr key={row.id} 
            onClick={() => addItem(row.original)}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
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
        

        <button  className = 'button-1' onClick={getCart}>Show cart</button>
        {" "}
        <button  className = 'button-1' onClick={clearCart}>Clear cart</button>

 
      </div>
    );
  
}