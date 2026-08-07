const express = require("express"); //Express 서버 사용
const session = require("express-session"); //로그인한 사용자를 기억하기 위한 세션
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

 // 대시보드 라우터 연결
const dashboardRouter = require("./routes/dashboard");
app.use("/", dashboardRouter);

// 위성 관련 라우터 연결
const satelliteRouter = require("./routes/satellite");
app.use("/", satelliteRouter);

const settingsRouter = require("./routes/settings");
app.use("/", settingsRouter);

// 서버 실행
app.listen(PORT, () => {
    console.log(
        `SISS Mission Control running on http://localhost:${PORT}`
    );
});