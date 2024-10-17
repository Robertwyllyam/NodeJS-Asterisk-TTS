import express from "express";
import { createTts } from "./core/tts/generator.js";
import { createCall } from "./core/calls/caller.js";
const PORT = 3000;
const app = express();
import { config } from "dotenv";
config();

const { AUDIO_OUTPUT_BASE_PATH } = process.env;

function timeLog(msg, ...args) {
  console.log(new Date().toLocaleString("pt-br"), msg, args);
}

app.use(express.json());
app.use(express.static(AUDIO_OUTPUT_BASE_PATH));

app.use((req, res, next) => {
  timeLog(`[${req.method}] - ${req.url}`);
  timeLog(req.body);
  return next();
});

app.post("/tts", async (req, res) => {
  const { name, description } = req.body;

  console.log("converting file");
  const fileName = await createTts(name, name + " " + description);
  console.log("file", fileName);
  await createCall("6002", 6001, { fileName });
  return res.send("OK");
});

app.listen(PORT, () => {
  timeLog("Iniciado na porta", PORT);
});
