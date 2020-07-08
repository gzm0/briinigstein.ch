var row_count;

var dfltFreeTxt = "Noch zu vermieten / free";
var dfltOccTxt  = "Besetzt / occupied";

var delButTxt  = "löschen";
var undoButTxt = "rückgängig";

var emptyRowData = {
    from: "",
    to: "",
    text: "",
    occ: null
}

function populateDateData(data) {
    var tb = $("#date_edit tbody")

    for (var e in data) {
        tb.append(createRow(e,data[e]));
    }

    row_count = data.length;

    appendNewEmptyRow(data.length);

}

function triggerNewRow() {
    // Turn off onFocus trigger
    $(this).parents("tr").find("input").off("focus");

    // Initial date values
    var vStartD = "?";
    var vEndD   = "?";

    // Try to fetch date from previous row
    var lastDate = $(this).parents("tr").prev().find("input[name^=dateTo]").val();

    if (lastDate) {
        var oldD = parseDate(lastDate);

        if (oldD >= 0) {

            // Now add a week:
            var newD = oldD + 7 * 24 * 60 * 60 * 1000

            vStartD = formatDate(oldD);
            vEndD   = formatDate(newD);
        }
    }

    var row = $(this).parents("tr");

    row.find("input[name^=dateFrom]").val(vStartD);
    row.find("input[name^=dateTo]").val(vEndD);
    row.find("input[name^=text]").val(dfltFreeTxt);
    row.removeClass(rowColClass(null));
    row.addClass(rowColClass(false));
    row.children().last().append(createDelBut());

    appendNewEmptyRow(++row_count);

}

function appendNewEmptyRow(idx) {

    var row = createRow(idx, emptyRowData);

    $(row).find("input").focus(triggerNewRow);

    $("#date_edit tbody").append(row);

}

function triggerDelRow() {
    // Find all relevant rows
    var crow = $(this).parents("tr");
    var rows = crow.prevAll().add(crow);

    // Set color and disabled
    rows.addClass("rowDel");
    rows.find("input[type!=button]").attr("disabled", "disabled");

    // Change button to "undelete"
    var but = rows.find("input:button");
    but.click(triggerUnDelRow);
    but.val(undoButTxt);
}

function triggerUnDelRow() {
    // Find all relevant rows
    var crow = $(this).parents("tr");
    var rows = crow.nextAll(".rowDel").add(crow);

    // Set color and enabled
    rows.removeClass("rowDel");
    rows.find("input[type!=button]").removeAttr("disabled");

    // Change button to "delete"
    var but = rows.find("input:button");
    but.click(triggerDelRow);
    but.val(delButTxt);

}

function rowToggleOccupied() {

    // Fetch my row
    var row = $(this).parents("tr");

    // Are we occupied?
    var occ = $(this).attr("checked") != null;

    // Set color of row
    row.attr("class", rowColClass(occ));

    // Change name if no data is lost
    var nin = row.find("input[name^=text]");
    if (occ && $.trim(nin.val()) == dfltFreeTxt)
        nin.val(dfltOccTxt);
    else if (!occ && $.trim(nin.val()) == dfltOccTxt)
        nin.val(dfltFreeTxt);
}

/***************************/
/* Form creation functions */
/***************************/

function createRow(idx, data) {

    var row = $("<tr/>", {
        "class": rowColClass(data.occ)
    });

    row.append(createTxtCell(idx, "dateFrom", "date",     data.from));
    row.append(createTxtCell(idx, "dateTo",   "date",     data.to));
    row.append(createTxtCell(idx, "text",     "dateText", data.text));
    row.append(createOccCell(idx, data.occ));
    row.append(createDelButCell(idx, data.occ != null));

    return row;

}

function createDelButCell(idx, really) {

    var cell = $("<td/>");

    if (really)
        cell.append(createDelBut(idx));

    return cell;

}

function createDelBut(idx) {
    var input = $("<input/>", {
        type: "button",
        value: delButTxt,
        click: triggerDelRow
    });
    return input;
}

function createOccCell(idx, val) {

    var input = $("<input/>", {
        type: "checkbox",
        value: "occupied",
        name: "occ[" + idx + "]",
        click: rowToggleOccupied
    });

    if (val == true)
        input.attr("checked", "checked");

    var cell = $("<td/>");
    cell.append(input);
    return cell;
}

function createTxtCell(idx, name, cls, val) {

    var input = $("<input/>", {
        type: "ptext",
        value: val,
        "class": cls,
        name: name + "[" + idx + "]"
    });

    var cell = $("<td/>");
    cell.append(input);
    return cell;
}

/*************/
/* Utilities */
/*************/

function rowColClass(occ) {
    if (occ == null)
        return "rowNew";
    if (occ == true)
        return "rowOcc";
    return "rowFree";
}

function parseDate(dStr) {
    if (dStr.match(/^\d{2}\.\d{2}.\d{2}$/)) {
        // "Convert" date. Ugly as fuck but works.
        // does: 13.08.10 --> 2010-08-13
        var ndate = "20" + dStr.split(".").reverse().join("-");
        return Date.parse(ndate);
    }
    return -1;
}

function formatDate(epoch) {
    var dt = new Date(epoch);

    var m = dt.getMonth() + 1;
    var d = dt.getDate();

    return (d <= 9 ? "0" : "") + d + "." +
        (m <= 9 ? "0" : "") + m + "." +
        (dt.getYear() % 100); // <-- jscript date is lol
}
