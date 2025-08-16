const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const CryptoJS = require("crypto-js");

const app = express();
let sessionCookie = ""; // نگهداری ASP.NET_SessionId

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/**
 * استفاده از clientResponse ثابت (مقداری که فرستادی)
 */
const HARDCODED_CLIENT_RESPONSE = "8687d21fa9baaff07a46c7c8609658beca552f542c193dc5f61252247f4abc62dc0f294fd18e3f6d1f167f1c7d87af49869798543453d1363cc0cbf3b44871d3ae4bddf283d845559b5375e5d1223ce9718387fcdbf53186752da4bb6907d3846ba7033a2280b3b9a785dd026a34c4475ee97420f221cbcbe8bd8d1b4be7ffac1069761b8f52e92eb9ea687293e82f3a6764de4618f429ef68db386fbc1758d52659c4fe7ac8e31a3eb8b97dee363a301906e94776365288bb94bcfa4a95f448bb642fd0_158";

/**
 * روت لاگین که از مقدار ثابت استفاده می‌کند
 */
app.post("/login", (req, res) => {
  const username = req.body.username || "501348";
  const password = req.body.password || "پسورد-جای-خالی"; // اگر نیاز داشتی می‌تونی ارسال کنی یا اینجا بذار

  // در این نسخه ما salt یا challenge را نخوانده و مستقیم از مقدار ثابت استفاده می‌کنیم
  const clientResponse = HARDCODED_CLIENT_RESPONSE;

  request.post({
    url: "https://bpms.marinagroup.org/Web/Ajax.+",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-BestPracticeAjax-Class": "8f510237511e48cc33c20fa86fa4982a",
      "X-BestPracticeAjax-Method": "c19235e28106c5717895667027885d22"
    },
    body: `userName=${encodeURIComponent(username)}&clientResponse=${encodeURIComponent(clientResponse)}`
  }, (err2, resp2, body2) => {
    if (err2) {
      console.error("Login request error:", err2);
      return res.status(500).send({ ok: false, error: err2.toString() });
    }

    // ذخیره کوکی سشن
    const cookies = resp2.headers["set-cookie"];
    if (cookies && cookies.length > 0) {
      sessionCookie = cookies.map(c => c.split(";")[0]).join("; ");
      console.log("Saved session cookie:", sessionCookie);
    } else {
      console.log("No set-cookie in login response headers.");
    }

    res.send({ status: "ok", body: body2 });
  });
});

/**
 * پروکسی درخواست‌ها به BPMS بعد از لاگین
 */
app.post("/proxy", (req, res) => {
  if (!sessionCookie) {
    return res.status(401).send("ابتدا باید لاگین کنید (session cookie موجود نیست)");
  }

  request.post({
    url: "https://bpms.marinagroup.org/Web/Ajax.+",
    headers: {
      // فقط هدرهای لازم را ارسال می‌کنیم؛ جلوگیری از ارسال هدرهای مرورگر که ممکن است مشکل‌ساز باشند
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": sessionCookie,
      "X-BestPracticeAjax-Class": req.headers["x-bestpracticeajax-class"] || "",
      "X-BestPracticeAjax-Method": req.headers["x-bestpracticeajax-method"] || ""
    },
    body: new URLSearchParams(req.body).toString()
  }, (error, response, body) => {
    if (error) {
      console.error("Proxy request error:", error);
      return res.status(500).send(error.toString());
    }
    res.send(body);
  });
});

app.use(express.static(__dirname + "/public"));

app.listen(3000, () => console.log("Server running on port 3000"));
