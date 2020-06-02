$(function () {
    $("#BeginDate").yayigj_date_Sel();
	$("#EndDate").yayigj_date_Sel();
	
	//加载页面获取当天日期
	$("#BeginDate").getCurrday();
	$("#EndDate").getCurrday();

    $('#container').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: null
        },
        credits:{
     		enabled:false // 禁用版权信息
		},
        tooltip: {
            enabled:false //不启用提示框
        },
        colors:['#e480e3','#f06866','#ff9166','#ffae66','#f7eb66','#ff9999'],
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}:{point.percentage} %',
                    style: {
						color:'#333'
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            data: [
//          	{
//                  name: '一星门诊',
//                  y: 15,
//                  sliced: true,
//                  selected: true
//              },
				['一星门诊',15],
                ['二星门诊',30],
                ['三星门诊',10],
                ['四星门诊',8],
                ['五星门诊',12],
                ['其他',25]
            ]
        }]
    });
    
    
    var seriesOptions = [],
        seriesCounter = 0,
        names = ['MSFT', 'AAPL'];
	
	Highcharts.setOptions({
		lang:{
			rangeSelectorFrom:null,
			rangeSelectorTo:'-',
			rangeSelectorZoom:null
		}
	});
	
    function createChart() {
        $('#container2').highcharts('StockChart', {
            rangeSelector: {
                selected: 0,//默认选中日期的索引
                buttons:[
                	{
                		type:'week',
                		count:1,
                		text:'周'
                	},
                	{
                		type:'month',
                		count:1,
                		text:'月'
                	},
                	{
                		type:'year',
                		count:1,
                		text:'年'
                	},
                	{
                		type:'all',
                		text:'全部'
                	}
                ],
                buttonTheme: {
	                width: 50
	            },
                inputDateFormat: '%Y-%m-%d',
				inputEditDateFormat: '%Y-%m-%d',
				inputEnabled:true//是否启用右边的日期
            },
            yAxis: {
                labels: {
//                  formatter: function () {
////                      return (this.value > 0 ? ' + ' : '') + this.value + '%';
//						return this.value;
//                  }
                    format: '{value}'
                },
                plotLines: [{//y轴基准线
                    value: 0,
                    width: 2,
                    color: 'silver'
                }],
                opposite:false//y轴方向，默认在右边
            },
            navigator:{
                enabled:false//隐藏导航
            },
            title: {
            	text: '增长率趋势图',
            	style:{
            		"color": "#21C1AA",
            		"fontSize": "14px",
            		"font-family":"Microsoft YaHei"
            	}
        	},
            scrollbar:{
            	enabled:false//隐藏滚动条
            },
            plotOptions: {
                series: {
                    compare: 'percent',
                    showInNavigator: true,
                    marker:{
                    	enabled:true,
                    	radius:4,//曲线点半径,默认是4
                    	symbol:"diamond",//曲线点类型
                    }
                }
            },
            tooltip: {//提示框
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                valueDecimals: 2,
                split: true
            },
            credits:{
	     		enabled:false // 禁用版权信息
			},
			legend:{
				enabled:true//显示图例
			},
			colors:['#ef7e51','#2dc4ae'],//线条颜色，全局设置
            series: seriesOptions
        });
    }
    $.each(names, function (i, name) {
        $.getJSON('http://datas.org.cn/jsonp?filename=json/' + name.toLowerCase() + '-c.json&callback=?',    function (data) {
            seriesOptions[i] = {
                name: name,
                data: data
            };

            seriesCounter += 1;
            if (seriesCounter === names.length) {
                createChart();
            }
        });
    });
});
