var express = require("express");
var bodyParser = require("body-parser");
var request = require("request");
var mongoose = require("mongoose");
var app = express();
var Student = require("./models/student");
var Club = require("./models/club");
var passport = require("passport");
// var LocalStrategy = require("passport-local");
const LocalStrategy = require("passport-local").Strategy;
var passportLocalMongoose = require("passport-local-mongoose");
var methodOverride = require("method-override");


const accountSid = '----';
const authToken = '---';
const client = require('twilio')(accountSid, authToken);


mongoose.connect('mongodb://localhost:27017/Publicize', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.use(require("express-session")({
  secret: "This the secret message for authentication",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use('student-signup', new LocalStrategy(Student.authenticate()));
passport.serializeUser(Student.serializeUser());
passport.deserializeUser(Student.deserializeUser());

passport.use('club-signup', new LocalStrategy(Club.authenticate()));
passport.serializeUser(Club.serializeUser());
passport.deserializeUser(Club.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});


// ----------------------------------------------
const fs = require("fs");

const multer = require("multer");
const OAuth2Data = require("./credentials.json");
var name, pic

const { google } = require("googleapis");


const CLIENT_ID = OAuth2Data.web.client_id;
const CLIENT_SECRET = OAuth2Data.web.client_secret;
const REDIRECT_URL = OAuth2Data.web.redirect_uris[0];

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);
var authed = false;

// If modifying these scopes, delete token.json.
const SCOPES =
  "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile";

app.set("view engine", "ejs");

var Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./images");
  },
  filename: function (req, file, callback) {
    // callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    callback(null, file.originalname);
  },
});

var upload = multer({
  storage: Storage,
}).single("file"); //Field name and max count


















// ----------------------------------------------






// ----------- Routes --------------------


//------------------------ Student Authentication Routes  ------------------------- 

app.get("/student_login", function (req, res) {
  res.render("student_login.ejs");
});
app.get("/student_signup", function (req, res) {
  res.render("student_signup.ejs");
});

app.post("/student_signup", function (req, res) {
  Student.register(
    new Student({
      username: req.body.username,
      name: req.body.name,
      year: req.body.year,
      clubs: req.body.clubs,
      phone: req.body.phone
    }),
    req.body.password, function (err, user) {

      if (err) {
        console.log(err);
      }
      passport.authenticate("student-signup")(req, res, function () {
        res.redirect("/");
      });
    });
});

app.post("/student_login", passport.authenticate("student-signup", {
  successRedirect: "/",
  failureRedirect: "/student_login"
}), function (req, res) {
});
app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

// ------------------------Student Authentication Ends ------------------------------




// --------------------- Club Authentication ----------------

app.get("/club_login", function (req, res) {
  res.render("club_login.ejs");
});
app.get("/club_signup", function (req, res) {
  res.render("club_signup.ejs");
});

app.post("/club_signup", function (req, res) {
  Club.register(
    new Club({
      username: req.body.username,
      name: req.body.name,
      description: req.body.description,
      phone: req.body.phone
    }),
    req.body.password, function (err, user) {

      if (err) {
        console.log(err);
      }
      passport.authenticate("club-signup")(req, res, function () {
        res.redirect("/");
      });
    });
});

app.post("/club_login", passport.authenticate("club-signup", {
  successRedirect: "/",
  failureRedirect: "/club_login"
}), function (req, res) {
});
app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

// --------------------- Club Authentication ends----------------




// ---------------------- Messaging Routes ----------------------

app.get("/club/message", function (req, res) {
  if (!authed) {
    // Generate an OAuth URL and redirect there
    var url = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
    console.log(url);
    console.log(location);
    console.log("YEH WALI LOCATION....")
    res.render("club_dashboard", { url: url });
  } else {
    var oauth2 = google.oauth2({
      auth: oAuth2Client,
      version: "v2",
    });
    oauth2.userinfo.get(function (err, response) {
      if (err) {
        console.log(err);
      } else {
        console.log(response.data);
        name = response.data.name
        pic = response.data.picture
        res.render("success", {
          name: response.data.name,
          pic: response.data.picture,
          success: false
        });
      }
    });
  }
  // res.render("club_dashboard.ejs");
});


app.post("/club/message/send", function (req, res) {
  Student.find({}, function (err, details) {
    if (err) {
      console.log(err);
    } else {
      console.log(req.body.url)
      details.forEach(function (info) {

        if (req.body.year.includes(info.year) && info.clubs.includes(req.user.username)) {
          client.messages
            .create({
              body: req.body.message,
              from: 'whatsapp:+14155238886',
              to: 'whatsapp:+91' + info.phone,
              mediaUrl: req.body.url
            })
            .then(message => console.log(message.sid))
            .done();
        }

      });
      res.redirect("/club/message");
    }
  });
});




// ---------------------- Messaging Routes End -----------------






app.get("/", function (req, res) {
  res.render("home.ejs");
});


// --------------------- SANJITCODES----------------------


// app.get("/", (req, res) => {

// });
var location;
app.post("/club/message/upload", (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.end("Something went wrong");
    } else {
      console.log(req.file.path);

      const drive = google.drive({ version: "v3", auth: oAuth2Client });

      const fileMetadata = {
        name: req.file.filename,
      };
      location = req.file.filename;
      const media = {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(req.file.path),
      };
      drive.files.create(
        {
          resource: fileMetadata,
          media: media,
          fields: "id",
        },
        (err, file) => {
          if (err) {
            // Handle error
            console.error(err);
          } else {
            // fs.unlinkSync(req.file.path)
            res.render("success", { name: name, pic: pic, success: true })
          }

        }
      );
    }
  });
});

app.get('/club/message/logout', (req, res) => {
  authed = false
  console.log("LOGOUT BOTTON LOGOUT BOTTON LOGOUT BOTTON LOGOUT BOTTON LOGOUT BOTTON LOGOUT BOTTON LOGOUT BOTTON LOGOUT BOTTON")
  res.redirect('/club/message')
})

app.get("/google/callback", function (req, res) {
  const code = req.query.code;
  if (code) {
    // Get an access token based on our OAuth code
    oAuth2Client.getToken(code, function (err, tokens) {
      if (err) {
        console.log("Error authenticating");
        console.log(err);
      } else {
        console.log("Successfully authenticated");
        console.log(tokens)
        oAuth2Client.setCredentials(tokens);


        authed = true;
        res.redirect("/club/message");
      }
    });
  }
});






//---------------------SANJITCODES ENDS----------------------

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

var port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log("Server Has Started!!");
});





