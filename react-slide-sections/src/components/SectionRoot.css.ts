import { style } from "@vanilla-extract/css";

export const SectionRootStyle = style({
  width: "100%",
  height: "100vh",
  position: "relative",
  overflow: "hidden",
});

export const SectionRootItemWrapperStyle = style({
  width: "100%",
  height: "100vh",
  position: "absolute",
  top: 0,
  left: 0,
  transform: `translate3d(0px, 0px, 0px)`,
  transition: "all ease 1s",
});

export const SectionRootInActiveItemWrapperStyle = style({
  width: "100%",
  height: "100vh",
  position: "absolute",
  top: 0,
  left: 0,
  transform: `translate3d(0px, -100%, 0px)`,
  transition: "all ease 1s",
});
