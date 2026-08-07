const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// EJS 설정
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 요청 데이터 처리
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 정적 파일 사용
app.use(express.static(path.join(__dirname, "public")));

// 테스트용 메인 페이지
app.get("/", (req, res) => {
    res.send("SISS Mission Control is running.");
});

app.listen(PORT, () => {
    console.log(`SISS Mission Control running on http://localhost:${PORT}`);
});