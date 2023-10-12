import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";

const session = new Map();
const VAR = "VAR_SESSION";
let connectionStatus: string = "Sedang cek koneksi";
let qrCode: string;

export const initWhatsApp = async () => {
  await connectToWhatsApp();
};

import { Request, RequestHandler, Response } from "express";
import qr from "qr-image";

export const getStatus: RequestHandler = async (
  req: Request,
  res: Response
) => {
  if (qrCode == null || qrCode == undefined) {
    res.json({
      success: true,
      data: connectionStatus,
      message: "Sukses",
    });
  } else {
    var code = qr.image(qrCode, { type: "png" });
    res.setHeader("Content-type", "image/png");
    code.pipe(res);
  }
};

export const sendMessage: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { nama, whatsapp, kelas, harga } = req.body;
  res.json({
    data: `percobaan berhasil`,
  });
  const msg = `*Hallo ${nama}*, \n \nBerikut adalah data kelas yang telah dipilih: \n \n*Kelas:* ${kelas} \n*harga:* Rp. ${harga} \n \nLangkah selanjutnya adalah silahkan untuk melakukan pembayaran melalui: \n \n *Gopay*\n 086545543777 \n atas nama: Tomy Adiansyah \n \n*Dana*\n 0876676667 \n \nTerima kasih telah memesan kelas ini.  Sampai jumpa di kelas pertama kita sob. \n \n*Salam* \n *Tomy Mengajar*.`;
  await session
    .get(VAR)
    .sendMessage(`${whatsapp}@s.whatsapp.net`, { text: msg });
};

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");
  const sock = makeWASocket({
    // can provide additional config here
    printQRInTerminal: true,
    auth: state,
  });
  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (update.qr) {
      qrCode = update.qr;
    }
    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log(
        "connection closed due to ",
        lastDisconnect?.error,
        ", reconnecting ",
        shouldReconnect
      );
      // reconnect if not logged out
      connectionStatus = "Closed";
      if (shouldReconnect) {
        connectToWhatsApp();
      }
    } else if (connection === "open") {
      connectionStatus = "connected";
      console.log("connected");
    }
  });
  sock.ev.on("messages.upsert", async (m) => {
    console.log(JSON.stringify(m, undefined, 2));

    console.log("replying to", m.messages[0].key.remoteJid);
    await sock.sendMessage(m.messages[0].key.remoteJid!, {
      text: "Hallo, terima kasih telah menghubungi saya. Saya akan hubungi kamu segera ya.  Terima kasih.",
    });
  });
  session.set(VAR, sock);
}

// run in main file
// connectToWhatsApp();
