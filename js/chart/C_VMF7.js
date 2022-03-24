   
function printExcelHandler() {
	parent.setLinkLoad(group_code);	
}


Ext.onReady(function() { 
	/* Excel Button
	 * ---------------*/
	 Ext.create('Ext.Button', {
		 renderTo: 'downExcelBtn',
		 iconCls: 'search',
		 handler: printExcelHandler
	 });
	 Ext.create('Ext.Button', {
		 renderTo: 'downExcelBtn',
		 iconCls: 'MSExcelX'
	 });

	if (GALLERY_RENDERER && GALLERY_RENDERER.search(/javascript|flash/i)==0)  FusionCharts.setCurrentRenderer(GALLERY_RENDERER); 
	
	var chart = null;
	try {
		//MSColumn3DLineDY
		//MSCombiDY2D
		//MSCombi2D
		//MSColumnLine3D
		chart = new FusionCharts( CONTEXT_PATH + "/Charts/MSColumnLine3D.swf", "myChartId", "340", "150", "0", "0");
	} catch (noError) {}

	var targetDate = new Date();
	console_log('-------Value!!!!');
	console_log(targetDate);
	console_log(cubeCode);
	console_log(group_code);
	console_log(work_unit_gubun);
	console_log(dayDiv);
	console_log(work_unit);
	
	//alert(targetDate);
    //Category 호출 후
    Ext.Ajax.request({
		url: /*"http://" + vREPORT_SERVER +*/ CONTEXT_PATH + "/statistics/chart.do?method=getChart",
		params:{
			fontSize: 8,
			gridQuan: 7,
			targetDate: targetDate,
			cubeCode: cubeCode,
			work_group: group_code,
			//value_type: 'WORK_REAL_TIME',
			work_unit: work_unit, //UID
			work_unit_gubun: work_unit_gubun,
			dayDiv: dayDiv,
			lang: lang,
			user: G_USER_ID
		},
		success : function(result, request) {
			
//			console_log(result.responseText);
			var chartData = Ext.decode(result.responseText);
			console_log(chartData);

			chartData['chart']['bgcolor'] = 'EAEAEA';
			chartData['chart']['showlabels'] = 1;
			chartData['chart']['showlinevalues'] = 1;
			chartData['chart']['linethickness']=3;
			chartData['chart']['showvalues'] = 1;
			//chartData['chart']['yaxisvaluesstep'] = 2;
			chartData['chart']['numdivlines'] = 4;
			//chartData['chart']['adjustvdiv'] = 1;
			chartData['chart']['divlineeffect'] = 'bevel';
			chartData['chart']['divlineIsdashed'] = 1;
			
			
//			chartData['chart']['PYAxisMaxValue'] = 220;
//			chartData['chart']['showDivLineSecondaryValue']=0;
//			chartData['chart']['showSecondaryLimits']=0;
//			chartData['chart']['showCumulativeLine'] = 1;
//			chartData['chart']['lineColor']="FF0000";
//			chartData['chart']['lineAlpha']=80;
//			chartData['chart']['lineDashed']=1;
//			chartData['chart']['lineDashLen']=5;
//			chartData['chart']['lineDashGap']=5;		
//			chartData['chart']['clustered']="1";
			
			chartData['chart']['showLegend']=1;
			chartData['chart']['legendPosition']='RIGHT';
			chartData['chart']['legendIconScale']=1;
			
//			chartData['chart']['chartLeftMargin']=5;
			chartData['chart']['chartRightMargin']=5;
			chartData['chart']['chartTopMargin']=5;
			chartData['chart']['chartBottomMargin']=5;
			chartData['chart']['canvasPadding']=10;
			chartData['chart']['yAxisNamePadding']=0;
			chartData['chart']['yAxisValuesPadding']=0; 
			chartData['chart']['setAdaptiveYMin']=1;
			chartData['chart']['syncAxisLimits']=1;
		
			
			 
			
			chartData['dataset'][0]['color']='BBDA00';
			chartData['dataset'][0]['anchorBgColor']='BBDA00';
			
			chartData['dataset'][0]['renderAs']='Line';
			chartData['dataset'][0]['anchorSides']='4';
			chartData['dataset'][0]['anchorRadius']='5';
			chartData['dataset'][0]['anchorBorderColor']='FFFFFF';
			chartData['dataset'][0]['anchorBorderThickness']='2';
			chartData['dataset'][0]['showvalue']=1;
			
			//사람이면 빨간색.
			if(work_unit_gubun=='HUMAN') {
				chartData['dataset'][1]['color']='FF0000';
			} else {
				chartData['dataset'][0]['color']='DDDD00';
				chartData['dataset'][0]['anchorBgColor']='DDDD00';
				chartData['dataset'][1]['color']='0000FF';
			}

			chartData['dataset'][1]['showvalue']=1;
			
			
			chartData['styles'] =			
				{    
				"definition": [      
				                     {        
				                    	 "name": "myValuesFont",        
				                    	 "type": "font",        
				                    	 "font": "Arial",        
				                    	 "size": "8",        
				                    	 "color": "666666",        
				                    	 "bold": "0"      
				                    }    ],    
				 "application": [      
				                       {        
				                    	   "toobject": "YAXISVALUES",        
				                    	   "styles": "myValuesFont"      
				                    	}    
				                   ]  
			};
			
			
			
			
			
			
			
		    chart.setChartData(chartData, "json");
		    chart.render("chartdiv");
		},
		failure: extjsUtil.failureMessage
	});	

	
});