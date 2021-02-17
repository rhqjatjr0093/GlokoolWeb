import React from "react";
import "./MainBody.css";
import top_img from "../../assets/pc-untactguide-main-home@3x.png";
import content_img1 from "../../assets/Group 89@3x.png";
import content_img2 from "../../assets/Group 88@3x.png";
import content_img3 from "../../assets/Group 87@3x.png";
import content_img4 from "../../assets/Group 86@3x.png";

const MainBody = () => {
  return (
    <div className="container">
      <div className="top">
        <div className="top-box">
          <div className="top-info-box">
            <div className="top-title">
              집에 앉아서
              <br />
              여행 가이드를 해보세요!
            </div>
            <div className="top-exp">
              글로쿨의 여행 가이드는 전화/카카오톡으로 진행합니다.
              <br />
              집에 앉아서 편하게 투어를 진행하고, 외국인과의 언어 교환을 통해
              외국어 능력도 향상하고, 쏠쏠한 용돈벌이도 할 수 있는 글로쿨의
              Untact Guide 를 신청하세요.
            </div>
            <a href="/auth/register" className="top-button">
              가이드 신청하기
            </a>
          </div>
          <img src={top_img} alt="" className="top-img" />
        </div>
      </div>
      <div className="content">
        <div className="box">
          <div className="top-title m-pc">언택트 가이드, 뭐가 좋나요?</div>
          <div className="top-exp margin-bt-40">
            요즘은 여행도 언택트로 한다!
            <br />집 안에서 외국인 친구를 위해 가이드로 활동해보세요!
          </div>
          <div className="content m-pc">
            <div className="group-box">
              <div className="group">
                <img src={content_img1} alt="" className="content-img" />
                <div className="group-title">틈틈이 용돈벌이 가능</div>
                <div className="group-exp">
                  회당 3만원씩 쏠쏠한 용돈벌이가 가능합니다.
                </div>
              </div>
              <div className="group">
                <img src={content_img2} alt="" className="content-img" />
                <div className="group-title">외국인 친구와 교류 가능</div>
                <div className="group-exp">
                  외국인 친구와 대면으로 만나 이야기하기 불편하셨죠? 메신저를
                  통한 교류로도 충분합니다.
                </div>
              </div>
              <div className="group">
                <img src={content_img3} alt="" className="content-img" />
                <div className="group-title">자신의 지역을 소개해주세요</div>
                <div className="group-exp">
                  전문적인 지식보다 자기 지역의 현지인만 알 수 있는 정보를
                  공유해주세요!
                </div>
              </div>
              <div className="group">
                <img src={content_img4} alt="" className="content-img" />
                <div className="group-title">휴대폰만 있으면 OK!</div>
                <div className="group-exp">
                  글로쿨 가이드에게 필요한 것은 스마트폰 하나면 충분합니다. 쉽고
                  편하게 가이드로 활동해보세요.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainBody;
