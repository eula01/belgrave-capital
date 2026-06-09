"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import memosData from "@/data/memos.json";

type ContentBlock =
  | { type: "text"; text: string }
  | { type: "image"; src: string; alt?: string };

type Memo = {
  slug: string;
  date: string;
  title: string;
  tags: string[];
  isAbout?: boolean;
  content: ContentBlock[];
};

const BREAKPOINT = 800;

export default function Website() {
  const memos = memosData as Memo[];
  const [activeSlug, setActiveSlug] = useState(
    memos.find((m) => !m.isAbout)?.slug ?? memos[0].slug
  );
  const [showList, setShowList] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const activeMemo = useMemo(
    () => memos.find((m) => m.slug === activeSlug) ?? memos[0],
    [memos, activeSlug]
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("mobile-show-project-list", showList);
    return () => document.body.classList.remove("mobile-show-project-list");
  }, [showList]);

  const selectMemo = useCallback((slug: string) => {
    setActiveSlug(slug);
    setShowList(false);
  }, []);

  const toggleList = useCallback(() => {
    setShowList((prev) => !prev);
  }, []);

  const renderListItem = (memo: Memo, index: number) => {
    const isActive = memo.slug === activeSlug;
    const showDate = index === 0 || memo.date !== memos[index - 1]?.date;
    const dateClass = showDate ? "year first-year" : "year hide_year";

    return (
      <div
        key={memo.slug}
        id={memo.isAbout ? "about-list-item" : undefined}
        className={`list-item${isActive ? " active" : ""}`}
      >
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            selectMemo(memo.slug);
          }}
        >
          <span className={dateClass}>{memo.date || " "}</span>
          <span className="title">{memo.title}</span>
          <span className="category">{memo.tags.join(", ")}</span>
        </a>
      </div>
    );
  };

  const renderContent = () => {
    if (activeMemo.isAbout) {
      return (
        <div id="about" className="project-view">
          {activeMemo.content.map((block, i) =>
            block.type === "text" ? (
              <div
                key={i}
                className="text-view"
                dangerouslySetInnerHTML={{ __html: block.text }}
              />
            ) : null
          )}
        </div>
      );
    }

    return (
      <div className="project-view project-content">
        {activeMemo.content.map((block, i) => {
          if (block.type === "image") {
            return (
              <div key={i} className="image-view media-view">
                <img src={block.src} alt={block.alt ?? ""} />
              </div>
            );
          }
          return (
            <div
              key={i}
              className="text-view"
              dangerouslySetInnerHTML={{ __html: block.text }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <>
      <a href="#" onClick={(e) => { e.preventDefault(); selectMemo("about"); }}>
        <div id="imprintmt">about</div>
      </a>

      <div className="website-view">
        {isMobile && (
          <>
            <div className="mobile-bar" onClick={toggleList}>
              belgrave capital ltd
            </div>
            <div className="mobile-icon-wrap" onClick={toggleList}>
              <div className="mobile-icon" />
            </div>
            <div className="mobile-active-project" onClick={toggleList}>
              <span className="year first-year">{activeMemo.date}</span>
              <span className="title">{activeMemo.title}</span>
              <span className="category">{activeMemo.tags.join(", ")}</span>
            </div>
          </>
        )}

        <div id="list">{memos.map(renderListItem)}</div>
        <div id="media">{renderContent()}</div>
      </div>
    </>
  );
}
