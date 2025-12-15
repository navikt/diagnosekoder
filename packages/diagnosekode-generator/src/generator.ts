import {type ICD10Diagnosekode, type ICPC2Diagnosekode, toIcd10Diagnosekode, toIcpc2Diagnosekode} from "@navikt/diagnosekoder";
import type {Urls} from "./config.ts";
import {
  type ICD10DownloadFormat,
  type ICPC2DownloadFormat,
  isICD10DownloadFormat, isICPC2DownloadFormat
} from "./DownloadFormat.ts";
import { processDownloaded } from "./processing.ts";

export async function generateICPC2(urls: Urls, validAfter: Date): Promise<ICPC2Diagnosekode[]> {
  const downloaded = await fetchJsonRemote(urls.icpc2)
  return processDownloaded(downloaded, validAfter)
      .map(toIcpc2Diagnosekode)
}

export async function generateICD10(urls: Urls, validAfter: Date): Promise<ICD10Diagnosekode[]> {
  const downloaded = await fetchJsonRemote(urls.icd10);
  return processDownloaded(downloaded, validAfter)
      .map(toIcd10Diagnosekode);
}

async function fetchJsonRemote(url: string): Promise<ICD10DownloadFormat[] | ICPC2DownloadFormat[]> {
  console.debug("Fetching json file", url);
  const result = await fetch(url);
  if (result.ok) {
    const json = await result.json();
    
    if (!Array.isArray(json)) {
      throw new Error(`Expected array in JSON response from ${url}, got: ${typeof json}`)
    }
    
    if (json.length === 0) {
      throw new Error(`Empty array returned from ${url}`)
    }

    if(json.every(isICD10DownloadFormat) || json.every(isICPC2DownloadFormat)) {
      return json;
    } else {
      throw new Error(`Unexpected json object format returned from ${url}`)
    }
    
  } else {
    throw new Error(`Unexpected response from "${url}": ${result.status} - ${result.statusText}`)
  }
}
