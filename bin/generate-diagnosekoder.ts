import xlsx from "node-xlsx";
import { icpc2ProcessCodes } from "./icpc2processCodes";

const xlsxs = {
  icd10:
    "https://www.ehelse.no/kodeverk-og-terminologi/ICD-10-og-ICD-11/_/attachment/inline/4d2b7160-407d-417a-b848-112002cc025c:4246e4ef5745de04307a4d5ae3a2a23dd23dc47f/Kodeliste%20ICD-10%202023%20oppdatert%2013.12.22.xlsx",
  icpc2:
    "https://www.ehelse.no/kodeverk-og-terminologi/ICPC-2/_/attachment/inline/bfa952b9-fbb5-49fe-963b-27024d573e71:3cdfa328cb7f9333a6707bb3bc079ce9d423174f/Fil%202%202023%20-%20ICPC-2%20teknisk%20koderegister%20med%20prosesskoder,%20fulltekst%20og%2060%20tegn%20tekst%20(kun%20en%20linje%20per%20kode)%20(Excel).xlsx",
};

await Promise.all([(generateICD10(), generateICPC2())]);

async function generateICPC2(): Promise<void> {
  const workSheetsFromFile = xlsx.parse(await fetchXlsxRemote(xlsxs.icpc2));
  const icpc2 = workSheetsFromFile[0].data
    .slice(1)
    .map(mapWorksheetRow)
    .filter(
      (item) =>
        item.code && item.text && !icpc2ProcessCodes.includes(item.code),
    );

  console.info("info - Writing ICPC2.json");
  Bun.write("koder/ICPC2.json", JSON.stringify(icpc2));
  console.info("info - ICPC2.json OK");
}

async function generateICD10(): Promise<void> {
  const workSheetsFromFile = xlsx.parse(await fetchXlsxRemote(xlsxs.icd10));
  const icd10 = workSheetsFromFile[0].data
    .slice(1)
    .map(mapWorksheetRow)
    .filter((item) => item.code && item.text);
  console.info("info - Writing ICD10.json");
  Bun.write("koder/ICD10.json", JSON.stringify(icd10));
  console.info("info - ICD10.json OK");
}

function mapWorksheetRow(row: string[]) {
  return {
    code: row[0],
    // Third column is text limited to 60 characters
    text: row[2],
  };
}

async function fetchXlsxRemote(url: string): Promise<ArrayBuffer> {
  console.info("info - Fetching xlsx file", url);
  const result = await fetch(url);
  if (!result.ok || result.body == null) {
    console.error(
      "ERROR - Unable to fetch xlsx file",
      url,
      result.status,
      result.statusText,
    );
    process.exit(1);
  }

  console.info("info - Fetched ok", url);
  return result.arrayBuffer();
}
