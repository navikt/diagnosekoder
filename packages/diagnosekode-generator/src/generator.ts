import xlsx from "node-xlsx";
import {icpc2ProcessCodes} from "./icpc2processCodes.js";
import {ICD10Diagnosekode, ICPC2Diagnosekode, toIcd10Diagnosekode, toIcpc2Diagnosekode} from "@navikt/diagnosekoder";
import {toDiagnosekode} from "@navikt/diagnosekoder";
import type {Urls} from "./config.js";

export async function generateICPC2(urls: Urls): Promise<ICPC2Diagnosekode[]> {
  const workSheetsFromFile = xlsx.parse(await fetchXlsxRemote(urls.icpc2));
  return workSheetsFromFile[0].data
      .slice(1)
      .map(mapWorksheetRow)
      .filter(row => row?.code?.length && row?.text?.length) // Remove empty rows
      .map(toDiagnosekode)
      .filter( (item) => !icpc2ProcessCodes.includes(item.code) )
      .map(toIcpc2Diagnosekode)
}

export async function generateICD10(urls: Urls): Promise<ICD10Diagnosekode[]> {
  const jsonData = await fetchJsonRemote(urls.icd10);
  return jsonData
      .map(mapJsonItem)
      .filter(row => row?.code?.length && row?.text?.length) // Remove empty rows
      .map(toDiagnosekode)
      .map(toIcd10Diagnosekode)
}

function mapWorksheetRow(rowColumns: string[]): {code?: string, text?: string} {
  return {
    code: rowColumns[0],
    // Third column is text limited to 60 characters
    text: rowColumns[2],
  };
}

function mapJsonItem(item: any): {code?: string, text?: string} {
  // Handle different possible JSON structures
  return {
    code: item.code || item.kode || item.Code || item.Kode,
    text: item.text || item.tekst || item.Text || item.Tekst || item.term || item.Term,
  };
}

async function fetchXlsxRemote(url: string): Promise<ArrayBuffer> {
  console.debug("Fetching xlsx file", url);
  const result = await fetch(url);
  if (result.ok) {
    const buffer = await result.arrayBuffer()
    if (buffer.byteLength < 10) {
      throw new Error(`Empty response returned from ${url}`)
    }
    const contentType = result.headers.get("Content-Type");
    if (contentType === null || !contentType.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
      console.warn(`Unexpected content type of downloaded file: ${contentType} (${url})`)
    }
    console.debug(`Xlsx file fetched (${buffer.byteLength} bytes)`)
    return buffer;
  } else {
    throw new Error(`Unexpected response from "${url}": ${result.status} - ${result.statusText}`)
  }
}

async function fetchJsonRemote(url: string): Promise<any[]> {
  console.debug("Fetching json file", url);
  const result = await fetch(url);
  if (result.ok) {
    const json = await result.json();
    if (!json) {
      throw new Error(`Empty response returned from ${url}`)
    }
    const contentType = result.headers.get("Content-Type");
    if (contentType === null || !contentType.includes("application/json")) {
      console.warn(`Unexpected content type of downloaded file: ${contentType} (${url})`)
    }
    
    // Handle different possible JSON structures
    let data = json;
    if (json.data) {
      data = json.data;
    } else if (json.codes) {
      data = json.codes;
    } else if (json.items) {
      data = json.items;
    } else if (json.codeSystem) {
      data = json.codeSystem;
    }
    
    if (!Array.isArray(data)) {
      throw new Error(`Expected array in JSON response from ${url}, got: ${typeof data}`)
    }
    
    console.debug(`Json file fetched (${data.length} items)`)
    return data;
  } else {
    throw new Error(`Unexpected response from "${url}": ${result.status} - ${result.statusText}`)
  }
}
