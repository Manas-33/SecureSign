// var fs = require('fs');
// import fs from 'fs';
        var ipfs = window.IpfsApi('localhost', '5001')
        const Buffer = window.IpfsApi().Buffer;

        var ailmentsDict = {};
        ailmentsDict[0] = "Common Flu";
        ailmentsDict[1] = "Viral Infection";
        ailmentsDict[2] = "Cancer";
        ailmentsDict[3] = "Tumor";
        ailmentsDict[4] = "Covid-19";
        ailmentsDict[5] = "Heart-Disorder";
        ailmentsDict[6] = "Other";
        var url_string = window.location.href;
        var url = new URL(url_string);
        var key;
        var docName = "";


        toggleRecordsButton = 0;

        $(window).load(function () {
            connect();
            $(".alert-danger").hide();

            key = web3.currentProvider.selectedAddress;
            key = key.toLocaleLowerCase();

            var a = 0;
            var b = 0;
            contractInstance.get_doctor.call(key, { gas: 1000000 }, function (error, result) {
                if (!error) {
                    a = result[0];
                    b = result[1];
                    docName = a;
                    $("#name").html(a);
                    $("#age").html(b.c[0]);
                }

                else
                    console.error(error);
            });
            var patientAddressList = 0;

            contractInstance.get_accessed_patientlist_for_doctor(key, { gas: 1000000 }, function (error, result) {
                if (!error) {
                    patientAddressList = result;
                    console.log(result);

                    patientAddressList.forEach(function (patientAddress, index) {
                        contractInstance.get_patient.call(patientAddress, { gas: 1000000 }, function (error, result) {
                            var table = document.getElementById("viewPatient");
                            if (!error) {
                                [a, b] = result;
                                console.log(a);

                                var row = table.insertRow(index + 1);
                                var cell1 = row.insertCell(0);
                                var cell2 = row.insertCell(1);
                                var cell3 = row.insertCell(2);
                                cell2.className = "publicKeyPatient";
                                cell1.innerHTML = a;
                                cell2.innerHTML = patientAddress;
                                cell3.innerHTML = '<input class="btn btn-success" onclick="showRecords(this)" id="viewRecordsButton" type="button" value="View records"></input>';


                            }
                            else
                                console.error(error);
                        })
                    })
                }
                else
                    console.error(error);
            });

        });
        // const fs = require('fs');
        
        // import * as fs from 'fs'
        function reader() {

        }

        function showRecords(element) {

            var table = document.getElementById("viewPatient");
            var index = element.parentNode.parentNode.rowIndex;
            var patientAddress = table.rows[index].cells[1].innerHTML;

            if (toggleRecordsButton % 2 == 0) {

                var patientRecord = ""

                contractInstance.get_hash(patientAddress, { gas: 1000000 }, function (error, result) {
                    if (!error) {

                        $.get("http://localhost:8080/ipfs/" + result, function (data) {
                            patientRecord = data;

                            content = `<div class="tab-content">
                        <div id="view${patientAddress}">
                                <div class="row">
                                    <div class="col-sm-12">
                                        <pre style="margin: 20px 0;" id="records${patientAddress}">${patientRecord}</pre>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-sm-12">
                                        <div class="row">
                                            <div class="form-group col-sm-10">
                                                <div class="row">
                                                    <div class="col-sm-2"><label for="ailmentsList" class="control-label">Diagnosis:</label></div>
                                                    <div class="col-sm-10">
                                                        <select class="form-control" id="ailmentsList${patientAddress}" style="width:inherit;" required>
                                                            <option selected disabled>-- Please Select --</option>
                                                            <option value = "0">Common Flu</option>
                                                            <option value = "1">Viral Infection</option>
                                                            <option value = "2">Cancer</option>
                                                            <option value = "3">Tumor</option>
                                                            <option value = "4">Covid-19</option>
                                                            <option value = "5">Heart-Disorder</option>
                                                            <option value = "6">Other</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="form-group col-sm-10">
                                                <div class="row">
                                                    <div class="col-sm-2">
                                                        <label class="control-label" for="details">Details:</label>
                                                    </div>
                                                    <div class="col-sm-10">
                                                        <textarea class="form-control" rows="5" id="details" placeholder="Enter details to be added" name = "Details" style="width: inherit" required autofocus></textarea>
                                                        <!-- <input type="text" class="form-control" id="details" placeholder="Enter details to be added" name = "Details" style="width: inherit" required autofocus> -->
                                                    </div>
                                                </div>    
                                            </div>
                                            <div class="form-group col-sm-2">
                                                <button class="btn btn-primary" onclick = "submitDiagnosis(this,`+ index + `)">Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>     
                            </div>
                        </div>`

                            var row1 = table.insertRow(index + 1);
                            var cell1 = row1.insertCell(0);
                            cell1.colSpan = 3;

                            cell1.innerHTML = content;

                        })


                    } else {
                        console.log(error);
                    }
                })

                toggleRecordsButton += 1
                element.value = "Hide Records";
                element.className = "btn btn-danger"

            } else {
                row = table.rows[index + 1];
                $(row).hide();
                toggleRecordsButton -= 1;
                element.value = "View Records";
                element.className = "btn btn-success"
            }

        }

        function getDateTime() {
            function AddZero(num) {
                return (num >= 0 && num < 10) ? "0" + num : num + "";
            }
            var now = new Date();
            var strDateTime = [[AddZero(now.getDate()),
            AddZero(now.getMonth() + 1),
            now.getFullYear()].join("/"),
            [AddZero(now.getHours()),
            AddZero(now.getMinutes())].join(":"),
            now.getHours() >= 12 ? "PM" : "AM"].join(" ");
            return strDateTime;
        }


        function submitDiagnosis(element, index) {
            var table = document.getElementById("viewPatient");
            var patientAddress = table.rows[index].cells[1].innerHTML;

            console.log(patientAddress);
            var diagnosis = $("#ailmentsList" + patientAddress).val();
            diagnosis = parseInt(diagnosis);
            var diagnosed = ailmentsDict[diagnosis];
            var comments = document.getElementById("details").value;

            var oldRecords = $("#records" + patientAddress).html();

            var newRecords =
                `Diagnosed By : ${docName}
Diagnosis Time : ${getDateTime()}
Diagnosis : ${diagnosed}
Comments : ${comments}

        
`

            // const pdfFile = fs.readFileSync("C:/Users/dalvi/Downloads/_51_CP Report_TextClassificationUsingOCRandNER.pdf");

            var updatedRecords = oldRecords + newRecords;

            if (!isNaN(diagnosis)) {

                var buffer = Buffer(updatedRecords);

                ipfs.files.add(updatedRecords, (error, result) => {
                    if (error) {
                        console.log(error)
                    } else {
                        console.log(result)
                        ipfshash = result[0].hash;
                        contractInstance.insurance_claim(patientAddress, diagnosis, ipfshash, { gas: 1000000 }, function (error, result) {
                            if (!error) {
                                alert("Your diagnosis has been submitted.");
                                table.deleteRow(index + 1);
                                table.deleteRow(index);
                            } else {
                                $(".alert-danger").show();
                                console.log(error);
                            }
                        })
                    }
                });

            }
            else {
                alert("Select a diagnosis");
            }
        }