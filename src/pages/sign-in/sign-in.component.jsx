import React ,{useState} from 'react';
import { auth, signInWithGoogle } from '../../firebase/firebase.utils';

import './sign-in.styles.scss';

//MUI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';

const REACT_APP_TEST_USER_PASS = process.env.REACT_APP_TEST_USER_PASS;

const SignIn = () => {
  
  const [userCredentials,setUserCredentials] = useState({email:'',password:''})
  const [open,setOpen] = useState({
  errorMes:{}});

  const { email, password } = userCredentials;
  const {errorMes} = open;

  const handleSubmit = async event => {
    event.preventDefault();

    try{
      await auth.signInWithEmailAndPassword(email,password);
      setUserCredentials({email:'',password:''});
 
    }catch (error){
      console.log(error)
      if(error.code === 'auth/user-not-found'){
        //alert('There is no user record corresponding to this identifier.')
        setOpen({
          errorMes:{email: "There is no user record corresponding to this identifier."}
          })
      }else if(error.code === 'auth/wrong-password'){
        setOpen({
          errorMes:{password: "Wrong password"}
          })
      }
    } 
  };

  const handleChange = event => {
    const { value, name } = event.target;
    setUserCredentials({ ...userCredentials, [name]: value });
  };

  const signInAsTest = () => {
    setUserCredentials({email:'testuser@gmail.com',password:REACT_APP_TEST_USER_PASS});
  }

    return (
      <div className='sign-in'>
        <h2>Sign in </h2>
        
        <form onSubmit={handleSubmit}>
          <TextField
            autoFocus
            error={!!errorMes.email}
            helperText={errorMes.email}
            margin="normal"
            id="email"
            type="text"
            label = "Email"
            name="email"
            value={email}
            onChange = {handleChange}
            fullWidth
            required             
          />
          <TextField
            error={!!errorMes.password}
            helperText={errorMes.password}
            autoFocus
            margin="normal"
            id="password"
            type="password"
            label = "Password"
            name="password"
            value={password}
            onChange = {handleChange}
            fullWidth
            required             
          />
          <div className='buttons'>
            <Button type="submit"
              onClick = {handleSubmit}
              variant="contained" color="default">Sign in</Button>
            
            <Button type="submit"
            variant="contained" 
            onClick={signInWithGoogle}
            color="primary">Sign in with Google</Button>
          </div>
         
          <div className= 'test-user-buttons'>
          <Button onClick = {signInAsTest}
            color="secondary" type="submit" variant="contained">Sign in as test user</Button>
          </div>
          <h4 className="sign-up-here">don't have an account? sign up <Link href="/signup">here</Link></h4>
            
        </form>
      </div>
    );
  
}

export default SignIn;