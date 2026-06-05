function parseResponseBody(xhr) {
  if (xhr.status === 204) {
    return null;
  }

  const contentType = xhr.getResponseHeader("content-type") || "";

  if (contentType.includes("application/json")) {
    const text = xhr.responseText || "";
    return text ? JSON.parse(text) : null;
  }

  return xhr.responseText;
}

function buildErrorMessage(data, fallbackMessage) {
  if (data && typeof data === "object" && "error" in data) {
    return data.error;
  }

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  return fallbackMessage;
}

export function ajaxRequest(path, options = {}) {
  const { body, headers, method = "GET" } = options;
  const requestHeaders = { ...(headers || {}) };
  let requestBody = body;

  if (
    body &&
    !(body instanceof FormData) &&
    !(body instanceof Blob) &&
    !(body instanceof ArrayBuffer) &&
    !(body instanceof URLSearchParams) &&
    typeof body !== "string"
  ) {
    requestHeaders["Content-Type"] = requestHeaders["Content-Type"] || "application/json";
    requestBody = JSON.stringify(body);
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, path, true);
    xhr.withCredentials = true;

    Object.entries(requestHeaders).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        xhr.setRequestHeader(key, String(value));
      }
    });

    xhr.onload = () => {
      let data;

      try {
        data = parseResponseBody(xhr);
      } catch (error) {
        reject(error);
        return;
      }

      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data);
        return;
      }

      const message = buildErrorMessage(data, "Request failed");
      const error = new Error(message);
      error.status = xhr.status;
      error.data = data;
      reject(error);
    };

    xhr.onerror = () => {
      const error = new Error("Network request failed");
      error.status = xhr.status || 0;
      reject(error);
    };

    xhr.send(requestBody instanceof URLSearchParams ? requestBody.toString() : requestBody);
  });
}

export const apiRequest = ajaxRequest;
