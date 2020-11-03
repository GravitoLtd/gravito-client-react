# Gravito Client React.js
Gravito's IdentityServer4 client for React.js

A sample project which demonstrates how to connect to Gravito and get the access_token.

Open and view the Project using the `.zip` file download or at our [GitHub Repository]

## Table of Contents
- [Getting started](#getting-started)
- [Tools required](#tools-required)
- [Usage guide](#usage-guide)
- [What after getting token?](#what-after-getting-token)
- [Visit us at](#visit-us-at)

## Getting Started

You can find the detailed documentation about the **Gravito Identity Management** at [Gravito Docs].

We have explained how Gravito works as an Identity Provider.

Here are a few things which will help you to validate your react App as valid client.

## Tools required

* VS Code

## Usage guide



* Install oidc-client library using npm:
```js
npm i oidc-client
```

* Inside your App.js create an oidc UserManager using the config 
```js
import { UserManager } from  'oidc-client';
var  querystring  =  require('querystring');

let  config  = {
client_id: 'client_id',
grant_type:'client_credentials',
scope:'API',

}
let  manager  =  new  UserManager(config);
```

* Call TokenEndpoint and get the token
```js
async  function  getIdentityToken() {
	let  localIdentityToken  =  localStorage.getItem('identityToken');
	if(localIdentityToken  ===  null  ||  localIdentityToken  ===  ''  ||  localIdentityToken  ===  undefined){
		let  promise  =  Promise.resolve(manager.metadataService.getTokenEndpoint());
		let  tokenEndpoint  =  await  promise;
		const  config_header  = {
		headers: {'Content-Type':'application/x-www-form-urlencoded'}
		}
		const  response  =  await  axios.post(tokenEndpoint, querystring.stringify(config), config_header);
		let  identity_token_expires_on  = (new  Date().getTime() /  1000) +  response.data["expires_in"];
		localStorage.setItem('identity_token_expires_on', identity_token_expires_on)
		localStorage.setItem('identityToken', response.data.access_token)
	}
}
```


* Write a function to remove invalid token from localstorage 
```js
function  removeInvalidToken() {
	const  localToken  =  localStorage.getItem('identitytoken');
	if (localToken) {
		let  identity_token_expires_on  =  localStorage.getItem('identity_token_expires_on');
		let  current_time  =  new  Date().getTime() /  1000;
		if (identity_token_expires_on) {
			if (identity_token_expires_on  <=  current_time){
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
```
* Then call these function to get token
```js
removeInvalidToken()
getIdentityToken();
```
* Your App.js should look something like this
```js
import  React  from  "react";
import  "./App.css";
import  axios  from  'axios';
import  Login  from  "./pages/loginpage";
import { UserManager } from  'oidc-client';
var  querystring  =  require('querystring');
  
let  config  = {
client_id: 'client_id',
grant_type:'client_credentials',
scope:'API',
}

let  magicLinkData  = {
email: 'testemail@example.com',
token: ''
}
 
let  manager  =  new  UserManager(config);

async  function  getIdentityToken() {
	let  localIdentityToken  =  localStorage.getItem('identityToken');
	if(localIdentityToken  ===  null  ||  localIdentityToken  ===  ''  ||  localIdentityToken  ===  undefined){
		let  promise  =  Promise.resolve(manager.metadataService.getTokenEndpoint());
		let  tokenEndpoint  =  await  promise;
		const  config_header  = {
		headers: {'Content-Type':'application/x-www-form-urlencoded'}
		}
		const  response  =  await  axios.post(tokenEndpoint, querystring.stringify(config), config_header);
		let  identity_token_expires_on  = (new  Date().getTime() /  1000) +  response.data["expires_in"];
		localStorage.setItem('identity_token_expires_on', identity_token_expires_on)
		localStorage.setItem('identityToken', response.data.access_token)
	}

}
function  removeInvalidToken() {
	const  localToken  =  localStorage.getItem('identitytoken');
	if (localToken) {
		let  identity_token_expires_on  =  localStorage.getItem('identity_token_expires_on');
		let  current_time  =  new  Date().getTime() /  1000;
		if (identity_token_expires_on) {
			if (identity_token_expires_on  <=  current_time) {
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
  
function  App() {
	return (
		<div className="App">
			<Login></Login>
		</div>
	);
}

export  default  App;
```
## What after getting token?
### Send this token as Authorization header with every API request to Gravito:
```js
loginUser  =  async () => {
	try {
		let  identityToken  =  localStorage.getItem('identityToken')
		this.setState({ loading: true })
		let  model  = {
		email: 'testemail@example.com',
		token: ''
		}
		const  config_header  = {
			headers: {
			'Content-Type': 'application/json',
			'Authorization': "bearer "  +  identityToken
			}
		}
		const  response  =  await  axios.post('https://api.gravito.net/api/account/sso/magiclink', model, config_header);
		this.setState({ loading: false, emailSent: true })
	} catch (error) {
		console.log("error occured", error);
		this.setState({ loading: false })
	}

}
```


## Visit us at
[Website]

[GitHub Repository]: https://github.com/GravitoLtd/gravito-client-dotnet
[Website]: https://www.gravito.net
[Gravito Docs]: https://docs.gravito.net/gravito-identity-provider/getting-started