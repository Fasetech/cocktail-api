const express = require("express");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const router = require("./routes/router.js");
app.use("/api", router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));