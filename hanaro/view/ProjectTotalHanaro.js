function redrawTotalChartAll() {
Ext.getBody().mask("잠시만 기다려주세요.");
	gUtil.redrawTotalChartAll();
}

var boardList = [];
var selectedTr = null;
var selectedline = -1;
var createViewForm = function (board) {

	//console_logs('board', board);

	var board_title = board.board_title
	var board_content = board.board_content;
	var create_date = board.create_date;
	var htmlFileNames = board.htmlFileNames;
	var fileQty = board.fileQty;
	var form = Ext.create('Ext.form.Panel', {
		defaultType: 'displayfield',
		bodyPadding: 15,
		height: 400,
		defaults: {
			anchor: '100%',
			msgTarget: 'side',
			labelWidth: 100
		},
		items: [{
				xtype: 'component',
				html: board_title
			},{
				xtype: 'component',
				html: '<hr />'
			},{
				xtype: 'component',
				html: '<div style="text-align:right;color:#009700;">' + create_date + '</div>'
			},{
				xtype:          'component',
				html: board_content,
				fieldStyle: 'background-color: #E3E9EF; background-image: none; color:#5F6DA3;',
				height: 340,
				readOnly: true
			}  
			]
	}); //endof form
	
	return form;
};

function showBoard(i) {

	var board = boardList[i];

	var oTr = $('#table_tr' + i);
	//oTr.addClass('selected');
	//console_logs('oTr', oTr);

	oTr.css("background-color", "#DCE4D6");
	if(selectedTr!=null) {
		selectedTr.css("background-color", "transparent");
	}
	selectedTr = oTr;

	var form = createViewForm(board);

	var user_name = board.user_name;
	var user_id = board.user_id;
	var board_email = board.board_email;

	var win = Ext.create('ModalWindow', {
		title: user_name + '(' + user_id + ')',
		width: 500,
		height: 400,
		minWidth: 200,
		minHeight: 180,
		layout: 'absolute',
		plain:true,
		items: form,
		buttons: [{
			text: CMD_OK,
			handler: function(){
					   if(win) 
					   {
						   win.close();
					   } 
			  }
		}]
	});
	win.show();

};

Ext.define('Hanaro.view.ProjectTotalHanaro', {
    extend: (vSYSTEM_TYPE == 'HANARO') ? 'Hanaro.base.HanaroBasePanel' : 'Rfx.base.BasePanel',
    alias: 'widget.projectTotal',
    
    oSumMainTab1_pre: 0,
    oSumMainTab1_mass: 0,
    oSumMainTab1_common: 0,
    oSumMainTab1_etc: 0,
    oSumMainTab1_total: 0,
    
    createToolbar: function(){

        var items = [],
            config = {};
        if (!this.inTab) {
			items.push({
	        	xtype: 'label',
	        	style: 'color:white;',
	        	html:'실시간종합'
			});	 
			items.push({
                scale: 'small',
            	glyph: 'f044@FontAwesome',
				xtype: 'button'
				,cls: 'my-transparent-button'
				,baseCls: 'my-transparent-button'
				,pressedCls: 'my-transparent-button-pressed'
            });
			items.push('->');
			

			var systemName = '하나로MES 2019';
			var version = 'v' + vMajor + '.' +vMinor;
			var color ='#fafafa';
			if(vSYSTEM_TYPE_SUB == 'SOLIDENG') {
				systemName = 'SolidMES';
			}
			
			items.push({
				xtype : 'component',
				html: '<span style="font-size:9px; font-weight:normal;color:' + color + ';"><i>' + systemName + '</i> on '+ version + '</span>'
			});

			items.push('-');
  
	        items.push({
	        	xtype: 'component',
	        	html: '<div class="searchcon" onClick="openNewWindow();" title="새로운 탭화면 열기"><span class="newwinBT"></span></div>'
	            //html: '<div class="inputBT"><button type="button" onClick="openNewWindow();"><span class="search">새창으로 보기</span></button></div>'
			});
	        config.items = items;
            
        }
        else {
            config.cls = 'x-docked-border-bottom';
        }
		config.cls = 'my-x-toolbar-default1-3-hanaro';
		config.height = 30;
        return Ext.create('widget.toolbar', config);

    },
    initComponent: function(){
        Ext.apply(this, {
        	contentEl: 'costPagelayout'
        });
        this.callParent(arguments);
        
        this.redrawTotalChartAll();
    },
    redrawTotalChartAll: function() {
		console_logs('redrawTotalChartAll', 'redrawTotalChartAll');
		console_logs('jsonBoard', jsonBoard);
		
		if(jsonBoard!=null && jsonBoard.length>0) {
			boardList = (Ext.decode(jsonBoard)).datas;
		}
		console_logs('boardList', boardList);
		//헤더정보
		// $('#mainTable1 > tbody:last-child').append(
		// 	'<tr>'
		// 	+'<th class="thbg1">합계</th>'
		// 	+'<th><span class="bluetxt" id="td1-total-1">' + Ext.util.Format.number(sum2/1000, '0,00/i') + '</span></th>'
		// 	+'<th><span class="bluetxt" id="td1-total-2">' + Ext.util.Format.number(sum3/1000, '0,00/i') + '</span></th>'
		// 	+'<th><span class="bluetxt" id="td1-total-3">' + Ext.util.Format.number(sum4/1000, '0,00/i') + '</span></th>'
		// 	+'<th><span class="bluetxt" id="td1-total-4">' + Ext.util.Format.number(sum5/1000, '0,00/i') + '</span></th>'
		// 	+'<th><span class="redtxt" id="td1-total-total">' +Ext.util.Format.number(sum6/1000, '0,00/i') + '</span></th>'
		// 	+'</tr>' );
		
		//레코드
		for(var i=0; i<boardList.length; i++) {
			var rec = boardList[i];
			var line = '<tr style="cursor: pointer;" id=' + 'table_tr' + i + ' onClick="showBoard(' + i + ')">'
				+'<td colspan=3 style="text-align:left; ">'+ rec.board_title + '</td>'
				+'<td style="text-align:center;">'+ rec.user_name + '</td>'
				+'<td style="text-align:center;">'+ (rec.create_date).substring(0,10) + '</td>'
				//+'<td>'+ rec.board_count + '</td>'
				+'</tr>';
				$('#mainTable1 > tbody:last-child').append( line );							
		}

		this.redrawTotalChart0();
		this.redrawTotalChart1();



    	this.redrawTotalChart2();
    	this.redrawTotalChart3();
    	
    },
    getMonthDay: function(d) {
    	var m = (d.getMonth()+1) + '';
    	var d = (d.getDate()) + '';
    	
    	return m + '/' + d;
    },
	
	redrawTotalChart0 : function () {

		var option = {
			title: {
				top: 0,
				text: '실시간 KPI'
			},
			tooltip: {},
			legend: {
				show: true,
				data: ['계획', '실적'],
				top: 50,
				right: 20,
				orient: 'vertical'
			},
			radar: {
				shape: 'circle',
				name: {
					textStyle: {
						color: '#fff',
						backgroundColor: '#999',
						borderRadius: 3,
						padding: [3, 5]
				   }
				},
				indicator: [
				   { name: '생산량', max: 6500},
				   { name: '납기준수', max: 10},
				   { name: '품질개선', max: 30000},
				   { name: '적정재고', max: 38000},
				   { name: '고객만족', max: 52000},
				   { name: '매출목표', max: 25000}
				]
			},
			series: [{
				name: '预算 vs 开销（Budget vs spending）',
				type: 'radar',
				// areaStyle: {normal: {}},
				data : [
					{
						value : [4300, 9, 28000, 35000, 50000, 19000],
						name : '경영목표'
					},
					 {
						value : [5000, 8, 28000, 31000, 42000, 21000],
						name : '경영실적'
					}
				]
			}]
		};

		option.grid = {
			left: 10,
			top: 25,
			right: 10,
			bottom: 5
		};

		
		var target = 'targerStatpenta';
		var chartTarget = document.getElementById(target);

		echarts.dispose(chartTarget);
		var myChart = echarts.init(chartTarget);

		myChart.setOption(option);
			
		window.onresize = function() {
			myChart.resize();
		};

		
		// setInterval(function () {
		// 	option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
		// 	myChart.setOption(option, true);
		// },20000);

	},

	redrawTotalChart1 : function () {

		var target = 'projecttotal-east-north-graph';
		var chartTarget = document.getElementById(target);

		var type = '';
		var xName = '';
		var yName = '';
		var dataName = '';

		var start_date = '20190717';
		var end_date =   gu.yyyymmdd(new Date());
		var time_unit = 'day';

		var call_url = CONTEXT_PATH + '/dashboard.do?method=getStaticsticProduction';
		var chartName = '제품 생산 추이';
		Ext.Ajax.request({
			url: call_url,				
			params:{
				start_date: start_date,
				end_date : end_date,
				time_unit : time_unit
			},
			success : function(response, request) {

				var val = Ext.JSON.decode(response.responseText);
				var list = val.datas;
				var listSeries = val.series;
				var listCat =  val.categories;

				var categories = [];
				for(var i=0; i<listCat.length; i++) {
					var s = listCat[i];
					var s1 = s.substring(4,6)+'/'+s.substring(6,8);
					categories.push(s1)
				}

				var seriesAll = [];

				//시리즈 오브젝트 생성
				for(var i=0; i<listSeries.length; i++) {
					var key = listSeries[i];
					var arr = key.split(':');
					seriesAll.push({
						series: key,
						name: arr[1],
						key: arr[0],
						data: []
					});
				}
				//카테고리 수만큼 초기화0 함
				for(var i=0; i<categories.length; i++) {
					for(var j=0; j<seriesAll.length; j++) {
						var s = seriesAll[j];
						s.data.push(0);
					}
				}

				for(var i=0; i<list.length; i++) {
					var o = list[i];
					//console_logs('o', o);
					var key1 = o.key1;
					var s1 = key1.substring(4,6)+'/'+key1.substring(6,8);
					var series = o.series;
					var val1 = o.val1;
					if(series!=null) {
						var pos = 0;
						for(; pos<categories.length; pos++) {
							if(categories[pos]==s1) {
								break;
							}
						}
						
						for(var j=0; j<seriesAll.length; j++) {
							var s = seriesAll[j];
							if(s.series == series) {
								s.data[pos] = val1;
							}
						}
					}

				}
				for(var j=0; j<seriesAll.length; j++) {
					var s = seriesAll[j];
					delete s['series'];
				}

				var params = getEchartParam(categories, seriesAll, true, true);
				//console_logs('params', params);
				echarts.dispose(chartTarget);
				var myChart = echarts.init(chartTarget);
				var option = getEchartOption();
				option.title = {
					left: 'center',
					textStyle: {
						fontSize: 14
					},
					text: chartName
				};
				option.dataset = {
					dimensions: params.dimensions,
					source: params.sources
				};
				option.xAxis = {
					type: 'category',
					
					axisLabel:{textStyle:{fontSize:11}}
			
				};
				option.yAxis = {
					name : yName,
					splitLine: {
						show: true,
						lineStyle: {
							color: '#F6F6F6',
							type: 'solid',
							width: "1"
						}
					},
					axisLabel:{
						show: false,
						textStyle:{fontSize:11}}
				};
				option.legend = {
					show : false
				};
				option.grid = {
					left: 10,
					top: 15,
					right: 10,
					bottom: 20
				};
				
				option.series = params.series;
				myChart.setOption(option);
			
				window.onresize = function() {
					myChart.resize();
				};

			},// endof success for ajax
			failure:function(result, request) {
				console_logs('fail', '#');
			}
			
		}); // endof Ajax

	},
	redrawTotalChart2 : function () {

		var target = 'projecttotal-east-center-graph';
		var chartTarget = document.getElementById(target);

		var type = '';
		var xName = '';
		var yName = '';
		var dataName = '';

		var start_date = '20190401';
		var end_date =   gu.yyyymmdd(new Date());
		var time_unit = 'day';

		var call_url = CONTEXT_PATH + '/dashboard.do?method=getStaticsticDefect&data_type=' + 'QLA';
		var chartName = '출하 불량 추이';
		Ext.Ajax.request({
			url: call_url,				
			params:{
				start_date: start_date,
				end_date : end_date,
				time_unit : time_unit
			},
			success : function(response, request) {

				var val = Ext.JSON.decode(response.responseText);
				var list = val.datas;
				var listSeries = val.series;
				var listCat =  val.categories;

				var categories = [];
				for(var i=0; i<listCat.length; i++) {
					var s = listCat[i];
					var s1 = s.substring(4,6)+'/'+s.substring(6,8);
					categories.push(s1)
				}

				var seriesAll = [];

				//시리즈 오브젝트 생성
				for(var i=0; i<listSeries.length; i++) {
					var key = listSeries[i];
					var arr = key.split(':');
					seriesAll.push({
						series: key,
						name: arr[1],
						key: arr[0],
						data: []
					});
				}
				//카테고리 수만큼 초기화0 함
				for(var i=0; i<categories.length; i++) {
					for(var j=0; j<seriesAll.length; j++) {
						var s = seriesAll[j];
						s.data.push(0);
					}
				}

				for(var i=0; i<list.length; i++) {
					var o = list[i];
					//console_logs('o', o);
					var key1 = o.key1;
					var s1 = key1.substring(4,6)+'/'+key1.substring(6,8);
					var series = o.series;
					var val1 = o.val1;
					if(series!=null) {
						var pos = 0;
						for(; pos<categories.length; pos++) {
							if(categories[pos]==s1) {
								break;
							}
						}
						
						for(var j=0; j<seriesAll.length; j++) {
							var s = seriesAll[j];
							if(s.series == series) {
								s.data[pos] = val1;
							}
						}
					}

				}
				for(var j=0; j<seriesAll.length; j++) {
					var s = seriesAll[j];
					delete s['series'];
				}

				var params = getEchartParam(categories, seriesAll, true, true);
				//console_logs('params', params);
				echarts.dispose(chartTarget);
				var myChart = echarts.init(chartTarget);
				var option = getEchartOption();
				option.title = {
					left: 'center',
					textStyle: {
						fontSize: 14
					},
					text: chartName
				};
				option.dataset = {
					dimensions: params.dimensions,
					source: params.sources
				};
				option.xAxis = {
					type: 'category',
					
					axisLabel:{textStyle:{fontSize:11}}
			
				};
				option.yAxis = {
					name : yName,
					splitLine: {
						show: true,
						lineStyle: {
							color: '#F6F6F6',
							type: 'solid',
							width: "1"
						}
					},
					axisLabel:{
						show: false,
						textStyle:{fontSize:11}}
				};

				option.legend = {
					show : false
				};
				option.grid = {
					left: 10,
					top: 15,
					right: 10,
					bottom: 20
				};
				
				option.series = params.series;
				myChart.setOption(option);
			
				window.onresize = function() {
					myChart.resize();
				};

			},// endof success for ajax
			failure:function(result, request) {
				console_logs('fail', '#');
			}
			
		}); // endof Ajax

	},
    
    redrawTotalChart3: function() {

		this.redrawTotalChartInner(1 , '1url', '목표대비 생산량');
		this.redrawTotalChartInner(2 , '2url', '납기준수율');
		this.redrawTotalChartInner(3 , '3url', '목표대비 불량율');
		this.redrawTotalChartInner(4 , '4url', '적정재고 유지');
		this.redrawTotalChartInner(5 , '5url', '고객만족도');
	},

	redrawTotalChartInner: function(num, url, title) {
		
		var option = {
			title: {
				//top: 6,
				left: 'center',
				textStyle: {
					fontSize: 14
				},
				text: title
			},
			grid: {
				top: 40,
				left: 10,
				right: 10,
				bottom: 30
			},
			tooltip: {},
			toolbox: {},
			legend: {
				show : false
			},
			xAxis:[
				{
					boundaryGap: true,

					type: 'category',
					data: ['2월','3월','4월'],

				}, {
					boundaryGap: false,
					show : false,
					type: 'category',
					data: ['2월','3월','4월'],
					axisPointer: {
						type: 'shadow'
					}
				}]

			,
			yAxis:{
				show : false
			},
			series: [
				
				{
					itemStyle: getEcItemStyle(num-1, true),
					name:'실적',
					type:'bar',
					barCategoryGap:'50%',
					data:[20.0,22, 27]
				},
				{
					name:'폭표',
					type: 'line',
					xAxisIndex: 1,
					data:[25, 25, 25]
				}
			]
		};
		
		var target = 'projecttotal-south-east-center' + num + '-graph';
		var chartTarget = document.getElementById(target);
		echarts.dispose(chartTarget);
		var myChart = echarts.init(chartTarget);


		myChart.setOption(option);
		
		

		window.onresize = function() {
			myChart.resize();
		};

		
		// setInterval(function () {
		// 	option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
		// 	myChart.setOption(option, true);
		// },20000);
		
		
    }

});