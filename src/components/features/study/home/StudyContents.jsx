import React, { useState, useEffect, useRef } from "react";
import studyAPI from "../studyAPI";
import styles from "./StudyContents.module.scss";
import StudyCard from "./StudyCard";
import { Link } from "react-router-dom";
import searchIcon from "../../../../../src/assets/icons/ic_search.svg";

function StudyContents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("createdAt");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // 실제 검색에 사용될 쿼리
  const sortRef = useRef(null);

  useEffect(() => {
    const fetchStudies = async () => {
      if (offset === 0) setIsInitialLoading(true);
      setError(null);
      try {
        const data = await studyAPI.getStudyList(
          searchQuery, // searchQuery 사용
          sortOption,
          offset
        );
        setCards((prevCards) =>
          offset === 0 ? [...data.studies] : [...prevCards, ...data.studies]
        );
        setTotal(data.total);
      } catch (err) {
        setError(err);
      } finally {
        if (offset === 0) setIsInitialLoading(false);
      }
    };

    // searchQuery가 변경될 때만 fetchStudies 실행
    if (searchQuery !== "" || offset > 0) {
      fetchStudies();
    } else if (offset === 0) {
      fetchStudies();
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchQuery, sortOption, offset]);

  const handleClickOutside = (e) => {
    if (sortRef.current && !sortRef.current.contains(e.target)) {
      setIsSortOpen(false);
    }
  };

  const handleLoadMore = () => {
    if (cards.length < total) {
      setOffset((prevOffset) => prevOffset + 6);
    }
  };

  const handleSortChange = (option) => {
    setCards([]);
    setOffset(0);
    switch (option) {
      case "최근 순":
        setSortOption("createdAt");
        break;
      case "오래된 순":
        setSortOption("oldest");
        break;
      case "많은 포인트 순":
        setSortOption("totalPointsDesc");
        break;
      case "적은 포인트 순":
        setSortOption("totalPointsAsc");
        break;
      default:
        setSortOption("createdAt");
    }
  };

  const calculateDays = (createdAt) => {
    const createdDate = new Date(createdAt);
    const today = new Date();
    const diffTime = Math.abs(today - createdDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // 엔터 키를 눌렀을 때 검색을 실행하는 함수
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setCards([]); // 검색 시 기존 카드 초기화
      setOffset(0); // 검색 시 offset 초기화
      setSearchQuery(searchTerm); // 실제 검색 쿼리 업데이트
    }
  };
  // 최초 로딩일 때만 전체 로딩 화면 표시
  if (isInitialLoading) return;

  if (error) {
    return <div className={styles.error}>Error: {error.message}</div>;
  }

  return (
    <div className={styles.studyContents}>
      <h2 className={styles.title}>스터디 둘러보기</h2>
      <div className={styles.optionBar}>
        <div className={styles.searchBar}>
          <div className={styles.searchIcon}>
            <img src={searchIcon} alt="searchIcon" />
          </div>
          <input
            type="text"
            placeholder="검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress} // 엔터 키 이벤트 핸들러 추가
            className={styles.searchInput}
          />
        </div>

        <div className={styles.sortDropdown} ref={sortRef}>
          <button
            className={styles.sortButton}
            onClick={() => setIsSortOpen((prev) => !prev)}
          >
            <span className={styles.sortLabel}>
              {
                {
                  createdAt: "최근 순",
                  oldest: "오래된 순",
                  totalPointsDesc: "많은 포인트 순",
                  totalPointsAsc: "적은 포인트 순",
                }[sortOption]
              }
            </span>
            <span className={styles.sortIcon}></span>
          </button>
          {isSortOpen && (
            <ul className={styles.sortList}>
              {["최근 순", "오래된 순", "많은 포인트 순", "적은 포인트 순"].map(
                (option) => (
                  <li
                    key={option}
                    onClick={() => handleSortChange(option)}
                    className={styles.sortItem}
                  >
                    {option}
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      </div>

      <div className={styles.studyCards}>
        {cards.map((card) => (
          <Link
            to={`/${card.id}`}
            key={card.id}
            className={styles.studyCardLink}
          >
            <div className={styles.studyCardContainer}>
              <StudyCard
                name={card.name}
                description={card.description}
                image={card.background}
                points={card.totalPoints}
                createdAt={card.createdAt}
                emojis={card.emojis}
                background={card.background}
                calculateDays={calculateDays}
                creatorNick={card.creatorNick}
              />
            </div>
          </Link>
        ))}
      </div>
      {cards.length < total && (
        <div className={styles.loadMoreWrapper}>
          <button className={styles.loadMore} onClick={handleLoadMore}>
            더보기
          </button>
        </div>
      )}
    </div>
  );
}

export default StudyContents;
