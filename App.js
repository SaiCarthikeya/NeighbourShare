import React from 'react';
import Home from './screens/Home';
import Login from './screens/Login.js';
import Register from './screens/Register';

import RootStack from './navigators/RootStack.js';


function App() {
  return (
    <RootStack />
  );
}


export default App;