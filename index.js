const express = require("express"),
  morgan = require("morgan");
const app = express();
const bodyParser = require("body-parser"),
  methodOverride = require("method-override");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(methodOverride());

app.use(morgan("common"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

let users = [
  {
    id: 1,
    Username: "Kevin Packer",
    Password: "1234",
    Email: "kevinpackerdesign@gmail.com",
    Birthday: "07/01/1989",
    FavoriteMovies: [],
  },
  {
    id: 2,
    Username: "Jasmine Magsaysay",
    Password: "5678",
    Email: "jasminesfca@gmail.com",
    Birthday: "08/25/1991",
    FavoriteMovies: [],
  },
  {
    id: 3,
    Username: "Daniel Packer",
    Password: "5555",
    Email: "packerdaniel@yahoo.com",
    Birthday: "05/09/1985",
    FavoriteMovies: [],
  },
];

let movies = [
  {
    id: 1,
    Title: "Mortal Kombat",
    Description:
      "MMA fighter Cole Young seeks out Earth's greatest champions in order to stand against the enemies of Outworld in a high stakes ballted for the universe",
    Genre: {
      Name: "Action",
      Description:
        "Action film is a film genre in which the protagonist or protagoninst are thrust into a series of events that typically include violence, extended fighting, physical feats, rescues and grantic chases",
    },
    Director: {
      Name: "Simon McQuoid",
      Bio:
        "Simon McQuoid is an Australian filmmaker, best known for the 2021 reboot of Mortal Kombat. McQuoid's background was in direction commercials",
      Birth: "1984",
      Death: "----",
    },
    ImagePath:
      "https://www.catholicnews.com/wp-content/uploads/custom/20210422T1130-MOVIE-REVIEW-MORTAL-KOMBAT-1246434.jpg",
    Featured: true,
  },
  {
    Title: "Justice League Snyder's cut",
    Description:
      "Fueled by his restored faith in humanity and inspired by Superman's selfless act, Bruce Wayne enlists newfound ally Diana Prince to face an even greater threat. Together Batman and WonderWoman work quickly to recruit a team to stand against this newly awakened enemy. Despite the formation of an unprescedented league of heroes it may be too late to save the planet from an assault of catastrophic proportions.",
    Genre: {
      Name: "Action",
      Description:
        "Action film is a film genre in which the protagonist or protagoninst are thrust into a series of events that typically include violence, extended fighting, physical feats, rescues and grantic chases",
    },
    Director: {
      Name: "Zack Snyder",
      Bio:
        "Zachary Edward Snyder is an American file director, producer and screenwriter. He made is feature film debut in 2004 with a remake of the 1978 horror film 'Dawn of the Dead'",
      Birth: "1966",
      Death: "----",
    },
    ImagePath:
      "https://images-na.ssl-images-amazon.com/images/I/71SS6iqW3ML._AC_SL1500_.jpg",
    Featured: true,
  },
  {
    Title: "Empire Records",
    Description:
      "Joe runs Empire Records, an independent Delaware store that emplots a tight-knit group of music-savvy youths. Hearing that the shop may be sold to a big chain, slacker employee Lucas bets a chunk of the store's money hoping to get a big return. When this plan fails, Empire Records falls into serious trouble, and the various other clerks, including lovely Corey and gloomy Deb, must deal with the problem, among many other issues.",
    Genre: {
      Name: "Comedy",
      Description:
        "A comedy film is a category of film in which the main emphasis is on humor. These films are designed to make the audience laugh through amusement and most often work by exaggeration characteristics of humorous effect. Films is this style traditionally have a happy ending.",
    },
    Director: {
      Name: "Allan Moyle",
      Bio:
        "Allan Moyle is a Canadian film director. He is best known for directing the films 'Pump Up the Volume' and 'Empire Records'",
      Birth: "1947",
      Death: "----",
    },
    ImagePath:
      "https://images-na.ssl-images-amazon.com/images/I/51kYOSFhjAL._AC_SY450_.jpg",
    Featured: false,
  },

  {
    Title: "Serenity",
    Description:
      "Set in 2517, Serenity is the story of the crew of Serenity, a 'Firefly-class' spaceship. The captain and first mate are veterans of the Unification War, having fought on the losing Independent side against the Alliance",
    Genre: {
      Name: "Action",
      Description:
        "Action film is a film genre in which the protagonist or protagoninst are thrust into a series of events that typically include violence, extended fighting, physical feats, rescues and grantic chases.",
    },
    Director: {
      Name: "Joss Whedon",
      Bio:
        "Joseph Hill Whedon is an American film director, producer, writer, and composer. He is the founder of Mutant Enemy Productions, co-founder of Bellwether Pictures, and is best known as the creator of several television series. These include Buffy the Vampire Slayer, Angle, Firefly, Dollhouse and Agents of S.H.I.E.L.D.",
      Birth: "1964",
      Death: "----",
    },
    ImagePath:
      "https://images-na.ssl-images-amazon.com/images/I/51EsHctpuHL._AC_.jpg",
    Featured: false,
  },
];

// GET requests
app.get("/", function (req, res) {
  res.send("Welcome to Flix Fix!");
});
app.get("/movies", function (req, res) {
  res.json(movies);
});
app.get("/movies/:Title", (req, res) => {
  res.json(
    movies.find((movie) => {
      return movie.Title === req.params.Title;
    })
  );
});
app.get("/movies/director/:Name", (req, res) => {
  res.json(
    movies.find((movie) => {
      return movie.Director.Name === req.params.Name;
    })
  );
});

app.get("/movies/genres/:Name", (req, res) => {
  res.json(
    movies.find((movie) => {
      return movie.Genre.Name === req.params.Name;
    })
  );
});
//User endpoints
app.get("/users", function (req, res) {
  res.json(users);
});
//adds user
app.post("/users", (req, res) => {
  res.status(500).send("User added!");
});

//updates user information
app.put("/users/:Username", (req, res) => {
  res.json(
    users.find((user) => {
      return user.Username === req.params.Username;
    })
  );
});

app.get("/users/:Username", (req, res) => {
  res.json(
    users.find((user) => {
      return user.Username === req.params.Username;
    })
  );
});

//allows user to add movie to favorites
app.post("/users/:Username/favorites", (req, res) => {
  res.status(500).send("Succesfully added movie to favorites!");
});

//allows user to remove movie from favorites
app.delete("/users/:Username/favorites", (req, res) => {
  res.status(500).send("Successfully removed movie from favorites.");
});

//allows user to deregister
app.delete("/users/:Email", (req, res) => {
  res.status(500).send("User Deleted.");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

//error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
