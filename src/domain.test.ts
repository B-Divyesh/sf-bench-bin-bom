import { describe, expect, it } from 'vitest';
import { allocateBom, parseBom, parseParts, partsCsv, statusFor, type BomLine, type Part } from './domain';

describe('BOM comparison', () => {
  const line: BomLine = { id:'l', part:'10k resistor', value:'1/4W', needed:8, substitute:'', note:'' };
  const parts: Part[] = [{ id:'p', name:'10K RESISTOR', value:'1/4w', quantity:6, bin:'A1', note:'' }];

  it('matches names and values without case sensitivity', () => {
    expect(statusFor(parts, line)).toEqual({ stocked:6, shortage:2, ready:false });
  });

  it('allocates shared stock once across duplicate BOM rows', () => {
    const stock: Part[] = [{ id:'screws', name:'M3 screw', value:'8 mm', quantity:10, bin:'C4', note:'' }];
    const lines: BomLine[] = [
      { id:'front', part:'M3 screw', value:'8 mm', needed:6, substitute:'', note:'' },
      { id:'rear', part:'M3 screw', value:'8 mm', needed:6, substitute:'', note:'' },
    ];
    expect(allocateBom(stock, lines)).toEqual([
      { stocked:6, shortage:0, ready:true },
      { stocked:4, shortage:2, ready:false },
    ]);
  });
});

describe('CSV parsing', () => {
  it('reads a BOM with an optional header', () => {
    expect(parseBom('part,value,quantity\nESP32,DevKit,2')).toEqual([
      { part:'ESP32', value:'DevKit', needed:2, substitute:'', note:'' },
    ]);
  });

  it('preserves quoted commas and all following columns', () => {
    expect(parseParts('Widget,"10k, 1%",2,A1,precision')).toEqual([
      { name:'Widget', value:'10k, 1%', quantity:2, bin:'A1', note:'precision', photo:undefined },
    ]);
  });

  it('rejects negative, fractional, and missing quantities', () => {
    expect(() => parseParts('Widget,10k,-5,A1,note')).toThrow('quantity must be a whole number of 0 or more');
    expect(() => parseParts('Widget,10k,1.5,A1,note')).toThrow('quantity must be a whole number');
    expect(() => parseBom('Widget,10k,,A1,note')).toThrow('quantity must be a whole number of 1 or more');
  });

  it('exports values as valid escaped CSV', () => {
    expect(partsCsv([{ id:'p', name:'Widget', value:'10k, 1%', quantity:2, bin:'A1', note:'called "precise"' }]))
      .toContain('"Widget","10k, 1%","2","A1","called ""precise"""');
  });
});
