import React, { Component, useState } from "react";
import { auth, storage, firestore } from "../../Firebase";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import {
  SettingContent,
  InputWithLabel,
  SettingButton,
  SettingDate,
  SettingGender,
  SettingError,
  SettingWrapper,
} from "../../components/Setting";
import profile from "../../assets/profile.jpg";
import ImageUploader from "react-images-upload";
import Modal from "@material-ui/core/Modal";
import { useHistory } from "react-router-dom";

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
  const [email, setEmail] = React.useState();
  const [username, setUserName] = React.useState();
  const [gender, setGender] = React.useState();
  const [test, setTest] = React.useState();
  const [birthDate, setBirthDate] = React.useState();
  const classes = useStyles();
  const history = useHistory();

  const DATA = {
    username: user.displayName,
  };

  React.useEffect(async () => {
    if (user.photoURL == "" || user.photoURL == null) {
      setPicture(profile);
    } else {
      setPicture(user.photoURL);
    }

    setEmail(user.email);
    setUserName(user.displayName);

    const profileRef = await firestore()
      .collection("Guides")
      .doc(user.uid)
      .get()
      .then(function (doc) {
        setGender(doc.data().gender);
        setTest(doc.data().gender);
      });
  }, []);

  const ImageClick = () => {
    setModal(true);
  };

  const CloseImage = () => {
    setModal(false);
  };

  const onDrop = (pic, url) => {
    setModal(false);
    setPicture(url[0]);
    let type = pic[0].type.split("/");

    const picRef = storage()
      .ref()
      .child(`profile/${user.uid}.${type[1]}`)
      .put(pic[0]);
    picRef.on(
      storage.TaskEvent.STATE_CHANGED,
      function (snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

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
          user.updateProfile({
            photoURL: downloadURL,
          });
        });
      }
    );

    CloseImage();
  };

  const updateProfile = async () => {
    user.updateProfile({
      displayName: username,
    });
    console.log(birthDate);

    var userDocument = await firestore()
      .collection("Guides")
      .doc(user?.uid)
      .update({
        name: username,
        gender: gender,
        birthDate: birthDate,
      })
      .then(() => {
        console.log("프로필 문서 업데이트 성공");
      })
      .catch(() => {
        console.log("프로필 문서 업데이트 성공");
      });

    history.push("/main");
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangeUserName = (e) => {
    setUserName(e.target.value);
  };

  const handleChangeGender = (e) => {
    setGender(e.target.value);
  };

  const handleChangeBirthDate = (e) => {
    setBirthDate(e.target.value);
  };

  return (
    <div>
      <SettingWrapper>
        <SettingContent title="회원 정보 수정">
          <button className={classes.button}>
            <img className={classes.image} src={picture} onClick={ImageClick} />
          </button>

          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              id="outlined-basic"
              name="email"
              label="이메일"
              variant="outlined"
              value={email}
              onChange={handleChangeEmail}
              InputProps={{
                readOnly: true,
              }}
            />

            <TextField
              id="outlined-basic"
              name="username"
              label="닉네임"
              variant="outlined"
              value={username}
              onChange={handleChangeUserName}
            />

            {/* 성별 선택 폼 */}
            <FormControl className={classes.formControl}>
              <InputLabel
                shrink
                id="demo-simple-select-placeholder-label-label"
              >
                성별
              </InputLabel>
              <Select
                labelId="demo-simple-select-placeholder-label-label"
                id="demo-simple-select-placeholder-label"
                defaultValue={"Male"}
                value={gender}
                onChange={handleChangeGender}
                displayEmpty
                className={classes.selectEmpty}
              >
                <MenuItem value={"Male"}>Male</MenuItem>
                <MenuItem value={"Female"}>Female</MenuItem>
              </Select>
            </FormControl>

            {/* 생년월일 */}
            <TextField
              id="date"
              label="생년월일"
              type="date"
              defaultValue={birthDate}
              className={classes.textField}
              onChange={handleChangeBirthDate}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
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
            buttonText="이미지를 선택하세요"
            onChange={onDrop}
            singleImage={true}
            imgExtension={[".jpg", ".gif", ".png", ".gif"]}
            maxFileSize={5242880}
          />
        </div>
      </Modal>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    flexDirection: "row",
  },
  container: {
    flex: 1,
  },
  imgContainer: {},
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
    margin: 10,
  },
  button: {
    backgroundColor: "#00FF0000",
    borderColor: "#00FF0000",
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
  },
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "40ch",
    },
  },
}));

export default Setting;
