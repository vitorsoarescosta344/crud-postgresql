import express from "express";
import cors from "cors";
import route from "./src/Routes";

const PORT = process.env.PORT || 3030;
const app = express();

app.use(cors());
app.use(express.json());

app.use(route);

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
