import axios from "axios";

import { config } from "dotenv";
config();

const {
  ASTERISK_ARI_USER,
  ASTERISK_ARI_HOST,
  ASTERISK_ARI_PORT,
  ASTERISK_ARI_PASSWORD,
} = process.env;

export const ari = axios.create({
  baseURL: `http://${ASTERISK_ARI_HOST}:${ASTERISK_ARI_PORT}`,
  auth: { username: ASTERISK_ARI_USER, password: ASTERISK_ARI_PASSWORD },
});
