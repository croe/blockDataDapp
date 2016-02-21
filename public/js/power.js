var chart = AmCharts.makeChart("power", {
    "type": "serial",
    "theme": "dark",
    "startDuration": 0,
    "marginTop":0,
    "marginRight": 15,
    "dataProvider": [{
        "year": "1979",
        "value": 0.05
    }, {
        "year": "1980",
        "value": 0.077
    }, {
        "year": "1981",
        "value": 0.12
    }, {
        "year": "1982",
        "value": 0.011
    }, {
        "year": "1983",
        "value": 0.177
    }, {
        "year": "1984",
        "value": -0.021
    }, {
        "year": "1985",
        "value": -0.037
    }, {
        "year": "1986",
        "value": 0.03
    }, {
        "year": "1987",
        "value": 0.179
    }, {
        "year": "1988",
        "value": 0.18
    }, {
        "year": "1989",
        "value": 0.104
    }, {
        "year": "1990",
        "value": 0.255
    }, {
        "year": "1991",
        "value": 0.21
    }, {
        "year": "1992",
        "value": 0.065
    }, {
        "year": "1993",
        "value": 0.11
    }, {
        "year": "1994",
        "value": 0.172
    }, {
        "year": "1995",
        "value": 0.269
    }, {
        "year": "1996",
        "value": 0.141
    }, {
        "year": "1997",
        "value": 0.353
    }, {
        "year": "1998",
        "value": 0.548
    }, {
        "year": "1999",
        "value": 0.298
    }, {
        "year": "2000",
        "value": 0.267
    }, {
        "year": "2001",
        "value": 0.411
    }, {
        "year": "2002",
        "value": 0.462
    }, {
        "year": "2003",
        "value": 0.47
    }, {
        "year": "2004",
        "value": 0.445
    }, {
        "year": "2005",
        "value": 0.47
    }],
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
    "dataDateFormat": "YYYY",
    "categoryField": "year",
    "categoryAxis": {
        "minPeriod": "YYYY",
        "parseDates": true,
        "minorGridAlpha": 0.1,
        "minorGridEnabled": true
    },
    "export": {
        "enabled": true
    }
});

chart.addListener("rendered", zoomChart);
if(chart.zoomChart){
    chart.zoomChart();
}

function zoomChart(){
    chart.zoomToIndexes(Math.round(chart.dataProvider.length * 0.4), Math.round(chart.dataProvider.length * 0.55));
}