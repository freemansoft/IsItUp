$(document).ready(function() {

    document.getElementById('confFileUpld').addEventListener('change', readSingleFile, false);

    // get values from localsync
    chrome.storage.local.get({
        allowIndividualRetry: true,
        allowAutomaticRefresh: false,
        pushNotifications: false,
        showBadges: false,
        showBuildId: false,
        pageRefreshAfter: 0,
        uweStatusCode: 206,
        color: "#ffcc00",
        cfgUri: "",
        cfgTxt: "",
        fileTypeTxt: "json"
    }, function(items) {
        //load the demo url if they don't have any. They can clear to remove
        //Ugh we should have set an initial and then not cleared but....
        //console.log("storage says cfgUri = "+items.cfgUri);
        if (items.cfgUri) {
            $("#confFileViaWeb").val(items.cfgUri);
        } else {
            $("#confFileViaWeb").val("https://raw.githubusercontent.com/NaveenGurram/IsItUp/master/conf/defaultConf.yaml");
        }
        // note we default to a json file even though the default url is YAML. This is mostly for demo purposes
        if (items.cfgTxt) {
            $("textarea[name='cfgTxt']").val(items.cfgTxt);
        } else {
            jQuery.get("conf/defaultConf.json", function(data) {
                $("textarea[name='cfgTxt']").val(data);
            });
        }

        if (items.fileTypeTxt) {
            $('#fileTypeId').val(items.fileTypeTxt);
        }

        if (items.allowIndividualRetry) {
            $('#pageRefreshAfterId').show();
        } else {
            items.pageRefreshAfter = 0;
        }
        $('#pageRefreshAfter').val(items.pageRefreshAfter);

        if (items.allowIndividualRetry) {
            $('#allowIndividualRetry-0').prop('checked', true);
        } else {
            $('#allowIndividualRetry-1').prop('checked', true);
        }

        if (items.allowAutomaticRefresh) {
            $('#allowAutomaticRefresh-0').prop('checked', true);
        } else {
            $('#allowAutomaticRefresh-1').prop('checked', true);
        }

        if (items.pushNotifications) {
            $('#pushNotifications-0').prop('checked', true);
        } else {
            $('#pushNotifications-1').prop('checked', true);
        }
        if (items.showBadges) {
            $('#showBadges-0').prop('checked', true);
        } else {
            $('#showBadges-1').prop('checked', true);
        }
        if (items.showBuildId) {
            $('#showBuildId-0').prop('checked', true);
        } else {
            $('#showBuildId-1').prop('checked', true);
        }
        if (items.uweStatusCode) {
            $("#uweStatusCode").val(items.uweStatusCode);
        }
        if (items.color) {
            $("#uweStatusColor").val(items.color);
        }

    });

    // when allow automatic refresh is enabled
    $('input:radio[name="allowAutomaticRefresh"]').change(function() {
        if ($(this).val() == 'Yes') {
            $('#pageRefreshAfterId').show();
        } else {
            $('#pageRefreshAfterId').val(0);
            $('#pageRefreshAfterId').hide();
        }
    });
    // when saved
    $('#saveBtn').click(function() {
        var allowIndividualRetry = ($("input[name=allowIndividualRetry]:checked").val() === 'Yes');
        var allowAutomaticRefresh = ($("input[name=allowAutomaticRefresh]:checked").val() === 'Yes');
        var pushNotifications = ($("input[name=pushNotifications]:checked").val() === 'Yes');
        var showBadges = ($("input[name=showBadges]:checked").val() === 'Yes');
        var showBuildId = ($("input[name=showBuildId]:checked").val() === 'Yes');
        var pageRefreshAfter = $("input[name=pageRefreshAfter]").val();
        var cfgUri = $("#confFileViaWeb").val();
        var cfgTxt = $("textarea[name=cfgTxt]").val();
        var fileTypeTxt = $("#fileTypeId").val();
        var uweStatusCode = $('#uweStatusCode').val();
        var color = $("#uweStatusColor").val();
        if (!allowAutomaticRefresh) {
            pageRefreshAfter = 0;
        }

        chrome.storage.local.set({
            allowIndividualRetry: allowIndividualRetry,
            allowAutomaticRefresh: allowAutomaticRefresh,
            pushNotifications: pushNotifications,
            pageRefreshAfter: pageRefreshAfter,
            showBadges: showBadges,
            showBuildId: showBuildId,
            cfgTxt: cfgTxt,
            cfgUri: cfgUri,
            fileTypeTxt: fileTypeTxt,
            uweStatusCode: uweStatusCode,
            color: color
        }, function() {
            // Update status to let user know options were saved.
            showStatus('Options saved');
            setTimeout(function() {
                window.close();
            }, 1000)
        });

    });

    // this should all be by mime type not extension :-(
    $('#confFileViaWebBtn').click(function() {
        var fullUri = document.getElementById('confFileViaWeb').value;
        loadConfigFromUri(fullUri);
    });

});

// a bit of a hack - take into account query strings when cought up by things like GIT
// we use the file name extracted from URI path instead of mime type
function loadConfigFromUri(fullUri) {
    var elementWorker = new URL(fullUri);
    var filePath = elementWorker.pathname;
    if (filePath) {
        var extension = filePath.split('.').pop();
        // ugh. extension matching
        if ("json" === extension || "yaml" === extension || "yml" === extension) {
            //console.log('in click method '+fullUri);
            $.get(fullUri)
                .success(function(fetchedData) {
                    $("textarea[name='cfgTxt']").val(fetchedData);
                    $("#fileTypeId").val(extension.toLowerCase());
                    showStatus('Configuration loaded successfully from remote location');
                })
                .error(function(jqXHR, statusText, error) {
                    showStatus('Error: ' + error + 'Failed to load from remote location');
                });
        } else {
            showStatus("Invalid filey type" + extension + " as calculated from config file url");
        }
    } else {
        showStatus('Enter a URL before attempting to load configuration');
    }
}

// reads a file, validates as json and puts the json in the text field
function readSingleFile(evt) {
    //Retrieve the first (and only!) File from the FileList object
    var f = evt.target.files[0];
    if (f) {
        var extension = f.name.split('.').pop();
        var r = new FileReader();
        r.onload = function(e) {
            var contents = e.target.result;
            // its a json file, convert into 
            var isFileValid = true;
            if ("json" === extension) {
                try {
                    $.parseJSON(contents);
                } catch (err) {
                    isFileValid = false;
                }
            } else if ("yaml" === extension || "yml" === extension) {
                try {
                    YAML.parse(contents);
                } catch (err) {
                    isFileValid = false;
                }
            }

            if (isFileValid) {
                $("textarea[name='cfgTxt']").val(contents);
                $("#fileTypeId").val(extension.toLowerCase());
            } else {
                showStatus("Invalid " + extension + " configuration file!!");
            }
        }
        r.readAsText(f);
    } else {
        showStatus("Failed to load file");
    }
}

function showStatus(statuString) {
    var status = document.getElementById('status');
    status.textContent = statuString;
    setTimeout(function() {
        status.textContent = '';
    }, 5000);
}