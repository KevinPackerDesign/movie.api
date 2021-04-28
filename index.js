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

let topMovies = [
  {
    Movie: "Mortal Kombat",
    Year: "2021",
    Director: "Simon McQuoid",
  },
  {
    Movie: "Justice League Snyder's cut",
    Year: "2021",
    Director: "Zack Snyder",
  },
  {
    Movie: "Empire Records",
    Year: "1995",
    Director: "Allan Moyle",
  },
  {
    Movie: "Con Air",
    Year: "1997",
    Director: "Simon West",
  },
  {
    Movie: "Face/Off",
    Year: "1997",
    Director: "John Woo",
  },
  {
    Movie: "Airheads",
    Year: "1994",
    Director: "Michael Lehmann",
  },
  {
    Movie: "Clerks",
    Year: "1994",
    Director: "Kevin Smith",
  },
  {
    Movie: "Star Wars",
    Year: "1977",
    Director: "George Lucas",
  },
  {
    Movie: "Lord of the Rings: Fellowship of the Ring",
    Year: "2002",
    Director: "Peter Jackson",
  },
  {
    Movie: "Serenity",
    Year: "2005",
    Director: "Joss Whedon",
  },
];

// GET requests
app.get("/", (req, res) => {
  res.send("Welcome to my movie club!");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

// listen for requests
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
