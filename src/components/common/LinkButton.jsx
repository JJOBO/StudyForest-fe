import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LinkButton.module.scss";
import arrowIcon from "../../assets/icons/ic_arrow_right.svg";

function LinkButton({ type, onClick, studyId }) {
  const navigate = useNavigate();

  const linkPaths = {
    habit: `/${studyId}/habits`,
    focus: `/${studyId}/focus`,
    home: `/`,
  };

  const handleClick = () => {
    if (onClick) onClick();
    if (linkPaths[type]) navigate(linkPaths[type]);
  };

  const renderContent = () => {
    switch (type) {
      case "home":
        return (
          <button className={styles.homeButton} onClick={handleClick}>
            홈
            <img src={arrowIcon} alt="arrow" className={styles.arrowIcon} />
          </button>
        );
      case "habit":
        return (
          <button className={styles.habitButton} onClick={handleClick}>
            오늘의 습관
            <img src={arrowIcon} alt="arrow" className={styles.arrowIcon} />
          </button>
        );
      case "focus":
        return (
          <button className={styles.focusButton} onClick={handleClick}>
            오늘의 집중
            <img src={arrowIcon} alt="arrow" className={styles.arrowIcon} />
          </button>
        );
      default:
        return (
          <button className={styles.homeButton} onClick={handleClick}>
            홈
            <img src={arrowIcon} alt="arrow" className={styles.arrowIcon} />
          </button>
        );
    }
  };

  return <div>{renderContent()}</div>;
}

export default LinkButton;
