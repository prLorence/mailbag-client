import axios from "axios";
import { config } from "./config";

export class Worker {
  public async sendMessage(
    into: string, inFrom: string, inSubject: string, inMessage: string
  ) : Promise<void> {
    await axios.post(`${config.serverAddress}/messages`, {
      to: into,
      from: inFrom,
      subject: inSubject,
      text: inMessage
    })
  }
}