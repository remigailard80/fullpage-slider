import React, { useState, useEffect, useRef, useCallback } from "react";

import {
  SectionRootStyle,
  SectionRootItemWrapperStyle,
} from "./SectionRoot.css";

interface SectionRootProps {
  children: React.ReactNode[];
}

let scrollThrottle;

export const SectionRoot: React.FC<SectionRootProps> = ({ children }) => {
  const rootElementRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [lastScrollY, setLastScrollY] = useState<number>(
    window.pageYOffset || window.scrollY
  );
  const [scrollable, setScrollable] = useState<boolean>(true);

  const detectScrollDirection = useCallback(
    (e) => {
      const currentWindow = e.currentTarget;
      const isScrollUp = lastScrollY > currentWindow.scrollTop;
      const isScrollDown = lastScrollY < currentWindow.scrollTop;

      if (isScrollDown) {
        return "SCROLL_DOWN";
      }
      if (isScrollUp) {
        return "SCROLL_UP";
      }
      return;
    },
    [lastScrollY]
  );

  const handleScrollThrottle = () => {
    // TODO
    scrollThrottle = true;
    setTimeout(() => {
      scrollThrottle = false;
    }, 1000);
  };

  const setScreenNotScrollableDuringScrollThrottle = useCallback(() => {
    setScrollable(false);
    setTimeout(() => {
      setScrollable(true);
    }, 1200);
  }, [scrollable]);

  const windowScrollTo = (position: number) => {
    rootElementRef.current.scrollTo({
      left: 0,
      top: position,
      behavior: "smooth",
    });
    return;
  };

  const handleScroll = useCallback(
    (e) => {
      if (scrollThrottle) {
        // scroll Action Processing Throttle
        return;
      }
      // if not processing scroll Action
      handleScrollThrottle();

      // Detect Scroll Direction
      const scrollDirection = detectScrollDirection(e);
      if (scrollDirection === "SCROLL_DOWN") {
        const nextActiveIdx =
          activeIdx < children.length - 1 ? activeIdx + 1 : children.length - 1;

        setActiveIdx(nextActiveIdx);
        setLastScrollY(nextActiveIdx * rootElementRef.current.clientHeight);
        setScreenNotScrollableDuringScrollThrottle();

        windowScrollTo(nextActiveIdx * rootElementRef.current.clientHeight);
        return;
      }
      if (scrollDirection === "SCROLL_UP") {
        const nextActiveIdx = activeIdx > 0 ? activeIdx - 1 : 0;

        setActiveIdx(nextActiveIdx);
        setLastScrollY(nextActiveIdx * rootElementRef.current.clientHeight);
        setScreenNotScrollableDuringScrollThrottle();

        windowScrollTo(nextActiveIdx * rootElementRef.current.clientHeight);
        return;
      }
    },
    [
      rootElementRef,
      detectScrollDirection,
      setScreenNotScrollableDuringScrollThrottle,
      activeIdx,
      children,
    ]
  );

  useEffect(() => {
    rootElementRef.current.addEventListener("scroll", handleScroll);
    return () => {
      rootElementRef.current.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <main
      ref={rootElementRef}
      className={SectionRootStyle}
      style={{ overflow: scrollable ? "auto" : "hidden" }}
    >
      {React.Children.map(children, (child, idx) => {
        return (
          <section
            className={SectionRootItemWrapperStyle}
            style={{
              zIndex: 100 - idx,
            }}
          >
            {child}
          </section>
        );
      })}
    </main>
  );
};

export default SectionRoot;
