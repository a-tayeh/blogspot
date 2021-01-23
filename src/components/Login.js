import React from 'react';


const Login = (props) => {
    const { 
        email, 
        setEmail, 
        password, 
        setPassword, 
        handleLogin, 
        handleSignUp, 
        hasAccount, 
        setHasAccount, 
        emailError, 
        passwordError, 
    } = props;

    return(
     <section className="login"> 
     <div className="loginContainer">
         <label>UserName</label>
         <input
         type = "text"
         autoFocus
         required
         value={email}
         onChange={(e) => setEmail(e.target.value)}
         />
         <p className="errorMsg">{emailError}</p> 
         <label>Password</label>
         <input
         type = "password"
         autoFocus
         required
         value={password}
         onChange={(e) => setPassword(e.target.value)}
         />
         <p className="errorMsg">{passwordError}</p> 
         <div className= "btnContainer">
             {hasAccount ?(
                 <>
                 <button onClick={handleLogin}>Sign In</button>
                 <p> Dont have an account? <span onClick={() => setHasAccount(!hasAccount)}>sign Up</span></p>
                 </>
             ) : (
                <>
                <button onClick ={handleSignUp}>Sign Up</button>
                <p>Already a User? <span onClick={() => setHasAccount(!hasAccount)}>Sign In</span></p>
                </>
             )}
         </div>
     </div>
     </section>
    )
}

export default Login;