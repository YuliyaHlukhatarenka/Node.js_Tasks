import * as http from "http";
import * as url from "url";
import { IncomingMessage, ServerResponse } from "http";
import { routeHobbies } from "./routes/hobbies";
import { routeUsers } from "./routes/users";

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    if (req.url?.includes("/hobbies")) {
        console.log("Route hobbies");
        return routeHobbies(req, res);
      }

      if (req.url?.match("^(/users)|(users/.*)$")) {
        console.log("Route users");
        return routeUsers(req, res);
      }
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Resource not found" }));
  }
);

const port = 8000;
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
