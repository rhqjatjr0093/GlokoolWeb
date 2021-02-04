import React, { useCallback, useRef } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { useHistory } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Avatar, ListItemAvatar, Toolbar } from '@material-ui/core';
import { GiftedChat, Composer, Bubble, Send } from 'react-native-gifted-chat';
import { database, auth, storage } from '../../Firebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { IconButton } from "@material-ui/core";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ImageUploader from 'react-images-upload';
import Modal from '@material-ui/core/Modal';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const Chat = () => {
  const chatRoom = [1,2,3,4,5];
  const classes = useStyles();
  const [chatMessages, setChatMessages] = React.useState([]);
  
  const [selectedIndex, setSelectedIndex] = React.useState(1);


  const [anchorEl, setAnchorEl] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [picture, setPicture] = React.useState(null);
  const [modalStyle] = React.useState(getModalStyle);

  const ChatDB = database().ref('/chats/test');
  const user = auth().currentUser;
  const history = useHistory();


  //메시지 아이디 생성기 (출처: https://github.com/liplylie/ReactNativeChatImageAudio/blob/master/src/components/chat.js)
  //메시지 구분을 위한 임시 조치 (시간, uid를 넣어서 만들면 될 듯)
  const messageIdGenerator = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        let r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
  }


  //componentwillmount 대신 사용
  //페이지 최초 로딩시 채팅 메시지 로딩
  React.useEffect(() => {    
    if(user.emailVerified == false){
      history.push('/email/fail')
    }

    ChatDB.on('value', snapshot => {
        if (!snapshot.val()) {
            return;
        }
        let { messages } = snapshot.val();
        messages = messages.map(node => {
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


  // 이미지 업로드 기능 관련 구현
  const clickImageSend = () => {
    setModalOpen(true)
    handleMenuClose();
  };

  const handleCloseImage = () => {
    setModalOpen(false);
  }

  const onDrop = (pic, url) => {

    const MessageID = messageIdGenerator();    
    let type = pic[0].type.split('/') //[1] 에 확장자 들어있음
    
    const picRef = storage().ref().child(`xxxxx/picture/${MessageID}.${type[1]}`).put(pic[0]);
    picRef.on(storage.TaskEvent.STATE_CHANGED,
      function(snapshot) {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + MessageID, '.' + (type[1]) + progress + '% done');
          switch (snapshot.state) {
          case storage.TaskState.PAUSED:
              console.log('Upload is paused');
              break;
          case storage.TaskState.RUNNING:
              console.log('Upload is running');
              break;
          }
      }, function(error) {
          switch (error.code) {
              case 'storage/unauthorized':
              break;
          
              case 'storage/canceled':
              break;

              case 'storage/unknown':
              break;
      }
      }, function() {
          picRef.snapshot.ref.getDownloadURL().then(async function(downloadURL) {
              //업로드 완료
              const message = {
                  _id : MessageID,
                  createdAt : new Date().getTime(),
                  user: {
                      _id: user?.uid
                  },
                  image : downloadURL,  //다운로드URL 전달
                  messageType : 'image'
              };

              await ChatDB.update({messages: [message, ...chatMessages]});
          });
      
    })


    handleCloseImage();
  };

  // 오버플로우 메뉴 구현
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  


  const renderLoading = () => {
    return (<div>Loading...</div>)
  }

  const onSend = async(messages = []) => {
      messages[0].messageType = "message";
      messages[0].createdAt = new Date().getTime();

      await ChatDB.update({messages: [messages[0], ...chatMessages]});
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
              onSubmitEditing: (() => { //Enter 키를 입력시 Send 할 수 있도록
                      if (props.text && props.onSend) {
                        props.onSend({text: props.text.trim()}, true);
                      }
              })              
            }}
            textInputStyle={{justifyContent: 'center'}}
       />
    );
  }

  const renderActions = (props) => {
    return(
      
      <div>
        <IconButton onClick={handleMenuClick}>
          <FontAwesomeIcon icon={faBars} style={{color: '#FFC043'}} size={32}/>   
        </IconButton>
        <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
          <MenuItem onClick={clickImageSend}>이미지</MenuItem>
          <MenuItem onClick={handleMenuClose}>음성</MenuItem>
        </Menu>   
      </div>
    );
  };

  const renderSend = (props) => {
    return(
      <Send {...props} containerStyle={{justifyContent: 'center', 
            alignItems: 'center',
            borderWidth: 0,
            marginLeft: 15,
            marginRight: 5,
            marginBottom: 1,
            width: 60}}>
        <FontAwesomeIcon icon={faPaperPlane} style={{color: '#FFC043'}} size={60}/>
      </Send>
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
          <Toolbar/>
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
            renderActions={renderActions}
            renderSend={renderSend}
            renderLoading={renderLoading}
            renderBubble={renderBubble}
            renderComposer={renderComposer}
            renderAvatar={null}
          />

        <Modal
          open={modalOpen}
          onClose={handleCloseImage}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div style={modalStyle} className={classes.paper}>
            <ImageUploader
              withIcon={true}
              buttonText='이미지를 선택하세요'
              onChange={onDrop}
              singleImage={true}
              imgExtension={['.jpg', '.gif', '.png', '.gif']}
              maxFileSize={5242880}
            />
          </div>
        </Modal>
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
    flexDirection: "column",
    height: "100vh",
    borderColor: 'gray'
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
  },

}));

export default Chat;