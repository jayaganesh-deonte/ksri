import ccavenueUtils from "./ccavenue-utils";

import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event);
    const data = ccavenueUtils.redirectResponseToJson(body.encResp);

    const redirectUrl =
      data.order_status === "Success"
        ? `/payment/donation/success?order_id=${data.order_id}&status=${data.order_status}`
        : `/payment/donation/failed?order_id=${data.order_id}&status=${data.order_status}`;

    return sendRedirect(event, redirectUrl, 302);
  } catch (error) {
    console.error("Error processing CCAvenue request:", error);
    return sendRedirect(event, "/payment/failed", 302);
  }
});
