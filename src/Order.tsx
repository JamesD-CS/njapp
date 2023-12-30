import {useState , useEffect, useContext}from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useLocalStorage } from 'usehooks-ts';
import { ToastContainer, toast } from 'react-toastify';
import { CartContext, useCartContext } from "./cartContext";
import { Item, Order } from "./appTypes";
import cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";



export default function CreateOrder() {
    const [data, setData] = useLocalStorage('data', []);
    const[apiCache, setApicache] = useLocalStorage('api_cache', []);
    const  cartContext = useContext(CartContext);
    const navigate = useNavigate();

    
    const columnHelper = createColumnHelper<Item>()

    const columns = [
      columnHelper.accessor('item_name', {
        cell: info => info.getValue(),
        footer: info => info.column.id,
      }),

    columnHelper.accessor('item_description', {
      cell: info => info.getValue(),
      footer: info => info.column.id,
    }),
    columnHelper.accessor('price', {
      cell: info => info.getValue(),
      footer: info => info.column.id,
    }),
    columnHelper.display({
      id: 'actions',
      cell: props =>  <button type="button">Add</button> ,
    })
    
  ]

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
        setApicache(data);
      })
      .catch((error) => {
        console.log('error: ' + error);
      });
      console.log('cookie is', cookies.get('token'));
      return () => {
        
      };
    }, []);
    

    return (
      <div>
        <ToastContainer autoClose={2000 } position="bottom-center"/>
        <table>
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
        
      </table>
        

        <button  onClick={getCart}>Show cart</button>
        <button  onClick={clearCart}>Clear cart</button>

        
      </div>
    );
  
}