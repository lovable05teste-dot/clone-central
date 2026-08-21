import { createServerFn } from "@tanstack/react-start";
import {
  createFortpayPixCharge,
  readFortpayPixStatus,
  type FortpayChargeInput,
  type FortpayChargeResult,
} from "./pix.server";

export const createPixCharge = createServerFn({ method: "POST" })
  .inputValidator((data: FortpayChargeInput) => data)
  .handler(async ({ data }): Promise<FortpayChargeResult> => {
    const token = process.env.FORTPAY_API_TOKEN;
    const offerHash = process.env.FORTPAY_OFFER_HASH || "o9ybnwoyun";
    const productHash = process.env.FORTPAY_PRODUCT_HASH || "txi2kwhf0r";
    const baseUrl = process.env.FORTPAY_BASE_URL;
    if (!token) {
      throw new Error("FortPay não está configurado. Salve o segredo FORTPAY_API_TOKEN.");
    }

    return createFortpayPixCharge(data, { token, offerHash, productHash, baseUrl });
  });

export const getPixStatus = createServerFn({ method: "GET" })
  .inputValidator((data: { transactionId: string }) => data)
  .handler(async ({ data }): Promise<{ status: string; paidAt?: string }> => {
    const token = process.env.FORTPAY_API_TOKEN;
    const baseUrl = process.env.FORTPAY_BASE_URL;
    if (!token) return { status: "PENDING" };
    return readFortpayPixStatus(data.transactionId, token, baseUrl);
  });
