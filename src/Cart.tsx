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

export default function Cart() {
    //constants and button handler functions go here
    const [data, setData] = useLocalStorage('data', [] as Order[]);
    const [apiCache, setapiCache] = useLocalStorage('api_cache', []);
    const  cartContext = useContext(CartContext);

    const columnHelper = createColumnHelper<Order>()
    const columns = [
      columnHelper.accessor(data => data.item_name, {
        id:'item_name',
        cell: info => info.getValue(),
      }),

    columnHelper.accessor(data=> data.quantity, {
      id:'quantity',
      cell: info => info.getValue(),
    }),
    
    columnHelper.display({
      id: 'actions',
      cell: props =>  <button type="button">Remove Item</button> ,
    })
    
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const getSetCartData = () => {
    let cartContents:Order[]|undefined = cartContext?.getCartItems();
    setData(cartContents as Order[]);
  }

  const clearLocalStorage = () =>{
    setapiCache([]);
  }

  const clearCart = () =>{
    cartContext?.clearCart();
    setData([] as Order[]);
  }

  const deleteItem = (order:Order) =>{
    cartContext?.removeItem(order.item_id);
    getSetCartData();
  }

  useEffect(() => {
    
    getSetCartData();
    console.log(apiCache);
    //if localstorage api cache is empty fetch data from api
    if (apiCache.length === 0){
      console.log("api cache empty");
      let res = Api_driver.getItems().then((response) => {
        if(!response.ok) throw new Error(response.status.toString() );
        else return response.json();
      })
      .then((data:JSON) => {
        console.log(data);
      })
      .catch((error) => {
        console.log('error: ' + error);
      });
    }
    }, []);

    
      return (
        <div>
          <h2>My Cart</h2>

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
            <tr key={row.id} onClick={() => deleteItem(row.original)}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        
      </table>
      <button  onClick={clearCart}>Clear Cart</button>
      
          
        </div>
      );
    
  }