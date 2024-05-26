import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';


const Colors = {
  primary: "#ffffff",
  secondary: "#ED5B2D",
  teritiary: "#291B25",
  brand: "#ff8316",
  blue: "#569fa0",
  gray: "#f9e8d1"
};


const ItemCard = ({ image, itemName, rentPerHour, description, onRequestRent }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.itemName}>{itemName}</Text>
      <Text style={styles.rentPerHour}>Cost per hour: {rentPerHour}</Text>
      <Text style={styles.description}>{description}</Text>
      <TouchableOpacity onPress={onRequestRent} style={styles.rentButton}>
        <Text style={styles.rentButtonText}>Request Rent</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
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
    fontSize: 16,
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    marginTop: 5,
    color: 'gray',
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
