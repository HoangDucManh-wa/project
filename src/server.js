import { connect } from "./configs/database.js";
import app from "./app.js";
await connect();
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(
    `server is running on http://localhost:${port}/api/student-portal`,
  );
});
