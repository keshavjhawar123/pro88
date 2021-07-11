import React,{Component} from 'react';
import {StyleSheet,View,Text,TouchableOpacity} from 'react-native';
import {Avatar} from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import {DrawerItems} from 'react-navigation-drawer';
import firebase from 'firebase';

export default class CustomSideBarMenu extends Component{
    state={
        userId: firebase.auth().currentUser.email,
        image: "#",
    name: "",
    docId: "",
    };

    selectPicture = async () => {
        const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!cancelled) {
          this.uploadImage(uri, this.state.userId);
        }
      };
    
      uploadImage = async (uri, imageName) => {
        var response = await fetch(uri);
        var blob = await response.blob();
    
        var ref = firebase
          .storage()
          .ref()
          .child("user_profiles/" + imageName);
    
        return ref.put(blob).then((response) => {
          this.fetchImage(imageName);
        });
      };
    
      fetchImage = (imageName) => {
        var storageRef = firebase
          .storage()
          .ref()
          .child("user_profiles/" + imageName);
    
        // Get the download URL
        storageRef
          .getDownloadURL()
          .then((url) => {
            this.setState({ image: url });
          })
          .catch((error) => {
            this.setState({ image: "#" });
          });
      };
    
      getUserProfile() {
        db.collection("users")
          .where("email_id", "==", this.state.userId)
          .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              this.setState({
                name: doc.data().first_name + " " + doc.data().last_name,
                docId: doc.id,
                image: doc.data().image,
              });
            });
          });
      }
    
      componentDidMount() {
        this.fetchImage(this.state.userId);
        this.getUserProfile();
      }
    
    render(){
        return(
            <View style={{flex:1}}>
                <Avatar
            rounded
            source={{
              uri: this.state.image,
            }}
            size="medium"
            onPress={() => this.selectPicture()}
            containerStyle={styles.imageContainer}
            showEditButton
          />
                <View style={styles.drawerItemsContainer}>
                    <DrawerItems{...this.props}/>
                </View>
                <View style={styles.logOutContainer}>
                    <TouchableOpacity 
                    style={styles.logOutButton}
                    onPress={()=>{
                        this.props.navigation.navigate('SignUpScreen')
                        firebase.auth().signOut()
                    }}
                    >
                        <Text style={styles.logOutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles= StyleSheet.create({
    drawerItemsContainer:{
        flex:0.8
    },
    logOutContainer:{
        flex:0.2,
        justifyContent:'flex-end',
        paddingBottom:30
    },
    logOutButton:{
        width:'100%',
        height:30,
        borderRadius:10,
        padding:10,
        justifyContent:'center'
    },
    logOutText:{
        fontWeight:'bold',
        fontSize:30,
    }
})