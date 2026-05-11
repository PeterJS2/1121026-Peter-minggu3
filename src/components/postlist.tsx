import React from "react";
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  TextField, Select, MenuItem
} from "@mui/material";

interface Post {
  id: string;
  title: string;
  createdAt: string;
  user: string;
}

interface State {
  posts: Post[];
  search: string;
  sortBy: string;
  loading: boolean;
}

export default class PostList extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      posts: [],
      search: "",
      sortBy: "title",
      loading: false
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    fetch("https://forum.hansyulian.space/api/post")
      .then(res => res.json())
      .then(data => this.setState({ posts: data, loading: false }));
  }

  handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ search: e.target.value });
  };

  handleSort = (e: React.ChangeEvent<{ value: unknown }>) => {
    this.setState({ sortBy: e.target.value as string });
  };

  render() {
    const { posts, search, sortBy, loading } = this.state;

    const filtered = posts
      .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "createdAt") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy === "user") return a.user.localeCompare(b.user);
        return 0;
      });

    return (
      <div>
        <TextField
          label="Search"
          value={search}
          onChange={this.handleSearch}
          style={{ marginBottom: 16 }}
        />
        <Select value={sortBy} onChange={this.handleSort}>
          <MenuItem value="title">Title</MenuItem>
          <MenuItem value="createdAt">Created At</MenuItem>
          <MenuItem value="user">User</MenuItem>
        </Select>

        {loading ? <p>Loading...</p> : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(post => (
                <TableRow key={post.id}>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.user}</TableCell>
                  <TableCell>{post.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    );
  }
}