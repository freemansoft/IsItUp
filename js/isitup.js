var notApplicable = "N/A";
var gifLoadingEle = "<img src='./img/ajax-loader.gif'>";
var healthResp = "Only Json is displayed";

$(document).ready(function() {

    // get configuraton values
    // get values from localsync
    chrome.storage.local.get({
        allowIndividualRetry: false,
        allowAutomaticRefresh: false,
        pushNotifications: false,
        showBadges: false,
        pageRefreshAfter: 30,
        cfgTxt: "",
        fileTypeTxt: "json"
    }, function(items) {
        doProcess(items);
    });

});

function doProcess(items) {
    // show the options page if we don't have any JSON definition
    if (!items.cfgTxt) {
        chrome.tabs.create({ 'url': "/options.html" })
        return;
    }
    var configuration;
    if ("json" === items.fileTypeTxt) {
        configuration = JSON.parse(items.cfgTxt);
    } else {
        configuration = YAML.parse(items.cfgTxt);
    }
    // don't show an error because this could be a new user with no values yet
    if (!configuration) {
        return;
    }
    var componentMap = {};
    // create a componentMap 
    var hcols = configuration.headers.cols.split(",");
    var hrows = configuration.headers.rows.split(",");
    // now validate json 
    if (hcols.length == 0) {
        setErrorText("Configuration Error: No column headers specified. Please check configuration");
        return;
    }
    if (hrows.length == 0) {
        setErrorText("Configuration Error: No row headers specified. Please check configuration");
        return;
    }
    // verify the number of row headers matches number of rows
    if (configuration.rows.length != hrows.length) {
        setErrorText("Configuration Error: " + configuration.rows.length + " rows of data provided. This conflicts with the " + hrows.length + " row headers provided.");
        return;
    }
    // verify the number of cols in each row matches the number of col headers
    // build out a componentMap that has one element for each row. Key = row name, Value = array of columns
    for (var i = 0; i < configuration.rows.length; i++) {
        if (configuration.rows[i].cols.length != hcols.length) {
            setErrorText("Configuration Error: Row " + i + " has " + configuration.rows[i].cols.length + " columns of data provided. This conflicts with the " + hcols.length + " column headers provided");
            return;
        }
        componentMap[i] = configuration.rows[i].cols;
    }
    // setup title
    layoutTitle(configuration.title);
    // setup badgeShowHideToggle 
    setupBadgeShowHideToggle(items.showBadges);
    var spanIdMap = {}
        // create table
    var isitupHtml = "<table id='envStatusTbl' class='table table-bordered table-striped table-hover table-condensed'>";
    isitupHtml += layoutHeader(hcols);
    isitupHtml += layoutTableBody(hrows, componentMap, spanIdMap, items.allowIndividualRetry, items.showBadges);
    /// isitupHtml += layoutHeader(hcols);
    isitupHtml += "</table>";
    // now inject markup into web page table 
    $('#isitupId').html(isitupHtml);
    // now check health
    checkHealth(spanIdMap, items.pushNotifications);
    // allow automatic refresh
    if (items.allowAutomaticRefresh && items.pageRefreshAfter > 0) {
        // refresh status every x seconds
        window.setInterval(function() {
            /// call your function here
            checkHealth(spanIdMap, items.pushNotifications);
        }, parseInt(items.pageRefreshAfter * 1000));
    }

    $("span").click(function() {
        var spanData = $(this).attr("data");
        if ($(this).text() === notApplicable) {
            $('#status-detail').html("");
            $('#status-detail').hide();
            $('#health').hide();
            return;
        }
        // when refresh is clicked, just re-run the health
        if ($(this).hasClass("glyphicon-refresh")) {
            var healthMap = {};
            healthMap[spanData] = spanIdMap[spanData];
            $('#' + spanData).removeClass("status-code success");
            $('#' + spanData).html(gifLoadingEle);
            checkHealth(healthMap);
            return;
        }
        if($(this).attr('data-target')){
            var dataTargetId = $(this).attr('data-target');
            if ($(this).hasClass("glyphicon glyphicon-collapse-up")) {
                $(this).removeClass("glyphicon glyphicon-collapse-up");
                $(this).addClass("glyphicon glyphicon-collapse-down");
                return;
            }
            if ($(this).hasClass("glyphicon glyphicon-collapse-down")) {
                $(this).removeClass("glyphicon glyphicon-collapse-down");
                $(this).addClass("glyphicon glyphicon-collapse-up");
                return;
            }
        }



        var isJson = isDataJson(spanData);
        if (!isJson) {
            spanData = "Not JSON";
        }
        $('#status-detail').html(spanData);
        $('#status-detail').show();
        $('#health').show();
    });
}

function setupBadgeShowHideToggle(showBadges){
    if(showBadges){
        $('#showBadgeToggle').attr("checked", true);
    }
    // 'collapse out' is hide, 'collapse in' is expand
    $('#showBadgeToggle').change(function() {
        if($(this).is(":checked")) {
            $('.badgeDivClass').removeClass("collapse out");
            $('.badgeDivClass').addClass("collapse in");    
        } else{
            $('.badgeDivClass').removeClass("collapse in");
            $('.badgeDivClass').addClass("collapse out");            
        } 
        $('span').each(function(){
            if($(this).attr('data-toggle')=== 'collapse'){
                if($(this).hasClass('glyphicon glyphicon-collapse-up')){
                    $(this).removeClass('glyphicon glyphicon-collapse-up');
                    $(this).addClass('glyphicon glyphicon-collapse-down');
                }else{
                    $(this).removeClass('glyphicon glyphicon-collapse-down');
                    $(this).addClass('glyphicon glyphicon-collapse-up');
                }
            }
        })
    });
}

// sets the title on the page based on the passed in title. 
// picks a default title if none provided
function layoutTitle(title) {
    if (title) {
        $('#isitupTitleId').html(title);
    } else {
        $('#isitupTitleId').html("Environment Status ");
    }
}

function layoutHeader(columnHeaders) {
    var markupHtml = "";
    markupHtml += "<thead><tr class='info'><th></th>";
    for (var i = 0; i < columnHeaders.length; i++) {
        markupHtml += ("<th>" + columnHeaders[i].toUpperCase() + "</th>");
    }
    markupHtml += "</tr></thead>";
    return markupHtml;
}
// layout a table and return a map of ids to be used for healthcheck
// accepts a component map.  updates spanIdMap returns the table body markup
function layoutTableBody(rowHeaders, componentMap, spanIdMap, allowIndividualRetry,showBadges) {
    var markupHtml = ""
    markupHtml += "<tbody>";
    // build out the table one row at a time
    $.each(componentMap, function(key, value) {
        // row header
        markupHtml += ("<tr><td><b>" + rowHeaders[key] + "</b></td>");
        // now each column
        var rowIsBlank = isRowBlank(value);
        for (var i = 0; i < value.length; i++) {
            if (value[i].healthUrl) {
               spanId = uuid();
                markupHtml += ("<td><span id='" + spanId + "'>" + gifLoadingEle + "</span>");
                // if individual retry is allowed.
                if (allowIndividualRetry) {
                    markupHtml += (" <span id='refreshId' data='" + spanId + "' class='status-code refresh glyphicon glyphicon-refresh' title='Refresh'></span>");
                }
                // setup secondary links as hrefs - they go inside the same cell as primary
                if (value[i].other) {
                    for (var j = 0; j < value[i].other.length; j++) {
                        markupHtml += " <a target='_blank' href='" + value[i].other[j].url + "'>"
                        markupHtml += "<img alt='' src='" + value[i].other[j].icon + "' title='" + value[i].other[j].url + "'/></a> ";
                    }
                }
                // check if other badge info needs to be displayed.
                if(value[i].badges){
                    badgeDivId = uuid();
                    badgeGlyphiconId = uuid();
                    var badgeGlyphicon = 'glyphicon glyphicon-collapse-down';
                    var badgeDivClass= 'collapse out';
                    if(showBadges){
                        // expand badges, so show collapse up icon.
                        badgeGlyphicon = 'glyphicon glyphicon-collapse-up';
                        badgeDivClass= 'collapse in';
                    }
                    markupHtml += "<br><span id='"+badgeGlyphiconId+"' class='"+badgeGlyphicon+"' data-toggle='collapse' data-target='#"+badgeDivId+"'></span>";
                    markupHtml += "<div id='"+badgeDivId+"' class='badgeDivClass "+badgeDivClass+" panel panel-default '>";
                    for (var bi_i = 0; bi_i < value[i].badges.length; bi_i++){
                        badgeSpanId = uuid();
                        markupHtml += ("<span id='" +  badgeSpanId + "' jsonPath='" + escape(value[i].badges[bi_i].jsonPath.trim()) + "'>" + gifLoadingEle + "</span><br>");
                        spanIdMap[badgeSpanId] = value[i].badges[bi_i].url;
                    }
                    markupHtml += "</div>";
                }
                markupHtml += "</td>";
                spanIdMap[spanId] = value[i].healthUrl;
            } else if (rowIsBlank){
                markupHtml += ("<td></td>");
            } else {
                markupHtml += ("<td><span class='status-code na'>" + notApplicable + "</span></td>");
            }

        }
        markupHtml += "</tr>"
    });
    markupHtml += "</tbody>"
    return markupHtml;
}

// return true if all healthcheck urls in the row are blank
function isRowBlank(value){
    var rowIsBlank=true;
    for (var i = 0; i < value.length; i++) {
        if (value[i].healthUrl){
            rowIsBlank=false;
        }
    }
    return rowIsBlank;
}

/**
 * Check health of each url.
 */
function checkHealth(spanIdMap, pushNotifications) {
    // now fire all url's and callback will update span with corresponding style and the content.
    // Deprecation Notice: The jqXHR.success(), jqXHR.error(), and jqXHR.complete() callbacks are removed as of jQuery 3.0. You can use jqXHR.done(), jqXHR.fail(), and jqXHR.always() instead.
    // http://api.jquery.com/jquery.ajax/
    $.each(spanIdMap, function(key, value) {
        $.ajax({
            url: value,
            type: 'GET',
            // 2xx and notmodified 304
            success: function(data) {
                var spanData = "";
                var badgeVal = "200";
                var badgeCssClass = "status-code success"
                if (isDataJson(data)) {
                    data.url = value;
                    spanData = stringify(data);
                } else {
                    var jsonObj = {};
                    jsonObj.url = value;
                    spanData = stringify(jsonObj);
                }
                if($('#' + key).attr('jsonPath')){
                    if(isDataJson(data)) {
                        spanData = stringify(data);
                        var jsonEval = unescape($('#' + key).attr('jsonPath'));
                        badgeVal = jsonPath(data,jsonEval);
                    }else{
                        badgeVal = "";
                    }
                    badgeCssClass = "status-code badge";
                } 
                $('#' + key).removeClass("status-code error");
                $('#' + key).addClass(badgeCssClass);
                $('#' + key).attr('data', spanData);
                $('#' + key).text(badgeVal); 
            },
            error: function(jqXHR, error, errorThrown) {
                errMsg = "";
                if (jqXHR.status) {
                    var statusData = {};
                    statusData.error = errorThrown;
                    errMsg += "with error '" + errorThrown + "' \n";
                    statusData.url = value;
                    $('#' + key).addClass("status-code error");
                    $('#' + key).attr('data', stringify(statusData));
                    $('#' + key).text(jqXHR.status);
                } else {
                    var statusData = {};
                    statusData.error = 'Failed to send xmlhttprequest';
                    statusData.url = value;
                    $('#' + key).addClass("status-code error");
                    $('#' + key).attr('data', stringify(statusData));
                    $('#' + key).text(jqXHR.status);
                }
                errMsg += "URL is " + value;
                if (pushNotifications) {
                    sendNotification((key + " is down!!!"), errMsg);
                }
            },
            complete: function() {
                $('#' + key).attr('title', value);
            }
        });
    });

};

/**
 * Send Notification
 */
function sendNotification(title, notificationMessage) {
    var options = {
        type: "basic",
        title: title,
        iconUrl: 'img/isitup16.png',
        message: (notificationMessage)
    }
    chrome.notifications.create("", options, function(cb) {});

}

/**
 * Checks if given data is of type JSON
 */
function isDataJson(data) {
    if (typeof data === 'object') {
        return true;
    }
    var isJson = true;
    try {
        JSON.parse(data);
    } catch (err) {
        isJson = false;
    }
    return isJson;
}
/**
 * Stringify data with 4 spaces.
 */
function stringify(data) {
    return JSON.stringify(data, null, 4);
}

function setErrorText(text) {
    $('#isitupId').html(text);
}
/**
 * generates uuid
 */
function uuid() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16);
}