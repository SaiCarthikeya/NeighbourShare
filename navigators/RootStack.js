
import { createStackNavigator } from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {firebase} from '../firebaseConfig'
import { useState, useEffect } from 'react';
const Stack = createStackNavigator();

//import AppLoadingScreen from './../components/AppLoadingScreen';
import Home from './../screens/Home';
import Login from './../screens/Login';
import Register from './../screens/Register';

const Colors = {
    primary: "#ffffff",
    secondary: "#ED5B2D",
    teritiary: "#291B25",
    brand: "#ff8316",
    blue: "#569fa0",
    gray: "#f9e8d1"
  };
  


const RootStack = () => {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    const onAuthStateChanged = (user) => {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const currrentUser = firebase.auth().onAuthStateChanged(onAuthStateChanged);
        return currrentUser;
    }, [])

    if (initializing) return null;
    if (!user) {
    return (
        <NavigationContainer>

            <Stack.Navigator screenOptions={{
                headerStyle: {
                    backgroundColor: "transparent"
                },
                headerTintColor: Colors.teritiary,
                headerTransparent:true,
                headerTitle: '',
                headerLeftContainerStyle: {
                    paddingLeft: 20
                }
            }}
            initialRouteName='Register'>
                <Stack.Screen name="Login" component={Login} /> 
                <Stack.Screen name="Register" component={Register} /> 
                <Stack.Screen name="Home" component={Home} /> 
            </Stack.Navigator>
        </NavigationContainer>
    )
}
return (
    <NavigationContainer>

            <Stack.Navigator screenOptions={{
                headerStyle: {
                    backgroundColor: "transparent"
                },
                headerTintColor: Colors.teritiary,
                headerTransparent:true,
                headerTitle: '',
                headerLeftContainerStyle: {
                    paddingLeft: 20
                }
            }}
            initialRouteName='Home'>
                <Stack.Screen name="Login" component={Login} /> 
                <Stack.Screen name="Register" component={Register} /> 
                <Stack.Screen name="Home" component={Home} /> 
            </Stack.Navigator>
        </NavigationContainer>
)
}

export default RootStack;