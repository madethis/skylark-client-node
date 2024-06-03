#!/usr/bin/env node

import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import { test, deviceReadingValues } from "./src/commands/index.js";

yargs(hideBin(process.argv))
  .option("host", {
    alias: "h",
    type: "string",
    description: "The host of the GraphQL server",
  })
  .option("token", {
    alias: "t",
    type: "string",
    description: "The access token for the GraphQL server",
  })
  .demandOption(["host", "token"])
  .command("test", "Test connection authentication", () => {}, test)
  .command(
    "device_reading_values",
    "Get the device reading values",
    (yargs) =>
      yargs
        .option("device", {
          alias: "d",
          type: "string",
          description: "The UUID of the device",
        })
        .option("input", {
          alias: "i",
          type: "string",
          description: "The input of the reading series",
        })
        .option("name", {
          alias: "n",
          type: "string",
          description: "The name of the reading series",
        })
        .option("from", {
          type: "string",
          description: "The start date of the reading values",
        })
        .option("to", {
          type: "string",
          description: "The end date of the reading values",
        })
        .coerce({
          from: Date.parse,
          to: Date.parse,
        })
        .demandOption(["device", "from", "to"]),
    deviceReadingValues,
  )
  .parse();
