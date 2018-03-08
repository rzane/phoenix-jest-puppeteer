# Phoenix Puppeteer Feature Testing

This project demonstrates a technique for testing a Phoenix application using Jest and Puppeteer.

For starters, we use [jest-puppeteer-preset](https://github.com/smooth-code/jest-puppeteer). It gets puppeteer playing nicely with Jest and provides a utility for starting our server. Props to those people.

In our [jest-puppeteer.config.js](assets/jest-puppeteer.config.js), we tell [jest-puppeteer-preset](https://github.com/smooth-code/jest-puppeteer) to launch the server when our test suite boots. See the `alias` in [`mix.exs`](mix.exs) and make sure `server: true` is set in [`config/test.exs`](config/test.exs).

In [BlogWeb.Endpoint](lib/blog_web/endpoint.ex), we configure [`Phoenix.Ecto.SQL.Sandbox`](https://hexdocs.pm/phoenix_ecto/Phoenix.Ecto.SQL.Sandbox.html) which allows our tests to run in isolated transactions. The general idea is to send a `POST` to `/sandbox` at the beginning of every test to checkout a database transaction. The server will respond with a value that we need to set as our `User-Agent` header so that Phoenix can figure out which currently checked-out transaction we should use. At the end of every test, we check the connection back in by sending a `DELETE` to `/sandbox`.

In [BlogWeb.Endpoint](lib/blog_web/endpoint.ex), we also wire up [`BlogWeb.Sandbox`](lib/blog_web/sandbox.ex), which allows our JavaScript tests to setup state on the server (e.g. insert records into the database).

The end result is [`assets/__tests__/integration/posts.test.js`](assets/__tests__/integration/posts.test.js).
