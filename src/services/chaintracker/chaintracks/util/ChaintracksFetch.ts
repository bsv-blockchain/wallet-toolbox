import { defaultHttpClient, HttpClient } from "@bsv/sdk";
import { ChaintracksFetchApi } from "../Api/ChaintracksFetchApi";

export class ChaintracksFetch implements ChaintracksFetchApi {
  httpClient: HttpClient = defaultHttpClient();

  constructor() {
  }

  async download(url: string): Promise<number[]> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to download from ${url}: ${response.statusText}`);
    }

    const data = await response.arrayBuffer();

    return Array.from(new Uint8Array(data));
  }
}