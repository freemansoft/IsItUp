$(document).ready(function () {


    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        allowIndividualRetry: false,
        allowAutomaticRefresh: false,
        pushNotifications: false,
        pageRefreshAfter: 30,
        cfgTxt: ""
    }, function (items) {
  
        $("textarea[name='cfgTxt']").val(items.cfgTxt);
        if(items.allowIndividualRetry){
            $('#pageRefreshAfterId').show();
        }
        $('#pageRefreshAfter').val(items.pageRefreshAfter);

        if(items.allowIndividualRetry){
            $('#allowIndividualRetry-0').prop('checked',true);
        }else{
           $('#allowIndividualRetry-1').prop('checked',true); 
        }

        if(items.allowAutomaticRefresh){
            $('#allowAutomaticRefresh-0').prop('checked',true);
        }else{
           $('#allowAutomaticRefresh-1').prop('checked',true); 
        }

        if(items.pushNotifications){
            $('#pushNotifications-0').prop('checked',true);
        }else{
           $('#pushNotifications-1').prop('checked',true); 
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

       
        chrome.storage.sync.set({
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
            }, 750);
        });

    });

});
