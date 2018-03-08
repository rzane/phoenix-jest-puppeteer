use Mix.Config

config :blog, BlogWeb.Endpoint,
  http: [port: 4001],
  server: true

config :blog, sql_sandbox: true

# Print only warnings and errors during test
# config :logger, level: :warn
config :logger, level: :debug

# Configure your database
config :blog, Blog.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "blog_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox
