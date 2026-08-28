import { describe, expect, it } from 'vitest';
import { parseBom, statusFor, type BomLine, type Part } from './domain';

describe('BOM comparison', () => {
  const line: BomLine = { id:'l', part:'10k resistor', value:'1/4W', needed:8, substitute:'', note:'' };
  const parts: Part[] = [{ id:'p', name:'10K RESISTOR', value:'1/4w', quantity:6, bin:'A1', note:'' }];
  it('matches names and values without case sensitivity', () => expect(statusFor(parts, line)).toEqual({ stocked:6, shortage:2, ready:false }));
  it('reads a CSV BOM with an optional header', () => expect(parseBom('part,value,quantity\nESP32,DevKit,2')).toEqual([{ part:'ESP32', value:'DevKit', needed:2, substitute:'', note:'' }]));
});
