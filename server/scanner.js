var fs = require("fs");
var quagga = require('quagga');
var imageToTextDecoder = require('image-to-text');
var async = require('async');

function ScannerController() {};

ScannerController.prototype.scan = function(barcode, cb) {
    var files = fs.readdirSync("././barcodes");

    var count = 0;
    var scope = this;
    var barcodesDetails = [];

    async.whilst(
        function () {
            return count < files.length; 
        },
        function (callback) {
            var path = "././barcodes/"+files[count];
            console.log(path);
            quagga.decodeSingle({
                src: path,
                numOfWorkers: 0,  // Needs to be 0 when used within node
                inputStream: {
                    size: 1920,
                    area : {
                        top : "10%",
                        left : "10%"
                    }
                },
                decoder: {
                    readers: ["code_39_reader"] // List of active readers
                },
            }, function(result) {
                console.log("ffffffff");
                if(result && result.codeResult) {
                    console.log("result", files[count], result.codeResult.code);
                    barcodesDetails.push({fileName : files[count], barcode : result.codeResult.code});
                    count++;
                    callback();
                } else {
                    console.log("not detected", files[count]);
                    var file = {
                        name: files[count],
                        path: '././barcodes/'
                    };
                    imageToTextDecoder.getKeywordsForImage(file).then(function(keywords){
                        if(keywords){
                            keywords = keywords.replace(" ", "");
                            if(keywords.indexOf("barcode") > -1){
                                keywords = keywords.replace("barcode","");
                            }
                            barcodesDetails.push({fileName : files[count], barcode : keywords});
                        }
                        count++;
                        callback();
                    }).fail(function(){
                        console.log("not detected in fallback also");
                        count++;
                        callback();
                    });
                }
            });
            
        },
        function (err, n) {
            var scannedReport = [];
            barcodesDetails.forEach(function(code){
                if(code.barcode === barcode){
                    scannedReport.push({fileName:code.fileName, partialMatch : false, exactMatch : true, barcode : code.barcode})
                }else if(code.barcode.indexOf(barcode) > -1){
                    scannedReport.push({fileName:code.fileName, partialMatch : true, exactMatch : false, barcode : code.barcode})
                }else{
                    scannedReport.push({fileName:code.fileName, partialMatch : false, exactMatch : false, barcode : code.barcode})
                }
            });
            console.log(scannedReport, cb);
            return cb(scannedReport);
        }
    );
};

module.exports = new ScannerController();
