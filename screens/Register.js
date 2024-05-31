import React, { useState } from 'react';
import {  ScrollView, View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Octicons, Ionicons, AntDesign } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { firebase } from '../firebaseConfig';
const statusBarHeight = Constants.statusBarHeight;
const Colors = {
  primary: "#ffffff",
  secondary: "#ED5B2D",
  teritiary: "#291B25",
  brand: "#ff8316",
  blue: "#569fa0",
  gray: "#f9e8d1"
};

const Register = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
  
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        const userId = firebase.auth().currentUser.uid;
        return firebase.firestore().collection('users').doc(userId).set({
          fullName: fullName,
          email: email
        });
      })
      .then(() => {
        const user = firebase.auth().currentUser
        user.sendEmailVerification().then(() => {
            alert("Verification email has been sent");
            navigation.navigate("Home")
        }).catch((err) => {
            console.log(err)
        })
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      <View style={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <Image
            style={styles.pageLogo}
            source={require("../assets/LogoTopBottom.png")}
            resizeMode="contain"
          />
          <Text style={styles.pageTag}>Don't just buy stuff on a whim!!</Text>
          <Text style={styles.secondHeader}>-SIGN UP-</Text>
          <View style={styles.formArea}>
            <MyTextInput
              label="Name:"
              icon="person"
              placeholder="Enter Your Name"
              onChangeText={setFullName}
              value={fullName}
            />
            <MyTextInput
              label="Email Address:"
              icon="mail"
              placeholder="Enter Your Email"
              onChangeText={setEmail}
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
            <MyTextInput
              label="Confirm Password:"
              icon="lock"
              placeholder="Confirm Your Password"
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              secureTextEntry={!isPasswordVisible}
              isPassword={true}
              isPasswordVisible={isPasswordVisible}
              setIsPasswordVisible={setIsPasswordVisible}
            />
            <Text style={styles.msgBox}>...</Text>
            <TouchableOpacity style={styles.styledButton} onPress={handleRegister}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <View style={styles.line} />
            <View style={styles.extraView}>
              <Text style={styles.extraText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.textLink}>
                <Text style={styles.textLinkContent}>Sign in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
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
  scrollContainer: {
    paddingTop: statusBarHeight + 12,
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

export default Register;
