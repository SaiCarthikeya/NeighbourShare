import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Octicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { firebase } from '../firebaseConfig';

const Colors = {
  primary: "#ffffff",
  secondary: "#ED5B2D",
  teritiary: "#291B25",
  brand: "#ff8316",
  blue: "#569fa0",
  gray: "#f9e8d1"
};

const AddItem = ({ route, navigation }) => {
  const { currentLocation } = route.params;
  const [selectedType, setSelectedType] = useState('item');
  const [itemName, setItemName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [rentPerHour, setCostPerHour] = useState('');
  const [location, setLocation] = useState(currentLocation || null);
  const [mobile, setMobile] = useState('');

  const handleAddItem = async () => {
    if (!itemName || !imageUrl || !description || !rentPerHour || !location || !mobile) {
      Alert.alert("Validation Error", "Please fill in all the fields.");
      return;
    }

    try {
      const newItem = {
        itemName,
        image: imageUrl,
        description,
        rentPerHour,
        location,
        mobile,
        type: selectedType,
        ownerId: firebase.auth().currentUser.uid
      };
      const collectionName = selectedType === 'item' ? 'items' : 'rentRequests';
      await firebase.firestore().collection(collectionName).add(newItem);
      navigation.navigate('Home', { refresh: true });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  useEffect(() => {
    if (!currentLocation) {
      const requestLocationPermission = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location.coords);
      };
      requestLocationPermission();
    }
  }, [currentLocation]);

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
      <View style={styles.innerContainer}>
        <Text style={styles.header}>Add New {selectedType === 'item' ? 'Item' : 'Rent Request'}</Text>
        <View style={styles.formArea}>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedType}
              onValueChange={(itemValue) => setSelectedType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Add Item" value="item" />
              <Picker.Item label="Add Rent Request" value="rentRequest" />
            </Picker>
          </View>
          <MyTextInput
            label="Item Name:"
            icon="tag"
            onChangeText={setItemName}
            placeholder="Enter Item Name"
            value={itemName}
          />
          <MyTextInput
            label="Image URL:"
            icon="link"
            onChangeText={setImageUrl}
            placeholder="Enter Image URL"
            value={imageUrl}
          />
          <MyTextInput
            label="Description:"
            icon="info"
            onChangeText={setDescription}
            placeholder="Enter Description"
            value={description}
          />
          <MyTextInput
            label="Cost per Hour:"
            icon="money"
            onChangeText={setCostPerHour}
            placeholder="Enter Cost per Hour"
            value={rentPerHour}
          />
          <MyTextInput
            label="Mobile:"
            icon="device-mobile"
            onChangeText={setMobile}
            placeholder="Enter Mobile Number"
            value={mobile}
            keyboardType="phone-pad"
          />
          <TouchableOpacity style={styles.styledButton} onPress={handleAddItem}>
            <Text style={styles.buttonText}>Add {selectedType === 'item' ? 'Item' : 'Rent Request'}</Text>
          </TouchableOpacity>
          {location && (
        <Text style={styles.locationText}>
          Location: {location.latitude}, {location.longitude}
        </Text>
      )}
        </View>
      </View>
    </ScrollView>
  );
};

const MyTextInput = ({ label, icon, ...props }) => {
  return (
    <View>
      <View style={styles.leftIcon}>
        {icon === "money" ? (
          <FontAwesome6 name="money-bill" size={30} color={Colors.brand} />
        ) : (
          <Octicons name={icon} size={30} color={Colors.brand} />
        )}
      </View>
      <Text style={styles.styledInputLabel}>{label}</Text>
      <TextInput style={styles.styledInput} {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
  },
  innerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.teritiary,
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
  pickerWrapper: {
    borderWidth: 2,
    borderColor: Colors.blue,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default AddItem;
