import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { firebase } from '../firebaseConfig';

const Colors = {
  primary: "#ffffff",
  secondary: "#ED5B2D",
  tertiary: "#291B25",
  brand: "#ff8316",
  blue: "#569fa0",
  gray: "#f9e8d1"
};


const DetailedItem = ({ route }) => {
  const { item } = route.params;
  const currentLocation = item.currentLocation;
  const [ownerName, setOwnerName] = useState('');
  const [loading, setLoading] = useState(true);
  const distance = item.distance;
  console.log(distance)

  useEffect(() => {
    const fetchOwnerName = async () => {
      try {
        const userDoc = await firebase.firestore().collection('users').doc(item.ownerId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setOwnerName(userData.fullName);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching owner details: ", error);
      } finally {
        setLoading(false);
      }
    };


    fetchOwnerName();
  }, [item.ownerId, currentLocation, item.location]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.brand} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Detailed Item Info</Text>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.itemName}>{item.itemName}</Text>
        <Text style={styles.rentPerHour}>Cost per Hour: {item.rentPerHour}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.contactContainer}>
          <Text style={styles.contactLabel}>Contact:</Text>
          <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
        </View>
        <View style={styles.distanceContainer}>
          <Text style={styles.distanceLabel}>Distance:</Text>
          <Text style={styles.distance}>
            {distance < 1 ? "Less than 1 km" : `${distance.toFixed(2)} km`}
          </Text>
        </View>
        <View style={styles.ownerContainer}>
          <Text style={styles.ownerLabel}>Owner:</Text>
          <Text style={styles.ownerName}>{ownerName}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  }, distanceContainer: {
    marginBottom: 16,
  },
  distanceLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.tertiary,
    marginBottom: 4,
  },
  distance: {
    fontSize: 16,
    color: Colors.tertiary,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: Colors.gray,
    borderRadius: 8,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.tertiary,
    marginBottom: 8,
  },
  rentPerHour: {
    fontSize: 18,
    color: Colors.tertiary,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: Colors.secondary,
    marginBottom: 16,
  },
  contactContainer: {
    marginBottom: 16,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.tertiary,
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 16,
    color: Colors.tertiary,
  },
  locationContainer: {
    marginBottom: 16,
  },
  locationLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.tertiary,
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: Colors.tertiary,
  },
  ownerContainer: {
    marginBottom: 16,
  },
  ownerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.tertiary,
    marginBottom: 4,
  },
  ownerName: {
    fontSize: 16,
    color: Colors.tertiary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
});

export default DetailedItem;
