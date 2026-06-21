import fs from 'fs';

const tsFile = 'src/data.ts';
let tsContent = fs.readFileSync(tsFile, 'utf8');

const villasStr = fs.readFileSync('output_villas.json', 'utf8');

const searchStr = 'export const VILLA_DATA: Villa[] = [';
const insertStr = searchStr + '\n  ' + villasStr + ',';

tsContent = tsContent.replace(searchStr, insertStr);

fs.writeFileSync(tsFile, tsContent);
console.log('Injected successfully!');
