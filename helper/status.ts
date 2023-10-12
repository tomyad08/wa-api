// import { Request, RequestHandler, Response } from "express";
// import qr from "qr-image";
// let connectionStatus: string = "Sedang cek koneksi";
// let qrCode: string;

// export const getStatus: RequestHandler = async (
//   req: Request,
//   res: Response
// ) => {
//   if (qrCode == null || qrCode == undefined) {
//     res.json({
//       success: true,
//       data: connectionStatus,
//       message: "Sukses",
//     });
//   } else {
//     var code = qr.image(qrCode, { type: "png" });
//     res.setHeader("Content-type", "image/png");
//     code.pipe(res);
//   }
// };
