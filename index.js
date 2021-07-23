const express = require("express"),
  morgan = require("morgan");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Models = require("./models.js");
const { check, validationResult } = require("express-validator");

const Movies = Models.Movie;
const Users = Models.User;
const cors = require("cors");
let allowedOrigins = ["http://localhost:8080", "http://testsite.com"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn’t found on the list of allowed origins
        let message =
          "The CORS policy for this application doesn’t allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);
let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

// mongoose.connect("mongodb://localhost:27017/myFlixDB", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

mongoose.connect(
  "mongodb+srv://kevinpacker:kevinpacker@cluster0.ghnpw.mongodb.net/myFlixDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

//express.static
//"documentation.html" file from public folder
app.use(express.static("public"));

//Morgan middleware function to log all requests
app.use(morgan("common"));
app.use(bodyParser.json());

//List of all movies
app.get("/", function (req, res) {
  res.send("Welcome to Flix Fix!");
});

app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    Movies.find()
      .then(function (movies) {
        res.status(201).json(movies);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//get information about a movie by title
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),

  function (req, res) {
    Movies.findOne({ Title: req.params.Title })
      .then(function (movies) {
        res.json(movies);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//get data about a director
app.get(
  "/movies/directors/:Name",
  passport.authenticate("jwt", { session: false }),

  function (req, res) {
    Movies.findOne({ "Director.Name": req.params.Name })
      .then(function (movies) {
        res.json(movies.Director);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//get data about a genre by name
app.get(
  "/movies/genres/:Name",
  passport.authenticate("jwt", { session: false }),

  function (req, res) {
    Movies.findOne({ "Genre.Name": req.params.Name })
      .then(function (movies) {
        res.json(movies.Genre);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//user endpoints
//get a list of users
app.get("/users", function (req, res) {
  Users.find()
    .then(function (users) {
      res.status(201).json(users);
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//get a user by username
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),

  function (req, res) {
    Users.findOne({ Username: req.params.Username })
      .then(function (user) {
        res.json(user);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//add user
/*We'll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthdate: Date
}*/

app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

//Update a user's info by username
/*We'll expect JSON in this format
{
  Username: String, (required)
  Password: String, (required)
  Email: String, (required)
  Birthday: Date
}*/
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),

  (req, res) => {
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }, //This Line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Delete a user by username
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),

  function (req, res) {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then(function (user) {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found.");
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Add a movie to a user's list of favorites
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),

  function (req, res) {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $push: { FavoriteMovies: req.params.MovieID } },
      { new: true }, //This line makes sure the updated document is returned
      function (err, updatedUser) {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//delete movie from user's list of favorites
app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),

  function (req, res) {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true },
      function (err, updatedUser) {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
