var deviceId = "31323437353934303832333830343839383734354c";
var client = "http://108.61.170.245:7000/";
var dappId = "17801572182567880835";

jQuery.get(client + "api/dapps/" + dappId + "/api/get/values?deviceId=" + deviceId).done(function (data) {

    var gaugeChart = AmCharts.makeChart( "gas", {
      "type": "gauge",
      "startDuration": 0,
      "theme": "dark",
      "axes": [ {
        "axisThickness": 1,
        "axisAlpha": 0.2,
        "tickAlpha": 0.2,
        "valueInterval": 20,
        "text": "80",
        "bands": [ {
          "color": "#84b761",
          "endValue": 90,
          "startValue": 0
        }, {
          "color": "#fdd400",
          "endValue": 130,
          "startValue": 90
        }, {
          "color": "#cc4748",
          "endValue": 220,
          "innerRadius": "95%",
          "startValue": 130
        } ],
        "bottomText": data.response.homeValues[3].asset.gas + " bar",
        "bottomTextYOffset": -20,
        "endValue": 220
      } ],
      "arrows": [ {
        "value": data.response.homeValues[3].asset.gas
      }],
      "export": {
        "enabled": true
      }
    });

  gaugeChart.validateData();
});