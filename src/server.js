import { connect } from "./configs/database.js";
import app from "./app.js";
await connect();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("server is alive");
});
