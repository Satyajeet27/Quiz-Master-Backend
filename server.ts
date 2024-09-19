import app from "./src";
import connectDB from "./src/config/db.config";
import dotenv from "dotenv";

dotenv.config();

connectDB();

const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server running on port: ", port);
});
