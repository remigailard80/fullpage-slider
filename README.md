## react-slide-sections

![react-slide-sections](https://user-images.githubusercontent.com/55088346/188320539-88505770-366f-4b8c-961c-8355178ca4b7.gif)

한 페이지씩 스크롤로 넘기고 싶어서 만든, `fullPage.js`랑 비슷한 패키지입니다. 참고로 `fullPage.js`는 유료여서 직접 만들었습니다.

또한, 이왕 만드는거 패키지로 인스톨해서 사용할 수 있게 했습니다.

## Installation

### yarn

```
yarn add react-slide-sections
```

###  npm

```
npm i reatc-slide-sections
```

## Example

```
git clone https://github.com/remigailard80/fullpage-slider
yarn install
yarn start
```

시 Example Project를 구동할 수 있습니다.

Or

```
import React from "react";
import { SectionRoot } from "react-slide-sections";

function App() {
  return (
    <SectionRoot>
      <div style={{ backgroundColor: "red", height: "100%" }}> Paper1 </div>
      <div style={{ backgroundColor: "blue", height: "100%" }}> Paper2 </div>
      <div style={{ backgroundColor: "green", height: "100%" }}> Paper3 </div>
    </SectionRoot>
  );
}

export default App;

```

## TODO

1. `useImperativeHandle` 이용해서 activeIdx를 외부에서 직접 조작할 수 있게 할 예정입니다.
