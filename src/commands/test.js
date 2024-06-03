import { gql } from "graphql-request";
import { Client } from "../client.js";

export async function test(argv) {
  const client = new Client(argv.host, argv.token);

  const result = await client.request(gql`
    query SkylarkClientTest {
      me {
        name
      }
    }
  `);

  const name = result?.me?.name;

  if (!name) {
    console.error("Failed to authenticate, please check your token");
    return;
  }

  console.log("All good! You are authenticated as", name);

  const device = client.device("0000-2022-0109-2210");

  const title = await device.title();
  console.log("Device title:", title);
}
