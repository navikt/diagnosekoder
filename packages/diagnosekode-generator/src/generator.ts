import xlsx from "node-xlsx";
import {icpc2ProcessCodes} from "./icpc2processCodes.js";
import ICPC2Diagnosekode, {toIcpc2Diagnosekode} from "@navikt/diagnosekoder/ICPC2Diagnosekode";
import {toDiagnosekode} from "@navikt/diagnosekoder/Diagnosekode";
import ICD10Diagnosekode, {toIcd10Diagnosekode} from "@navikt/diagnosekoder/ICD10Diagnosekode";

const urls = {
  icd10:
    "https://www.ehelse.no/kodeverk-og-terminologi/ICD-10-og-ICD-11/_/attachment/inline/4d2b7160-407d-417a-b848-112002cc025c:4246e4ef5745de04307a4d5ae3a2a23dd23dc47f/Kodeliste%20ICD-10%202023%20oppdatert%2013.12.22.xlsx",
  icpc2:
    "https://www.ehelse.no/kodeverk-og-terminologi/ICPC-2/_/attachment/inline/bfa952b9-fbb5-49fe-963b-27024d573e71:3cdfa328cb7f9333a6707bb3bc079ce9d423174f/Fil%202%202023%20-%20ICPC-2%20teknisk%20koderegister%20med%20prosesskoder,%20fulltekst%20og%2060%20tegn%20tekst%20(kun%20en%20linje%20per%20kode)%20(Excel).xlsx",
};

export async function generateICPC2(): Promise<ICPC2Diagnosekode[]> {
  const workSheetsFromFile = xlsx.parse(await fetchXlsxRemote(urls.icpc2));
  return workSheetsFromFile[0].data
      .slice(1)
      .map(mapWorksheetRow)
      .filter(row => row?.code?.length && row?.text?.length) // Remove empty rows
      .map(toDiagnosekode)
      .filter( (item) => !icpc2ProcessCodes.includes(item.code) )
      .map(toIcpc2Diagnosekode)
}

export async function generateICD10(): Promise<ICD10Diagnosekode[]> {
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
