require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Routes
app.use("/api", require("./routes/upload"));
app.use("/api", require("./routes/interview"));
app.use("/api", require("./routes/exam"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
