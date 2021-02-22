import React, { useCallback, useRef } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import { useHistory } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Avatar, ListItemAvatar, Toolbar } from "@material-ui/core";
import { GiftedChat, Composer, Bubble, Send } from "react-native-gifted-chat";
import { database, auth, storage } from "../../Firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ImageUploader from "react-images-upload";
import Modal from "@material-ui/core/Modal";
import { Recorder } from "react-voice-recorder";
import "react-voice-recorder/dist/index.css";

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
  const user = auth().currentUser;
  const history = useHistory();
  const classes = useStyles();
  const [chatMessages, setChatMessages] = React.useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [Chat, setChat] = React.useState();
  const [roomName, setRoomName] = React.useState();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const [audioModalOpen, setAudioModalOpen] = React.useState(false);
  const [audioDetails, setAudioDetails] = React.useState({
    url: null,
    blob: null,
    chunks: null,
    duration: {
      h: 0,
      m: 0,
      s: 0,
    },
  });

  const chatRoom = [
    {
      name: "minJung",
      tour: "GyeongChun Forest Line",
      chatRoom: "test1",
    },
    {
      name: "hyeseon",
      tour: "GyengChun Forest",
      chatRoom: "test2",
    },
  ];

  //메시지 아이디 생성기 (출처: https://github.com/liplylie/ReactNativeChatImageAudio/blob/master/src/components/chat.js)
  //메시지 구분을 위한 임시 조치 (시간, uid를 넣어서 만들면 될 듯)
  const messageIdGenerator = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      let r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const changeChatRoom = (room) => {
    const ChatRoom = database().ref("/chats/" + room);
    setChat(ChatRoom);
    setRoomName(room);
  };

  //componentwillmount 대신 사용
  //페이지 최초 로딩시 채팅 메시지 로딩
  React.useEffect(() => {
    if (user.emailVerified == false) {
      history.push("/email/fail");
    }

    //chatRoomInitiate('test1');
    setChatMessages([]); //로컬 메시지 저장소 초기화

    const ChatRoom = database().ref("/chats/test1");
    setChat(ChatRoom);
    setRoomName("test1");

    return () => {
      setChatMessages([]);
    };
  }, []);

  React.useEffect(() => {
    if (Chat == undefined) {
      //아직 초기화 되지 않은 값임
    } else {
      //Chat 값이 바뀌었을 경우 실행
      //채팅방 전환 작업 실행

      setChatMessages([]); //로컬 메시지 저장소 초기화

      Chat.on("value", (snapshot) => {
        if (!snapshot.val()) {
          return;
        }
        let { messages } = snapshot.val();
        messages = messages.map((node) => {
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
        setChatMessages([...messages]);
      });
    }
  }, [Chat]);

  React.useEffect(() => {
    //채팅방을 클릭했을 때 작동
    //selectedIndex에는 채팅방 객체정보 함유

    changeChatRoom(selectedIndex.chatRoom);
  }, [selectedIndex]);

  // 이미지 업로드 기능 관련 구현
  const clickImageSend = () => {
    setModalOpen(true);
    handleMenuClose();
  };

  const handleCloseImage = () => {
    setModalOpen(false);
  };

  const onDrop = (pic, url) => {
    const MessageID = messageIdGenerator();
    let type = pic[0].type.split("/"); //[1] 에 확장자 들어있음

    const picRef = storage()
      .ref()
      .child(`/chats/${roomName}/picture/${MessageID}.${type[1]}`)
      .put(pic[0]);
    picRef.on(
      storage.TaskEvent.STATE_CHANGED,
      function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(
          "Upload is " + MessageID,
          "." + type[1] + progress + "% done"
        );
        switch (snapshot.state) {
          case storage.TaskState.PAUSED:
            console.log("Upload is paused");
            break;
          case storage.TaskState.RUNNING:
            console.log("Upload is running");
            break;
        }
      },
      function (error) {
        switch (error.code) {
          case "storage/unauthorized":
            break;

          case "storage/canceled":
            break;

          case "storage/unknown":
            break;
        }
      },
      function () {
        picRef.snapshot.ref.getDownloadURL().then(async function (downloadURL) {
          //업로드 완료
          const message = {
            _id: MessageID,
            createdAt: new Date().getTime(),
            user: {
              _id: user?.uid,
            },
            image: downloadURL, //다운로드URL 전달
            messageType: "image",
          };

          await Chat.update({ messages: [message, ...chatMessages] });
        });
      }
    );
    handleCloseImage();
  };

  // 오디오 업로드 기능 관련 구현

  const audioReset = () => {
    setAudioDetails({
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: 0,
        m: 0,
        s: 0,
      },
    });
  };

  const audioStop = (data) => {
    setAudioDetails(data);
    console.log(audioDetails);
  };

  const audioUpload = async (file) => {
    const MessageID = messageIdGenerator();
    const reference = storage().ref();
    const voiceRef = reference.child(`/chats/${roomName}/voice/${MessageID}`);

    voiceRef.put(file).then(async (response) => {
      await storage()
        .ref(`/chats/${roomName}/voice/${MessageID}`)
        .getDownloadURL()
        .then((result) => {
          const message = {
            _id: MessageID,
            createdAt: new Date().getTime(),
            user: {
              _id: `${user?.uid}`,
              name: user?.displayName,
              avatar: user?.photoURL,
            },
            audio: result, //파일 경로만 전달
            messageType: "audio",
          };
          Chat.update({ messages: [message, ...chatMessages] });
          setAudioModalOpen(false);
        });
    });
  };

  const handleAudioModal = () => {
    setAudioModalOpen(true);
    handleMenuClose();
  };

  const handleCloseAudio = () => {
    setAudioModalOpen(false);
    audioReset();
  };

  const getUrl = async (props) => {
    const url = await storage()
      .ref(props.currentMessage.audio)
      .getDownloadURL();

    console.log(url);

    return url;
  };

  const renderAudio = (props) => {
    return (
      <div className={classes.player}>
        <audio src={props.currentMessage.audio} controls />
      </div>
    );
  };

  // 오버플로우 메뉴 구현
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderLoading = () => {
    return <div>Loading...</div>;
  };

  const onSend = async (messages = []) => {
    messages[0].messageType = "message";
    messages[0].createdAt = new Date().getTime();

    await Chat.update({ messages: [messages[0], ...chatMessages] });
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "#F5F5F5",
            fontColor: "black",
            fontWeight: "bold",
          },
          right: {
            backgroundColor: "#FFC043",
            fontWeight: "bold",
          },
        }}
      />
    );
  };

  const renderComposer = (props) => {
    return (
      <Composer
        {...props}
        textInputProps={{
          ...props.textInputProps,
          autoFocus: true,
          blurOnSubmit: true,
          onSubmitEditing: () => {
            //Enter 키를 입력시 Send 할 수 있도록
            if (props.text && props.onSend) {
              props.onSend({ text: props.text.trim() }, true);
            }
          },
        }}
        textInputStyle={{ justifyContent: "center" }}
      />
    );
  };

  const renderActions = (props) => {
    return (
      <div>
        <IconButton onClick={handleMenuClick}>
          <FontAwesomeIcon
            icon={faBars}
            style={{ color: "#FFC043" }}
            size={32}
          />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={clickImageSend}>이미지</MenuItem>
          <MenuItem onClick={handleAudioModal}>음성</MenuItem>
        </Menu>
      </div>
    );
  };

  const renderSend = (props) => {
    return (
      <Send
        {...props}
        containerStyle={{
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 0,
          marginLeft: 15,
          marginRight: 5,
          marginBottom: 1,
          width: 60,
        }}
      >
        <FontAwesomeIcon
          icon={faPaperPlane}
          style={{ color: "#FFC043" }}
          size={60}
        />
      </Send>
    );
  };

  return (
    <div>
      {Object.keys(chatRoom).length == 0 ? (
        <div
          style={{
            width: "100%",
            height: "1000px",
            backgroundColor: "#c9c9c9",
            opacity: "0.3",
            position: "relative",
          }}
        >
          <span
            style={{
              width: "300px",
              fontSize: "20px",
              color: "black",
              opacity: "2",
              textAlign: "center",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          >
            결과 없음
          </span>
        </div>
      ) : (
        <div>
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <Toolbar />
            <div className={classes.drawerContainer}>
              <List button selected>
                {chatRoom.map((key) => (
                  <ListItem
                    key={key}
                    button
                    selected={selectedIndex === key}
                    classes={{ selected: classes.active }}
                    onClick={() => setSelectedIndex(key)}
                  >
                    <ListItemAvatar>
                      <Avatar src="../../assets/profile.jpg" />
                    </ListItemAvatar>
                    <ListItemText primary={key.tour} secondary={key.name} />
                  </ListItem>
                ))}
              </List>
            </div>
          </Drawer>

          <div className={classes.chat}>
            <Toolbar />
            <GiftedChat
              user={{
                _id: `${user?.uid}`,
                name: user.displayName,
              }}
              infiniteScroll={true}
              createdAt={new Date().getTime()}
              textInputProps={{ autoFocus: true }}
              messages={chatMessages}
              alwaysShowSend={true}
              renderUsernameOnMessage={true}
              onSend={(messages) => onSend(messages)}
              renderActions={renderActions}
              renderSend={renderSend}
              renderLoading={renderLoading}
              renderBubble={renderBubble}
              renderMessageAudio={renderAudio}
              renderComposer={renderComposer}
              renderAvatar={null}
            />

            <Modal
              open={modalOpen}
              onClose={handleCloseImage}
              aria-labelledby="Image Modal"
              aria-describedby="이미지 업로드를 위한 Modal 창"
            >
              <div style={modalStyle} className={classes.paper}>
                <ImageUploader
                  withIcon={true}
                  buttonText="이미지를 선택하세요"
                  onChange={onDrop}
                  singleImage={true}
                  imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                  maxFileSize={5242880}
                />
              </div>
            </Modal>
            <Modal
              open={audioModalOpen}
              onClose={handleCloseAudio}
              aria-labelledby="Audio Modal"
              aria-describedby="오디오 메시지 전송을 위한 Modal"
            >
              <div style={modalStyle} className={classes.paper}>
                <Recorder
                  record={true}
                  title={"녹음기"}
                  audioURL={audioDetails.url}
                  showUIAudio
                  handleAudioStop={(data) => audioStop(data)}
                  handleAudioUpload={(data) => audioUpload(data)}
                  handleRest={() => audioReset()}
                />
              </div>
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  drawer: {
    position: "relative",
    width: 300,
    flexShrink: 0,
    zIndex: 0,
  },
  drawerPaper: {
    width: 300,
  },
  drawerContainer: {
    overflow: "auto",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 100,
  },
  chat: {
    position: "fixed",
    bottom: 0,
    left: 300,
    right: 0,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    borderColor: "gray",
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
  },
  player: {
    padding: 5,
  },
  active: {
    backgroundColor: "red",
  },
}));

export default Chat;
