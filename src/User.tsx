import cookies from 'js-cookie';
import {useState, useEffect, useMemo} from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getExpandedRowModel,
  ExpandedState,
  
} from '@tanstack/react-table'
import './App.css';

type item={
  order_id:number,
  item_id:number,
  quantity:number,
  item_name:string,
  price:number
}

type retreived_order={
  items:item[] 
  order_total:number 
  email:string 
  order_status:string 
  order_date:string 
  total_items:string
}

export default function User() {
    const [username, setUsername] = useState('');
    const token = cookies.get('token');
    //console.log(token);
    const [data, setData] = useState([] as retreived_order[]);
    const columnHelper = createColumnHelper<retreived_order>()
    const [expanded, setExpanded] = useState<ExpandedState>({});

    const columns = useMemo(() => [
      columnHelper.accessor(data=> data.total_items, {
        id:'Total Items',
        cell: (info) => {
          return (
            <>
              {info.row.getCanExpand() && (
                <button  className = 'button-1 expand-button' onClick={info.row.getToggleExpandedHandler()}>
                  {info.row.getIsExpanded() ? "-" : "+"}
                </button>
              )}
              {'  '}
              {info.getValue()}
            </>
          );
        }
      }), 
      columnHelper.accessor(data=> data.order_date, {
        id:'Order Date',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor(data=> data.order_status, {
        id:'Order status',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor(data => data.order_total, {
        id:'Total',
        cell: (info) => {return <>{'$ '} {(info.getValue())}</> },
      }),

    ], []);
  const table = useReactTable({
    data,
    columns,
    state: {
      expanded
    },
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onExpandedChange: setExpanded,
    
    getSubRows: (originalRow) =>
      originalRow.items.map((item) => ({
        order_total:item.price * item.quantity,
        email:'', 
        order_status:'', 
        order_date:'' ,
        total_items:item.item_name + ' - ' + item.quantity,
        items: []
      }))
    
  })
    const requestOptions = {
      method: 'GET',
      headers: { 
          'Content-Type': 'application/json',
          'Accept':'*/*',
          'Authorization': token as string,
      },
      
    };

    useEffect(() => {
      let token:string| undefined = cookies.get('token');
      if (typeof token === 'string'){
        setUsername(cookies.get('user_name') as string);
      }
      console.log('user name from cookie:',cookies.get('user_name'));
      fetch("http://localhost:9000/get_order", requestOptions).then((response) => {
            if(!response.ok) throw new Error(response.status.toString() );
            else return response.json();
          })
          .then((data:retreived_order[]) => {
            //console.log('order data',data);
            data.forEach((order) => {
              console.log('items', order.items);
              let formatted_time = new Date(order.order_date).toLocaleTimeString(navigator.language, {
                hour: '2-digit',
                minute:'2-digit'
              });
              let formatted_date = new Date(order.order_date).toLocaleDateString("en-US");
              order.order_date = formatted_date +' ' + formatted_time;
              let total_items = 0;
              order.items.forEach((item) =>{
                total_items += item.quantity;
              });
              order.total_items = total_items.toString();
              console.log('total items',order.order_total);
            });
            setData(data.reverse());
          })
          .catch((error) => {
            console.log('error: ' + error);
          });
      
      }, []);
    
    return (
      <div>
        <br></br>
        <br></br>
        <p>Welcome Back  {username ? <p>{username}</p> : null}</p>
        <h2>My Orders</h2>
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
            <tr key={row.id}>
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
          </tr>
        </tfoot>
      </table>
        
      </div>
    );
  
}
