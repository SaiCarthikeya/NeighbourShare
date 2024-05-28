import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';  // Import icon library
import ItemCard from '../components/ItemCard';
import { firebase } from '../firebaseConfig';

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
  const [selectedSubsection, setSelectedSubsection] = useState('byYou');
  const [availableItems, setAvailableItems] = useState([]);
  const [rentRequests, setRentRequests] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userSnapshot = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get();
        if (userSnapshot.exists) {
          const userData = userSnapshot.data();
          setFullName(userData.fullName);
        } else {
          alert("User does not exist");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    const fetchItems = async () => {
      try {
        const itemsSnapshot = await firebase.firestore().collection('items').get();
        const items = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAvailableItems(items);
      } catch (error) {
        console.error("Error fetching items: ", error);
      }
    };

    const fetchRentRequests = async () => {
      try {
        const requestsSnapshot = await firebase.firestore().collection('rentRequests').get();
        const requests = requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRentRequests(requests);
      } catch (error) {
        console.error("Error fetching rent requests: ", error);
      }
    };

    fetchUser();
    fetchItems();
    fetchRentRequests();
  }, []);

  const renderItems = () => {
    const filteredItems = availableItems.filter(item =>
      selectedSubsection === 'byYou' ? item.ownerId === firebase.auth().currentUser.uid : item.ownerId !== firebase.auth().currentUser.uid
    );

    return (
      <View style={styles.itemContainer}>
        {filteredItems.length === 0 ? (
          <Text style={styles.noItemsText}>No items available</Text>
        ) : (
          filteredItems.map(item => (
            <ItemCard
              key={item.id}
              image={item.image}
              id={item.id}
              itemName={item.itemName}
              rentPerHour={item.rentPerHour}
              description={item.description}
              mode={selectedSection}
              subMode={selectedSubsection}
              phoneNumber={item.mobile}
              location={item.location}
            />
          ))
        )}
      </View>
    );
  };

  const renderRequests = () => {
    const filteredRequests = rentRequests.filter(request =>
      selectedSubsection === 'byYou' ? request.ownerId === firebase.auth().currentUser.uid : request.ownerId !== firebase.auth().currentUser.uid
    );

    return (
      <View style={styles.itemContainer}>
        {filteredRequests.length === 0 ? (
          <Text style={styles.noItemsText}>No rent requests available</Text>
        ) : (
          filteredRequests.map(request => (
            <ItemCard
              key={request.id}
              image={request.image}
              id={request.id}
              itemName={request.itemName}
              rentPerHour={request.rentPerHour}
              mode={selectedSection}
              subMode={selectedSubsection}
              description={request.description}
              phoneNumber={request.mobile}
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
          <View style={styles.welcomeContainer}>
            <Text style={styles.text}>Welcome {name}</Text>
            <TouchableOpacity style={styles.iconButton} onPress={() => { firebase.auth().signOut().then(() => navigation.navigate("Login")) }}>
              <Ionicons name="log-out-outline" size={26} color={Colors.blue} />
            </TouchableOpacity>
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
              style={[styles.sectionButton, selectedSubsection === 'byYou' && styles.activeButton]}
              onPress={() => setSelectedSubsection('byYou')}
            >
              <Text style={styles.buttonText}>By You</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sectionButton, selectedSubsection === 'byOthers' && styles.activeButton]}
              onPress={() => setSelectedSubsection('byOthers')}
            >
              <Text style={styles.buttonText}>By Others</Text>
            </TouchableOpacity>
          </View>
          {selectedSection === 'availableItems' ? renderItems() : renderRequests()}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddItem")}>
        <Ionicons name="add" size={36} color={Colors.primary} />
      </TouchableOpacity>
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
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  }
});

export default Home;
