import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import focusAPI from "../components/features/focus/focusAPI.js";
import FocusContainer from "../components/features/focus/FocusContainer.jsx";
import FocusTimer from "../components/features/focus/FocusTimer.jsx";
import PointDisplay from "../components/features/focus/PointDisplay.jsx";
import styles from "./FocusPage.module.scss";

const FocusPage = () => {
  const { studyId } = useParams();
  const [studyInfo, setStudyInfo] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await focusAPI.getStudyInfo(studyId);
        setStudyInfo(data);
        setTotalPoints(data.totalPoints);
      } catch (e) {
        console.error("Error fetching study info:", e);
      }
    };

    fetchData();
  }, [studyId]);

  if (!studyInfo) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <Header isButtonDisabled={true} />
      <div className={styles.focusContainer}>
        <FocusContainer studyInfo={studyInfo} />
        <PointDisplay totalPoints={totalPoints} />
        <FocusTimer totalPoints={totalPoints} setTotalPoints={setTotalPoints} />
      </div>
    </div>
  );
};

export default FocusPage;
