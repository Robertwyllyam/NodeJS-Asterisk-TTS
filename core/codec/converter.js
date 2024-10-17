import ffmpeg from "fluent-ffmpeg";

import { config } from "dotenv";
config();

const { AUDIO_OUTPUT_BASE_PATH } = process.env;

export async function convertAudioToGSM(fileName) {
  const outputPath = `${AUDIO_OUTPUT_BASE_PATH}\\${fileName}.gsm`;
  const inputPath = `${AUDIO_OUTPUT_BASE_PATH}\\${fileName}.wav`;
  return new Promise((resolve, reject) => {
    const conversion = ffmpeg(inputPath)
      .audioFrequency(8000)
      .audioChannels(1)
      .audioCodec("libgsm")
      .output(outputPath);
    conversion.on("error", (error) => {
      return reject(error);
    });

    conversion.on("end", () => {
      return resolve(fileName + ".gsm");
    });

    conversion.run();
  });
}
