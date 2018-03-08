import fetch from "node-fetch";

const SANDBOX = "http://localhost:4001/sandbox";

const sandbox = (opts) => {
  const method = opts.method || "POST";
  const headers = opts.headers || {};
  const payload = { method, headers };

  if (opts.data) {
    payload.body = JSON.stringify(opts.data);
  }

  return fetch(SANDBOX, payload).then(response => {
    if (!response.ok) {
      throw new Error(`${method} ${SANDBOX} failed with: ${response.statusText}`);
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
    sandbox({
      method: "PUT",
      data: { key, options },
      headers
    });

  const finish = () =>
    sandbox({
      method: "DELETE",
      type: "text",
      headers
    });

  return { userAgent, call, finish };
};

export default () => {
  return sandbox({ type: "text", method: "POST" }).then(buildSession);
};
