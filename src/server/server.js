import compression from "compression";
import express from "express";
import fileUpload from 'express-fileupload';
import helmet from "helmet";
import { customAlphabet } from 'nanoid';
import path from 'path';
import ReactDOMServer from "react-dom/server";
import { ServerApp } from "../App";
import { mainTemplate } from "./mainTemplate";

const SITE =
  process.env.SITE === "undefined" || process.env.SITE === undefined
    ? "localhost"
    : process.env.SITE;
const PORT =
  process.env.PORT === "undefined" || process.env.PORT === undefined
    ? 3000
    : process.env.PORT;

const AVATARS_DIRNAME = 'avatars';

const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(compression());
  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );
}

app.use("/static", express.static("./app/client"));

app.post("/upload-avatar", fileUpload({
  createParentPath: true,
}), (req, res) => {
  const files = req.files
  let avatarFullNewName = ''
  Object.keys(files).forEach( key => {
    // так как файлы с нелатинскими буквами в названии сохранялись типа так Ð´ÐµÐ¼Ð¾Ñ�Ð¸Ð²Ð°Ñ�Ð¾Ñ�
    //    решено было переделывать название на смесь рандомных латинских букв и цифр и для этого поставлен пакет NanoId
    // последняя версия nanoid работает только с import а тут есть CommonJS который при компиляции переделывает import в require
    //    поэтому поставлена версия 3.3.6 (она самая скачиваемая)
    const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 20)
    const avatarNewName = nanoid()
    const avatarFileType = files[key].name.slice(files[key].name.lastIndexOf("."))
    avatarFullNewName = avatarNewName+avatarFileType
    const filepath = path.join(__dirname, `../../src/assets/${AVATARS_DIRNAME}`, avatarFullNewName)
    files[key].mv(filepath, (err) => {
      // эта функция вызывается в любом случае независимо от результата
      // и поэтому, чтобы выводить сообщение об ошибки только, когда она есть, нужно условие
      if (err) return res.status(500).json({
        message: `[server.js]: ошибка при загрузке аватара: ${err}`
      })
    })
  })
  return res.status(200).json({
    avatar: `${AVATARS_DIRNAME}/${avatarFullNewName}`
  })
});

app.get("*", (req, res) => {
  res.send(mainTemplate(ReactDOMServer.renderToString(ServerApp(req.url))));
});

app.listen(PORT, () =>
  console.log(`[server.js]: приложение запустилось на http://${SITE}:${PORT}`)
);
