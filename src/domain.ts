export type Part = { id: string; name: string; value: string; quantity: number; bin: string; note: string; photo?: string };
export type BomLine = { id: string; part: string; value: string; needed: number; substitute: string; note: string };
export type Project = { id: string; name: string; notes: string; bom: BomLine[]; updatedAt: string };
export type AppState = { parts: Part[]; projects: Project[]; activeProjectId?: string };

export const blankState = (): AppState => ({ parts: [], projects: [], activeProjectId: undefined });
export const makeId = () => crypto.randomUUID();
export const normalize = (value: string) => value.trim().toLocaleLowerCase();
export const matchesPart = (part: Part, line: BomLine) =>
  normalize(part.name) === normalize(line.part) && (!line.value || normalize(part.value) === normalize(line.value));
export const stockFor = (parts: Part[], line: BomLine) => parts.filter((part) => matchesPart(part, line)).reduce((sum, part) => sum + part.quantity, 0);
export const statusFor = (parts: Part[], line: BomLine) => {
  const stocked = stockFor(parts, line); const shortage = Math.max(0, line.needed - stocked);
  return { stocked, shortage, ready: shortage === 0 };
};
export const csvEscape = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
export const partsCsv = (parts: Part[]) => ["name,value,quantity,bin,note"].concat(parts.map((part) => [part.name, part.value, part.quantity, part.bin, part.note].map(csvEscape).join(','))).join('\n');
export const parseBom = (raw: string): Omit<BomLine, 'id'>[] => raw.trim().split(/\r?\n/).filter(Boolean).map((line, index) => {
  const cols = line.split(',').map((item) => item.trim().replace(/^"|"$/g, ''));
  if (index === 0 && /part|name/i.test(cols[0] || '')) return null;
  const needed = Number(cols[2] ?? cols[1]);
  return { part: cols[0] || 'Unnamed part', value: Number.isFinite(needed) ? (cols[1] || '') : '', needed: Number.isFinite(needed) ? needed : Number(cols[1]) || 1, substitute: cols[3] || '', note: cols[4] || '' };
}).filter((line): line is Omit<BomLine, 'id'> => line !== null);
