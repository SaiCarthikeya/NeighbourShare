import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ItemCard from '../components/ItemCard';
import { firebase } from '../firebaseConfig';
import Slider from '@react-native-community/slider';

import * as Location from "expo-location";

const getDistance = (latitude1, longitude1, latitude2, longitude2) => {
  const toRadian = n => (n * Math.PI) / 180;
  const R = 6371; // km

  const dLat = toRadian(latitude2 - latitude1);
  const dLon = toRadian(longitude2 - longitude1);
  const lat1 = toRadian(latitude1);
  const lat2 = toRadian(latitude2);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const Colors = {
  primary: "#ffffff",
  secondary: "#ED5B2D",
  tertiary: "#291B25",
  brand: "#ff8316",
  blue: "#569fa0",
  gray: "#f9e8d1"
};

const Home = ({ navigation }) => {
  const [name, setFullName] = useState('');
  const [selectedSection, setSelectedSection] = useState('availableItems');
  const [selectedSubsection, setSelectedSubsection] = useState('byOthers');
  const [availableItems, setAvailableItems] = useState([]);
  const [rentRequests, setRentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [checkingEmailVerification, setCheckingEmailVerification] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distanceFilter, setDistanceFilter] = useState(20); 
  const [maxDistance, setMaxDistance] = useState(20);


  const fetchUser = async () => {
    try {
      const user = firebase.auth().currentUser;
      const userSnapshot = await firebase.firestore().collection('users').doc(user.uid).get();
      if (userSnapshot.exists) {
        const userData = userSnapshot.data();
        setFullName(userData.fullName);
        setIsEmailVerified(user.emailVerified);
      } else {
        alert("User does not exist");
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      setLocationPermissionGranted(false);
      setLoading(false);  // Stop loading if permission is denied
      return;
    }
    setLocationPermissionGranted(true);
    let location = await Location.getCurrentPositionAsync({});
    setCurrentLocation(location.coords);
    setLoading(false);
  };
  
  

  const fetchItems = async () => {
    try {
      const itemsSnapshot = await firebase.firestore().collection('items').get();
      const items = itemsSnapshot.docs.map(doc => {
        const item = doc.data();
        const distance = currentLocation ? getDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          item.location.latitude,
          item.location.longitude
        ) : null;
        return { id: doc.id, ...item, distance };
      });
      setAvailableItems(items);
    } catch (error) {
      console.error("Error fetching items: ", error);
    }
  };

  const fetchRentRequests = async () => {
    try {
      const requestsSnapshot = await firebase.firestore().collection('rentRequests').get();
      const requests = requestsSnapshot.docs.map(doc => {
        const request = doc.data();
        const distance = currentLocation ? getDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          request.location.latitude,
          request.location.longitude
        ) : null;
        return { id: doc.id, ...request, distance };
      });
      setRentRequests(requests);
    } catch (error) {
      console.error("Error fetching rent requests: ", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await fetchUser();
    if (firebase.auth().currentUser.emailVerified) {
      setIsEmailVerified(true);
      await getLocation();
    } else {
      setIsEmailVerified(false);
      setCheckingEmailVerification(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      fetchItems();
      fetchRentRequests();
      setLoading(false);
      setCheckingEmailVerification(false);
    }
  }, [currentLocation]);

  const handleRefresh = async () => {
    setLoading(true);
    await fetchItems();
    await fetchRentRequests();
    setLoading(false);
  };

  const renderItems = () => {
    const filteredItems = availableItems.filter(item => {
      if (selectedSubsection === 'byYou') {
        return item.ownerId === firebase.auth().currentUser.uid;
      } else {
        return item.ownerId !== firebase.auth().currentUser.uid && (distanceFilter === maxDistance || item.distance <= distanceFilter);
      }
    });
  
    return (
      <View style={styles.itemContainer}>
        {filteredItems.length === 0 ? (
          <Text style={styles.noItemsText}>No items available</Text>
        ) : (
          filteredItems.map(item => (
            <ItemCard
              key={item.id}
              image={item.image}
              itemId={item.id}
              itemName={item.itemName}
              rentPerHour={item.rentPerHour}
              description={item.description}
              mode={selectedSection}
              subMode={selectedSubsection}
              phoneNumber={item.mobile}
              location={item.location}
              distance={item.distance}
              currentLocation={currentLocation}
              handleRefresh={handleRefresh}
              ownerId={item.ownerId}
            />
          ))
        )}
      </View>
    );
  };
  
  const renderRequests = () => {
    const filteredRequests = rentRequests.filter(request => {
      if (selectedSubsection === 'byYou') {
        return request.ownerId === firebase.auth().currentUser.uid;
      } else {
        return request.ownerId !== firebase.auth().currentUser.uid && (distanceFilter === maxDistance || request.distance <= distanceFilter);
      }
    });
  
    return (
      <View style={styles.itemContainer}>
        {filteredRequests.length === 0 ? (
          <Text style={styles.noItemsText}>No rent requests available</Text>
        ) : (
          filteredRequests.map(request => (
            <ItemCard
              key={request.id}
              image={request.image}
              itemId={request.id}
              itemName={request.itemName}
              rentPerHour={request.rentPerHour}
              mode={selectedSection}
              ownerId={request.ownerId}
              handleRefresh={handleRefresh}
              subMode={selectedSubsection}
              description={request.description}
              phoneNumber={request.mobile}
              distance={request.distance}
              currentLocation={currentLocation}
              location={request.location}
            />
          ))
        )}
      </View>
    );
  };
  
  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Image source={require("../assets/LogoLeftRight.png")} style={styles.logo} resizeMode="contain" />

          {isEmailVerified ? (
          locationPermissionGranted ? (
            loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.blue} />
              </View>
            ) : (
              <>
                <View style={styles.welcomeContainer}>
                  <Text style={styles.text}>Welcome {name}</Text>
                  <View style={styles.iconContainer}>
                    <TouchableOpacity style={styles.iconButton} onPress={handleRefresh}>
                      <Ionicons name="refresh" size={26} color={Colors.blue} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => { firebase.auth().signOut().then(() => navigation.navigate("Login")) }}>
                      <Ionicons name="log-out-outline" size={26} color={Colors.blue} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.buttonGroupPrimary}>
                  <TouchableOpacity
                    style={[styles.sectionPrimaryButton, selectedSection === 'availableItems' && styles.activePrimaryButton]}
                    onPress={() => setSelectedSection('availableItems')}
                  >
                    <Text style={[styles.primaryButtonText, selectedSection === 'availableItems' && styles.activePrimaryButtonText]}>Available Items</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.sectionPrimaryButton, selectedSection === 'rentRequests' && styles.activePrimaryButton]}
                    onPress={() => setSelectedSection('rentRequests')}
                  >
                    <Text style={[styles.primaryButtonText, selectedSection === 'rentRequests' && styles.activePrimaryButtonText]}>Rent Requests</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    style={[styles.sectionButton, selectedSubsection === 'byOthers' && styles.activeButton]}
                    onPress={() => setSelectedSubsection('byOthers')}
                  >
                    <Text style={styles.buttonText}>By Others</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.sectionButton, selectedSubsection === 'byYou' && styles.activeButton]}
                    onPress={() => setSelectedSubsection('byYou')}
                  >
                    <Text style={styles.buttonText}>By You</Text>
                  </TouchableOpacity>
                </View>
                
                {selectedSubsection === 'byOthers' && (
                 <View style={styles.sliderContainer}>
                 <Text>Filter by distance: {distanceFilter === maxDistance ? "Unlimited" : `${distanceFilter} km`}</Text>
                 <Slider
                   style={{ width: 200, height: 40 }}
                   minimumValue={1}
                   maximumValue={maxDistance + 1}
                   step={1}
                   value={distanceFilter}
                   onValueChange={(value) => setDistanceFilter(value === maxDistance + 1 ? maxDistance : value)}
                   minimumTrackTintColor={Colors.blue}
                   maximumTrackTintColor="#000000"
                 />
               </View>
                )}

                {selectedSection === 'availableItems' ? renderItems() : renderRequests()}
              </>
            )
          ) : (
            <View style={styles.verificationContainer}>
              <Text style={styles.text}>Please grant location permission to continue.</Text>
              <TouchableOpacity style={styles.loginButton} onPress={getLocation}>
                <Text style={styles.loginButtonText}>Grant Location Permission</Text>
              </TouchableOpacity>
            </View>
          )
        ) : (
          <View style={styles.verificationContainer}>
            <Text style={styles.text}>Please verify your email to continue.</Text>
            <Text style={styles.text}>Check your inbox and try logging in again.</Text>
            <TouchableOpacity style={styles.loginButton} onPress={() => { firebase.auth().signOut().then(() => navigation.navigate("Login")) }}>
              <Text style={styles.loginButtonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        )}


      </View>
      </ScrollView>
      {isEmailVerified && locationPermissionGranted && (
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddItem", { currentLocation })}>
          <Ionicons name="add" size={36} color={Colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: 150,
    height: 70,
    marginVertical: 5,
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
    color: Colors.tertiary,
  },
  buttonGroupPrimary: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    margin: 5,
    alignItems: 'center'
  },
  sectionPrimaryButton: {
    padding: 15,
    marginHorizontal: 5,
  },
  primaryButtonText: {
    color: "#ccc",
    fontSize: 22,
    fontWeight: 'bold'
  },
  activePrimaryButtonText: {
    color: Colors.brand,
  },
  activePrimaryButton: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.brand,
  }, 
  sliderContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  sectionButton: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: Colors.blue,
  },
  buttonText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonTextDark: {
    color: Colors.tertiary,
  },
  welcomeContainer: {
    flexDirection: 'row',
    width: "100%",
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 5,
    padding: 5,
    justifyContent: 'space-between',
  },
  logoutButton: {
    borderWidth: 3,
    borderColor: Colors.blue,
    padding: 15,
    borderRadius: 45,
    marginTop: 20,
    alignItems: 'center',
    marginLeft: 10,
    width: '30%',
  },
  noItemsText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: Colors.blue,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: Colors.blue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  loginButtonText: {
    color: Colors.primary,
    fontSize: 18,
  },
});

export default Home;
