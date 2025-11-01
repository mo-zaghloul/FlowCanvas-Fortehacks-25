import "dotenv/config";
import express from "express";
import cors from "cors";
import executeRouter from "./api/execute";
import testExecuteRouter from "./api/test-execute";
import executeNodeRouter from "./api/test-node";
import sourceNodeRouter from "./api/source-node";
import harvestRouter from "./api/execute-harvest";
import { configureFlow } from "./flow/fclConfig";
const app = express();
const port = process.env.PORT ?? 8081;

app.use(cors({ origin: "http://localhost:8080" }));
app.use(express.json());
configureFlow("emulator"); // or "testnet"
app.use("/api/execute", executeRouter);
app.use("/api/test-execute", testExecuteRouter);
app.use("/api/test-node", executeNodeRouter);
app.use("/api/source-node", sourceNodeRouter);
app.use("/api/execute-harvest", harvestRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});