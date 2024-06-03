import { gql } from "graphql-request";

function splitIntoDates(from, to) {
  const dates = [];
  let after = from;
  let before = to;
  while (after < before) {
    let nextBefore = new Date(after.getTime() + 1000 * 60 * 60 * 24 - 1);
    if (nextBefore > before) {
      nextBefore = before;
    }
    dates.push([after, nextBefore]);
    after = new Date(after.getTime() + 1000 * 60 * 60 * 24);
  }
  return dates;
}

export class Device {
  constructor(client, uuid) {
    this.client = client;
    this.uuid = uuid;
  }

  async readingSeries(input = null, name = null) {
    const result = await this.client.request(
      gql`
        query SkylarkClientDeviceReadingSeries(
          $uuid: ID!
          $input: String
          $name: String
        ) {
          device(id: $uuid) {
            readingSeries(input: $input, name: $name) {
              id
              input
              name
              appInstance {
                id
              }
            }
          }
        }
      `,
      { uuid: this.uuid, input, name },
    );

    return result?.device?.readingSeries;
  }

  async *readingValues(seriesId, from, to) {
    const document = gql`
      query SkylarkClientDeviceReadingValues(
        $uuid: ID!
        $seriesId: ID!
        $after: ISO8601DateTime!
        $before: ISO8601DateTime!
      ) {
        device(id: $uuid) {
          readingSeriesById(id: $seriesId) {
            values(after: $after, before: $before, first: 1000) {
              nodes {
                ... on DeviceReadingValue {
                  time
                  value
                }
              }
              pageInfo {
                endCursor
              }
            }
          }
        }
      }
    `;

    const dates = splitIntoDates(from, to);

    for (const [after, before] of dates) {
      let cursor = after;
      let done = false;

      while (!done) {
        const variables = {
          uuid: this.uuid,
          seriesId,
          after: cursor.toISOString(),
          before: before.toISOString(),
        };

        if (after.getTime() > new Date().getTime()) {
          done = true;
        } else {
          const data = await this.client.request(document, variables);
          const page = data?.device?.readingSeriesById?.values;

          if (page) {
            cursor = new Date(page.pageInfo.endCursor);
            for (const value of page.nodes) {
              yield value;
            }

            if (page.nodes.length < 1000) {
              done = true;
            }
          } else {
            done = true;
          }
        }
      }
    }
  }
}
