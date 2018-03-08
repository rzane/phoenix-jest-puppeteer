import fetch from "node-fetch";

const SANDBOX = "http://localhost:4001/sandbox";
const CALL = `${SANDBOX}/call`;

const request = (url, opts) => {
  const method = opts.method || "POST";
  const headers = opts.headers || {};
  const payload = { method, headers };

  if (opts.data) {
    payload.body = JSON.stringify(opts.data);
  }

  return fetch(url, payload).then(response => {
    if (!response.ok) {
      throw new Error(`${method} ${url} failed with: ${response.statusText}`);
    }

    if (opts.type === "text") {
      return response.text();
    }

    return response.json();
  });
};

const buildSession = userAgent => {
  const headers = {
    "User-Agent": userAgent,
    "Content-Type": "application/json"
  };

  const call = (key, options) =>
    request(CALL, {
      data: { key, options },
      headers
    });

  const finish = () =>
    request(SANDBOX, {
      method: "DELETE",
      headers,
      type: "text"
    });

  return { userAgent, call, finish };
};

export default () => {
  return request(SANDBOX, { type: "text" }).then(buildSession);
};
