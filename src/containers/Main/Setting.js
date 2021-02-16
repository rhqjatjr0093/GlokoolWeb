import React, { Component, useState } from "react";
import { auth, storage } from '../../Firebase'
import { makeStyles } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';
import {
  SettingContent,
  InputWithLabel,
  SettingButton,
  SettingDate,
  SettingGender,
  SettingError,
  SettingWrapper,
} from "../../components/Setting";
import profile from '../../assets/profile.jpg'
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

const Setting = () => {
  const user = auth().currentUser;
  const [modal, setModal] = React.useState(false);
  const [picture, setPicture] = React.useState(null);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();

  const DATA = {
    username: user.displayName
  }

  React.useEffect(() => {
    if(user.photoURL == '' || user.photoURL == null){
      setPicture(profile);
    }
    else{
      setPicture(user.photoURL);
    }

    console.log(user.photoURL);
  },[]);

  const ImageClick = () => {
      setModal(true)
  }

  const CloseImage = () => {
      setModal(false);
  }

  const onDrop = (pic, url) => {
      setModal(false);
      setPicture(url[0]);
      let type = pic[0].type.split('/');

      const picRef = storage().ref().child(`profile/${user.uid}.${type[1]}`).put(pic[0]);
      picRef.on(storage.TaskEvent.STATE_CHANGED,
        function(snapshot) {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            
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
                user.updateProfile({
                  photoURL: downloadURL,
                })
              });
                  })
            
        CloseImage();
  };

  const updateProfile = () => {
      user.updateProfile({
        
      })
  }

  return (
    <div>
      <SettingWrapper>           
           <SettingContent title="회원 정보 수정">
            
               <button className={classes.button}><img className={classes.image} src={picture} onClick={ImageClick}/></button>      
             
             <InputWithLabel
               label="이메일"
               name="email"
               value={user.email}
               readonly
             />
             <InputWithLabel
               label="닉네임"
               name="username"
               value={DATA.username}
             />
             
             <SettingGender label="성별" value={"Male"} />
             <SettingButton onClick={updateProfile}>수정</SettingButton>
           </SettingContent>
      </SettingWrapper>

      <Modal
          open={modal}
          onClose={CloseImage}
          aria-labelledby="Image Modal"
          aria-describedby="이미지 업로드를 위한 Modal 창"
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
    


    
    );
  }

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    flexDirection: "row",
  },
  container: {
    flex: 1,
  },
  imgContainer: {

  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
    margin: 10
  },
  button: {
    backgroundColor: '#00FF0000',
    borderColor: '#00FF0000'
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
  },
}));

export default Setting;
