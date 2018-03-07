use Mix.Config

if System.get_env("INTEGRATION") do
  config :blog, BlogWeb.Endpoint,
    http: [port: 4002],
    server: true,
    watchers: [npm: ["run", "-S", "start", cd: Path.expand("../assets", __DIR__)]]

  config :blog, sql_sandbox: true
else
  config :blog, BlogWeb.Endpoint,
    http: [port: 4001],
    server: false
end

# Print only warnings and errors during test
config :logger, level: :warn

# Configure your database
config :blog, Blog.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "blog_test",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox
