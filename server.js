const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const bannerRoute = require("./routes/bannerRoute");
const serviceRoute = require('./routes/serviceRoute');
const titleDescribeServiceRoute = require("./routes/title_describe_Service_route");
const branchRoute = require('./routes/branchRoute');
const messageRouteModule = require('./routes/messageRoute');
const authRoute = require('./routes/authRoute');
const menuRoute = require("./routes/menuRoute");
const reviewRoute = require('./routes/reviewRoute');
const userRoute = require('./routes/userRoute');
const aboutRoute = require('./routes/aboutRoute');
const teamRoute = require('./routes/teamRoute');
const faqRoute = require('./routes/faqRoute');
const careerRoute = require('./routes/careerRoute');
const uploadRoute = require('./routes/uploadRoute');

const port = 5000;

dotenv.config();
const app = express();
// Enable CORS for all routes
app.use(cors({
    origin: [ 'https://frontend-production-b728.up.railway.app','http://localhost:5000','http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true
  }));
  
// Middleware
// app.use(cors());  // Removed duplicate cors middleware call
app.use(bodyParser.json());
app.use("/api/banner", bannerRoute);
app.use("/uploads", express.static("uploads"));
app.use('/api/service', serviceRoute);
app.use("/api/service/title-describe", titleDescribeServiceRoute);
app.use('/api/admin/branches', branchRoute);
app.use('/api/admin/messages', messageRouteModule.router);
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);

app.use("/api/menu", menuRoute);
app.use('/api/reviews', reviewRoute);
app.use("/api/about", aboutRoute);
app.use('/api/team', teamRoute);
app.use('/api/faqs', faqRoute);
app.use('/api/careers', careerRoute);
app.use('/api/upload', uploadRoute);

const trainingRoute = require('./routes/trainingRoute');
const studentSuccessStoryRoute = require('./routes/studentSuccessStoryRoute');
const eventRoute = require('./routes/eventRoute');
app.use('/api/trainings', trainingRoute);
app.use('/api/student-success-stories', studentSuccessStoryRoute);
app.use('/api/events', eventRoute);

// Create HTTP server and wrap Express app
const httpServer = http.createServer(app);

// Initialize Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: [ 'https://frontend-production-b728.up.railway.app','http://localhost:5000','http://localhost:5173','https://coffeehouse-1.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  }
});

// Pass io instance to messageRoute to enable socket event emitting
messageRouteModule.setSocketIO(io);

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));

// Example Route
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// Start the HTTP server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
