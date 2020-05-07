import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("SUCCESS");
  };

  return (
    <Fragment>
      {/* <div class='alert alert-danger'>Invalid credentials</div> */}
      <h1 class='large text-primary'>Sign In</h1>
      <p class='lead'>
        <i class='fas fa-user'></i> Sign into Your Account
      </p>
      <form className='form' onSubmit={(e) => onSubmit(e)}>
        <div className='form-group'>
          <input
            onChange={(e) => onChange(e)}
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
          />
        </div>
        <div className='form-group'>
          <input
            onChange={(e) => onChange(e)}
            type='password'
            placeholder='Password'
            name='password'
            minLength='6'
            value={password}
          />
        </div>
        <input
          onChange={(e) => onChange(e)}
          type='submit'
          className='btn btn-primary'
          value='Login'
        />
      </form>
      <p className='my-1'>
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
    </Fragment>
  );
};

export default Login;