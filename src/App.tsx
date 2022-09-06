import React from "react";
import { SectionRoot } from "react-slide-sections";

function App() {
  return (
    <SectionRoot threshold={20}>
      <div style={{ backgroundColor: "red", height: "100%" }}> Paper1 </div>
      <div style={{ backgroundColor: "blue", height: "100%" }}> Paper2 </div>
      <div style={{ backgroundColor: "green", height: "100%" }}> Paper3 </div>
    </SectionRoot>
  );
}

export default App;
