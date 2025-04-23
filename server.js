const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const chokidar = require("chokidar");
const { exec } = require("child_process");
const path = require("path");

// Route imports
const bannerRoute = require("./routes/bannerRoute");
const serviceRoute = require("./routes/serviceRoute");
const titleDescribeServiceRoute = require("./routes/title_describe_Service_route");
const branchRoute = require("./routes/branchRoute");
const messageRouteModule = require("./routes/messageRoute");
const authRoute = require("./routes/authRoute");
const menuRoute = require("./routes/menuRoute");
const reviewRoute = require("./routes/reviewRoute");
const userRoute = require("./routes/userRoute");

// Load environment variables
dotenv.config();

const app = express();
const httpServer = http.createServer(app);

// Middleware
app.use(cors({
  origin: [
    'https://frontend-production-b728.up.railway.app',
    'https://coffeehouse-4yii.onrender.com',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());

// Static files
app.use("/uploads", express.static("uploads"));

// API routes
app.use("/api/banner", bannerRoute);
app.use("/api/service", serviceRoute);
app.use("/api/service/title-describe", titleDescribeServiceRoute);
app.use("/api/admin/branches", branchRoute);
app.use("/api/admin/messages", messageRouteModule.router);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/menu", menuRoute);
app.use("/api/reviews", reviewRoute);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: [
      'https://frontend-production-b728.up.railway.app',
      'https://coffeehouse-4yii.onrender.com',
      'http://localhost:5173'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  }
});
messageRouteModule.setSocketIO(io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// File watcher for auto-pushing to GitHub
const uploadsDir = path.join(__dirname, "uploads");
let pushTimeout = null;
const debounceDelay = 5000;

function gitPushChanges() {
  console.log("Detected changes. Preparing to push to GitHub...");

  exec('git config user.name "sagarr" && git config user.email "sgrgrg34@gmail.com"', { cwd: __dirname }, (err) => {
    if (err) return console.error("Git config error:", err);

    exec("git add .", { cwd: __dirname }, (err) => {
      if (err) return console.error("Git add error:", err);

      exec('git commit -m "Auto commit: uploads changed"', { cwd: __dirname }, (err, stdout, stderr) => {
        if (err) {
          if (stderr.includes("nothing to commit")) {
            return console.log("No changes to commit.");
          }
          return console.error("Git commit error:", err);
        }

        exec("git push", { cwd: __dirname }, (err) => {
          if (err) return console.error("Git push error:", err);
          console.log("Changes pushed to GitHub.");
        });
      });
    });
  });
}

const watcher = chokidar.watch(uploadsDir, {
  persistent: true,
  ignoreInitial: true
});

watcher
  .on("add", (filePath) => {
    console.log(`File added: ${filePath}`);
    clearTimeout(pushTimeout);
    pushTimeout = setTimeout(gitPushChanges, debounceDelay);
  })
  .on("change", (filePath) => {
    console.log(`File changed: ${filePath}`);
    clearTimeout(pushTimeout);
    pushTimeout = setTimeout(gitPushChanges, debounceDelay);
  })
  .on("unlink", (filePath) => {
    console.log(`File removed: ${filePath}`);
    clearTimeout(pushTimeout);
    pushTimeout = setTimeout(gitPushChanges, debounceDelay);
  });

console.log(`Watching for changes in ${uploadsDir}...`);

// Default route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
