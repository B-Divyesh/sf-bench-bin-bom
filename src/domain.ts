export type Part = { id: string; name: string; value: string; quantity: number; bin: string; note: string; photo?: string };
export type BomLine = { id: string; part: string; value: string; needed: number; substitute: string; note: string };
export type Project = { id: string; name: string; notes: string; bom: BomLine[]; updatedAt: string };
export type AppState = { parts: Part[]; projects: Project[]; activeProjectId?: string };
export type LineStatus = { stocked: number; shortage: number; ready: boolean };

export const blankState = (): AppState => ({ parts: [], projects: [], activeProjectId: undefined });
export const makeId = () => crypto.randomUUID();
export const normalize = (value: string) => value.trim().toLocaleLowerCase();
export const matchesPart = (part: Part, line: BomLine) =>
  normalize(part.name) === normalize(line.part) && (!line.value || normalize(part.value) === normalize(line.value));
export const stockFor = (parts: Part[], line: BomLine) =>
  parts.filter((part) => matchesPart(part, line)).reduce((sum, part) => sum + part.quantity, 0);

/** Allocate every physical item once, in BOM order, so duplicate lines cannot reuse stock. */
export function allocateBom(parts: Part[], lines: BomLine[]): LineStatus[] {
  const remaining = new Map(parts.map((part) => [part.id, part.quantity]));
  return lines.map((line) => {
    let stocked = 0;
    for (const part of parts) {
      if (!matchesPart(part, line) || stocked >= line.needed) continue;
      const available = remaining.get(part.id) ?? 0;
      const used = Math.min(available, line.needed - stocked);
      stocked += used;
      remaining.set(part.id, available - used);
    }
    const shortage = Math.max(0, line.needed - stocked);
    return { stocked, shortage, ready: shortage === 0 };
  });
}

export const statusFor = (parts: Part[], line: BomLine) => allocateBom(parts, [line])[0];
export const csvEscape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
export const partsCsv = (parts: Part[]) => ['name,value,quantity,bin,note']
  .concat(parts.map((part) => [part.name, part.value, part.quantity, part.bin, part.note].map(csvEscape).join(','))).join('\n');

/** RFC 4180-style rows, including escaped quotes, commas, and newlines inside quoted fields. */
export function parseCsv(raw: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  const finishField = () => { row.push(field.trim()); field = ''; };
  const finishRow = () => { finishField(); if (row.some((value) => value.length > 0)) rows.push(row); row = []; };
  for (let index = 0; index < raw.length; index += 1) {
    const character = raw[index];
    if (quoted) {
      if (character === '"' && raw[index + 1] === '"') { field += '"'; index += 1; }
      else if (character === '"') quoted = false;
      else field += character;
    } else if (character === '"') {
      if (field.trim()) throw new Error('A quote must start at the beginning of a CSV field.');
      quoted = true;
    } else if (character === ',') finishField();
    else if (character === '\n') finishRow();
    else if (character !== '\r') field += character;
  }
  if (quoted) throw new Error('A quoted CSV field is not closed.');
  if (field.length || row.length) finishRow();
  return rows;
}

function wholeNumber(value: string, minimum: number, rowNumber: number, label: string) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < minimum) {
    throw new Error(`Row ${rowNumber}: ${label} must be a whole number of ${minimum} or more.`);
  }
  return number;
}

function dataRows(raw: string) {
  const rows = parseCsv(raw);
  if (rows.length && /^(part|name)$/i.test(rows[0][0] || '')) rows.shift();
  if (!rows.length) throw new Error('Add at least one valid row.');
  return rows;
}

export function parseParts(raw: string): Omit<Part, 'id'>[] {
  return dataRows(raw).map((columns, index) => {
    const name = columns[0]?.trim();
    if (!name) throw new Error(`Row ${index + 1}: add a part name.`);
    return { name, value: columns[1] || '', quantity: wholeNumber(columns[2] || '', 0, index + 1, 'quantity'), bin: columns[3] || '', note: columns[4] || '', photo: undefined };
  });
}

export function parseBom(raw: string): Omit<BomLine, 'id'>[] {
  return dataRows(raw).map((columns, index) => {
    const part = columns[0]?.trim();
    if (!part) throw new Error(`Row ${index + 1}: add a part name.`);
    return { part, value: columns[1] || '', needed: wholeNumber(columns[2] || '', 1, index + 1, 'quantity'), substitute: columns[3] || '', note: columns[4] || '' };
  });
}

export const sampleState = (): AppState => {
  const projectId = 'sample-weather-node';
  return {
    parts: [
      { id: 'sample-esp32', name: 'ESP32 DevKit', value: 'USB-C', quantity: 2, bin: 'A1', note: 'Tested' },
      { id: 'sample-resistor', name: '10k resistor', value: '1/4W', quantity: 6, bin: 'A2', note: 'Metal film' },
      { id: 'sample-screw', name: 'M3 screw', value: '8 mm', quantity: 10, bin: 'C4', note: 'Socket head' },
    ],
    projects: [{ id: projectId, name: 'Workshop weather node', notes: 'A small temperature and humidity display for the workbench.', updatedAt: '2026-08-29T12:00:00.000Z', bom: [
      { id: 'sample-line-1', part: 'ESP32 DevKit', value: 'USB-C', needed: 1, substitute: '', note: '' },
      { id: 'sample-line-2', part: '10k resistor', value: '1/4W', needed: 8, substitute: 'Two 20k resistors in parallel', note: 'Pull-up resistors' },
      { id: 'sample-line-3', part: 'M3 screw', value: '8 mm', needed: 6, substitute: '', note: 'Front plate' },
      { id: 'sample-line-4', part: 'M3 screw', value: '8 mm', needed: 6, substitute: '', note: 'Rear plate' },
    ] }],
    activeProjectId: projectId,
  };
};
