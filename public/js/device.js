AmCharts.ready(function() {

    // column chart with different negative colors
    var chart = new AmCharts.AmSerialChart(AmCharts.themes.dark);
    chart.dataProvider = [{
        day: 1,
        value: -5
    }, {
        day: 2,
        value: 3
    }, {
        day: 3,
        value: 7
    }, {
        day: 4,
        value: -3
    }, {
        day: 5,
        value: 3
    }, {
        day: 6,
        value: 4
    }, {
        day: 7,
        value: 6
    }, {
        day: 8,
        value: -3
    }, {
        day: 9,
        value: -2
    }, {
        day: 10,
        value: 6
    }];
    chart.categoryField = "day";
    chart.autoMargins = false;
    chart.marginLeft = 0;
    chart.marginRight = 0;
    chart.marginTop = 0;
    chart.marginBottom = 0;

    var graph = new AmCharts.AmGraph();
    graph.valueField = "value";
    graph.type = "column";
    graph.fillAlphas = 1;
    graph.showBalloon = false;
    graph.lineColor = "#ffbf63";
    graph.negativeFillColors = "#289eaf";
    graph.negativeLineColor = "#289eaf";
    chart.addGraph(graph);

    var valueAxis = new AmCharts.ValueAxis();
    valueAxis.gridAlpha = 0;
    valueAxis.axisAlpha = 0;
    chart.addValueAxis(valueAxis);

    var categoryAxis = chart.categoryAxis;
    categoryAxis.gridAlpha = 0;
    categoryAxis.axisAlpha = 0;
    chart.write("device");


});