import { defaultHttpClient, HttpClient } from "@bsv/sdk";
import { ChaintracksFetchApi } from "../Api/ChaintracksFetchApi";

export class ChaintracksFetch implements ChaintracksFetchApi {
  httpClient: HttpClient = defaultHttpClient();

  constructor() {
  }

  async download(url: string): Promise<Uint8Array> {
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

    return new Uint8Array(data)
  }

  async fetchJson<R>(url: string): Promise<R> {
    const requestJsonOptions = {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    }
    const response = await this.httpClient.request(url, requestJsonOptions)
    if (!response.ok) {
      throw new Error(`Failed to fetch JSON from ${url}: ${response.statusText}`);
    }
    return response.data as R;
  }
}