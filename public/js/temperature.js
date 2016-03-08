var deviceId = "31323437353934303832333830343839383734354c";
var client = "http://108.61.170.245:7000/";
var dappId = "17801572182567880835";

jQuery.get(client + "api/dapps/" + dappId + "/api/get/values?deviceId=" + deviceId).done(function (data) {

    var chart = AmCharts.makeChart("temperature", {
        "type": "serial",
        "theme": "dark",
        "startDuration": 0,
        "marginTop":0,
        "marginRight": 15,
        "dataProvider": [],
        "valueAxes": [{
            "axisAlpha": 0,
            "position": "left"
        }],
        "graphs": [{
            "id":"g1",
            "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
            "bullet": "round",
            "bulletSize": 8,         
            "lineColor": "#d1655d",
            "lineThickness": 2,
            "negativeLineColor": "#637bb6",
            "type": "smoothedLine",
            "valueField": "value"
        }],
        "chartScrollbar": {
            "graph":"g1",
            "gridAlpha":0,
            "color":"#888888",
            "scrollbarHeight":55,
            "backgroundAlpha":0,
            "selectedBackgroundAlpha":0.1,
            "selectedBackgroundColor":"#888888",
            "graphFillAlpha":0,
            "autoGridCount":true,
            "selectedGraphFillAlpha":0,
            "graphLineAlpha":0.2,
            "graphLineColor":"#c2c2c2",
            "selectedGraphLineColor":"#888888",
            "selectedGraphLineAlpha":1
        },
        "chartCursor": {
            "categoryBalloonDateFormat": "YYYY",
            "cursorAlpha": 0,
            "valueLineEnabled":true,
            "valueLineBalloonEnabled":true,
            "valueLineAlpha":0.5,
            "fullWidth":true
        },
        "dataDateFormat": "DD-MM-YYYY",
        "categoryField": "time",
        "categoryAxis": {
            "minPeriod": "DD",
            "parseDates": true,
            "minorGridAlpha": 0.1,
            "minorGridEnabled": true
        },
        "export": {
            "enabled": true
        }
    });

  if (data.error == "DAPPS.DAPPS_NOT_READY") {
    alert("Dapp offline! The master node which computes your instance of this dapp is offline. Please reload the window!");
  }

  jQuery.each(data.response.homeValues, function (key, value) {
    chart.dataProvider.push({time: clock, value: value.asset.temperature});
  });
  chart.validateData();
});

chart.addListener("rendered", zoomChart);
if(chart.zoomChart){
    chart.zoomChart();
}

function zoomChart(){
    chart.zoomToIndexes(Math.round(chart.dataProvider.length * 0.4), Math.round(chart.dataProvider.length * 0.55));
}