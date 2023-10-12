import express from "express";
import { getStatus, initWhatsApp, sendMessage } from "./helper/whatsapp";

const app = express();
app.use(express.json());

app.get("/", getStatus);
app.post("/send-message", sendMessage);

const port = 3100;
app.listen(port, async () => {
  console.log("server sedang berjalan");
  await initWhatsApp();
});
