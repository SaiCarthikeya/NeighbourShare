import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Octicons, Ionicons, AntDesign } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { firebase } from '../firebaseConfig';
//import { useNavigation } from '@react-navigation/native';
const statusBarHeight = Constants.statusBarHeight;

const Colors = {
  primary: "#ffffff",
  secondary: "#ED5B2D",
  teritiary: "#291B25",
  brand: "#ff8316",
  blue: "#569fa0",
  gray: "#f9e8d1"
};

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  // const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin =async () => {
    // Add your login logic here
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      navigation.navigate("Home");
    } catch(error) {
      alert(error.message);
    }
  };

  const resetPassword = async () => {
    if (!email) {
      alert("Enter a valid email");
      return
    } 
    firebase.auth().sendPasswordResetEmail(email)
  .then(() => {
    alert("Password reset email has been sent!")
  })
  .catch((error) => {
    alert(error.message)
  });
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Image
          style={styles.pageLogo}
          source={require("../assets/LogoTopBottom.png")}
          resizeMode="contain"
        />
        <Text style={styles.pageTag}>Don't just buy stuff on a whim!!</Text>
        <Text style={styles.secondHeader}>-LOGIN-</Text>
        <View style={styles.formArea}>
          <MyTextInput
            label="Email Address:"
            icon="mail"
            onChangeText={setEmail}
            placeholder="Enter Your Email"
            value={email}
            keyboardType="email-address"
          />
          <MyTextInput
            label="Password:"
            icon="lock"
            placeholder="Enter Your Password"
            onChangeText={setPassword}
            value={password}
            secureTextEntry={!isPasswordVisible}
            isPassword={true}
            isPasswordVisible={isPasswordVisible}
            setIsPasswordVisible={setIsPasswordVisible}
          />
          <Text style={styles.msgBox}>...</Text>
          <TouchableOpacity style={styles.styledButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <View style={styles.line} />
          <View style={styles.extraView}>
            <Text style={styles.extraText}>Don't have an account already? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.textLink}>
              <Text style={styles.textLinkContent}> Signup</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.extraView}>
            <Text style={styles.extraText}>Forgot you Password? Dont't worry </Text>
            <TouchableOpacity onPress={resetPassword} style={styles.textLink}>
              <Text style={styles.textLinkContent}> Reset Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const MyTextInput = ({ label, icon, isPassword, isPasswordVisible, setIsPasswordVisible, ...props }) => {
  return (
    <View>
      <View style={styles.leftIcon}>
        <Octicons name={icon} size={30} color={Colors.brand} />
      </View>
      <Text style={styles.styledInputLabel}>{label}</Text>
      <TextInput style={styles.styledInput} {...props} />
      {isPassword && (
        <TouchableOpacity style={styles.rightIcon} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Ionicons size={30} name={isPasswordVisible ? "eye" : "eye-off"} color="#f99984" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: statusBarHeight + 12.5,
    backgroundColor: Colors.primary,
  },
  innerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageLogo: {
    width: 250,
    height: 200,
    margin: 0,
    paddingTop: 50,
  },
  pageTag: {
    fontSize: 12,
    marginTop: 0,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 0,
    color: Colors.teritiary,
    fontFamily: 'Roboto',
  },
  secondHeader: {
    fontSize: 18,
    marginTop: 0,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 0,
    margin: 20,
    color: Colors.teritiary,
    fontFamily: 'Roboto',
  },
  formArea: {
    width: '85%',
  },
  styledInput: {
    padding: 18,
    paddingLeft: 50,
    fontSize: 16,
    backgroundColor: Colors.gray,
    borderWidth: 3,
    borderColor: Colors.secondary,
    borderRadius: 12,
    color: Colors.teritiary,
    marginVertical: 4,
    marginBottom: 10,
  },
  styledInputLabel: {
    color: Colors.teritiary,
    fontSize: 12,
    textAlign: 'left',
    padding: 5,
  },
  leftIcon: {
    position: 'absolute',
    top: 47,
    left: 10,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    top: 47,
    right: 10,
    zIndex: 1,
  },
  styledButton: {
    backgroundColor: Colors.blue,
    color: Colors.teritiary,
    padding: 15,
    alignContent: 'center',
    borderRadius: 12,
    marginVertical: 5,
    justifyContent: 'center',
    height: 60,
    width: '60%',
    alignSelf: 'center',
  },
  buttonText: {
    color: Colors.primary,
    textAlign: 'center',
    fontSize: 16,
    padding: 5,
  },
  msgBox: {
    textAlign: 'center',
    fontSize: 12,
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: '#44361b',
    marginVertical: 5,
  },
  extraView: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  extraText: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    color: Colors.teritiary,
    fontSize: 14,
  },
  textLink: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLinkContent: {
    backgroundColor: Colors.primary,
    color: Colors.secondary,
    fontSize: 14,
  },
});

export default Login;
