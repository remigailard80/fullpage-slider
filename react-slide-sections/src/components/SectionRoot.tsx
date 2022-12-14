import React, { useEffect, useState, useMemo, useCallback } from "react";

import {
  SectionRootStyle,
  SectionRootItemWrapperStyle,
  SectionRootInActiveItemWrapperStyle,
} from "./SectionRoot.css";
import { reverseArrayIndex } from "../utils/Array";

export type SectionRootProps = {
  threshold?: number;
  loopingScroll?: boolean;
  children: React.ReactNode[];
};

let scrollThrottle;

export const SectionRoot: React.FC<SectionRootProps> = ({
  threshold,
  loopingScroll = false,
  children,
}: SectionRootProps) => {
  const scrollThreshold = threshold || 0;
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const activeIndexes = useMemo(
    () => Array.from({ length: children.length }).map((_, index) => index),
    [children]
  );

  const handleScrollThrottle = (timeout: number) => {
    if (scrollThrottle) return;
    scrollThrottle = true;
    scrollThrottle = setTimeout(() => {
      scrollThrottle = false;
    }, timeout);
  };

  const handleWheelEvent = useCallback(
    (e) => {
      const isDeltaYThresholdOver = Math.abs(e.deltaY) >= scrollThreshold;
      const isScrollUp = e.deltaY > 0 && isDeltaYThresholdOver;
      const isScrollDown = e.deltaY < 0 && isDeltaYThresholdOver;

      if (scrollThrottle) return;

      if (isScrollUp) {
        handleScrollThrottle(1000);
        setActiveIdx((prev) => {
          if (!loopingScroll) {
            return prev < children.length - 1 ? prev + 1 : prev;
          }
          return prev + 1;
        });
        return;
      }
      if (isScrollDown) {
        handleScrollThrottle(1000);
        setActiveIdx((prev) => {
          if (!loopingScroll) {
            return prev > 0 ? prev - 1 : 0;
          }
          return prev - 1;
        });
        return;
      }
    },
    [scrollThreshold, loopingScroll, children]
  );

  useEffect(() => {
    window.addEventListener("wheel", handleWheelEvent);
    return () => window.removeEventListener("wheel", handleWheelEvent);
  }, [handleWheelEvent]);

  return (
    <main className={SectionRootStyle}>
      {React.Children.map(children, (child, idx) => {
        const isActiveSection =
          reverseArrayIndex(activeIndexes, activeIdx) <= idx;
        return (
          <section
            className={
              isActiveSection
                ? SectionRootItemWrapperStyle
                : SectionRootInActiveItemWrapperStyle
            }
            style={{ zIndex: 100 - idx }}
          >
            {child}
          </section>
        );
      })}
    </main>
  );
};
