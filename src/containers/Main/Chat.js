import React, { useCallback, useRef } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Avatar, ListItemAvatar, Toolbar } from '@material-ui/core';
import { GiftedChat, Composer, Bubble } from 'react-native-gifted-chat';
import { database, auth } from '../../Firebase'

const Chat = () => {
  const chatRoom = [1,2,3,4,5];
  const classes = useStyles();
  const [chatMessages, setChatMessages] = React.useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const ChatDB = database().ref('/chats/test');
  const user = auth().currentUser;

  console.log(user)

  //componentwillmount 대신 사용
  React.useEffect(() => {        

    ChatDB.on('value', snapshot => {
        console.log(snapshot.val(), "snap shot")
        if (!snapshot.val()) {
            return;
        }
        let { messages } = snapshot.val();
        messages = messages.map(node => {
            console.log(node, "node")
            const message = {};
            message._id = node._id;
            message.text = node.messageType === "message" ? node.text : "";
            message.createdAt = node.createdAt;
            message.user = {
                _id: node.user._id,
                // 바꿔야 됌
            };
            message.image = node.messageType === "image" ? node.image : "";
            message.audio = node.messageType === "audio" ? node.audio : "";
            message.messageType = node.messageType;
            return message;
        });
        setChatMessages([...messages])
    });;
    
    
    return () => {
        setChatMessages([]);
    };
}, [])


  const renderLoading = () => {
    return (<div>Loading...</div>)
  }

  const onSend = (messages = []) => {
      messages[0].messageType = "message";
      messages[0].createdAt = new Date().getTime();
      console.log(messages[0])
      ChatDB.update({messages: [messages[0], ...chatMessages]});
  }        

  const renderBubble = (props) => {
    return(
        <Bubble 
            {...props}
            wrapperStyle={{
                left:{
                    backgroundColor: '#F5F5F5',
                    fontColor: 'black',
                    fontWeight: 'bold'
                },
                right: {
                    backgroundColor: '#FFC043',
                    fontWeight: 'bold'
                }
            }}
        />

    );
  }

  const renderComposer = (props) => {
    return(
       <Composer
            {...props}
            textInputProps={{
              ...props.textInputProps,
              autoFocus: true,
              blurOnSubmit: true,
              onSubmitEditing: (() => {
                      if (props.text && props.onSend) {
                        props.onSend({text: props.text.trim()}, true);
                      }
              })              
            }}
            textInputStyle={{justifyContent: 'center'}}
       />
    );
  }

  return (
    <div>
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
        >
            <Toolbar/>
            <div className={classes.drawerContainer}>
            
            <List 
              button            
              selected
            >
              {chatRoom.map((key) => (
                <ListItem key={key} button selected={selectedIndex === key} onClick={() => setSelectedIndex(key)}>                      
                  <ListItemAvatar>
                    <Avatar src='../../assets/profile.jpg'/>
                  </ListItemAvatar>
                  <ListItemText primary='장충단 길' secondary='고객명'/>
                </ListItem>
              ))}
            </List>
            </div>            
        </Drawer>

        <div className={classes.chat}>
          <GiftedChat
            user={{
              _id: `${user?.uid}`,
            }}
            infiniteScroll={true}
            createdAt={new Date().getTime()}
            textInputProps={{autoFocus: true}}
            messages={chatMessages}
            alwaysShowSend={true}
            renderUsernameOnMessage={true}
            onSend={messages => onSend(messages)}
            renderLoading={renderLoading}
            renderBubble={renderBubble}
            renderComposer={renderComposer}
            renderAvatar={null}
          />
        </div>        
      </div>
  );
  
}

const useStyles = makeStyles((theme) => ({
  drawer: {
    position: 'relative',
    width: 300,
    flexShrink: 0,
    zIndex: 0,
  },
  drawerPaper: {
    width: 300,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 100,
  },
  chat: {
    position: 'fixed',
    bottom: 0,
    left: 300,
    right: 0,
    display: "flex",
    flexDirection: "row",
    height: "100vh",
    borderColor: 'gray'
  },

}));

export default Chat;