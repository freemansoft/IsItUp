$(document).ready(function () {

    document.getElementById('confFileUpld').addEventListener('change', readSingleFile, false);

    // get values from localsync
    chrome.storage.local.get({
        allowIndividualRetry: false,
        allowAutomaticRefresh: false,
        pushNotifications: false,
        pageRefreshAfter: 30,
        cfgTxt: ""
    }, function (items) {
        if (items.cfgTxt) {
            $("textarea[name='cfgTxt']").val(items.cfgTxt);
        }
        else {
            jQuery.get("conf/defaultConf.json", function (data) {
                $("textarea[name='cfgTxt']").val(data);
            });
        }


        if (items.allowIndividualRetry) {
            $('#pageRefreshAfterId').show();
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


    });

    // when allow automatic refresh is enabled
    $('input:radio[name="allowAutomaticRefresh"]').change(function () {
        if ($(this).val() == 'Yes') {
            $('#pageRefreshAfterId').show();
        } else {
            $('#pageRefreshAfterId').hide();
        }
    });
    // when saved
    $('#saveBtn').click(function () {
        var allowIndividualRetry = ($("input[name=allowIndividualRetry]:checked").val() === 'Yes');
        var allowAutomaticRefresh = ($("input[name=allowAutomaticRefresh]:checked").val() === 'Yes');
        var pushNotifications = ($("input[name=pushNotifications]:checked").val() === 'Yes');
        var pageRefreshAfter = $("input[name=pageRefreshAfter]").val();
        var cfgTxt = $("textarea[name=cfgTxt]").val();
        if(!allowAutomaticRefresh){
            pageRefreshAfter = 0;
        }


        chrome.storage.local.set({
            allowIndividualRetry: allowIndividualRetry,
            allowAutomaticRefresh: allowAutomaticRefresh,
            pushNotifications: pushNotifications,
            pageRefreshAfter: pageRefreshAfter,
            cfgTxt: cfgTxt
        }, function () {
            // Update status to let user know options were saved.
            var status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(function () {
                status.textContent = '';
            }, 5000);
            setTimeout(function () {
                window.close();
            }, 1000)
        });

    });

});


function readSingleFile(evt) {
    //Retrieve the first (and only!) File from the FileList object
    var f = evt.target.files[0];
    if (f) {
        var r = new FileReader();
        r.onload = function (e) {
            var contents = e.target.result;
            var isJson = true;
            try {
                var json = $.parseJSON(contents);
            }
            catch (err) {
                isJson = false;
            }
            if (isJson) {
                $("textarea[name='cfgTxt']").val(contents);
            } else {
                alert("Invalid configuration Json file!!");
            }
        }
        r.readAsText(f);
    } else {
        alert("Failed to load file");
    }
}

