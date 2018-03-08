const fetch = require("node-fetch");

const SANDBOX = "http://localhost:4001/sandbox";
const CALL = `${SANDBOX}/call`;

function request(url, opts) {
  const method = opts.method || "POST";
  const headers = opts.headers || {};
  const payload = { method: method, headers: headers };

  if (opts.data) {
    payload.body = JSON.stringify(opts.data);
  }

  return fetch(url, payload).then(function(response) {
    if (!response.ok) {
      throw new Error(`${method} ${url} failed with: ${response.statusText}`);
    }

    if (opts.type === "text") {
      return response.text();
    }

    return response.json();
  });
}

function buildSession(userAgent) {
  const headers = {
    "User-Agent": userAgent,
    "Content-Type": "application/json"
  };

  function call(key, options) {
    return request(CALL, {
      data: { key: key, options: options },
      headers: headers
    });
  }

  function finish() {
    return request(SANDBOX, {
      method: "DELETE",
      headers: headers,
      type: "text"
    });
  }

  return {
    userAgent: userAgent,
    call: call,
    finish: finish
  };
}

module.exports = function startSession() {
  return request(SANDBOX, { type: "text" }).then(buildSession);
};
