import { IncomingMessage, ServerResponse } from 'http';

let hobbiesDB = [{
  id: 'user1',
  hobbies: [],
}];

export const routeHobbies = (req: IncomingMessage, res: ServerResponse) => {
  const hobbiesUrl = req.url?.match("^/users/([a-z0-9_-]*)/hobbies$");
  const userId = hobbiesUrl[1];
  console.log(userId);

  if (req.method === "GET") {
      if (hobbiesUrl) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "max-age=3600, private");
        res.end(JSON.stringify((hobbiesDB.find(({id}) => id === userId))));
        return;
      }
    }
  
    if (req.method === "PATCH" && hobbiesUrl) {
      let body = "";
      console.log("Hobbies update");

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        console.log("Add new hobbies");
        const newHobbies = JSON.parse(body).hobbies;
        if ( hobbiesDB.find(({ id }) => id === userId)) {
          hobbiesDB = hobbiesDB.map(({id, hobbies}) => ({
            id,
            hobbies: id === userId ? [...hobbies, ...newHobbies] : [...hobbies],
          }))
        } else {
          hobbiesDB.push({id: userId, hobbies: []});
        }
      });

      res.statusCode = 201;
      res.end("Hobbies updated successfully");
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: `User with id ${userId} doesn't exist` }));
}
