  var notApplicable = "N/A";
  var gifLoadingEle = "<img src='./img/ajax-loader.gif'>";
  var healthResp = "Only Json is displayed";

$(document).ready(function () {

  // get configuraton values
      // get values from localsync
    chrome.storage.sync.get({
        allowIndividualRetry: false,
        allowAutomaticRefresh: false,
        pushNotifications: false,
        pageRefreshAfter: 30,
        cfgTxt: ""
    }, function (items) {
        doProcess(items);
    });

});

function doProcess(items)
{
  var configuration = JSON.parse(items.cfgTxt);
  if(!configuration){
    return;
  }
  var componentMap = {};
  // create a componentMap 
  for (i = 0; i < configuration.length; i++) {
    componentMap[configuration[i].name] = configuration[i].envs;
  }
  var environments = [];
  var component = componentMap[configuration[0].name];
  // create array of elements
  for (var i = 0; i < component.length; i++) {
    environments.push(component[i].name);
  }

  var isitupHtml = "<table id='envStatusTbl' class='table table-bordered table-striped table-hover table-condensed'>";
  isitupHtml += "<thead><tr class='info'><th></th>";
  for (var i = 0; i < environments.length; i++) {
    isitupHtml += ("<th>" + environments[i].toUpperCase() + "</th>");
  }
  isitupHtml += "</tr></thead><tbody>";
  var spanIdMap = {};

  $.each(componentMap, function (key, value) {
    isitupHtml += ("<tr><td><b>" + key + "</b></td>");
    for (var i = 0; i < value.length; i++) {
      spanId = (key + "-" + value[i].name);
      if (value[i].url) {
        isitupHtml += ("<td><span id='" + spanId + "'>" + gifLoadingEle + "</span>");
        // if individual retry is allowed.
        if(items.allowIndividualRetry){
        isitupHtml += (" <span id='refreshId' data='" + spanId + "' class='status-code refresh glyphicon glyphicon-refresh'></span>");
        }
        isitupHtml += "</td>";
        spanIdMap[spanId] = value[i].url;
      } else {
        isitupHtml += ("<td><span class='status-code na'>" + notApplicable + "</span></td>");
      }

    }
    isitupHtml += "</tr>"
  });
  isitupHtml += "</tbody></table>";
  // now update table 
  $('#isitupId').html(isitupHtml);
  // now check health
  checkHealth(spanIdMap);
  // allow automatic refresh
  if(items.allowAutomaticRefresh){
    // refresh status every x seconds
    window.setInterval(function(){
      /// call your function here
      checkHealth(spanIdMap);
    }, parseInt(items.pageRefreshAfter*1000)); 
  }

  $("span").click(function () {
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
    var IS_JSON = true;
    try {
      var json = $.parseJSON(spanData);
    }
    catch (err) {
      IS_JSON = false;
    }
    if (!IS_JSON) {
      spanData = "Not JSON";
    }
    $('#status-detail').html(spanData);
    $('#status-detail').show();
    $('#health').show();
  });
}

/**
 * Check health of each url.
 */
function checkHealth(spanIdMap) {
  var notificationMessage="";
  // now fire all url's and callback will update span with corresponding style and the content.
  $.each(spanIdMap, function (key, value) {
    $.ajax({
      url: value,
      type: 'GET',
      success: function (data) {
        data.url = value;
        $('#' + key).addClass("status-code success");
        $('#' + key).attr('data', data);
        $('#' + key).text("200");
      },
      error: function (jqXHR, error, errorThrown) {
        notificationMessage += (key + " = " + value + "\n");
        if (jqXHR.status) {
          var statusData = {};
          statusData.error = errorThrown;
          statusData.url = value;
          $('#' + key).addClass("status-code error");
          $('#' + key).attr('data', statusData);
          $('#' + key).text(jqXHR.status);
        } else {
          var statusData = {};
          statusData.error = 'Failed to send xmlhttprequest';
          statusData.url = value;
          $('#' + key).addClass("status-code error");
          $('#' + key).attr('data', statusData);
          $('#' + key).text(jqXHR.status);
        }
        if(items.sendNotification){
        sendNotification(notificationMessage);
        }
      },
      complete: function () {
        $('#' + key).removeClass("loading");
      }
    });
  });

  /**
   * Send Notification
   */
  function sendNotification(notificationMessage)
  {
       
       var options = {
         type: "basic",
         title: "Environment is Down",
         iconUrl: 'img/isitup16.png',
         message: (notificationMessage)
       }
       chrome.notifications.create("", options, function (cb) {
       });
    
  }
};