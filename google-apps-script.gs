const SPREADSHEET_ID = '1y9CjgDcfSnG6RQ_wlnb7t0EnPuOyLK6I2qXSQW-nGvM';
const SHEET_NAME = 'Hoja 1';

function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  const people = Array.isArray(payload.people) ? payload.people : [];
  if (people.length < 1 || people.length > 6) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, message: 'Se permite un invitado principal y hasta 5 acompañantes' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.getSheets()[0];

  if (!sheet) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, message: 'Datos o hoja no encontrados' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const rows = people.map((person) => [
    person.firstName || '',
    person.middleName || '',
    person.firstLastName || '',
    person.secondLastName || '',
    person.phone || '',
    person.confirmation || ''
  ]);

  const startRow = Math.max(2, sheet.getLastRow() + 1);
  sheet.getRange(startRow, 1, rows.length, 6).setValues(rows);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, rows: rows.length }))
    .setMimeType(ContentService.MimeType.JSON);
}
