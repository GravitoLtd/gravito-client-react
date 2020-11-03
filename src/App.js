import React from "react";
//import logo from "./logo.svg";
import "./App.css";
import axios from 'axios';
import Login from "./pages/loginpage";
import { UserManager } from 'oidc-client';
var querystring = require('querystring');

let config = {
	client_id: 'client_id',
	client_secret:'client_secret',
	grant_type:'client_credentials',
	scope:'API',
	authority: 'https://dev-identity.gravito.net'
}

let magicLinkData = {
	email: 'testemail@example.com',
	token: ''
}

// let token_endpoint = '';

let manager = new UserManager(config);


async function getIdentityToken() {
    let localIdentityToken = localStorage.getItem('identityToken');  
    if(localIdentityToken === null || localIdentityToken === '' || localIdentityToken === undefined){
        let promise = Promise.resolve(manager.metadataService.getTokenEndpoint());
        let tokenEndpoint = await promise;
        const config_header = {
          headers: {'Content-Type':'application/x-www-form-urlencoded'}
        }
      
        const response = await axios.post(tokenEndpoint, querystring.stringify(config), config_header);
        let identity_token_expires_on = (new Date().getTime() / 1000) + response.data["expires_in"];
        localStorage.setItem('identity_token_expires_on', identity_token_expires_on)
        localStorage.setItem('identityToken', response.data.access_token)
      }
   
    
}
function removeInvalidToken() {
    const localToken = localStorage.getItem('identitytoken');
    if (localToken) {
      let identity_token_expires_on = localStorage.getItem('identity_token_expires_on');
      let current_time = new Date().getTime() / 1000;
      if (identity_token_expires_on) {
        if (identity_token_expires_on <= current_time) {
          localStorage.removeItem('identitytoken');
          localStorage.removeItem('identity_token_expires_on');
          return
        }
        return
      }
      localStorage.removeItem('identitytoken');
      return
    }
  
  }
removeInvalidToken()
getIdentityToken();

function App() {
	return (
		<div className="App">
			<Login></Login>
		</div>
  	);
}


export default App;
