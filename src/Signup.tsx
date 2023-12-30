// Filename - pages/signup.js

import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';

export default function SignUp ()  {
  const navigate = useNavigate();
  const schema  = yup.object().shape({
    FirstName: yup.string().required("First Name is a required field"),
    LastName: yup.string().required("Last Name is a required field"),
    email: yup.string().required("email is a required field").email(),
    phone: yup
      .string()
      .required("Phone is a required field")
      .matches(
        /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
        "Invalid phone number format"
      ),
    password: yup
      .string()
      .required("Password is a required field"),
  });
  
  type FormValues = {
    FirstName: string
    LastName: string
    email: string
    phone:string
    password:string
  }  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } =  useForm<FormValues>({ resolver: yupResolver(schema) });
 
  const onSubmit:SubmitHandler<FormValues> = async(data) => {
    console.log(data.FirstName);
    const requestOptions = {
		  method: 'POST',
		  headers: { 
			  'Content-Type': 'application/json'    
		  },
		  body: JSON.stringify({
			first_name: data.FirstName,
      last_name:data.LastName,
      email:data.email,
			phone: data.phone,
			user_pass:data.password
		  })
		};
    
    try {
      
		  let res = await fetch("http://localhost:9000/register_user", requestOptions);
		  
		  if (res.status === 201) {
        toast.success("Sign up successful",{autoClose: 2000,position: "bottom-center"});
        //navigate('/login');
        setTimeout(navigate, 2500, "/login", { replace: true });
      
		  } else if (res.status===500){
			  alert("Error");
        toast.error("Error during signup");
		  }
		} catch (err) {
		  console.log(err);
		}
    
  };
  
	return (
		<div className="container">
      <ToastContainer autoClose={2000 } position="bottom-center"/>

      <header>
        <h1>Register New User</h1>
      </header>
      <form className = "nice-form-group" onSubmit={handleSubmit(onSubmit)}>
        <input
          id="FirstName"
          {...register("FirstName", {
            required: true,
          })}
          aria-invalid={errors.FirstName ? "true" : "false"}
          type="text"
          placeholder="First Name"
          className="input"
        />      
        {errors.FirstName?.type === "required" && (
          <p role="alert">First name is required</p>
        )}
        <br></br>
        <input
          id="LastName"
          {...register("LastName", {
            required: true,
          })}
          type="text"
          placeholder="Last Name"
          className="input"
        />
        {errors.LastName?.type === "required" && (
          <p role="alert">Last name is required</p>
        )}
         <br></br>
         <input
          id="email"
          {...register("email", {
            required: true,
          })}
          aria-invalid={errors.email ? "true" : "false"}
          type="text"
          placeholder="Email"
          className="input"
        />
        {errors.email && <p role="alert">{errors.email.message}</p>}
         <br></br>
        <input
          id="phone"
          {...register("phone", {
            required: true,
          })}
          type="text"
          placeholder="Phone"
          className="input"
        />
        {errors.phone && <p role="alert">{errors.phone.message}</p>}
         <br></br>
        <input
          id="password"
          {...register("password", {
            required: true,
          })}
          type="password"
          placeholder="password"
          className="input"
        />
        {errors.password?.type === "required" && (
          <p role="alert">password is required</p>
        )}
         <br></br>
        <button type="submit" className="btn">Submit</button>
      </form>
    </div>
	);
};

