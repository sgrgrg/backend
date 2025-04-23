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
const chokidar = require('chokidar');
const { exec } = require('child_process');
const path = require('path');

const port = 5000;

dotenv.config();
const app = express();
// Enable CORS for all routes
app.use(cors({
    origin: [ 'https://frontend-production-b728.up.railway.app','https://coffeehouse-4yii.onrender.com','http://localhost:5173'],
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

// Create HTTP server and wrap Express app
const httpServer = http.createServer(app);

// Initialize Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: [ 'https://frontend-production-b728.up.railway.app','https://coffeehouse-4yii.onrender.com','http://localhost:5173'],
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

// Watcher for uploads directory to auto push changes to GitHub
const uploadsDir = path.join(__dirname, 'uploads');
let pushTimeout = null;
const debounceDelay = 5000; // 5 seconds debounce

function gitPushChanges() {
  console.log('Detected changes in uploads. Preparing to push to GitHub...');
  exec('git add .', { cwd: __dirname }, (err, stdout, stderr) => {
    if (err) {
      console.error('Error during git add:', err);
      return;
    }
    exec('git commit -m "Auto commit: uploads changed"', { cwd: __dirname }, (err, stdout, stderr) => {
      if (err) {
        if (stderr.includes('nothing to commit')) {
          console.log('No changes to commit.');
        } else {
          console.error('Error during git commit:', err);
        }
        return;
      }
      exec('git push', { cwd: __dirname }, (err, stdout, stderr) => {
        if (err) {
          console.error('Error during git push:', err);
          return;
        }
        console.log('Successfully pushed changes to GitHub.');
      });
    });
  });
}

const watcher = chokidar.watch(uploadsDir, {
  persistent: true,
  ignoreInitial: true,
});

watcher
  .on('add', filePath => {
    console.log(`File added: ${filePath}`);
    if (pushTimeout) clearTimeout(pushTimeout);
    pushTimeout = setTimeout(gitPushChanges, debounceDelay);
  })
  .on('change', filePath => {
    console.log(`File changed: ${filePath}`);
    if (pushTimeout) clearTimeout(pushTimeout);
    pushTimeout = setTimeout(gitPushChanges, debounceDelay);
  })
  .on('unlink', filePath => {
    console.log(`File removed: ${filePath}`);
    if (pushTimeout) clearTimeout(pushTimeout);
    pushTimeout = setTimeout(gitPushChanges, debounceDelay);
  });

console.log(`Watching for changes in ${uploadsDir}...`);

// Example Route
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// Start the HTTP server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
