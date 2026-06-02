export async function apiRequest(path, options = {}) {
  const { body, headers, ...rest } = options;
  const requestHeaders = { ...(headers || {}) };
  let requestBody = body;

  if (body && !(body instanceof FormData)) {
    requestHeaders["Content-Type"] = requestHeaders["Content-Type"] || "application/json";
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(path, {
    credentials: "include",
    headers: requestHeaders,
    body: requestBody,
    ...rest,
  });

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "error" in data
        ? data.error
        : typeof data === "string" && data.trim()
          ? data
          : "Request failed";

    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
