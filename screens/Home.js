import React from 'react';
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import ItemCard from '../components/ItemCard';
import { firebase } from '../firebaseConfig';
const Home = ({ navigation }) => {
  const [name, setFullName] = useState('')
  const itemsData = [
    {
      id: 1,
      image: "https://images.singletracks.com/blog/wp-content/uploads/2016/09/IMG_1720.jpg",
      itemName: "Bicycle",
      rentPerHour: "120Rs",
      description: "6 month old bicycle santa cruz",
    },
    {
      id: 2,
      image: "https://www.artnews.com/wp-content/uploads/2021/05/AdobeStock_245170605.jpeg?resize=400",
      itemName: "Hot Glue Gun",
      rentPerHour: "60Rs",
      description: "Hot Glue Gun with 12 Glue sticks for your hardware projects",
    },
    {
      id: 3,
      image: "https://cdn.shopify.com/s/files/1/0467/2959/2992/products/Sony_A7C_hand_grip_tripod_mount_wood_iwoodstar2.jpg?v=1663683828",
      itemName: "Camera",
      rentPerHour: "80Rs",
      description: "Sony A7C DSLR camera",
    },
    {
      id: 4,
      image: "https://media.architecturaldigest.com/photos/5ef398c0b0e5bfef6fbfac31/1:1/w_1280%2Cc_limit/canopypool.jpg",
      itemName: "Inflatable Pool",
      rentPerHour: "90Rs",
      description: "Inflatable Pool 160 Gallons capacity",
    },
    // Add more items as needed
  ];

  const handleRequestRent = (itemId) => {
    // Handle rent request for the item with itemId
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userSnapshot = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get();
        if (userSnapshot.exists) {
          const userData = userSnapshot.data();
          setFullName(userData.fullName);
        } else {
          console.log("User does not exist");
          alert("User does not exist");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUser();
  }, []);


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Image source={require("../assets/LogoLeftRight.png")} style={styles.logo} resizeMode="contain" />
        <Text style={styles.text}>Welcome {name}</Text>
        <Text style={styles.text}>Available Items for Rent</Text>
        <View style={styles.itemContainer}>
          {itemsData.map(item => (
            <ItemCard key={item.id} image={item.image} id={item.id} itemName={item.itemName} rentPerHour={item.rentPerHour} description={item.description}/>
          ))}
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={() => { firebase.auth().signOut()
          navigation.navigate("Login")
         }}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: 100,
    height: 50,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
    color: '#291B25',
  },
  itemContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 5,
    justifyContent: 'space-between',
  },
  itemCard: {
    width: '48%',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
  },
  itemImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDetails: {
    fontSize: 14,
    marginBottom: 5,
  },
  rentButton: {
    backgroundColor: '#ff8316',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff8316',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Home;
