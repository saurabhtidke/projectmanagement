/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = "/api/iml";
var proDBName = "Project";
var proRelationName = "Project-Rel";
var connToken = "90932612|-31949278103502680|90949073";

$("#proid").focus();

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getProIdAsJsonObj() {
    var proid = $('#proid').val();
    var jsonStr = {
        id: proid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data.record);
    $('#proname').val(record.proname);
    $('#assisto').val(record.assisto);
    $('#assisdate').val(record.assisdate);
    $('#deadline').val(record.deadline);
}

function resetForm() {
    $('#proid').val("");
    $('#proname').val("");
    $('#assisto').val("");
    $('#assisdate').val("");
    $('#deadline').val("");
    $('#proid').prop("disabled", false);
    $('#save').prop("disabled", true);
    $('#change').prop("disabled", true);
    $('#reset').prop("disabled", true);
    $("#proid").focus();
}

function validateData() {
    var proid = $('#proid').val();
    var proname = $('#proname').val();
    var assisto = $('#assisto').val();
    var assisdate = $('#assisdate').val();
    var deadline = $('#deadline').val();
   
    if (proid === "") {
        alert("Project ID Is Missing")
        $("#proid").focus();
        return "";
    }
    if (proname === "") {
        alert("Project Name Is Missing")
        $("#proname").focus();
        return "";
    }
    if (assisto === "") {
        alert("Assis To Is Missing")
        $("#assisto").focus();
        return "";
    }
    if (assisdate === "") {
        alert("Assis Date Is Missing")
        $("#assisdate").focus();
        return "";
    }
    if (deadline === "") {
        alert("Deadline Is Missing")
        $("#deadline").focus();
        return "";
    }

    var jsonStrObj = {
        ProjectID: proid,
        ProjectName: proname,
        AssignedTo: assisto,
        AssignmentDate: assisdate,
        Deadline: deadline
    };
    return JSON.stringify(jsonStrObj);
}

function getPro() {
    var proIdJsonObj = getProIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, proDBName, proRelationName, proIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400) {
        $('#save').prop("disabled", false);
        $('#reset').prop("disabled", false);
        $("#proname").focus();
    } else if (resJsonObj.status === 200) {
        $('#proid').prop("disabled", true);
        fillData(resJsonObj);
        $('#change').prop("disabled", false);
        $('#reset').prop("disabled", false);
        $("#proname").focus();
    }
}

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === " ") {
        return " ";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, proDBName, proRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#proid").focus();
}

function changeData() {
    $("#change").prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, proDBName, proRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#proid").focus();
}
