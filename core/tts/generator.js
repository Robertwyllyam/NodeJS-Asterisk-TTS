import { PowerShell } from "node-powershell";
import moment from "moment";
import ffmpeg from "fluent-ffmpeg";
import { convertAudioToGSM } from "../codec/converter.js";
import { config } from "dotenv";
config();

const { AUDIO_OUTPUT_BASE_PATH } = process.env;

export async function createTts(fileName, description) {
  const data = moment().format("DD.MM.yyyy.HH.mm.ss");
  const name = fileName + "-" + data;
  const command = `
  
      Add-Type -AssemblyName System.speech
      $speak = New-Object System.Speech.Synthesis.SpeechSynthesizer
      $speak.SetOutputToWaveFile('${AUDIO_OUTPUT_BASE_PATH}\\${name}.wav')
      $speak.Speak('${description}')
      $speak.dispose()

  `;

  const posh = new PowerShell({
    executableOptions: { "-WindowStyle": "hidden" },
    inputEncoding: "utf-8",
    outputEncoding: "utf-8",
  });

  const run = await posh.invoke(command);
  const error = run.hadErrors;
  if (error) {
    await posh.dispose();
    throw new Error(
      "There was an error while creating the tts file : " + error.toString()
    );
  }

  try {
    const filePath = await convertAudioToGSM(name);
    return filePath;
  } catch (error) {
    throw new Error("Error during conversion..." + error);
  } finally {
    await posh.dispose();
  }
}
