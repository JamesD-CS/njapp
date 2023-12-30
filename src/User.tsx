import cookies from 'js-cookie';
import {useState} from 'react';

export default function User() {
    const [username, setUsername] = useState('');
    const token = cookies.get('token');
    console.log(token);
    const requestOptions = {
      method: 'GET',
      headers: { 
          'Content-Type': 'application/json',
          'Accept':'*/*',
          'Authorization': token as string,
      },
      
    };
    
    fetch("http://localhost:9000/user", requestOptions).then((response) => {
            if(!response.ok) throw new Error(response.status.toString() );
            else return response.json();
          })
          .then((data) => {
            //console.log(JSON.parse(data.user_info).user_name);
            setUsername(JSON.parse(data.user_info).user_name);
          })
          .catch((error) => {
            console.log('error: ' + error);
          });
        
    return (
      <div>
        <h3>Hello <div className="message">{username ? <p>{username}</p> : null}</div></h3>
        <p>Welcome Back</p>
        
      </div>
    );
  
}
