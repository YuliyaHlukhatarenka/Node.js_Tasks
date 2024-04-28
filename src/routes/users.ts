import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuid } from "uuid";

const users = [];

export const routeUsers = (req: IncomingMessage, res: ServerResponse) => {
  if (req.method === "GET") {
    if (req.url?.match("^/users[/]?$")) {
      console.log("Get all users");
      res.statusCode = 200;
      res.setHeader("Cache-Control", "max-age=3600, public");
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(users));
      return;
    }

    const isGetUserById = req.url?.match("^/users/([a-z0-9_-]*)$");
    if (isGetUserById) {
      const userId = isGetUserById[1];
      console.log(`Get user with ID ${userId}`);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(users.find(({ id }) => id === userId)));
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Users not found" }));
  }

  if (req.method === "POST" && req.url === "/users") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      console.log("Add new user");
      const userInfo = JSON.parse(body);
      const id = uuid();
      console.log(id);
      users.push({
        id,
        ...userInfo.user,
        hobbies: [],
        links: {
          self: { method: "GET", path: `users/${id}` },
          update: { method: "PATCH", path: `users/${id}` },
          delete: { method: "DELETE", path: `users/${id}` },
          getHobbies: { method: "GET", path: `users/${id}/hobbies` },
        },
      });
    });

    res.statusCode = 201;
    res.end("User created successfully");
    return;
  }

  if (req.method === "DELETE" && req.url === "/users") {
    users.length = 0;
    res.statusCode = 204;
    res.end("User deleted successfully");
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: "User not found" }));
};

