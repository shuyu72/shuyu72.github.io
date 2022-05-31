    var data = {
        "currentTime": new Date().getTime(),
        "currentPos": [92,12],
        "mu": "so be it"
    };
    $(function() {
        let cacheName = "core" // Whatever name
        // Pass all assets here
        // This example use a folder named «/core» in the root folder
        // It is mandatory to add an icon (Important for mobile users)
        let filesToCache = [
            "/",
            "/index.html",                    
        ]

        self.addEventListener("install", function(e) {
        e.waitUntil(
            caches.open(cacheName).then(function(cache) {
            return cache.addAll(filesToCache)
            })
        )})

        self.addEventListener("fetch", function(e) {
        e.respondWith(
            caches.match(e.request).then(function(response) {
            return response || fetch(e.request)
            })
        )});
    });

    $(function () {
        self.addEventListener('install', function (event) {
        event.waitUntil(
            caches.open('mysite-static-v3').then(function (cache) {
            return cache.addAll([
                '/index.html'
            ]);
            }),
        );
        });
        self.addEventListener('activate', function (event) {
            event.waitUntil(
                caches.keys().then(function (cacheNames) {
                return Promise.all(
                    cacheNames
                    .filter(function (cacheName) {
                        // Return true if you want to remove this cache,
                        // but remember that caches are shared across
                        // the whole origin
                    })
                    // .map(function (cacheName) {
                    //     return caches.delete(cacheName);
                    // }),
                );
                }),
            );
        });

        // document.querySelector('.cache-article').addEventListener('click', function (event) {
        //     event.preventDefault();

        //     var id = this.dataset.articleId;
        //     caches.open('mysite-article-' + id).then(function (cache) {
        //         fetch('/get-article-urls?id=' + id)
        //         .then(function (response) {
        //             // /get-article-urls returns a JSON-encoded array of
        //             // resource URLs that a given article depends on
        //             return response.json();
        //         })
        //         .then(function (urls) {
        //             cache.addAll(urls);
        //         });
        //     });
        // });
    })

    $(function () {
        initDB();
        addObj();               
        getObj(); 
        function initDB () {

            var db;
            var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
            var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;

            var req = indexedDB.open("mydb", 5);

            req.onsuccess = function (e) {
                console.log("open");
                db = e.target.result;
            };

            req.onerror = function () {
                console.log("error");
            };

            req.onupgradeneeded = function (e) {
                console.log("upgradeneeded");          

                var db = e.target.result;
                var emp = { id: 1, name: "ray" };
                var store = db.createObjectStore("items", { keyPath: "id" });

                store.add(emp);
            }
            return db;
        }

        function addObj() {                                    
            var db;// = initDB();
            var request = indexedDB.open("mydb", 3);  
            request.onsuccess = function (evt) {
                db = request.result; 
                var txn = db.transaction("items", "readwrite");
                var store = txn.objectStore("items");

                var emp2 = { id: 2, name: "vivid" };

                var req = store.add(emp2);
                req.onsuccess = function (e) {
                    console.log("add");
                }

                req.onerror = function () {
                    console.log("error");
                };
            }
        }

        function getObj() {
            var db;// = initDB();
            var request = indexedDB.open("mydb", 3);  
            request.onsuccess = function (evt) {
                db = request.result; 
                var txn = db.transaction("items", "readwrite");
                var store = txn.objectStore("items");

                var req = store.get(1);

                req.onsuccess = function (e) {
                    console.log("get");

                    var emp = e.target.result;
                    document.getElementById("result").innerHTML =
                        emp.id + ", " + emp.name;
                }

                req.onerror = function () {
                    console.log("error");
                };
            }
        }

        function deleteObj() {
            var db = initDB();
            var txn = db.transaction("items", "readwrite");
            var store = txn.objectStore("items");

            var req = store.delete(1);

            req.onsuccess = function (e) {
                console.log("delete");
            }

            req.onerror = function () {
                console.log("error");
            };
        }

        function updateObj() {
            var db = initDB();
            var txn = db.transaction("items", "readwrite");
            var store = txn.objectStore("items");

            var emp2 = { id: 2, name: "kevin" };

            var req = store.put(emp2);
            req.onsuccess = function (e) {
                console.log("put");
            }

            req.onerror = function () {
                console.log("error");
            };
        }

        
    });

    
    
    let isStarted = false;
    let isBegun = false;

    function start() {
        isStarted = true;
        $('input:text').attr('placeholder','掃描或輸入單號');
    }
    // $(function() {
    //     // document.getElementById("result").innerHTML = sessionStorage.table_content;
    //     sessionStorage.removeItem('table_content');
    // })

    function end() {
        isStarted = false;
        isBegun = false;
        let tpl = '<a download="' + $('#orderId').html() + '.csv" href="data:application/csv;charset=utf-8,{table_content}">下載此訂單</a>';
        let table_content = '';
            
            $.each($("td"), function (index, cell) {
                let cellContent = cell.innerHTML;
                let td = '';
                if (index % 4 === 0 || index % 4 === 1) {
                    td = cellContent.split('<td>')[0];                                    
                } else if (index % 4 === 2){                                                               
                    td = $('#field' + (Math.trunc(index / 4)).toString()).val();
                }
                if (index % 4 === 0 || index % 4 === 1) {                                    
                    table_content += td + '%2C'; //Need to return contents of cell                                
                } else if (index % 4 === 2){
                    table_content += td + '%0A';
                }                                
            });

        tpl = tpl.replace('{table_content}', table_content);
        $(tpl).appendTo($('#orderId'));
        if (typeof(Storage) !== "undefined") {                    
            sessionStorage.table_content = table_content;                
            document.getElementById("result").innerHTML = sessionStorage.table_content;
        } else {
            document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
        }
    }
    

    function docReady(fn) {
        // see if DOM is already available
        if (document.readyState === "complete" || document.readyState === "interactive") {
            // call on next available tick
            setTimeout(fn, 1);
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    } 

    docReady(function() {
        var resultContainer = document.getElementById('qr-reader-results');
        var lastResult, countResults = 0;
        
        var html5QrcodeScanner = new Html5QrcodeScanner(
            "qr-reader", { fps: 10, qrbox: 250 });
        
        function onScanSuccess(decodedText, decodedResult) {
            if (decodedText !== lastResult) {
                ++countResults;
                lastResult = decodedText;
                // console.log(`Scan result = ${decodedText}`, decodedResult);
                $('#inputBarCode').val(decodedResult.val());
    
                resultContainer.innerHTML += `<div>[${countResults}] - ${decodedText}</div>`;
                
                // Optional: To close the QR code scannign after the result is found
                html5QrcodeScanner.clear();
            }
        }
        
        // Optional callback for error, can be ignored.
        function onScanError(qrCodeError) {
            // This callback would be called in case of qr code scan error or setup error.
            // You can avoid this callback completely, as it can be very verbose in nature.
        }
        
        html5QrcodeScanner.render(onScanSuccess, onScanError);
    });
    $(document).on("click", ".delete", function(){                                
        $(this).parents("tr").remove();                 
    });

    // $(document).on("click", ".reset-input", function(){                                
    //     $(this).parents("div").find('input').val("");                 
    // });

    function clearInput(id) {
        $("#" + id).val("");
    }

    // function testInput() {
    //     $('#inputBarCode').val('11111');
    // }
    let itemCount = 0;
    function newRecordOrNewOrder() {
        if (isBegun) {
            $('table').find('tbody').append('<tr><td>' + (itemCount + 1).toString() + '</td><td class="barcode">' + $('#inputBarCode').val() + '</td><td class="col-4 col-xs-4 col-sm-4 col-md-4 col-lg-4"><div class="input-group"><input type="text" id="field' + itemCount.toString() + '" class="form-control memo"/><div class="input-group-append"><div class="btn btn-danger px-1 reset-input" onclick="clearInput(\'field' + itemCount.toString() + '\')">×</div></div></div></td><td><div class="btn btn-danger delete">移除</div></td></tr>');
            $('#inputBarCode').val('');
            itemCount++;
        } else if (!isBegun && isStarted) {
            if ($('#inputBarCode').val()) {
                $('#orderId').html($('#inputBarCode').val());                    
                
                isBegun = true;
                $('input:text').attr('placeholder','掃描或輸入條碼');
                $('#inputBarCode').val('');
            } else {
                alert('請掃描或輸入單號!');                    
            }
        }

    }

    function clearTable() {
        if (!isStarted) {
            if (confirm("您確定要刪除此筆訂單的所有資料嗎?")) {
                $('#orderId').html('')
                $('tr td').remove();
                itemCount = 0;
            } 
        } else {
            if (confirm("刪除此筆訂單目前的資料嗎?")) {
                $('tr td').remove();                        
                itemCount = 0;
            }
        }    
    }
