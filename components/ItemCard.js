import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { firebase } from '../firebaseConfig';  // Ensure firebaseConfig is correctly set up

const Colors = {
  primary: "#ffffff",
  secondary: "#ED5B2D",
  teritiary: "#291B25",
  brand: "#ff8316",
  blue: "#569fa0",
  gray: "#f9e8d1"
};

const ItemCard = ({ image, itemName, rentPerHour, description, phoneNumber,currentLocation, location, mode, subMode, ownerId, itemId,handleRefresh }) => {
  const navigation = useNavigation();
  console.log("Submode " + mode +" " + ownerId)
  let buttonTextDisplay;
  let displayRed = false;
  if (mode === "availableItems") {
    if (subMode === "byYou") {
      buttonTextDisplay = "Remove Item";
      displayRed = true;
    } else {
      buttonTextDisplay = "Request Item";
    }
  } else if (mode === "rentRequests") {
    if (subMode === "byYou") {
      buttonTextDisplay = "Remove Rent Request";
      displayRed = true;
    } else {
      buttonTextDisplay = "Contact Person";
    }
  }

  let costDisplay = mode === "availableItems" ? "Cost per Hour: " : "Expected cost/Hour: ";

  const handlePress = async () => {
    if (subMode !== 'byYou') {
      console.log(location)
      navigation.navigate('DetailedItem', {
        item: { image, itemName, rentPerHour, description, phoneNumber, location, mode, ownerId,currentLocation }

      });
    } else {
      // Handle deletion
      const collec = mode === "availableItems" ? "items" : "rentRequests";
      Alert.alert(
        "Confirm Deletion",
        "Are you sure you want to remove this item?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes", 
            onPress: async () => {
              try {
                console.log(`Attempting to delete item with ID: ${itemId}`);
                await firebase.firestore().collection(collec).doc(itemId).delete();
                console.log("Item successfully deleted.");
                Alert.alert("Item removed", "The item has been removed successfully.");
                handleRefresh();
              } catch (error) {
                console.error("Error removing item: ", error);
                Alert.alert("Error", "There was an error removing the item. Please try again.");
              }
            }
          }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.itemName}>{itemName}</Text>
      <Text style={styles.rentPerHour}>{costDisplay} {rentPerHour}</Text>
      <TouchableOpacity onPress={handlePress} style={[styles.rentButton, displayRed && styles.redButton]}>
        <Text style={styles.rentButtonText}>{buttonTextDisplay}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '45%',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#ddd',
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 10,
    margin: 5,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  rentPerHour: {
    fontSize: 12,
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    marginTop: 5,
    color: 'gray',
  },
  redButton: {
    backgroundColor: '#f43e11',
  },
  rentButton: {
    backgroundColor: Colors.blue,
    borderRadius: 5,
    marginTop: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  rentButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ItemCard;
