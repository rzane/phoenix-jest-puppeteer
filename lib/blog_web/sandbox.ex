defmodule BlogWeb.Sandbox do
  @behaviour Plug

  import Phoenix.Controller, only: [json: 2]

  @impl true
  def init(opts) do
    %{path: Plug.Router.Utils.split(opts[:at])}
  end

  @impl true
  def call(%Plug.Conn{method: "PUT", path_info: path, params: params} = conn, %{path: path}) do
    do_call(conn, params)
  end

  def call(conn, _opts), do: conn

  defp do_call(conn, %{"key" => key, "options" => options}) do
    json(conn, handle_call(key, options))
  end

  defp do_call(conn, %{"key" => key}) do
    json(conn, handle_call(key, %{}))
  end

  defp do_call(_conn, _params) do
    raise "The sandbox setup route expects a 'key' parameter."
  end

  defp handle_call("post", options) do
    {:ok, post} = Blog.Posts.create_post(options)
    Map.take(post, [:id, :title, :content])
  end
end
