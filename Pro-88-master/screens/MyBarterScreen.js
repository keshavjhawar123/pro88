import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements'
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js'

export default class MyBartersScreen extends Component {
  static navigationOptions = { header: null };

   constructor(){
     super()
     this.state = {
       userId : firebase.auth().currentUser.email,
       donorName:"",
       allBarters : []
     }
     this.requestRef= null
   }

   getDonorDetails=(donorId)=>{
    console.log("abc")
   db.collection("users").where("email_id","==",donorId).get()
   .then((snapshot)=>{
     snapshot.forEach((doc) => {
       this.setState({
         "donorName" : doc.data().first_name + " " + doc.data().last_name
       })
     });
   })
 }

   sendItem=(itemDetails)=>{
    if(itemDetails.request_status === "Item Sent"){
      var requestStatus = "Donor Interested"
      db.collection("all_donations").doc(itemDetails.doc_id).update({
        "request_status" : "Donor Interested"
      })
      this.sendNotification(itemDetails,requestStatus)
    }
    else{
      var requestStatus = "item Sent"
      db.collection("all_donations").doc(itemDetails.doc_id).update({
        "request_status" : "item Sent"
      })
      this.sendNotification(itemDetails,requestStatus)
    }
  }


   sendNotification=(itemDetails,requestStatus)=>
   {
     var requestId = itemDetails.request_id
     var donorId = ItemDetails.donor_id
    db.collection("all_notifications")
    .where("request_id","==", requestId)
    .where("donor_id","==",donorId)
    .get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        var message = ""
        if(requestStatus === "item Sent"){
          message = this.state.donorName + " sent you book"
        }else{
           message =  this.state.donorName  + " has shown interest in donating the book"
        }
        db.collection("all_notifications").doc(doc.id).update({
          "message": message,
          "notification_status" : "unread",
          "date"                : firebase.firestore.FieldValue.serverTimestamp()
        })
      });
    })

   }


   getAllBarters =()=>{
     this.requestRef = db.collection("all_Barters").where("donor_id" ,'==', this.state.userId)
     .onSnapshot((snapshot)=>{
       var allBarters = snapshot.docs.map(document => document.data());
       this.setState({
         allBarters : allBarters,
       });
     })
   }

   keyExtractor = (item, index) => index.toString()

   renderItem = ( {item, i} ) =>(
     <ListItem>
       key={i}
       <ListItem.Content>
       <ListItem.Title>{item.item_name}</ListItem.Title>
       <ListItem.Subtitle>{"Requested By : " + item.requested_by +"\nStatus : " + item.request_status}</ListItem.Subtitle>
      <ListItem.LeftElement>{<Icon name="book" type="font-awesome" color ='#696969'/>}</ListItem.LeftElement>
       <ListItem.RightElement>
           <TouchableOpacity style={[styles.button,
          {
            backgroundColor : item.request_status === "item Sent" ? "green" : "#ff5722"
          }
        ]}
        onPress = {()=>{
          this.sendItem(item)
        }}>
             <Text style={{color:'#ffff'}}>Exchange</Text>
           </TouchableOpacity>
           </ListItem.RightElement>
       bottomDivider
       </ListItem.Content>
       </ListItem>
   )
    
   


   componentDidMount(){
     this.getAllBarters()
   }

   componentWillUnmount(){
     this.requestRef();
   }

   render(){
     return(
       <View style={{flex:1}}>
         <MyHeader navigation={this.props.navigation} title="My Barters"/>
         <View style={{flex:1}}>
           
               <View style={styles.subtitle}>
                 <Text style={{ fontSize: 20}}>List of all Barters</Text>
               </View>
             
               <FlatList
                 keyExtractor={this.keyExtractor}
                 data={this.state.allBarters}
                 renderItem={this.renderItem}
               />
             
         </View>
       </View>
     )
   }
   }


const styles = StyleSheet.create({
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  },
  subtitle :{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  }
})