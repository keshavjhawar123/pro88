import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput,KeyboardAvoidingView,TouchableOpacity,Alert, ToastAndroid } from 'react-native';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/MyHeader'

export default class Exchange extends Component{

  constructor(){
    super()
    this.state = {
      userId : firebase.auth().currentUser.email,
      itemName:"",
      reasonToRequest:"",
      IsItemRequestActive : "",
      requestedItemName: "",
      itemStatus:"",
      requestId:"",
      userDocId: '',
      docId :''
    }
  }
  

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }

  addItem=(itemName, description)=>{
    var userName = this.state.userName
    var randomReqId = this.createUniqueId()
    db.collection("exchange_requests").add({
      "username"    : userName,
      "item_name"   : itemName,
      "description" : description,
      "request_id"  : randomReqId
     })
     await this.getItemRequest()
     db.collection('users').where("email_id","==",userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection('users').doc(doc.id).update({
      IsBookRequestActive: true
      })
    })
  })

this.setState({
  bookName :'',
        reasonToRequest : '',
        requestId: randomRequestId 
})

  }

  recievedItem=(itemName)=>{
    var userId = this.state.userId
    var requestId = this.state.requestId
    db.collection('recieved_items').add({
        "user_id": userId,
        "item_name":itemName,
        "request_id"  : requestId,
        "itemStatus"  : "recieved",
  
    })
  }

  getIsItemRequestActive(){
    db.collection('users')
    .where('email_id','==',this.state.userId)
    .onSnapshot(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.setState({
          IsItemRequestActive:doc.data().IsItemRequestActive,
          userDocId : doc.id
        })
      })
    })
  }

  getItemRequest =()=>{
  var itemRequest=  db.collection('requested_items')
    .where('user_id','==',this.state.userId)
    .get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        if(doc.data().item_status !== "recieved"){
          this.setState({
            requestId : doc.data().request_id,
            requestedItemName: doc.data().item_name,
            itemStatus:doc.data().item_status,
            docId     : doc.id
          })
        }
      })
  })}

  sendNotification=()=>{
    //to get the first name and last name
    db.collection('users').where('email_id','==',this.state.userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var name = doc.data().first_name
        var lastName = doc.data().last_name
  
        // to get the donor id and book nam
        db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
        .then((snapshot)=>{
          snapshot.forEach((doc) => {
            var donorId  = doc.data().donor_id
            var itemName =  doc.data().item_name
  
            //targert user id is the donor id to send notification to the user
            db.collection('all_notifications').add({
              "targeted_user_id" : donorId,
              "message" : name +" " + lastName + " recieved the book " + bookName ,
              "notification_status" : "unread",
              "item_name" : itemName
            })
          })
        })
      })
    })
  }

  componentDidMount(){
    this.getItemRequest()
    this.getIsItemRequestActive()
  
  }  

  updateItemRequestStatus=()=>{
    //updating the Item status after receiving the book
    db.collection('requested_item').doc(this.state.docId)
    .update({
      item_status : 'recieved'
    })
  
    //getting the  doc id to update the users doc
    db.collection('users').where('email_id','==',this.state.userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        //updating the doc
        db.collection('users').doc(doc.id).update({
          IsItemRequestActive: false
        })
      })
    })
  
  
  }

  getData(){
    fetch("http://data.fixer.io/api/latest?access_key=9f5f8ecfac42c41b46d55a2db749e987")
    .then(response=>{
      return response.json();
    }).then(responseData =>{
      var currencyValue=this.state.currencyValue
      var currency = responseData.rates.INR
      var value = 69/ currency
      console.log(value);
      db.collection('exchange_rate').add({
        "currency_value" : this.state.currencyValue,
        "currency" : currency,
        "value" : value
      })
    })
  }

  render(){
    if(this.state.IsItemRequestActive === true){
      return(

        // Status screen

        <View style = {{flex:1,justifyContent:'center'}}>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text>Item Name</Text>
          <Text>{this.state.requestedItemName}</Text>
          </View>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text> Item Status </Text>

          <Text>{this.state.itemStatus}</Text>
          </View>

          <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
          onPress={()=>{
            this.sendNotification()
            this.updateItemRequestStatus();
            this.recievedItem(this.state.requestedItemName)
          }}>
          <Text>I recieved the Item </Text>
          </TouchableOpacity>
        </View>
      )
    }
    else
    {


    return(
        <View style={{flex:1}}>
          <MyHeader title="Request Items" navigation={this.props.navigation} />
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter book name"}
                onChangeText={(text)=>{
                    this.setState({
                        itemName:text
                    })
                }}
                value={this.state.itemName}
              />
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Why do you need the Item"}
                onChangeText ={(text)=>{
                    this.setState({
                        reasonToRequest:text
                    })
                }}
                value ={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{this.addRequest(this.state.itemName,this.state.reasonToRequest)}}
                >
                <Text>Request</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    )
  }

  }

}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)