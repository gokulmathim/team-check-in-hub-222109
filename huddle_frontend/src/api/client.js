import { getApiBaseUrl } from "../config/env";

/**
 * Normalize fetch errors into a consistent shape.
 */
function buildHttpError({ status, message, details }) {
  const err = new Error(message || "Request failed");
  err.name = "HttpError";
  err.status = status;
  err.details = details;
  return err;
}

/**
 * PUBLIC_INTERFACE
 * Perform a JSON API request against the backend.
 *
 * Notes:
 * - Uses a default timeout to avoid hanging UI.
 * - Throws an Error with `status` when HTTP status is not ok.
 *
 * @param {string} path Relative API path (e.g. "/health")
 * @param {object} options fetch options plus { timeoutMs }
 * @returns {Promise<any>} Parsed JSON or null (if empty response)
 */
export async function apiRequest(path, options = {}) {
  const { timeoutMs = 12000, headers, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${getApiBaseUrl()}${path}`, {
      ...fetchOptions,
      headers: {
        Accept: "application/json",
        ...(fetchOptions.body ? { "Content-Type": "application/json" } : {}),
        ...(headers || {}),
      },
      signal: controller.signal,
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

    if (!res.ok) {
      throw buildHttpError({
        status: res.status,
        message:
          (payload &&
            payload.detail &&
            (typeof payload.detail === "string" ? payload.detail : payload.detail?.message)) ||
          (typeof payload === "string" && payload) ||
          `HTTP ${res.status}`,
        details: payload,
      });
    }

    // Some endpoints may return an empty body
    if (payload === "" || payload == null) return null;
    return payload;
  } catch (e) {
    if (e?.name === "AbortError") {
      const err = new Error("Request timed out. Please try again.");
      err.name = "TimeoutError";
      throw err;
    }
    throw e;
  } finally {
    clearTimeout(timeoutId);
  }
}
