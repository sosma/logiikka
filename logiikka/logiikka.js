var data = null;
var dataList = null;
var variables = [];
var tables = [];
$('#dynamictable').append('<table></table>');
var table = $('#dynamictable').children();
function initiate() {
    data = document.getElementById("input").value;
    $('#dynamictable').empty();
    parse(data);
    $('#dynamictable').append('<table></table>');
    var table = $('#dynamictable').children();
    table.append("<tr><th>propositiolauseet</th><th>totuustaulukot</th></tr>")
    for (var i = 0, len = variables.length; i < len; i++) {
        table.append("<tr><td>" + variables[i] + "</td><td>" + findkey(variables[i]) + "</td></tr>");
    }
    dataList = toList(data);
    for(var i = 0, len = dataList.length; i < len; i++){
        if(variables.contains(dataList[i])){
            dataList[i] = findkey(dataList[i]);
        }
    }
    nextSolve(dataList);
    table.append("<tr><th>okea vastausrivi: " + dataList + "</th></tr>")
}

function nextSolve(list){
    for(var i = 0, len = list.length; i < len; i++){
        if(list[i] == "(" && typeof list[i+1] == "object" && typeof list[i+2] == "string" && typeof list[i+3] == "object" && list[i+4] == ")"){
            list = list.splice(i, 5, getTable(list[i+1], list[i+2], list[i+3]))
            return nextSolve(dataList);
        } else if (list[i] == "!" && typeof list[i+1] == "object"){
            list = list.splice(i, 2, negaatio(list[i+1]));
            return nextSolve(dataList);
        }
    }
    return list[2];
}

function getTable(table1, type, table2){
    if(type == "^"){
        return konjunktio(table1, table2);
    }   else if (type == "V") {
        return disjunktio(table1, table2);
    } else if (type == ">"){
        return implikaatio(table1, table2);
    } else if (type == "=") {
        return ekvivalenssi(table1, table2);

    }
}

function toList(string){
    var list = [];
    for(var i = 0, len = string.length; i < len; i++){
        list.push(string[i]);
    }
    return list;
}

function findkey(value){
    for(var i = 0, len = tables.length; i < len; i++){
        if (tables[i][0] == value){
            return tables[i][1];
        }
    }
}

function parse(input) {
    tables = [];
    for (var i = 0, len = data.length; i < len; i++) {
        if(data[i] != "^" && data[i] != "V" && data[i] != ">" && data[i] != "=" && data[i] != "(" && data[i] != ")" && data[i] != "!"){
            if(!variables.contains(data[i])){
                variables.push(data[i]);
            }
        }

    }
    for (var i = 0, len = variables.length; i < len; i++) {
        tables.push([variables[i], createTable(i, variables.length)]);
    }

}

function createTable(index, length){
    var arr = [];
    var counter = Math.pow(2, length) / (Math.pow(2,index + 1));
    var TorF = true;
    for(i=0, len = Math.pow(2, length); i < len; i++){
        if(counter == 0) {
            counter = Math.pow(2, length) / (Math.pow(2,index + 1));
            TorF = !TorF;
        }
        if(TorF){
            arr.push(1);
        } else {
            arr.push(0);
        }
        counter--;
    }
    return arr;
}

function konjunktio(table1, table2){
    var result = [];
    for(i=0, len = Math.pow(2, variables.length); i < len; i++){
        if (table1[i] && table2[i]) {
            result.push(1);
        } else {
            result.push(0);
        }
    }
    return result;
}

function disjunktio(table1, table2){
    var result = [];
    for(i=0, len = Math.pow(2, variables.length); i < len; i++){
        if (table1[i] || table2[i]) {
            result.push(1);
        } else {
            result.push(0);
        }
    }
    return result;
}

function implikaatio(table1, table2){
    var result = [];
    for(i=0, len = Math.pow(2, variables.length); i < len; i++){
        if (!table1[i] || table2[i]) {
            result.push(1);
        } else {
            result.push(0);
        }
    }
    return result;
}

function ekvivalenssi(table1, table2){
    var result = [];
    for(i=0, len = Math.pow(2, variables.length); i < len; i++){
        if (table1[i] == table2[i]) {
            result.push(1);
        } else {
            result.push(0);
        }
    }
    return result;
}

function negaatio(table1){
    var arr = [];
    for(var i = 0, len = table1.length; i < len; i++){
        arr.push(Number(!table1[i]));
    }
    return arr;
}

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}
