import { GraphQLClient } from "graphql-request";
import { Device } from "./device.js";

export class Client {
  constructor(host, accessToken) {
    this.host = host;
    this.accessToken = accessToken;
    this.graphQLClient = new GraphQLClient(`${this.host}/api/graphql`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
  }

  async request(document, variables) {
    return this.graphQLClient.request(document, variables);
  }

  device(uuid) {
    return new Device(this, uuid);
  }
}
