const express = require("express");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const cocktails = require("./routes/cocktails.js");
const ingredients = require("./routes/ingredients.js");
app.use("/api/", cocktails);
app.use("/api/cocktails", cocktails);
app.use("/api/ingredients", ingredients);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));