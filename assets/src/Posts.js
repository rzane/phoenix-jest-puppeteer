import React, { Component } from "react";
import request from "./request";

const formatErrors = errors =>
  Object.keys(errors).reduce(
    (acc, key) => acc.concat(errors[key].map(err => `${key} ${err}`)),
    []
  );

export default class Posts extends Component {
  state = {
    posts: [],
    form: { title: "", content: "" },
    errors: {}
  };

  componentDidMount() {
    request.get("/posts").then(({ data }) => {
      this.setState({ posts: data });
    });
  }

  editPost(post) {
    this.setState({ form: post });
  }

  createPost(post) {
    request
      .post("/posts", { post })
      .then(({ data }) => {
        this.setState(({ posts }) => ({
          posts: [data, ...posts],
          form: { title: "", content: "" }
        }));
      })
      .catch(error => {
        this.setState({
          errors: formatErrors(error.body.errors)
        });
      });
  }

  updatePost(id, post) {
    request
      .put(`/posts/${id}`, { post })
      .then(({ data }) => {
        this.setState(({ posts }) => ({
          posts: posts.map(p => (p.id === id ? data : p)),
          form: { title: "", content: "" }
        }));
      })
      .catch(error => {
        this.setState({
          errors: formatErrors(error.body.errors)
        });
      });
  }

  deletePost(post) {
    request.delete(`/posts/${post.id}`).then(() => {
      this.setState(({ posts }) => ({
        posts: posts.filter(p => p.id !== post.id)
      }));
    });
  }

  togglePostForm = () => {
    this.setState(({ isShowingForm }) => ({
      isShowingForm: !isShowingForm
    }));
  };

  handleChange = event => {
    const { name, value } = event.target;

    this.setState(({ form }) => ({
      form: { ...form, [name]: value }
    }));
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({ errors: {} });

    const { id, ...data } = this.state.form;

    if (id) {
      this.updatePost(id, data);
    } else {
      this.createPost(data);
    }
  };

  render() {
    const { form, errors, posts } = this.state;

    return (
      <div className="Posts">
        <ul className="Posts--list">
          {posts.map(post => (
            <li key={post.id} className="Post">
              <div className="d-flex">
                <h4 className="mr-auto">{post.title}</h4>
                <div>
                  <button
                    className="btn btn-link"
                    onClick={() => this.editPost(post)}
                  >
                    Edit
                  </button>{" "}
                  |{" "}
                  <button
                    className="btn btn-link"
                    onClick={() => this.deletePost(post)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p>{post.content}</p>
            </li>
          ))}
        </ul>

        <form className="Posts--form" onSubmit={this.handleSubmit}>
          {errors.length && (
            <div className="alert alert-warning" role="alert">
              <div>
                <strong>The following errors occurred:</strong>
              </div>
              <ul>{errors.map(error => <li key={error}>{error}</li>)}</ul>
            </div>
          )}

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={form.title}
              onChange={this.handleChange}
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              rows="5"
              name="content"
              className="form-control"
              value={form.content}
              onChange={this.handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Save post
          </button>
        </form>
      </div>
    );
  }
}
