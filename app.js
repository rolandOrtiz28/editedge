const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const path = require('path');
const session = require('express-session');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/CatchAsync');
const nodemailer = require('nodemailer');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const mongoSanitize = require('express-mongo-sanitize');
const MongoDBStore = require("connect-mongo");
const axios = require('axios');
// const Subscriber = require('./model/Subscriber');


// Routes
const serviceRoute = require('./routes/services');
const quoteRoute = require('./routes/quotation');
const blogRoute = require('./routes/blogs');
const pricingRoute = require('./routes/Pricing');
const adminRoute = require('./routes/Admin');


// SECURITY
const helmet = require('helmet')
const Joi = require('joi');
const secret = process.env.SESSION_SECRET;
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/bluelightinnovations';
//
// Connect to MongoDB with extended timeout options
mongoose.connect(dbUrl, {
  serverSelectionTimeoutMS: 5000 // Adjust as needed
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});
const sessionConfig = {
    secret,
    name: '_bluelight',
    resave: false,
    saveUninitialized: true,
    store: MongoDBStore.create({
        mongoUrl: dbUrl,
        touchAfter: 24 * 3600 // time period in seconds
    }),
    cookie: {
        httpOnly: true,
        // secure: true, // Enable if using HTTPS
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

const frameSrcUrls = [
  "https://js.stripe.com/",
  "https://www.sandbox.paypal.com/",
  "https://www.facebook.com/",
  "https://my.spline.design/",
  "https://drive.google.com/",
  "https://accounts.google.com/",
];

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://cdn.jsdelivr.net/",
  "https://cdnjs.cloudflare.com/",
  "https://unpkg.com/",
  "https://kit.fontawesome.com/",
  "https://unpkg.com/@splinetool/viewer@1.9.48/build/spline-viewer.js",
  "https://unpkg.com/@splinetool/viewer@1.9.48/build/process.js",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://code.jquery.com/",
  "https://cdn.quilljs.com/" ,
  "https://cdn.ckeditor.com/" 
];

const styleSrcUrls = [
  "https://cdn.jsdelivr.net/",
  "https://fonts.googleapis.com/",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css",
  "https://cdnjs.cloudflare.com/",
  "https://kit-free.fontawesome.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://cdn.quilljs.com/"
];

const connectSrcUrls = [
  "https://unsplash.com/",
  "https://prod.spline.design/",
  "https://unpkg.com/",
  "https://ka-f.fontawesome.com/",
  "https://fonts.gstatic.com/",
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];

const imgSrcUrls = [
  "https://images.unsplash.com/",
  "https://app.spline.design/_assets/_icons/icon_favicon32x32.png",
  "https://cdn.jsdelivr.net/",
  "https://kit-free.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://res.cloudinary.com/" ,
  "https://media.istockphoto.com/" ,
  "https://plus.unsplash.com/" ,
  "https://mdbcdn.b-cdn.net/" ,
  
];

const fontSrcUrls = [
  "https://fonts.gstatic.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net/",
  "https://ka-f.fontawesome.com/"
];

const mediaSrcUrls = [
  "'self'",
  "https://res.cloudinary.com/",
  "https://drive.google.com/",
  "https://www.google.com/",
  "https://www.dropbox.com/",
  "https://dl.dropboxusercontent.com/" // Allow direct Dropbox links
];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      formAction: ["'self'"],
      frameSrc: ["'self'", ...frameSrcUrls],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", ...scriptSrcUrls],
      scriptSrcElem: ["'self'", "'unsafe-inline'", "'unsafe-eval'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      styleSrcElem: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: ["'self'", "blob:", "data:", ...imgSrcUrls],
      fontSrc: ["'self'", ...fontSrcUrls, "data:"],
      mediaSrc: [...mediaSrcUrls],
      "script-src-attr": ["'unsafe-inline'"], 
    },
  })
);


// Set EJS as the view engine

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));
app.use(session(sessionConfig));
app.use(mongoSanitize());
app.use('/uploads', express.static('uploads')); // ✅ Serve uploads as static

// ✅ Increase JSON and form data size limits
app.use(express.json({ limit: "50mb" }));  // ✅ Allows large JSON payloads
app.use(express.urlencoded({ limit: "50mb", extended: true })); // ✅ Allows large form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use('/stylesheet', express.static(path.join(__dirname, 'stylesheet')));
app.use(flash());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

const subscriptionSchema = Joi.object({
    email: Joi.string().email().required()
  });

const contactSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    subject: Joi.string().min(3).max(100).required(),
    message: Joi.string().min(5).max(1000).required()
  });

  app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});


  app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});
  app.get('/', (req, res) => {

    res.render('home/home', { currentRoute: '/' });
});
  app.get('/trial', (req, res) => {

    res.render('home/trial', { currentRoute: '/trial' });
});

// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// app.post('/generate-social', async (req, res) => {
//   const { topic } = req.body;
//   try {
//       const response = await axios.post('https://api.openai.com/v1/chat/completions', {
//           model: "gpt-4",
//           messages: [{ role: "user", content: `Generate an engaging social media post about: ${topic}` }]
//       }, {
//           headers: { 
//               'Authorization': `Bearer ${OPENAI_API_KEY}`,
//               'Content-Type': 'application/json'  // Add this line
//           }
//       });

//       res.json({ content: response.data.choices[0].message.content });
//   } catch (error) {
//       console.error("OpenAI API Error:", error.response?.data || error.message);  // Log the full error
//       res.status(500).json({ error: 'Error generating content', details: error.response?.data || error.message });
//   }
// });



// app.post('/generate-blog', async (req, res) => {
//   const { topic } = req.body;
//   try {
//       const response = await axios.post('https://api.openai.com/v1/chat/completions', {
//           model: "gpt-3.5-turbo",
//           messages: [{ role: "user", content: `Write a detailed blog post about: ${topic}` }]
//       }, {
//           headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
//       });

//       res.json({ content: response.data.choices[0].message.content });
//   } catch (error) {
//       res.status(500).send('Error generating content');
//   }
// });


app.post('/send', catchAsync(async (req, res) => {
  // Validate the request data against the schema
  const { error } = contactSchema.validate(req.body);
  
  if (error) {
    // Return an error message if validation fails
    return res.status(400).json({ message: "Invalid data provided.", error: error.details[0].message });
  }

  const { name, email, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `${email}`,
    to: process.env.GMAIL_EMAIL,
    subject: `New contact form submission: ${subject}`,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `
  };

  await transporter.sendMail(mailOptions);

  req.flash('success', 'Thank you for your message! We\'ll get back to you very soon.');
  res.redirect('/');
}));

app.use('/', serviceRoute)
app.use('/', quoteRoute)
app.use('/', blogRoute);
app.use('/', pricingRoute);
app.use('/admin', adminRoute);

const port = process.env.PORT || 3000;
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

server.keepAliveTimeout = 120000; // 120 seconds
server.headersTimeout = 120000;
