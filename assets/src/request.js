import querystring from "querystring";

const request = (method, url, data = {}) => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]');

  const opts = {
    method,
    credentials: "same-origin",
    headers: {
      "x-csrf-token": csrfToken.content,
      "content-type": "application/json"
    }
  };

  if (method === "POST" || method === "PUT") {
    opts.body = JSON.stringify(data);
  }

  return fetch(url, opts).then(res => {
    if (res.status == 204) {
      return null;
    }

    return res.json().then(json => {
      if (res.ok) {
        return json;
      }

      const error = new Error(res.statusText);
      error.status = res.status;
      error.body = json;
      throw error;
    });
  });
};

request.get = request.bind(null, "GET");
request.post = request.bind(null, "POST");
request.put = request.bind(null, "PUT");
request.delete = request.bind(null, "DELETE");

export default request;
