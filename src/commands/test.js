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
}
