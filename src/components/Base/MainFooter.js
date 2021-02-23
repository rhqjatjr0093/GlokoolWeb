import React from "react";
import "./MainFooter.css";
import Button from "@material-ui/core/Button";
import { white, green, purple } from "@material-ui/core/colors";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { SvgIcon } from "@material-ui/core";
import InstagramIcon from "@material-ui/icons/Instagram";
import IconButton from "@material-ui/core/IconButton";
import YouTubeIcon from "@material-ui/icons/YouTube";
import AppleIcon from "@material-ui/icons/Apple";
import ShopIcon from "@material-ui/icons/Shop";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
// const BootstrapButton = withStyles({
//   root: {
//     boxShadow: "none",
//     textTransform: "none",
//     fontSize: 16,
//     padding: "6px 12px",
//     border: "1px solid",
//     lineHeight: 1.5,
//     backgroundColor: "#0063cc",
//     borderColor: "#0063cc",
//     fontFamily: [
//       "-apple-system",
//       "BlinkMacSystemFont",
//       '"Segoe UI"',
//       "Roboto",
//       '"Helvetica Neue"',
//       "Arial",
//       "sans-serif",
//       '"Apple Color Emoji"',
//       '"Segoe UI Emoji"',
//       '"Segoe UI Symbol"',
//     ].join(","),
//     "&:hover": {
//       backgroundColor: "#0069d9",
//       borderColor: "#0062cc",
//       boxShadow: "none",
//     },
//     "&:active": {
//       boxShadow: "none",
//       backgroundColor: "#0062cc",
//       borderColor: "#005cbf",
//     },
//     "&:focus": {
//       boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
//     },
//   },
// })(Button);
import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "#3f50b5",
      dark: "#002884",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
});

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(purple[500]),
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

const MainFooter = () => {
  const classes = useStyles();
  return (
    <div className="footer {classes.root}">
      <div className="footer_container">
        <div className="footer_top">
          <div className="footer_warning">
            <div className="footer_terms">
              <ColorButton href="/desc/terms">이용약관</ColorButton>
            </div>
            <div className="footer_terms">
              <ColorButton href="/desc/perInfo">개인정보 처리방침 </ColorButton>
            </div>
          </div>
          <div className="footer_icon">
            {/* instagram */}
            <div className="footer__option">
              <IconButton href="https://www.instagram.com/glokool_official/?hl=ko">
                <InstagramIcon style={{ color: "#f5f5f5" }} />
              </IconButton>
            </div>

            {/* youtube */}
            <div className="footer__option">
              <IconButton href="https://www.youtube.com/channel/UC4oTkStEsZooHYGZlDkxp1Q">
                <YouTubeIcon style={{ color: "#f5f5f5" }} />
              </IconButton>
            </div>

            {/* kakao */}
            <div className="footer__option">
              <IconButton href="http://pf.kakao.com/_eQNzK">
                <QuestionAnswerIcon style={{ color: "#f5f5f5" }} />
              </IconButton>
            </div>

            {/* applestore */}
            <div className="footer__option">
              <IconButton href="#text-buttons">
                <AppleIcon style={{ color: "#f5f5f5" }} />
              </IconButton>
            </div>

            {/* googleplay */}
            <div className="footer__option">
              <IconButton href="#text-buttons">
                <ShopIcon style={{ color: "#f5f5f5" }} />
              </IconButton>
            </div>
          </div>
        </div>
        <div className="footer_text">
          상호명 올인원 | 대표 박성수 조민기 | 개인정보보호책임자 조민기 |
          사업자등록번호 257-61-00529 사업자정보확인 | 통신판매업신고번호
          2020-서울강남-01433
        </div>
        <div className="footer_text">
          주소 서울특별시 관악구 남부순환로 1929-9, 301호 | 이메일
          glokoolofficial@gmail.com
        </div>
      </div>
    </div>
  );
};

export default MainFooter;
