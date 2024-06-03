# Skylark LIVE Client

**Warning: This is very much work in progress**

This is a client for the Skylark LIVE GraphQL API, used as a CLI tool or library for interacting with the API.

Currently only a very few features and CLI commands exists.

## Installation

Currently this is not published to npm, so you need to clone the repository

```bash
git clone git@github.com:madethis/skylark-client-node.git
cd skylark-client-node
npm install
```

## Library Usage

A Client class is exported from the library, which can be used to interact with the API.

## CLI Usage

```bash
node cli.js --help
```

### Command: test

Can be used to verify a authenticated connection to the API.

A personal access token can be generated from the documentation section in the Skylark Live admin interface.

```bash
node cli.js \
  --host "https://admin.skylark.live" \
  --token "xxx" \
  test
```

### Command: device_reading_values

Can be used to fetch device reading values for a specific device, either for specific series, or from all series.

Readings are written to files in CSV format as they are fetched.

```bash
node cli.js \
  --host "https://admin.skylark.live" \
  --token "xxx" \
  --device "0000-0000-0000-0000" \
  --from "2024-05-01T00:00:00Z" \
  --to "2020-06-01T00:00:00Z" \
  device_reading_values
```

Or only series for a specific input / name

```bash
node cli.js \
  --host "https://admin.skylark.live" \
  --token "xxx" \
  --device "0000-0000-0000-0000" \
  --input "input1" \
  --from "2024-05-01T00:00:00Z" \
  --to "2020-06-01T00:00:00Z" \
  device_reading_values
```

```bash
node cli.js \
  --host "https://admin.skylark.live" \
  --token "xxx" \
  --device "0000-0000-0000-0000" \
  --name "temperature" \
  --from "2024-05-01T00:00:00Z" \
  --to "2020-06-01T00:00:00Z" \
  device_reading_values
```
