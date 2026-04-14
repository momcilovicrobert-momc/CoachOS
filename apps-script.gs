var SHEET_ID = '1yEUOOHOQcd8MY9TB4_ohGTj0ijZhwqQbclqBryqv5i8';

function doGet(e) {
  var action = e.parameter.action;
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var result = {};

  if (action === 'getClients') {
    var sheets = ss.getSheets();
    var names = [];
    for (var i = 0; i < sheets.length; i++) {
      names.push(sheets[i].getName());
    }
    result = names;
  }

  if (action === 'getLogs') {
    var client = e.parameter.client;
    var tab = ss.getSheetByName(client);
    if (!tab) {
      result = { logs: [] };
    } else {
      var rows = tab.getDataRange().getValues();
      if (rows.length <= 1) {
        result = { logs: [] };
      } else {
        var headers = rows[0];
        var logs = [];
        for (var i = rows.length - 1; i >= 1; i--) {
          var row = rows[i];
          var obj = {};
          for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = row[j];
          }
          logs.push({
            date:     obj['Datum']     || '',
            session:  obj['Trening']   || '',
            exercise: obj['Vaja']      || '',
            sets:     obj['Serije']    || '',
            reps:     obj['Ponovitve'] || '',
            weight:   obj['Teža']      || '',
            rpe:      obj['RPE']       || '',
            notes:    obj['Opomba']    || ''
          });
        }
        result = { logs: logs };
      }
    }
  }

  if (action === 'getCheckins') {
    var client = e.parameter.client;
    var tab = ss.getSheetByName(client + '_checkin');
    if (!tab) {
      result = { checkins: [] };
    } else {
      var rows = tab.getDataRange().getValues();
      if (rows.length <= 1) {
        result = { checkins: [] };
      } else {
        var headers = rows[0];
        var checkins = [];
        for (var i = rows.length - 1; i >= 1; i--) {
          var row = rows[i];
          var obj = {};
          for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = row[j];
          }
          checkins.push({
            date:      obj['Datum']     || '',
            sleep:     obj['Sleep']     || '',
            wellbeing: obj['Wellbeing'] || '',
            note:      obj['Opomba']    || ''
          });
        }
        result = { checkins: checkins };
      }
    }
  }

  if (action === 'getMeasurements') {
    var client = e.parameter.client;
    var tab = ss.getSheetByName(client + '_mere');
    if (!tab) {
      result = { measurements: [] };
    } else {
      var rows = tab.getDataRange().getValues();
      if (rows.length <= 1) {
        result = { measurements: [] };
      } else {
        var headers = rows[0];
        var measurements = [];
        for (var i = rows.length - 1; i >= 1; i--) {
          var row = rows[i];
          var obj = {};
          for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = row[j];
          }
          measurements.push({
            date:  obj['Datum']  || '',
            waist: obj['Pas']    || '',
            hip:   obj['Boki']   || '',
            chest: obj['Prsi']   || '',
            thigh: obj['Stegna'] || ''
          });
        }
        result = { measurements: measurements };
      }
    }
  }

  if (action === 'getProgram') {
    var client = e.parameter.client;
    var type = e.parameter.type || '';
    var tabName = type ? client + '_program_' + type : client + '_program';

    var ptab = ss.getSheetByName(tabName);
    if (!ptab) {
      result = { program: '', message: '', error: 'Tab ' + tabName + ' not found' };
    } else {
      var rows = ptab.getDataRange().getValues();
      var message = rows.length > 0 ? (rows[0][1] || '') : '';
      var programText = rows.map(function(r) { return r[0]; }).filter(Boolean).join('\n');
      result = { program: programText, message: message };
    }
  }

  if (action === 'getAltPrograms') {
    var client = e.parameter.client;
    var prefix = client + '_program_';
    var sheets = ss.getSheets();
    var alts = [];
    for (var i = 0; i < sheets.length; i++) {
      var name = sheets[i].getName();
      if (name.indexOf(prefix) === 0) {
        alts.push(name.substring(prefix.length));
      }
    }
    result = { alts: alts };
  }

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var data = JSON.parse(e.postData.contents);
  var action = data.action;
  var result = { success: false };

  if (action === 'logWorkout') {
    var tab = ss.getSheetByName(data.client);
    if (!tab) {
      tab = ss.insertSheet(data.client);
      tab.appendRow(['Datum', 'Trening', 'Vaja', 'Serije', 'Ponovitve', 'Teža', 'RPE', 'Opomba']);
    }
    tab.appendRow([
      data.date || new Date().toISOString(),
      data.session,
      data.exercise,
      data.sets,
      data.reps,
      data.weight,
      data.rpe,
      data.notes
    ]);
    result = { success: true };
  }

  if (action === 'logCheckin') {
    var tabName = data.client + '_checkin';
    var tab = ss.getSheetByName(tabName);
    if (!tab) {
      tab = ss.insertSheet(tabName);
      tab.appendRow(['Datum', 'Sleep', 'Wellbeing', 'Opomba']);
    }
    tab.appendRow([
      data.date || new Date().toISOString(),
      data.sleep,
      data.wellbeing,
      data.note
    ]);
    result = { success: true };
  }

  if (action === 'logMeasurements') {
    var tabName = data.client + '_mere';
    var tab = ss.getSheetByName(tabName);
    if (!tab) {
      tab = ss.insertSheet(tabName);
      tab.appendRow(['Datum', 'Pas', 'Boki', 'Prsi', 'Stegna']);
    }
    tab.appendRow([
      data.date || new Date().toISOString(),
      data.waist,
      data.hips,
      data.chest,
      data.thigh
    ]);
    result = { success: true };
  }

  if (action === 'saveProgram') {
    var tabName = data.type ? data.client + '_program_' + data.type : data.client + '_program';

    var ptab = ss.getSheetByName(tabName);
    if (!ptab) ptab = ss.insertSheet(tabName);

    ptab.clearContents();
    var lines = data.program.split('\n');
    var firstRow = true;
    lines.forEach(function(line) {
      if (line.trim()) {
        if (firstRow) {
          ptab.appendRow([line, data.message || '']);
          firstRow = false;
        } else {
          ptab.appendRow([line]);
        }
      }
    });
    result = { success: true };
  }

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function sortLogByDate(e) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = e.range.getSheet();
  var sheetName = sheet.getName();

  // Samo glavne stranke (ne _program, _teza, _checkin, _mere)
  if (sheetName.indexOf('_') !== -1) return;

  var data = sheet.getDataRange().getValues();
  if (data.length <= 2) return;

  var header = data[0];
  var rows = data.slice(1);

  rows.sort(function(a, b) {
    var dateA = new Date(a[0]);
    var dateB = new Date(b[0]);
    return dateA - dateB;
  });

  sheet.getRange(2, 1, rows.length, header.length).setValues(rows);
}
