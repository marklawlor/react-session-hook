<h1 align="center">
  <p align="center" style="font-size: 3em">👤</p>
  <p align="center">react-session-hook</p>
  <p align="center" style="font-size: 0.5em">Stateful sessions made easy</p>
</h1>

## Overview

<ul style="list-style: none;">
<li>✔️ Simple API
<li>✔️ Supports JWTs, simple string tokens and custom profiles
<li>✔️ Supports handling multiple tokens (access-token, id-token, refresh-token)
<li>✔️ Automatic logout and periodic refresh functions
<li>✔️ Customisable persistent storage
<li>✔️ Server-side rendering
<li>✔️ Global login and logout events across tabs
<li>✔️ Typescript typings and helper functions
</ul>

## Getting Started

Install react-session-hook using [`yarn`](https://yarnpkg.com):

```bash
yarn add react-session-hook
```

Or [`npm`](https://www.npmjs.com/):

```bash
npm install --save react-session-hook
```

And within your react component:

```javascript
import useSession from 'react-session-hook';

export default () => {
   
  /**
   * Recommended
   */
   
  // use the JWT values in storage
  const { token, profile, isAuthenticated, expiration } = useSession();
  
  // or for non JWT tokens
  const { token, isAuthenticated, expiration } = useSession({ jwt: false });

  // if you wish to change any settings provide values
  const { profile, isAuthenticated, expiration } = useSession(options);
}
```

## Examples

See the examples folder for complex usage

## Usage


### Options

```javascript
{ 
  // Set an initial value for a token. If undefined, they will default to the value in storage	
  accessToken: String (optional)
  idToken: String (optional)
  refreshToken String (optional)
  token: String (optional)
      
  // Attempt to parse profile and expiration date from the tokens
  jwt: Boolean (True)

  // The session profile. 
  // If jwt = True
  //    This will be set as the payload of the id Token or token
  profile: Object (optional)

  // Date object for the session expiration
  // If jwt = True
  //    Uses the 'exp' field in the accessToken or token to calculate session expiry
  //    If the payload does not have an 'exp' field it will fall back to this field
  // If no expiration is set the session will expire after 10 hours
  // Set value to null to explicitly set a session that never expires
  expiration: Date (optional)

  // Async callback. Returned object be passed to setSession
  // Notes: 
  //   - will not be fired if isAuthenticated = false
  //   - will be fired before the refreshInterval if session expires before refresh period
  refreshFn: Function (optional)
  
  // How often the refreshFn is called.
  refreshInterval: Number (1 * 60 * 60 * 1000) // 1 hours
  
 
  // Provide your own profile parsing logic. Useful for string tokens
  profileFn: (String) => Object | void
  
  // Defaults to cookie storage. See Storage for more information            
  storage: Storage (optional)

  //See: Server-Side Rendering for more information
  req: Request (optional)
  
  // See: Global login/logout for more information
  globalLogin: Boolean (false)
  globalLogout: Boolean (false)
                   
}
```

### Returned values

```javascript
{ 
  // The session tokens
  token: String | void
  accessToken: String | void
  idToken: String | void
  refreshToken: String | void
  
  // Manually set the session
  setSession: Function (options) => void 
  
  // Manually remove the session
  removeSession: Function () => void 

  profile: Object | void
  
  // If the session has no expiration, will be set to new Date(8640000000000000)
  expiration: Date,
  
  // If an accessToken or token exists and has not expired
  isAuthenticated: Boolean

  // See: Typescript section for more information
  isAuthenicatedGuard: () => Boolean
  
  // You can manually invoke the refreshFn
  refreshFn: Function (options) => options
  
  // If null, the refreshFn is paused. Most likely because isAuthenticated = False
  refreshInterval: Number | null

}
```

## Features

### Global login/logout

By default, browser tabs are kept in sync. If `removeSession` is called in one tab, it will be called in all tabs

If you wish to disable this behaviour set `globalLogout` and `globalLogin` to false in the options

### Server Side Rendering

If the `req` option is used, the package assumes you are performing Server Side Rendering. If you are using the default cookie storage, it will switch to using the request headers and an in-memory store.

If you are using a custom storage, the request will be passed to your store.

### Typescript 

`react-session-hook` was written in Typescript and includes typings out of the box.

It also includes the `isAuthenicatedGuard` function, which acts as a typeguard between an
authenicated and authenicated session

See the examples to see it in action

## Misc

The `setSesson` function can also be used to update some of the options. You can update the `refreshFn` with `setSession({ refreshFn })` or disable the refresh with `setSession({ refreshInterval: null })`

