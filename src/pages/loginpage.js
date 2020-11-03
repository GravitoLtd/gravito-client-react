import React, { Component } from "react";
import { Button, Loader, Segment, Dimmer } from "semantic-ui-react";
import axios from "axios"
import { NavLink } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css'

const justifyCenter = {
    display: "flex",
    justifyContent: "center",

};
class Login extends Component {
    state = {
        email: '',
        token: '',
        open: false,
        alreadyHavePin: false,
        emailSent:false,
        loading:false
    }

    isEmailValid = false;
    isTokenValid = false;
    componentDidMount() {

    }
    loginUser = async () => {
        try {
            let identityToken = localStorage.getItem('identityToken')
            this.setState({loading:true})
            let model = {
                email: this.state.email,
                token: ''
            }
            const config_header = {
                
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "bearer " + identityToken
                }

            }
            const response = await axios.post('https://dev-api.gravito.net/api/account/sso/magiclink', model, config_header);
            this.setState({loading:false,emailSent:true})
        } catch (error) {
            console.log("error occured", error);
            this.setState({loading:false})
        }
    }
    onUserLogin = () => {
        if (this.state.email !== '' && this.isEmailValid) {
            localStorage.setItem('user_id', this.state.email);
            // this.setState({email:""})
            this.loginUser()
        }
        else {
            alert('Please enter a valid email address');
        }

    }
    onEmailChange(event) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gmi;
        this.setState({ email: event.target.value, open: true });
        if (re.test(event.target.value)) {
            this.isEmailValid = true;
            return

        }
        this.isEmailValid = false
    }
    handleKeyDown = function (e) {
        if (e.key === 'Enter' && e.shiftKey === false) {
            e.preventDefault();
            this.onUserLogin();
        }
    };
    confirmUser=async()=>{
        try {
            let identityToken = localStorage.getItem('identityToken')
            this.setState({loading:true})
            let model = {
                email: this.state.email,
                token: this.state.token
            }
            const config_header = {
                withCredentials:true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "bearer " + identityToken
                }

            }
            const response = await axios.post('https://dev-api.gravito.net/api/account/sso/magicpinconfirmation', model, config_header);
            this.setState({loading:false,emailSent:true});
            alert("login successful")
            this.onReset()
        } catch (error) {
            console.log("error occured", error);
            this.setState({loading:false})
        }
    }
    onConfirmUser = () => {


        if (this.state.token !== '' && this.isTokenValid) {
            localStorage.setItem('user_id', this.state.email);
            this.confirmUser()
        }
        else {
            alert('Please enter a valid verification code');
        }

    }

    handlePinKeyDown = function (e) {
        if (e.key === 'Enter' && e.shiftKey === false) {
            e.preventDefault();
            this.onConfirmUser();
        }
    };
    onReset = () => {
        this.setState({
            alreadyHavePin: false,
            email: "",
            token: '',
            emailSent:false
        })
        
    }
    onPinChange(event) {
        var regex = /^\d{6}$/;
        this.setState({ token: event.target.value });
        if (regex.test(event.target.value)) {
            this.isTokenValid = true;

        }
    }
    alreadyHavePin = () => {



        this.setState({
            email: localStorage.getItem('user_id'),
            alreadyHavePin: true
        })
    }


    render() {
        const { email, token,loading, emailSent  } = this.state;
        

        const responseGoogle = (response) => {
            var responseModel = {
                accessToken: response.accessToken,
                provider: 'google'
            }
            // Pass Email, Name, accesstoken and provider to Gravito Api for user registration/access
            if (responseModel.accessToken) {
                this.props.socialSignIn(responseModel);
            }

        }
        const responseFacebook = (response) => {
            var responseModel = {
                accessToken: response.accessToken,
                provider: 'facebook'
            }
            // Pass Email, Name, accesstoken and provider to Gravito Api for user registration/access
            if (responseModel.accessToken) {
                this.props.socialSignIn(responseModel);
            }
        }
        var formGroup = (
            <div>
                <div style={{ display: "flex" }} className="page-login-field top-15" onKeyDown={(e) => { this.handleKeyDown(e); }}>
                    <i className="fa fa-envelope"></i>
                    <input autoComplete="off" key="email" id="email" name="email" type="email" placeholder="Enter your email address"
                        value={this.state.email}
                        onChange={(e) => { this.onEmailChange(e) }}
                        required
                    ></input>
                    <em>(required)</em>
                </div>
                <div style={{ ...justifyCenter, marginBottom: "10px" }}>
                    <Button className="submit-button bg-theme-color" onClick={this.onUserLogin}>Email me PIN to log in</Button>
                </div>
                {/* <div className="justify-center-link" onClick={this.alreadyHavePin} >
                       Already have PIN ?    
                 </div> */}

            </div>

        )
        if (emailSent || this.state.alreadyHavePin) {
            formGroup = (
                <div>
                    <div style={{ display: "flex" }} className="page-login-field top-15" onKeyDown={(e) => { this.handlePinKeyDown(e) }}>
                        <i className="fa fa-key"></i>
                        <input autoComplete="off" key="pin" id="pin" name="pin" type="number" placeholder="Enter Verification Code"
                            value={this.state.token}
                            onChange={(e) => { this.onPinChange(e) }}
                            required
                        ></input>
                        <em>(required)</em>

                    </div>
                    <div style={{ ...justifyCenter, marginBottom: "10px" }}>
                        <Button className="submit-button" onClick={this.onConfirmUser}>Confirm</Button>
                        <Button className="submit-button" onClick={this.onReset}>Reset</Button>
                    </div>
                </div>
            )
        }
        return (
            <>
                <div className="login-page-div">
                    <div className="new-hider"></div>
                    <div className=" login-content-div page-login content-boxed content-boxed-padding top-0 bottom-50 bg-white">
                        <img className="preload-image login-bg responsive-image1 bottom-0" src={"https://gravitocdn.blob.core.windows.net/logos/gravito_logo_white_background_150px.png"} alt="img"></img>
                        {/* <img className="preload-image login-image shadow-small" src={require('../../assets/images/gravito(G).png')} alt="img"></img> */}
                        <h1 className="color-black ultrabold top-20 bottom-5 font-30">Login</h1>

                        {formGroup}
                        <Dimmer active={loading}>
                            <Loader>Loading</Loader>
                        </Dimmer>

                        {/* <div style={justifyCenter}>
                            <p className="bottom-10 top-10">
                            Or alternatively sign in with
                                 </p>
                        </div>
                        <div style={justifyCenter}>
                            
                        </div> */}
                        <div style={justifyCenter}>
                            <p className="bottom-10">By signing up you agree to Gravito
                                 </p>

                        </div>
                        <div style={justifyCenter}>
                            <a style={{color:"orange"}} href="https://gravito.net/">Terms of Service</a>
                            {/* <NavLink to="/terms-conditions" className="bottom-10"></NavLink> */}
                        </div>

                    </div>

                </div>


            </>
        )
    }
}




export default Login;