import fs from "fs";
import { Client } from "../client.js";
import readLastLines from "read-last-lines";

export async function deviceReadingValues({
  host,
  token,
  device: uuid,
  input,
  name,
  from,
  to,
}) {
  const client = new Client(host, token);
  const device = client.device(uuid);

  from = new Date(from);
  to = new Date(to);

  const series = await device.readingSeries(input, name);
  console.log(`Found ${series.length} series, fetching readings...`);

  for (const s of series) {
    await fetchSeries(device, s, from, to);
  }
}

async function fetchSeries(device, series, from, to) {
  const seriesId = series.id;
  const input = series.input;
  const name = series.name;
  const appInstanceId = series.appInstance ? series.appInstance.id : null;

  console.log(
    `\nID:${seriesId} (${input}, ${name})${appInstanceId ? ` - App instance ${appInstanceId}` : ""}`,
  );
  const filename = `${device.uuid}-${input}-${name}-${appInstanceId ? `${appInstanceId}-` : ""}${from.toISOString()}-${to.toISOString()}.csv`;

  console.log(`Writing readings to ${filename}`);

  try {
    const lastLine = await readLastLines.read(filename, 1);

    try {
      const lastTime = lastLine.split(",")[0];
      const newFrom = new Date(Date.parse(lastTime) + 1);
      from = newFrom;
      console.log(
        `File already exists, continuing from ${newFrom.toISOString()}`,
      );
    } catch (error) {
      console.error("File already exists but couldn't read last line");
      throw error;
    }
  } catch (error) {
    // Ignore error, file probably doesn't exist
  }

  const stream = fs.createWriteStream(filename, {
    encoding: "utf8",
    flags: "a",
  });

  let numberOfReadings = 0;

  for await (const reading of device.readingValues(seriesId, from, to)) {
    numberOfReadings++;
    stream.write(`${reading.time},${reading.value}\n`);

    process.stdout.write(
      `Wrote ${numberOfReadings} reading${numberOfReadings !== 1 ? "s" : ""}\r`,
    );
  }

  console.log(
    `Wrote ${numberOfReadings} reading${numberOfReadings !== 1 ? "s" : ""}`,
  );

  stream.end();
}
