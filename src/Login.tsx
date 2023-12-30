import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import cookies from 'js-cookie';

export default function Login() {

    
        const [email, setEmail] = useState('');
        const [password, setPass] = useState('');
        const [message, setMessage] = useState('');
        const navigate = useNavigate();

        let handleSubmit = async (e:React.FormEvent) => {
          //e.preventDefault();
          const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept':'*/*'
                   
            },
            body: JSON.stringify({
              email: email,
              password:password
            })
          };
          console.log('fetching request');
          fetch("http://localhost:9000/login", requestOptions).then((response) => {
            if(!response.ok) throw new Error(response.status.toString() );
            else return response.json();
          })
          .then((data) => {
            console.log(data.token);
            cookies.set('token', data.token, { expires: 2, secure: true });
            setMessage("login successful");
            navigate('/user', { replace: true });
          })
          .catch((error) => {
            console.log('error: ' + error);
          });

        };    
        
	return (
		<div className="container">
          <header>
            <h1>Log In</h1>
          </header>
          <form className = "nice-form-group" onSubmit={handleSubmit} >
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="email"
              className="input"
            />
            <br></br>
            <input
              value={password}
              onChange={(e) => setPass(e.target.value)}
              type="password"
              placeholder="password"
              className="input"
            />
            <br></br>
            <button type="submit" className="btn">Submit</button>
            <div className="message">{message ? <p>{message}</p> : null}</div>

          </form>
        </div>
	);


};
