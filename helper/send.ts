import { Request, RequestHandler, Response } from "express";
const session = new Map();
const VAR = "VAR_SESSION";

export const sendMessage: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { nama, whatsapp, kelas, harga, email } = req.body;
  res.json({
    data: `hallo ${nama}, ${kelas}, ${harga}`,
  });
  const msg = "percobaan chatbot";
  await session
    .get(VAR)
    .sendMessage(`${whatsapp}@s.whatsapp.net`, { text: msg });
};
