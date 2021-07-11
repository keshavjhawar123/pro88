import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class MyRecievedItemScreen extends Component{
  constructor(){
    super()
    this.state = {
      userId  : firebase.auth().currentUser.email,
      recievedItemList : []
    }
  this.requestRef= null
  }

  getRecievedItemList =()=>{
    this.requestRef = db.collection("requested_books")
    .where('user_id','==',this.state.userId)
    .where("item_status", '==','recieved')
    .onSnapshot((snapshot)=>{
      var recievedItemList = snapshot.docs.map((doc) => doc.data())
      this.setState({
        recievedItemList : recievedItemList
      });
    })
  }

  componentDidMount(){
    this.getRecievedItemList()
  }

  componentWillUnmount(){
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    console.log(item.item_name);
    return (
        <ListItem         key={i} bottomDivider >
        <ListItem.Content>
          <ListItem.Title>{item.item_name}</ListItem.Title>
          <ListItem.Subtitle>{item.itemStatus}</ListItem.Subtitle>
        </ListItem.Content>
        
      </ListItem>
    )
  }

  render(){
    return(
      <View style={{flex:1}}>
        <MyHeader title="Recieved items" navigation ={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.recievedItemsList.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>List Of All Recieved Items</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.recievedBooksList}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  subContainer:{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  },
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
     }
  }
})