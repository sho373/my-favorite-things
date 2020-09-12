import React from 'react';
import {auth, createUserProfileDocument} from '../../firebase/firebase.utils';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

//MUI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import './sign-up.styles.scss';

class SignUp extends React.Component  {

    constructor() {
        super();
    
        this.state = {
          displayName: '',
          email: '',
          password: '',
          confirmPassword: '',
          errorMes:{}
        };
      }

   
    //to soleve error "Can't perform a React state update on an unmounted component"
    componentWillUnmount() {
        this.setState = (state,callback)=>{
            return;
        };
    }
  
    handleSubmit = async event => {
        event.preventDefault();

        const { displayName, email, 
            password, confirmPassword,
          } = this.state;

        if(password !== confirmPassword){
            alert("passwords don't match");
            this.setState({
                isError:true,
                errorMes:{password:"passwords don't match"}
            })
            return;
        }
       
        const snapshot = await firebase.firestore().collection('users')
                        .where("displayName","==",displayName).get();

        if(!snapshot.empty){
            alert("this display name is already taken");
            this.setState({ 
                errorMes:{displayName:"this display name is already taken"}
            })
            return;
        } 
           
        try{
            const {user} = await auth.createUserWithEmailAndPassword(
                email,
                password
            );

            await createUserProfileDocument(user,{displayName});

            this.setState({
                displayName: '',
                email: '',
                password: '',
                confirmPassword: '',
                errorMes:{}
              });

        }catch (error){
            console.error(error);
            if(error.code === 'auth/email-already-in-use'){
                alert("The email address is already in use by another account")
                this.setState({ 
                    errorMes:{email:"The email address is already in use by another account"}
                })
            }else if (error.code === 'auth/weak-password'){
                alert("Passwords should be at least 6 characters")
                this.setState({
                    errorMes:{password:"Passwords should be at least 6 characters"}
                })
            }
        }
    }

    handleChange = event => {
        const {name,value} = event.target;
        this.setState({ [name]: value });
    }
   
    render () {
        const { displayName, email, 
            password, confirmPassword,
        errorMes } = this.state;

        return(
            <div className = 'sign-up'>
                <h2 className = 'title'>Create a new account</h2>
                <span>Sign up with your email and password</span>
                <form className = 'sign-up-form' onSubmit ={this.handleSubmit}>
                    
                        <TextField
                            autoFocus
                            error={!!errorMes.displayName}
                            helperText={errorMes.displayName}
                            margin="normal"
                            id="displayName"
                            type="text"
                            label = "Display name"
                            name="displayName"
                            value={displayName}
                            onChange = {this.handleChange}
                            fullWidth
                            required             
                        />
                        <TextField
                           
                            error={!!errorMes.email}
                            helperText={errorMes.email}
                            margin="normal"
                            id="email"
                            type="text"
                            label = "Email"
                            name="email"
                            value={email}
                            onChange = {this.handleChange}
                            fullWidth
                            required             
                        />
                        <TextField
                            error={!!errorMes.password}
                            helperText={errorMes.password}
                            margin="normal"
                            id="password"
                            type="password"
                            label = "Password"
                            name="password"
                            value={password}
                            onChange = {this.handleChange}
                            fullWidth
                            required             
                        /> 
                        <TextField
                            error={!!errorMes.password}
                            helperText={errorMes.password}
                            margin="normal"
                            id="confirmPassword"
                            type="password"
                            label = "Confirm Password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange = {this.handleChange}
                            fullWidth
                            required             
                        />      
                   
                    <span className = "sign-up-button">
                     <Button type='submit'
                        color="primary" variant="contained">SIGN UP</Button>
                    </span>
                    
                </form>

            </div>
        )
     }    
}

export default SignUp