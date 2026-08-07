const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = 3000;

// EJS 설정
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// public 폴더의 CSS / JS 사용
app.use(express.static(path.join(__dirname, "public")));

// form / JSON 데이터 처리
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 로그인 세션 설정
app.use(
    session({
        secret: "siss-secret-key",
        resave: false,
        saveUninitialized: false
    })
);

// 로그인 관련 라우터 연결
const authRouter = require("./routes/auth");
app.use("/", authRouter);

// 서버 실행
app.listen(PORT, () => {
    console.log(
        `SISS Mission Control running on http://localhost:${PORT}`
    );
});