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
  const workSheetsFromFile = xlsx.parse(await fetchXlsxRemote(urls.icd10));
  return workSheetsFromFile[0].data
      .slice(1) // Remove header row
      .map(mapWorksheetRow)
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
