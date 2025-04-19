const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const bannerRoute = require("./routes/bannerRoute");
const serviceRoute = require('./routes/serviceRoute');
const titleDescribeServiceRoute = require("./routes/title_describe_Service_route");
const branchRoute = require('./routes/branchRoute');
const messageRoute = require('./routes/messageRoute');
const menuRoute = require("./routes/menuRoute");
const reviewRoute = require('./routes/reviewRoute');

const port = 5000;

dotenv.config();
const app = express();
// Enable CORS for all routes
app.use(cors({
    origin: [ 'https://coffeehouse-1.onrender.com','https://coffeehouse-4yii.onrender.com','http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  }));
  
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/api/banner", bannerRoute);
app.use("/uploads", express.static("uploads"));
app.use('/api/service', serviceRoute);
app.use("/api/service/title-describe", titleDescribeServiceRoute);
app.use('/api/admin/branches', branchRoute);
app.use('/api/admin/messages', messageRoute);
app.use("/api/menu", menuRoute);
app.use('/api/reviews', reviewRoute);


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));

// Example Route
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
