interface SheetData {
  name: string;
  data: string[][];
}

interface XlsxWriterOptions {
  sheets: SheetData[];
  fileName?: string;
}

export class NanoXlsxWriter {
  constructor(options: XlsxWriterOptions) {
    this._sheets = options.sheets;
    this._fileName = options.fileName || 'output.xlsx';
  }

  private _generateContentTypes(): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  ${this._sheets.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}
</Types>`;
  }

  private _generateRels(): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;
  }

  private _generateWorkbook(): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    ${this._sheets.map((sheet, i) => `<sheet name="${sheet.name}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}
  </sheets>
</workbook>`;
  }

  private _generateWorkbookRels(): string {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${this._sheets.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')}
</Relationships>`;
  }

  private _generateSheet(sheetData: string[][]): string {
    // Determine the maximum number of columns
    const maxCols = Math.max(...sheetData.map((row) => row.length));
    const lastRow = sheetData.length;
    const lastColLetter = String.fromCharCode(64 + maxCols);
    const dimensionRef = `A1:${lastColLetter}${lastRow}`;
    const colsXml = maxCols > 0 ? `<cols>${Array.from({ length: maxCols }, (_, i) => `<col min="${i + 1}" max="${i + 1}" width="8.43" customWidth="1"/>`).join('')}</cols>` : '';

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="${dimensionRef}"/>
  <sheetFormatPr baseColWidth="10" defaultRowHeight="15"/>
  ${colsXml}
  <sheetData>
    ${sheetData.map((row, rowIndex) => {
    const paddedRow = [...row, ...Array(maxCols - row.length).fill('')];

    return `
        <row r="${rowIndex + 1}" spans="1:${maxCols}">
          ${paddedRow.map((cell, colIndex) => {
    const cellRef = String.fromCharCode(65 + colIndex) + (rowIndex + 1);
    // Escape special characters (basic XML escaping)
    const escapedCell = cell
      ? cell.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
      : '';

    return `<c r="${cellRef}"${escapedCell.trim() !== '' ? ' t="inlineStr"' : ''}>${escapedCell.trim() !== '' ? `<is><t>${escapedCell}</t></is>` : ''}</c>`;
  }).join('')}
        </row>`;
  }).join('')}
  </sheetData>
</worksheet>`;
  }

  private _stringToArrayBuffer(str: string): ArrayBuffer {
    const encoder = new TextEncoder();

    return encoder.encode(str).buffer;
  }

  private _createLocalFileHeader(fileName: string, data: ArrayBuffer): ArrayBuffer {
    const fileNameBuffer = new TextEncoder().encode(fileName);
    const crc = this._crc32(new Uint8Array(data));
    const header = new ArrayBuffer(30 + fileNameBuffer.length);
    const view = new DataView(header);
    view.setUint32(0, 0x04034b50, true); // Local file header signature
    view.setUint16(4, 20, true); // Version needed to extract
    view.setUint16(6, 0, true); // General purpose flags
    view.setUint16(8, 0, true); // Compression method (none)
    view.setUint16(10, 0, true); // Last mod file time
    view.setUint16(12, 0, true); // Last mod file date
    view.setUint32(14, crc, true); // CRC-32
    view.setUint32(18, data.byteLength, true); // Compressed size
    view.setUint32(22, data.byteLength, true); // Uncompressed size
    view.setUint16(26, fileNameBuffer.length, true); // File name length
    view.setUint16(28, 0, true); // Extra field length
    new Uint8Array(header).set(fileNameBuffer, 30); // File name

    return header;
  }

  private _createCentralDirectory(fileName: string, data: ArrayBuffer, offset: number): ArrayBuffer {
    const fileNameBuffer = new TextEncoder().encode(fileName);
    const crc = this._crc32(new Uint8Array(data));
    const header = new ArrayBuffer(46 + fileNameBuffer.length);
    const view = new DataView(header);
    view.setUint32(0, 0x02014b50, true); // Central directory signature
    view.setUint16(4, 20, true); // Version made by
    view.setUint16(6, 20, true); // Version needed to extract
    view.setUint16(8, 0, true); // General purpose flags
    view.setUint16(10, 0, true); // Compression method (none)
    view.setUint16(12, 0, true); // Last mod file time
    view.setUint16(14, 0, true); // Last mod file date
    view.setUint32(16, crc, true); // CRC-32
    view.setUint32(20, data.byteLength, true); // Compressed size
    view.setUint32(24, data.byteLength, true); // Uncompressed size
    view.setUint16(28, fileNameBuffer.length, true); // File name length
    view.setUint16(30, 0, true); // Extra field length
    view.setUint16(32, 0, true); // File comment length
    view.setUint16(34, 0, true); // Disk number start
    view.setUint16(36, 0, true); // Internal file attributes
    view.setUint32(38, 0, true); // External file attributes
    view.setUint32(42, offset, true); // Relative offset of local header
    new Uint8Array(header).set(fileNameBuffer, 46); // File name

    return header;
  }

  private _createEndOfCentralDirectory(fileCount: number, centralDirSize: number, centralDirOffset: number): ArrayBuffer {
    const header = new ArrayBuffer(22);
    const view = new DataView(header);
    view.setUint32(0, 0x06054b50, true); // End of central directory signature
    view.setUint16(4, 0, true); // Number of this disk
    view.setUint16(6, 0, true); // Disk where central directory starts
    view.setUint16(8, fileCount, true); // Number of central directory records on this disk
    view.setUint16(10, fileCount, true); // Total number of central directory records
    view.setUint32(12, centralDirSize, true); // Size of central directory
    view.setUint32(16, centralDirOffset, true); // Offset of start of central directory
    view.setUint16(20, 0, true); // Comment length

    return header;
  }

  private _crc32(data: Uint8Array): number {
    let crc = 0xffffffff;
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    for (const byte of data) {
      crc = (crc >>> 8) ^ table[(crc ^ byte) & 0xff];
    }

    return (crc ^ 0xffffffff) >>> 0;
  }

  public save(): void {
    const files: { name: string; data: ArrayBuffer }[] = [
      { name: '[Content_Types].xml', data: this._stringToArrayBuffer(this._generateContentTypes()) },
      { name: '_rels/.rels', data: this._stringToArrayBuffer(this._generateRels()) },
      { name: 'xl/workbook.xml', data: this._stringToArrayBuffer(this._generateWorkbook()) },
      { name: 'xl/_rels/workbook.xml.rels', data: this._stringToArrayBuffer(this._generateWorkbookRels()) },
      ...this._sheets.map((sheet, i) => ({
        name: `xl/worksheets/sheet${i + 1}.xml`,
        data: this._stringToArrayBuffer(this._generateSheet(sheet.data)),
      })),
    ];

    const buffers: ArrayBuffer[] = [];
    let offset = 0;
    const centralDir: ArrayBuffer[] = [];

    for (const file of files) {
      const localHeader = this._createLocalFileHeader(file.name, file.data);
      buffers.push(localHeader, file.data);
      centralDir.push(this._createCentralDirectory(file.name, file.data, offset));
      offset += localHeader.byteLength + file.data.byteLength;
    }

    const centralDirSize = centralDir.reduce((sum, cd) => sum + cd.byteLength, 0);
    const endRecord = this._createEndOfCentralDirectory(files.length, centralDirSize, offset);

    const totalSize = buffers.reduce((sum, b) => sum + b.byteLength, 0) + centralDirSize + endRecord.byteLength;
    const finalBuffer = new ArrayBuffer(totalSize);
    const finalView = new Uint8Array(finalBuffer);
    let pos = 0;

    for (const buffer of buffers) {
      finalView.set(new Uint8Array(buffer), pos);
      pos += buffer.byteLength;
    }
    for (const cd of centralDir) {
      finalView.set(new Uint8Array(cd), pos);
      pos += cd.byteLength;
    }
    finalView.set(new Uint8Array(endRecord), pos);

    const blob = new Blob([finalBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this._fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  private _sheets: SheetData[];
  private _fileName: string;
}
