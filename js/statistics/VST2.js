
Ext.onReady(function() { 
	
	var target = Ext.getCmp('mainview-content-panel');
	target.removeAll();
	target.add({  tag : 'h2', html: '<div id="chartdiv" align="center" style="padding:50px;width:100%; height:100%; background:F0F0F0;">Chart will load here</div>'  });
	
	
	if (GALLERY_RENDERER && GALLERY_RENDERER.search(/javascript|flash/i)==0)  FusionCharts.setCurrentRenderer(GALLERY_RENDERER); 
	
	var chart = null;
	try {
		chart = new FusionCharts( CONTEXT_PATH + "/Charts/MSColumn2D.swf", "myChartId", "560", "400", "0", "0");
	} catch (noError) {}

	
    var oChart = 
		{
			caption:		vCUR_MENU_NAME,
			xaxisname	:'Month',
			yaxisname:	'Revenue',
			showvalues:	'0',
			numberprefix:'$'
		};
    var oCategories = [
    	{
    		category: [
    		        {          label: 'Jan'        },
    		        {          label: 'Feb'        },
    		        {          label: 'Mar'        },
    		        {          label: 'Apr'        },
    		        {          label: 'May'        },
    		        {          label: 'Jun'        },
    		        {          vline: true,          color:'FF5904',          thickness:'2'        },
    		        {          label: 'Jul'        },
    		        {          label: 'Aug'        },
    		        {          label: 'Sep'        },
    		        {          label: 'Oct'        },
    		        {          label: 'Nov'        },
    		        {          label: 'Dec'        }
    		 ]
    	}
    ];
    
    var oTrendlines = {
				line:[
					{        
						startvalue:'10000',        
						color:'91C728',        
						displayvalue:'Target',        
						showontop:'1'      
					}    
					]
				}
    ;
	
    var oStyles = {
			definition: [  
					 {        
						 name: 'CanvasAnim',        
						 type: 'animation',        
						 param: '_xScale',        
						 start: '0',       
						 duration: '1'
					}
			],
			application: [   
					{    
						toobject: 'Canvas',        
						styles: 'CanvasAnim'      
					} 			
			]
    }
    ;
    
    var dataLong = {
    		chart: oChart,
    		categories:oCategories,
    		trendlines:oTrendlines,
    		styles:oStyles
    };
    
    Ext.Ajax.request({
		url: CONTEXT_PATH + "/statistics/chart.do?method=test",
		params:{
		},
		success : function(result, request) {
			
			var oDataset = Ext.decode(result.responseText);
			console_log(oDataset);
//			var oDataset = {};
//			for(var i=0; i< arr.length; i++) {
//				var obj = arr[i];
//				oDataset['seriesname'] = obj['seriesname'];
//				oDataset['data'] = 
//				
//			}
			dataLong['dataset'] = oDataset;

		    chart.setChartData(dataLong, "json");
			target.doLayout();
		    chart.render("chartdiv");
			cenerFinishCallback();
		},
		failure: extjsUtil.failureMessage
	});	
    
//    
//    
//    var data = {  "chart":{    "caption":"Business Results 2005 v 2006",    "xaxisname":"Month",    "yaxisname":"Revenue",    "showvalues":"0",    "numberprefix":"$"  },  "categories":[{      "category":[{          "label":"Jan"        },        {          "label":"Feb"        },        {          "label":"Mar"        },        {          "label":"Apr"        },        {          "label":"May"        },        {          "label":"Jun"        },        {          "vline":"true",          "color":"FF5904",          "thickness":"2"        },        {          "label":"Jul"        },        {          "label":"Aug"        },        {          "label":"Sep"        },        {          "label":"Oct"        },        {          "label":"Nov"        },        {          "label":"Dec"        }      ]    }  ],  "dataset":[{      "seriesname":"2006",      "data":[{          "value":"27400"        },        {          "value":"29800"        },        {          "value":"25800"        },        {          "value":"26800"        },        {          "value":"29600"        },        {          "value":"32600"        },        {          "value":"31800"        },        {          "value":"36700"        },        {          "value":"29700"        },        {          "value":"31900"        },        {          "value":"34800"        },        {          "value":"24800"        }      ]    },    {      "seriesname":"2005",      "data":[{          "value":"10000"        },        {          "value":"11500"        },        {          "value":"12500"        },        {          "value":"15000"        },        {          "value":"11000"        },        {          "value":"9800"        },        {          "value":"11800"        },        {          "value":"19700"        },        {          "value":"21700"        },        {          "value":"21900"        },        {          "value":"22900"        },        {          "value":"20800"        }      ]    }  ],  "trendlines":{    "line":[{        "startvalue":"26000",        "color":"91C728",        "displayvalue":"Target",        "showontop":"1"      }    ]  },   "styles": {    "definition": [      {        "name": "CanvasAnim",        "type": "animation",        "param": "_xScale",        "start": "0",        "duration": "1"      }    ],    "application": [      {        "toobject": "Canvas",        "styles": "CanvasAnim"      }    ]  }};
//    chart.setChartData(data, "json");
//    
//	target.doLayout();
//    chart.render("chartdiv");

	

	
});