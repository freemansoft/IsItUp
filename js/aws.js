$(document).ready(function() {

    var healthUrl = "health";
    var testCabinetUrl = "TestCabinet";
    var indexUrl = "index";
    var dynoUrl = "form/accessAdmin";
    var blank = "";
    var appDynamicsUrl2 = "https://finra{{vpc}}.saas.appdynamics.com/controller/#/location=APP_DASHBOARD&application={{app}}&dashboardMode=force";
    var splunkUrl2 = "https://finra.splunkcloud.com/en-US/app/search/search?q=search%20host%3D%22{{component}}*%22";
    var infoUrl = "info";
    var esearchUrl = "_nodes?v";

    var appDynamicsComponentMap = {
        "DEV": "122",
        "INT": "123",
        "INT3": "124",
        "QA": "125",
        "QAUAT": "131",
        "QAPM": "130",
        "QA-PREM": "28",
        "PROD": "141",
        "PROD-PREM": "68",
        "ESEARCH-DEV": "203"
    };

    var splunkMap = {
        "INDEX-DEV": "awslxcdip-aped11",
        "INDEX-QA": "awslxcdip-apeq11",
        "INDEX-PROD": "awslxcdip-apep11",

        "INDEX-INT": "awslxcdip-aped13",
        "INDEX-QA-PM": "awslxcdip-apeq13",

        "INDEX-INT3": "awslxcdip-aped15",
        "INDEX-QA-UAT": "awslxcdip-apeq15",

        "CABINET-DEV-ISSO": "awslxcdip-aped21",
        "CABINET-QA-ISSO": "awslxcdip-apeq21",
        "CABINET-PROD-ISSO": "awslxcdip-apep21",

        "CABINET-DEV-EWS": "awslxcdip-aped22",
        "CABINET-QA-EWS": "awslxcdip-apeq22",
        "CABINET-PROD-EWS": "awslxcdip-apep22",

        "CABINET-INT-ISSO": "awslxcdip-aped23",
        "CABINET-QA-PM-ISSO": "awslxcdip-apeq23",

        "CABINET-INT-EWS": "awslxcdip-aped24",
        "CABINET-QA-PM-EWS": "awslxcdip-apeq24",

        "CABINET-INT3-ISSO": "awslxcdip-aped25",
        "CABINET-QA-UAT-ISSO": "awslxcdip-apeq25",

        "CABINET-INT3-EWS": "awslxcdip-aped26",
        "CABINET-QA-UAT-EWS": "awslxcdip-apeq26",

        "NGINX-DEV": "awslxcdip-aped52",
        "NGINX-QA": "awslxcdip-apeq52",
        "NGINX-PROD": "awslxcdip-apep52",

        "NGINX-INT": "awslxcdip-aped54",
        "NGINX-QA-PM": "awslxcdip-apeq54",

        "NGINX-INT3": "awslxcdip-aped56",
        "NGINX-QA-UAT": "awslxcdip-apeq56",

        "QA-PREM": "kwalxapptq011",
        "PROD-PREM": "ny4lxapptp010",

        "ESEARCH-DEV": "awslxcdip-aped61"
    };

    function getAppDynamicsUrl(env) {
        var vpc = "";
        if (env === "PROD" || env === "PROD-PREM") {
            vpc = "pd";
        }
        var appDynamicsUrl = appDynamicsUrl2.replace("{{vpc}}", vpc);
        appDynamicsUrl = appDynamicsUrl.replace("{{app}}", appDynamicsComponentMap[env]);
        return appDynamicsUrl;
    };

    function getSplunkUrl(component) {
        var splunkUrl = splunkUrl2.replace("{{component}}", splunkMap[component]);
        return splunkUrl;
    };


    var items = [
        ["DEV", [
            ["https://firms.di.dev.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("NGINX-DEV"), blank],
            ["https://public.di.dev.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("NGINX-DEV"), blank],
            ["https://ews-ext.di.dev.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("CABINET-DEV-EWS"), getAppDynamicsUrl("DEV")],
            ["https://ews.di.dev.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("CABINET-DEV-EWS"), getAppDynamicsUrl("DEV")],
            ["https://isso.di.dev.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("CABINET-DEV-ISSO"), getAppDynamicsUrl("DEV")],
            ["https://index-api.di.dev.finra.org/cdip-index/", "health", indexUrl, getSplunkUrl("INDEX-DEV"), getAppDynamicsUrl("DEV")],
            ["https://esearch.di.dev.finra.org/", "_cluster/health?pretty", esearchUrl, getSplunkUrl("ESEARCH-DEV"), getAppDynamicsUrl("ESEARCH-DEV")],
            ["https://formui-api.dev.finra.org/cdip-erm/", "health", blank, blank, blank],
            ["http://formui-isso.dev.finra.org/cdip-dynoapp/", "health", dynoUrl, blank, blank],
            ["https://formui.dev.finra.org/cdip-cabinet/", "health", testCabinetUrl, blank, blank],
            ["https://formui-api.dev.finra.org/cdip-index/", "health", indexUrl, blank, blank]
        ]],
        ["INT", [
            ["https://firms-int.di.dev.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("NGINX-INT"), blank],
            ["https://public-int.di.dev.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("NGINX-INT"), blank],
            ["https://ews-ext-int.di.dev.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("CABINET-INT-EWS"), getAppDynamicsUrl("INT")],
            ["https://ews-int.di.dev.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("CABINET-INT-EWS"), getAppDynamicsUrl("INT")],
            ["https://isso-int.di.dev.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("CABINET-INT-ISSO"), getAppDynamicsUrl("INT")],
            ["https://index-api-int.di.dev.finra.org/cdip-index/", "health", testCabinetUrl, getSplunkUrl("INDEX-INT"), getAppDynamicsUrl("INT")],
            ["https://esearch-int.di.dev.finra.org", "_cluster/health?pretty", esearchUrl, blank, blank],
            ["https://formui-api.int.finra.org/cdip-erm/", "health", blank, blank, blank],
            ["http://formui-isso.int.finra.org/cdip-dynoapp/", "health", dynoUrl, blank, blank],
            ["https://formui.int.finra.org/cdip-cabinet/", "health", testCabinetUrl, blank, blank],
            ["https://formui-api.int.finra.org/cdip-index/", "health", indexUrl, blank, blank]
        ]],
        ["INT3", [
            ["https://firms-int3.di.dev.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("NGINX-INT3"), blank],
            ["https://public-int3.di.dev.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("NGINX-INT3"), blank],
            ["https://ews-ext-int3.di.dev.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("CABINET-INT3-EWS"), getAppDynamicsUrl("INT3")],
            ["https://ews-int3.di.dev.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("CABINET-INT3-EWS"), getAppDynamicsUrl("INT3")],
            ["https://isso-int3.di.dev.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("CABINET-INT3-ISSO"), getAppDynamicsUrl("INT3")],
            ["https://index-api-int3.di.dev.finra.org/cdip-index/", "health", testCabinetUrl, getSplunkUrl("INDEX-INT"), getAppDynamicsUrl("INT3")],
            ["https://esearch-int3.di.dev.finra.org", "_cluster/health?pretty", esearchUrl, blank, blank],
            ["https://formui3-api.int.finra.org/cdip-erm/", "health", blank, blank, blank],
            ["http://formui3-isso.int.finra.org/cdip-dynoapp/", "health", dynoUrl, blank, blank],
            ["https://formui3.int.finra.org/cdip-cabinet/", "health", testCabinetUrl, blank, blank],
            ["https://formui3-api.int.finra.org/cdip-index/", "health", indexUrl, blank, blank]
        ]],
        ["QA", [
            ["https://firms.di.qa.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("NGINX-QA"), blank],
            ["https://public.di.qa.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("NGINX-QA"), blank],
            ["https://ews-ext.di.qa.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("CABINET-QA-EWS"), getAppDynamicsUrl("QA")],
            ["https://ews.di.qa.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("CABINET-QA-EWS"), getAppDynamicsUrl("QA")],
            ["https://isso.di.qa.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("CABINET-QA-ISSO"), getAppDynamicsUrl("QA")],
            ["https://index-api.di.qa.finra.org/cdip-index/", "health", testCabinetUrl, getSplunkUrl("INDEX-QA"), getAppDynamicsUrl("QA")],
            ["https://esearch.di.qa.finra.org", "_cluster/health?pretty", esearchUrl, blank, blank],
            ["https://formui-api.qa.finra.org/cdip-erm/", "health", blank, getSplunkUrl("QA-PREM"), getAppDynamicsUrl("QA-PREM")],
            ["http://formui-isso.qa.finra.org/cdip-dynoapp/", "health", dynoUrl, getSplunkUrl("QA-PREM"), getAppDynamicsUrl("QA-PREM")],
            ["https://formui.qa.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("QA-PREM"), getAppDynamicsUrl("QA-PREM")],
            ["https://formui-api.qa.finra.org/cdip-index/", "health", indexUrl, getSplunkUrl("QA-PREM"), getAppDynamicsUrl("QA-PREM")]
        ]],
        ["QA-UAT", [
            ["https://firms-uat.di.qa.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("NGINX-QA-UAT"), blank],
            ["https://public-uat.di.qa.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("NGINX-QA-UAT"), blank],
            ["https://ews-ext-uat.di.qa.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("CABINET-QA-UAT-EWS"), getAppDynamicsUrl("QA-UAT")],
            ["https://ews-uat.di.qa.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("CABINET-QA-UAT-EWS"), getAppDynamicsUrl("QA-UAT")],
            ["https://isso-uat.di.qa.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("CABINET-QA-UAT-ISSO"), getAppDynamicsUrl("QA-UAT")],
            ["https://index-api-uat.di.qa.finra.org/cdip-index/", "health", testCabinetUrl, getSplunkUrl("INDEX-QA-UAT"), getAppDynamicsUrl("QA-UAT")],
            ["https://esearch-uat.di.qa.finra.org", "_cluster/health?pretty", esearchUrl, blank, blank],
            ["https://formui2uat-api.qa.finra.org/cdip-erm/", "health", blank, blank, blank],
            ["http://formui2uat-isso.qa.finra.org/cdip-dynoapp/", "health", dynoUrl, blank, blank],
            ["https://formui2uat.qa.finra.org/cdip-cabinet/", "health", testCabinetUrl, blank, blank],
            ["https://formui2uat-api.qa.finra.org/cdip-index/", "health", indexUrl, blank, blank]
        ]],
        ["QA-PM", [
            ["https://firms-pm.di.qa.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("NGINX-QA-PM"), blank],
            ["https://public-pm.di.qa.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("NGINX-QA-PM"), blank],
            ["https://ews-ext-pm.di.qa.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("CABINET-QA-PM-EWS"), getAppDynamicsUrl("QA-PM")],
            ["https://ews-pm.di.qa.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("CABINET-QA-PM-EWS"), getAppDynamicsUrl("QA-PM")],
            ["https://isso-pm.di.qa.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("CABINET-QA-PM-ISSO"), getAppDynamicsUrl("QA-PM")],
            ["https://index-api-pm.di.qa.finra.org/cdip-index/", "health", testCabinetUrl, getSplunkUrl("INDEX-QA-PM"), getAppDynamicsUrl("QA-PM")],
            ["https://esearch-pm.di.qa.finra.org", "_cluster/health?pretty", esearchUrl, blank, blank],
            ["https://formui2-api.qa.finra.org/cdip-erm/", "health", blank, blank, blank],
            ["http://formui2-isso.qa.finra.org/cdip-dynoapp/", "health", dynoUrl, blank, blank],
            ["https://formui2.qa.finra.org/cdip-cabinet/", "health", testCabinetUrl, blank, blank],
            ["https://formui2-api.qa.finra.org/cdip-index/", "health", indexUrl, blank, blank]
        ]],
        ["PROD", [
            ["https://firms.di.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("NGINX-PROD"), blank],
            ["https://public.di.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("NGINX-PROD"), blank],
            ["https://ews-ext.di.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("CABINET-PROD-EWS"), getAppDynamicsUrl("PROD")],
            ["https://ews.di.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("CABINET-PROD-EWS"), getAppDynamicsUrl("PROD")],
            ["https://isso.di.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("CABINET-PROD-ISSO"), getAppDynamicsUrl("PROD")],
            ["https://index-api.di.finra.org/cdip-index/", "health", testCabinetUrl, getSplunkUrl("INDEX-PROD"), getAppDynamicsUrl("PROD")],
            ["https://esearch.di.finra.org", "_cluster/health?pretty", esearchUrl, blank, blank],
            ["http://formui-api.finra.org/cdip-erm/", "health", blank, getSplunkUrl("PROD-PREM"), getAppDynamicsUrl("PROD-PREM")],
            ["https://formui.finra.org/cdip-dynoapp/", "health", dynoUrl, getSplunkUrl("PROD-PREM"), getAppDynamicsUrl("PROD-PREM")],
            ["https://formui.finra.org/cdip-cabinet/", "health", testCabinetUrl, getSplunkUrl("PROD-PREM"), getAppDynamicsUrl("PROD-PREM")],
            ["http://formui-api.finra.org/cdip-index/", "health", indexUrl, getSplunkUrl("PROD-PREM"), getAppDynamicsUrl("PROD-PREM")]
        ]]


    ];


    var output = "";
    var statusCheckMap = {};
    var healthCheckMap = {};
    var spanId;
    for (var i = 0; i < items.length; i++) {
        output = "";
        output += "<tr class='active'>";
        output += ("<td><b>" + items[i][0] + "</b></td>");
        var urlValue;
        var appUrl;
        var appDUrl;
        var splunk;
        for (var j = 0; j < items[i][1].length; j++) {
            urlValue = items[i][1][j][0];
            healthUrl = items[i][1][j][1];
            appUrl = items[i][1][j][2];
            splunk = items[i][1][j][3];
            appDUrl = items[i][1][j][4];
            spanId = items[i][0] + "-" + j;
            output += "<td><span id='" + spanId + "'><img src='./img/ajax-loader.gif'></span>";
            if (appUrl !== blank) {
                output += " <a href='" + (urlValue + appUrl) + "' target='_blank' title='Open new window'><img src='./img/cabinet.png' width='22' height='22'/></a> ";
            }
            if (splunk !== blank) {
                output += " <a href='" + splunk + "' target='_blank' title='Splunk Log'><img src='./img/splunk.png' width='16' height='16'/></a> ";
            }
            if (appDUrl !== blank) {
                output += " <a href='" + appDUrl + "' target='_blank' title='AppDynamics'><img src='./img/appdynamics.png' width='16' height='16' top='1px'/></a>";
            }
            output += "</td>";
            // create a map with spanId and value.
            statusCheckMap[spanId] = urlValue;
            healthCheckMap[spanId] = healthUrl;
        };
        output += "</tr>";
        $('#envStatusTbl > tbody:last').append(output);
    };
    // now fire all url's and callback will update span with corresponding style and the content.
    $.each(statusCheckMap, function(key, value) {
        $.ajax({
            url: value + healthCheckMap[key],
            type: 'GET',
            success: function(data) {
                data.url = value;
                $('#' + key).addClass("status-code success");
                $('#' + key).attr('data', JSON.stringify(data, null, 1));
                $('#' + key).text("200");
            },
            error: function(jqXHR, error, errorThrown) {
                if (jqXHR.status) {
                    var statusData = {};
                    statusData.error = errorThrown;
                    statusData.url = value;
                    $('#' + key).addClass("status-code error");
                    $('#' + key).attr('data', JSON.stringify(statusData, null, 1));
                    $('#' + key).text(jqXHR.status);
                } else {
                    var statusData = {};
                    statusData.error = 'Failed to send xmlhttprequest';
                    statusData.url = value;
                    $('#' + key).addClass("status-code error");
                    $('#' + key).attr('data', JSON.stringify(statusData, null, 1));
                    $('#' + key).text(jqXHR.status);
                }
            },
            complete: function() {
                $('#' + key).removeClass("loading");
            }
        });
    });


    $("span").click(function() {
        var spanData = JSON.parse($(this).attr("data"));
        var infoEndPoint = spanData.url + infoUrl;
        $('#status-detail').html($(this).attr("data"));
        $('#status-detail').show();
        $('h4').show();
        // now get the info out for each.
        if ($(this).text() === '200') {
            $('#infoPanel').html("<img src='./img/ajax-loader.gif'/>");
            $.ajax({
                url: infoEndPoint,
                type: 'GET',
                success: function(data) {
                    $('#infoPanel').html(JSON.stringify(data, null, 2));
                    $('#infoPanel').show();
                },
                error: function(jqXHR, error, errorThrown) {
                    if (jqXHR.status) {
                        var statusData = {};
                        statusData.error = errorThrown;
                        $('#infoPanel').html(JSON.stringify(statusData, null, 2));
                        $('#infoPanel').show();
                    }
                }
            });
        } else if ($(this).text() === '0') {
            $('#infoPanel').html(JSON.stringify(spanData, null, 2));
            $('#infoPanel').show();
        } else {
            $('#infoPanel').html("");
            $('#infoPanel').hide();
        }
    });

});