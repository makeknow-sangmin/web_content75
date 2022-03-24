var mainTabs = null;
var POPUP_SUB_TITLE = null;
var POPUP_CALL_FROM = null;
function console_logs(tag, val) {
	try {
		console.log(tag, val);
	} catch(e) {}
}

function checkRecordMatch(record) {
	
	//console_logs('selected record', record);
	var val = 'COMPARE';
	
	switch(POPUP_CALL_FROM) {
	case 'gridProductTable2':
		val = record.get('product');
		break;
	case 'gridCarTable':
		val = record.get('pj_name');
		break;
	case 'gridTechTable1':
		val =  record.get('tech');
		break;
	default:
			val=POPUP_SUB_TITLE;
	}
	
	return (val.indexOf(POPUP_SUB_TITLE) > -1) ? true : false;

}

function getPageToolbar(store, displayInfo, inEmpty, handler) {

	var emptyMsg = '';
	if(inEmpty==null || inEmpty==undefined) {
		emptyMsg = '표시할 데이터가 없습니다.';
	} else {
		emptyMsg = inEmpty;
	}
	
       var paging = Ext.create('Ext.PagingToolbar', {
         store: store,
         displayInfo: displayInfo,
         //displayMsg: 'display_page_msg',
         emptyMsg: emptyMsg
         ,listeners: {
                    beforechange: function (page, currentPage) {
//                        //--- Get Proxy ------//
//                        var myProxy = this.store.getProxy();                        
//                 //--- Define Your Parameter for send to server ----//
//                        myProxy.params = {
//                            MENU_NAME: '',
//                            MENU_DETAIL: ''
//                        };
//                  //--- Set value to your parameter  ----//
//                        myProxy.setExtraParam('MENU_NAME', '222222');
//                        myProxy.setExtraParam('MENU_DETAIL', '555555');
                    }
                }
         
         
         
     });
       
       if(VIEW_ALL_POWER==true) {

//	        // add the detailed view button
//	        paging.add('-', 
//	                    {
//	        				iconCls: 'MSExcelX',
//	                        text: '다운로드',//'Major Fields | Current Rows',
//	                        handler: handler
//	                    }
//	        );
       }
        return paging;
}


function arrangeColor(series) {
	if(series!=null) {
    	for(var i=0; i <series.length; i++) {
			var o = series[i];
			var colorIdx = 4;
			switch(o['name']) {
			case '선행':
				colorIdx = 0;
				break;
			case '양산':
				colorIdx = 1;
				break;
			case '기타':
				colorIdx = 2;
				break;
			case '공통':
				o['name'] = '공통업무';
				colorIdx = 3;
				break;
			}

			o['_colorIndex'] = colorIdx;
			o['index'] = colorIdx;
		} 
	}
}
function arrangeColorOrg(series) {
	//console_logs('in', series);
	if(series!=null) {
    	for(var i=0; i <series.length; i++) {
			var o = series[i];
			var colorIdx = 4;
			switch(o['name']) {
			case '연구':
				colorIdx = 0;
				break;
			case '품질':
				colorIdx = 1;
				break;
			case '생기':
				colorIdx = 2;
				break;
			case '기타':
				colorIdx = 3;
				break;
			}

			o['_colorIndex'] = colorIdx;
			o['index'] = colorIdx;
		} 
	}
		//console_logs('out', series);
}

       
    function refreshCheckBoxAll() {
    	for(var i=0; i<8; i++) {
    		var o = Ext.getCmp('chkAutorefresh' + (i+1));
    		if(o!=null && o!=undefined) {
    		 o.setRawValue(AUTO_REFRESH);
    		}
    	}
    }
    
     function setStringById(id,value) {
    	document.getElementById(id).innerHTML = value;
    
    }
     
    function setNumberById(id,value) {
    	
    	//console_logs(id, value);
    	if ( typeof value  != 'number' ) {	
			document.getElementById(id).innerHTML = '-';
		} else {
			if(value>0) {
				document.getElementById(id).innerHTML = Ext.util.Format.number(value, '0,000');
				
			} else {
				document.getElementById(id).innerHTML = '-';
			}
		}
    	
    }
    
    function stampNumberById(id, value, STAMP) {
    	
    	//console_logs(id, value);
    	if ( typeof value  != 'number' ) {	
			document.getElementById(id).innerHTML = '-';
		} else {
			if(value>0) {
				document.getElementById(id).innerHTML = Ext.util.Format.number(value, STAMP);
				
			} else {
				document.getElementById(id).innerHTML = '-';
			}
		}
    	
    }
        
    function openNewWindow() {
    	//console_logs('called', 'openNewWindow();');
    	window.open(window.location.hash, '_blank');
    
    }
    
    function hasOption (name) {
        return window.location.search.indexOf(name) >= 0;
    }
    
    function makeGridTitle(v) {
    	return '<div class="title01">' + v + '</div>';
		//return '<h2 class=subTitleBold><span></span>' + v + '</h2>';
	}
    
	function gotoMyTab(className, id, title, flag1, flag2, flag3, flag4, flag5) {
		//console_logs('className', className);
    	//console_logs('id', id);
    	//console_logs('title', title);
    	
    	var obj = Ext.getCmp(id);
    	//console_logs('obj', obj);
    	
    	if(obj==undefined || obj=='undefined' || obj==null) {
    		mainTabs.addTab(className, id, title, flag1, flag2, flag3, flag4, flag5)
    	}
    	mainTabs.setActiveTab(id);
    }
	
	function onWindowSize() {
		  if (typeof (window.innerWidth) == 'number') {
		    myWidth = window.innerWidth;
		    myHeight = window.innerHeight;
		  } else {
		    if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
		      myWidth = document.documentElement.clientWidth;
		      myHeight = document.documentElement.clientHeight;
		    } else {
		      if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
		        myWidth = document.body.clientWidth;
		        myHeight = document.body.clientHeight;
		      }
		    }
		  }
		  
		  //console_logs('myWidth:', myWidth);
		  //console_logs('myHeight:', myHeight);
		  
		  pjCostWidth = (myWidth - 510) < 0 ? 50 : (myWidth -510);
		  pjCostHeight = (myHeight-190) < 0 ? 50 : (myHeight-190)*35/100;
		  pjCostHeight1 = (myHeight-200) < 0 ? 50 : (myHeight-200)*30/100;
		  
		  eastNorthWidth = pjCostWidth;
		  eastNorthHeight = pjCostHeight -10;
		  eastCenterWidth = pjCostWidth;
		  eastCenterHeight = pjCostHeight -30;
		  
		  
		  pjCostHeight1 = pjCostHeight1 -30;
		  
		  eastSouth1Width = pjCostWidth/4 -8;
		  eastSouth1Height = pjCostHeight1;
		  eastSouth2Width = pjCostWidth/4 -8;
		  eastSouth2Height = pjCostHeight1;
		  eastSouth3Width = pjCostWidth/4 -8;
		  eastSouth3Height = pjCostHeight1;
		  eastSouth4Width = pjCostWidth/4 -8;
		  eastSouth4Height = pjCostHeight1;
		  
		  if(ocProjectTotalEastNorth!=null && ocProjectTotalEastNorth!=undefined && ocProjectTotalEastNorth!='undefined') {
	           ocProjectTotalEastNorth.setSize(  eastNorthWidth,   eastNorthHeight,  false    );   
			   ocProjectTotalEastNorth.reflow();
	      }
	      if(ocProjectTotalEastCenter!=null && ocProjectTotalEastCenter!=undefined && ocProjectTotalEastCenter!='undefined') {
	           ocProjectTotalEastCenter.setSize(  eastCenterWidth,   eastCenterHeight,  false    );   
			   ocProjectTotalEastCenter.reflow();
	      }     
		
	      if(ocProjectTotalEastSouth1!=null && ocProjectTotalEastSouth1!=undefined && ocProjectTotalEastSouth1!='undefined') {
	           ocProjectTotalEastSouth1.setSize(  eastSouth1Width,   eastSouth1Height,  false    );   
			   ocProjectTotalEastSouth1.reflow();
	      } 
	      if(ocProjectTotalEastSouth2!=null && ocProjectTotalEastSouth2!=undefined && ocProjectTotalEastSouth2!='undefined') {
	           ocProjectTotalEastSouth2.setSize(  eastSouth2Width,   eastSouth2Height,  false    );   
			   ocProjectTotalEastSouth2.reflow();
	      } 
	      if(ocProjectTotalEastSouth3!=null && ocProjectTotalEastSouth3!=undefined && ocProjectTotalEastSouth3!='undefined') {
	           ocProjectTotalEastSouth3.setSize(  eastSouth3Width,   eastSouth3Height,  false    );   
			   ocProjectTotalEastSouth3.reflow();
	      } 
	      if(ocProjectTotalEastSouth4!=null && ocProjectTotalEastSouth4!=undefined && ocProjectTotalEastSouth4!='undefined') {
	           ocProjectTotalEastSouth4.setSize(  eastSouth4Width,   eastSouth4Height,  false    );   
			   ocProjectTotalEastSouth4.reflow();
	      } 
		}
		
	function Main() {
		    
			var menuArr = [];
			menuArr.push(
				    {
				    	title: '현황종합',
				        url: {  name: '현황종합',
				        		xtype: 'ProjectTotal',//'projectTotalView',
				        		code: 'project-total'
				    }}, { title: '생산현황',
				        url: {  name: '생산현황',
				        		xtype: 'ProduceState',
				        		code: 'produce-state'
				    }}, { title: '영업.출하',
				        url: {  name: '영업.출하',
				        		xtype: 'SalesDelivery',
				        		code: 'sales-delivery'
				    }}, { title: '설계.디자인',
				        url: {  name: '설계.디자인',
				        		xtype: 'DesignPlan',
				        		code: 'design-plan'
				    }}, { title: '구매.재고',
				        url: {  name: '구매.재고',
				        	xtype: 'PurStock',
			        		code: 'pur-stock'
				    }}, { title: '생산관리',
				        url: {  name: '생산관리',
				        		xtype: 'ProduceMgmt',
				        		code: 'produce-mgmt'
				    }}, { title: '이력검색',
				        url: {  name: '이력검색',
				        		xtype: 'CriterionInfo',
				        		code: 'criterion-info'
				    }}
				       
				 );

//			// The only requirement for this to work is that you must have a hidden field and
//			    // an iframe available in the page with ids corresponding to Ext.History.fieldId
//			    // and Ext.History.iframeId.  See history.html for an example.
//			    Ext.History.init();
//			
//			    // Needed if you want to handle history for multiple components in the same page.
//			    // Should be something that won't be in component ids.
//			    var tokenDelimiter = ':';
			    
			    function onTabChange(tabPanel, tab) {
			    	//console_logs('tabPanel', tabPanel);
			    	//console_logs('tab', tab);
			    	window.location.hash = '#'+ tab.itemId;
				        switch(tab.title) {
						case '현황종합':
							if( AUTO_REFRESH) {
				        		//redrawTotalChartAll();
							}
				        	break;
				        case '제품별현황':
				        	if(selectedL1==null || AUTO_REFRESH) {
				        		//redrawProductChart1();
				        	}
				        	break;
				        case '조직별현황':
				         	if(selectedO1==null || AUTO_REFRESH) {
				        		//redrawOrgAll();
				        	}
				        	break;
				        case '차종별현황':
				         	if(selectedC1==null || AUTO_REFRESH) {
				        		//redrawCarChart1();
				        	}
				        	break;
				        case '생산현황':
				        	if(selectedO1==null || AUTO_REFRESH) {
				        		//redrawProduceAll();
				        	}
				        	break;
				        case '팀별현황':
				        	break;
				        case '프로젝트 비용분석':
				        	break;
				        case '이력검색':
				        	break;
				        	
				        }
			    }
			    
		    // Handle this change event in order to restore the UI to the appropriate history state
		    function onAfterRender() {
		    	
		    }

			mainTabs = new Ext.TabPanel({
			    region: 'center',
			    id: 'main-tabs',
			    flex:1,
			    activeTab: 0,
 			    deferredRender: false,
			    defaults: {
			        autoHeight: true
			    },
			    items: [],
			    addFeed: function(title, url, on){  
			    	switch(url['xtype']) {
			    	case 'criterionInfo':
			    		var active = Ext.create('Rfx.view.CriterionInfo', {
			    			title: title,
				            url: url,
				            id: url['code'],
				            itemId: url['code'],
				            closable: false
			    		});
			    		active = this.add(active);
			    		break;
			    	default:
					    active = this.add({
				            xtype: url['xtype'],
				            title: title,
				            url: url,
				            id: url['code'],
				            itemId: url['code'],
				            closable: false
				        });		
			    	}		
			       
			       if(on==true) {
			        	this.setActiveTab(active);
			        	active.doLayout();
			       }
			       return active;
			    },

				addTab: function (className, id, title) {
					//console_logs('className', className);
			    	//console_logs('id', id);
			    	//console_logs('title', title);
			    	
			    	var obj = Ext.getCmp(id);
			    	//console_logs('obj', obj);
			    	
			    	if(obj==undefined || obj=='undefined' || obj==null) {
			    		var active = Ext.create('Rfx.view.' + className, {
			    			title: title,
				            id: id,
				            itemId: id,
				            closable: false
			    		});
			    		this.add(active);
			    		
			    	}
			    	this.setActiveTab(id);
			    },
			    
		        listeners: {				
		        	resize : function(win,width,height,opt){        },
				    tabchange: onTabChange,
            		afterrender: onAfterRender 
				}
			});

		    var token = window.location.hash.substr(1);
		    if(token==null || token=='') {
		    	window.location.hash = '#' +  'project-total';
		    	token = window.location.hash.substr(1);
		    }
		    
 			var active = null;
 			//console_logs('token', token);
	        for(var i=0; i<menuArr.length; i++ ) {
	        	var url = menuArr[i]['url'];
	        	var title = menuArr[i]['title'];
	        	
	        	var xtype = url['xtype'];
	        	var code = url['code'];
	        	

	        	//console_logs('xtype', xtype);
	        	//console_logs('code', code);
	        	//console_logs('title', title);
	        	
	        	var active = ( code==token )? true : false;
	        	if(active==true) {
        			var menu = 'menu-' + token;
					var menuOn = menu+'on';
					$('.'+menu).removeClass(menu).addClass(menuOn);
					
					gotoMyTab(xtype, code, title)
	        	}
	        	
	        }
	        
			var main = Ext.create("Ext.panel.Panel",{
			        layout : 'border',
			        region : 'center',
			        items:[
			               mainTabs
			         ]
			    });
	        
			mainTabs.getTabBar().hide();
			var viewport = new Ext.Viewport({
				layout:	'border',
				bodyBorder: false,
    			border: false,
    			id: 'main-viewport',
    			hideNorth : function() {
    				var north = this.layout.north.panel;
    				north.collapse();
    			},
    			showNorth: function() {
    				var north = this.layout.north.panel;
    				north.expand();
    			},
			    defaults: {
			        collapsible: false,
			        split: false,	
			        bodyPadding: 0
			    },
				items: [{
					padding	: 0,
					height: 84,
					region	: 'north',
					id:'port_north_header',
					contentEl: 'header'
				},{
					//title	: 'East Item',
					width: 18,
					padding	: 0,
					bodyStyle: 'background: #29598B; ',
					region	: 'east'
				}
				, main
				,{
					width: 18,
					padding	: 0,
					bodyStyle: 'background: #29598B; ',
					region	: 'west'
				},{
					padding	: 0,
					height: 20,
					region	: 'south',
					contentEl: 'footer'
				}],
				listeners: {
                    afterrender: function(){
                    	Ext.getBody().unmask();
                    }
                }
			});
	}
	

function moveNullPos(cat, inSeries, aXis, arr) {
	
	var moveNull = false;
	var nullVal = null;
	var nullPos = -1;
	for(var i=0; i<cat.length; i++) {
		var res = cat[i].split(":");
		var code = res[0];
		var name = res[1];
		var o = { code : code,
				  name : name
				};
		if(name == 'NULL') {
			nullVal = o;
			nullPos = i;
		} else {
			arr.push(o);
			aXis.push(name);					
		}
	}
	if(nullPos>-1) {
		if(moveNull==true) {
			arr.push(nullVal);
			aXis.push("NULL");
		}
		
		for(var j=0; j<inSeries.length; j++) {
			var oS = inSeries[j];
			//console_logs('oS', oS);
			var data = oS['data'];
			var oNull = data.splice(nullPos, 1);
			if(moveNull==true) {
			   data.push(oNull);
			}
			
		}
	}
}

function changeSeriesValue(series, factor) {

	//console_logs('changeSeriesValue', series);
	for(var i=0; i<series.length; i++) {
		var o = series[i];
		var arr = o['data'];
		for(var j=0; j<arr.length; j++) {
				arr[j] = 	arr[j] * factor;
		}
	}
}

function changeSeriesName(series, from, to) {

	//console_logs('changeSeriesName', series);
	for(var i=0; i<series.length; i++) {
		var o = series[i];
		var name = o['name'];
		if(name==from) {
			o['name'] = to;
		}
	}
}

function changeAxisName(aXis, from, to) {

	//console_logs('changeAxisName', aXis);
	for(var i=0; i<aXis.length; i++) {
		var name = aXis[i];
		if(name==from) {
			aXis[i]  = to;
		}
	}
}


Ext.define('PopupTable1', {
    extend: 'Ext.data.Model',
    fields: [ 
              'id',
              'no', 
              'bonbu', 
              'center',
              'sil',
              'team',
              'gubun',
              'position', 
              'name', 
              {    name: 'v1',   type: 'float' }
     ],
        proxy: {
			type: 'ajax',
	        api: {  
	            read: CONTEXT_PATH +  '/xdview/popup.do?method=getTable'
	        },
			reader: {
				type: 'json',
				root: 'records',
				totalProperty: 'count',
				successProperty: 'success'
			}
		}
});
var storePopupTable1 = new Ext.data.Store({  
	model: 'PopupTable1'
});
	
Ext.define('PopupTable2', {
    extend: 'Ext.data.Model',
    fields: [ 
             'id',
			  'pre_mass', 
              'pj_code',
              'pj_name',
              'car', 
              'product',
              'tech',
              'task',
              {    name: 'v1',   type: 'float' },
              {    name: 'v2',   type: 'float' },
              {    name: 'v3',   type: 'float' }
     ],
        proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/xdview/popup.do?method=getTable'
	        },
			reader: {
				type: 'json',
				root: 'records',
				totalProperty: 'count',
				successProperty: 'success'
			}
		}
});

var storePopupTable2 = new Ext.data.Store({  
	model: 'PopupTable2'
});

//function winUserProjectDetail(title, target, gridPopupTable1, gridPopupTable2) {
//	
//    win = Ext.create('Ext.window.Window', {
//    	id: 'popup-grid-window',
//        title: title,
//        header: {
//            //titlePosition: 2,
//            titleAlign: 'center'
//        },
//        modal : true,
//        resizable   : false,
//        animateTarget : target,
//        autoShow: true,
//        closable: true,
//        closeAction: 'hide',
//        //maximizable: true,
//        //animateTarget: button,
//        width: 900,
//        //minHeight: 500,
//        height: 700,
//        //tools: [{type: 'pin'}],
//        layout: {
//            type: 'border',
//            padding: 5
//        },
//        items: [gridPopupTable1, gridPopupTable2],
//        
//        listeners: { 
//            beforeclose: function () { 
//              //  searchVisible = false;                      
//            } 
//        },
//        buttons: [
//        {
//             text:'닫기', 
//             handler: function() {
//	            win.hide(this, function() {
//	            	win = null;
//	            	//gridTeam1 = null;
//	            	//gridTeam2 = null;
//	                //button.dom.disabled = false;
//	            });                      
//             }
//         }
//        ]   
//    });
//    //Ext.getCmp('popup-grid-window').center();
//   win.show(this, function() {});
//
//}

function resetPopupParam() {
		storePopupTable1.removeAll();
		storePopupTable2.removeAll();
		
		storePopupTable1.getProxy().setExtraParam('projectProduct-L1', null);
		storePopupTable1.getProxy().setExtraParam('projectProduct-L2', null);
		storePopupTable1.getProxy().setExtraParam('projectProduct-L3', null);
		storePopupTable1.getProxy().setExtraParam('projectTech-L1', null);
		storePopupTable1.getProxy().setExtraParam('projectTech-L2', null);
		storePopupTable1.getProxy().setExtraParam('projectTech-L3', null);
}

function popupUserProjectDetail(title, record_in, callFrom, target, subTitle) {
	
	//console_logs('popupUserProjectDetail subTitle', subTitle);

	if(VIEW_ALL_POWER == true) {
		
		//초기화
		resetPopupParam();
		
		POPUP_CALL_FROM = callFrom;
		
		switch(callFrom) {
			//제품팝업
			case 'gridProductTable2':
				storePopupTable1.getProxy().setExtraParam('popup-Month', PRODUCT_PARAMS['projectProduct-Month']);
				storePopupTable1.getProxy().setExtraParam('popupOrg-team-code', record_in.get('team_code'));
				storePopupTable1.getProxy().setExtraParam('projectProduct-L2', null);
				storePopupTable1.getProxy().setExtraParam('projectProduct-L3', null);
				
				var level = Number( document.getElementById('SELECTED_PRODUCT_LEVEL').value );
				storePopupTable1.getProxy().setExtraParam('projectProduct-L1', document.getElementById('SELECTED_PRODUCT_L1').value);
				if(level>1) {
					storePopupTable1.getProxy().setExtraParam('projectProduct-L2', document.getElementById('SELECTED_PRODUCT_L2').value);
				}
				if(level>2) {
					storePopupTable1.getProxy().setExtraParam('projectProduct-L3', document.getElementById('SELECTED_PRODUCT_L3').value);
				}

				popupGridOrgTable(title, record_in, target, 'PJ_PRODUCT', 'POPUP_PRODDUCT_TABLE1', subTitle);
				storePopupTable2.getProxy().setExtraParam('popup-Month', PRODUCT_PARAMS['projectProduct-Month']);
				break;
			//조직팝업
			case 'gridOrgTable':
				storePopupTable1.getProxy().setExtraParam('popup-Month', ORG_PARAMS['projectOrg-Month']);
				storePopupTable1.getProxy().setExtraParam('popupOrg-team-code', record_in.get('team_code'));
				popupGridOrgTable(title, record_in, target, 'PJ_PRODUCT', 'POPUP_PRODDUCT_TABLE1', subTitle);
				
				storePopupTable2.getProxy().setExtraParam('popup-Month', ORG_PARAMS['projectOrg-Month']);
				break;
			//기술팝업
			case 'gridTechTable1':
				//console_logs('popupUserProjectDetail gridTechTable1 record_in' , record_in);

				if(TECH_PARAMS['projectTech-L1']!=null) {
					storePopupTable1.getProxy().setExtraParam('projectTech-L1', TECH_PARAMS['projectTech-L1']);
				}
				if(TECH_PARAMS['projectTech-L2']!=null) {
					storePopupTable1.getProxy().setExtraParam('projectTech-L2', TECH_PARAMS['projectTech-L2']);
				}
				if(TECH_PARAMS['projectTech-L3']!=null) {
					storePopupTable1.getProxy().setExtraParam('projectTech-L3', TECH_PARAMS['projectTech-L3']);
				}

				storePopupTable1.getProxy().setExtraParam('popup-Month', TECH_PARAMS['projectTech-Month']);
				storePopupTable1.getProxy().setExtraParam('popupOrg-team-code', record_in.get('team_code'));
				popupGridOrgTable(title, record_in, target, 'PJ_TECH', 'POPUP_TECH_TABLE1', subTitle);
				
				storePopupTable2.getProxy().setExtraParam('popup-Month', TECH_PARAMS['projectTech-Month']);
				break;
			//기술팝업
			case 'gridTechTable2':
				//console_logs('popupUserProjectDetail gridTechTable2 record_in' , record_in);

				if(TECH_PARAMS['projectTech-L1']!=null) {
					storePopupTable1.getProxy().setExtraParam('projectTech-L1', TECH_PARAMS['projectTech-L1']);
				}
				if(TECH_PARAMS['projectTech-L2']!=null) {
					storePopupTable1.getProxy().setExtraParam('projectTech-L2', TECH_PARAMS['projectTech-L2']);
				}
				if(TECH_PARAMS['projectTech-L3']!=null) {
					storePopupTable1.getProxy().setExtraParam('projectTech-L3', TECH_PARAMS['projectTech-L3']);
				}
				
				storePopupTable1.getProxy().setExtraParam('projectProduct-L1', record_in.get('l1'));
				storePopupTable1.getProxy().setExtraParam('projectProduct-L2', record_in.get('l2'));
				storePopupTable1.getProxy().setExtraParam('projectProduct-L3', record_in.get('l3'));
				
				storePopupTable1.getProxy().setExtraParam('popup-Month', TECH_PARAMS['projectTech-Month']);
				storePopupTable1.getProxy().setExtraParam('popupOrg-team-code', record_in.get('team_code'));
				popupGridOrgTable(title, record_in, target, 'PJ_TECH', 'POPUP_TECH_TABLE1', subTitle);
				
				storePopupTable2.getProxy().setExtraParam('popup-Month', TECH_PARAMS['projectTech-Month']);
				break;	
				
			//차종팝업
			case 'gridCarTable':
				storePopupTable1.getProxy().setExtraParam('popupcar-Month', CAR_PARAMS['projectCar-Month']);
				storePopupTable1.getProxy().setExtraParam('popupcar-SearchOrg', CAR_PARAMS['projectCar-SearchOrg']);
				storePopupTable1.getProxy().setExtraParam('popupcar-pj_code', record_in.get('pj_code'));
				popupGridOrgTable(title, record_in, target, 'PJ_ORG', 'POPUP_CAR_TABLE1', subTitle);
				
				storePopupTable2.getProxy().setExtraParam('popup-Month', CAR_PARAMS['projectCar-Month']);
				break;
			default:
		
		}		
	}
	
}
function popupGridOrgTable(title, record_in, target, cubeCode, chartType, subTitle) {
	
	
	if(subTitle==null ||  subTitle== undefined) {
			subTitleMsg = '프로젝트';
			POPUP_SUB_TITLE = null;
	} else {
		POPUP_SUB_TITLE = subTitle;
	}
	
	storePopupTable1.getProxy().setExtraParam('cubeCode', cubeCode);
	storePopupTable1.getProxy().setExtraParam('projectChartType', chartType);

	user_type = '';
	switch(record_in.get('org1')) {
	
	case '연구':
	case '품질':
	case '생기':
		user_type = '연구원';
		break;
	default:
		user_type = '비연구원';
	
	}
	storePopupTable1.getProxy().setExtraParam('user_type', user_type);

	target.setLoading(true);
	storePopupTable1.load(function(records){
		
		target.setLoading(false);

			//Table1 생성
			var gridPopupTable1 = Ext.create('Ext.grid.Panel', {
				id : 'gridPopupTable1',
				title: makeGridTitle('<span style="color:#003471">'+ subTitle + '</span> 투입인원'),
				region: 'north',
			    height: '50%',
			    split: true,
			    collapsible: false,
			    floatable: false,
			    store: storePopupTable1,
				layout          :'fit',
			    forceFit: true,
				columns: [{
				            	dataIndex: 'id', text: 'ID',
				            	hidden:true
				            }
							,{
				                header: 'No',
				                cls:'rfx-grid-header', 
				                dataIndex: 'no',
				                width:30,
				                resizable: true,
				                style: 'text-align:center',
				                align:'center',
					            sortable: true
				            },
				            {
					            header: '조직',
					            sortable: false,
					            flex:1,
					            cls:'rfx-grid-header', 
					            columns: [
						            {
						                header: '본부',
						                cls:'rfx-grid-header', 
						                dataIndex: 'bonbu',
						                resizable: true,
						                style: 'text-align:center',
						                 width:120,
							            sortable: true
						            },{
						                header: '사업부/센터',
						                cls:'rfx-grid-header', 
						                dataIndex: 'center',
						                resizable: true,
						                style: 'text-align:center',
						                width:120,
							            sortable: true
						            },{
						                header: '실',
						                cls:'rfx-grid-header', 
						                dataIndex: 'sil',
						                resizable: true,
						                style: 'text-align:center',
						                width:120,
							            sortable: true
						            },{
						                header: '팀',
						                cls:'rfx-grid-header', 
						                dataIndex: 'team',
						                resizable: true,
						                style: 'text-align:center',
						               width:120,
							            sortable: true
						            }
				            ]},
				            {
					            header: '투입현황',
					            sortable: false,
					            cls:'rfx-grid-header', 
					            flex:2,
					            columns: [
					            {
					                header: '구분',
					                width:120,
					                cls:'rfx-grid-header', 
					                dataIndex: 'gubun',
					                resizable: true,
					                style: 'text-align:center',
						            sortable: true
						        },{
					                header: '직급',
					                width:120,
					                cls:'rfx-grid-header', 
					                dataIndex: 'position',
					                resizable: true,
					                style: 'text-align:center',
						            sortable: true
					            },{
					                header: '이름',
					                width:120,
					                cls:'rfx-grid-header', 
					                dataIndex: 'name',
					                resizable: true,
					                style: 'text-align:center',
						            sortable: true
					            }
				            ]},
				            {
								header: '투입시간',
								cls:'rfx-grid-header', 
				                dataIndex: 'v1',
					              style: 'text-align:center',
					                align:'right',
					                width:50,
						            renderer: function(value, summaryData, dataIndex) {
						                return Ext.util.Format.number(value, '0,000');
						            },
					                field: {
					                    xtype: 'numberfield'
					                }
				            }
				  ]
			});
		
			//table2 생성
			var gridPopupTable2 = Ext.create('Ext.grid.Panel', {
				id : 'gridPopupTable2',
				cls : 'rfx-panel',
			    region: 'center',
			    height: '50%',
			    split: true,
			    title: makeGridTitle('개인별 <span style="color:#003471">'+ ' 투입 프로젝트' + '</span>'),
			    collapsible: false,
			    store: storePopupTable2,
				layout          :'fit',
			    forceFit: true,
			    viewConfig:{
				    markDirty:false
				},
				columns: [{
				            	dataIndex: 'id', text: 'ID',
				            	hidden:true
				            },{
				                header: '선행/양산',
				                cls:'rfx-grid-header', 
				                dataIndex: 'pre_mass',
				                align:'center',
				                width:50,
				                resizable: true,
				                style: 'text-align:center',
					            sortable: true
					            , attributes: { title: "#=data.pre_mass#" }
				            },{
				                header: '프로젝트',
				                cls:'rfx-grid-header', 
				                dataIndex: 'pj_name',
				                resizable: true,
				                style: 'text-align:center',
					            sortable: true
				            },{
				                header: '차종',
				                cls:'rfx-grid-header', 
				                dataIndex: 'car',
				                width: 100,
				                resizable: true,
				                style: 'text-align:center',
					            sortable: true
				            },{
				                header: '제품',
				                cls:'rfx-grid-header', 
				                dataIndex: 'product',
				                resizable: true,
				                style: 'text-align:center',
					            sortable: true
				            },{
				                header: '기술',
				                cls:'rfx-grid-header', 
				                dataIndex: 'tech',
				                resizable: true,
				                style: 'text-align:center',
					            sortable: true
				            },{
				                header: '업무',
				                cls:'rfx-grid-header', 
				                dataIndex: 'task',
				                resizable: true,
				                style: 'text-align:center',
					            sortable: true
				            },{
						        header: '투입정보',
						        cls:'rfx-grid-header', 
						        resizable: true,
						        sortable: true,
						        columns: [{
				            	text: '비중(%)',
				            	cls:'rfx-grid-header', 
				                dataIndex: 'v1',
				                width: 80,
				                 autoSizeColumn : true,
					                style: 'text-align:center',
					                align:'right',
					                summaryType: 'sum',
									summaryRenderer: function(value, summaryData, dataIndex) {
						                return '<b>' + Ext.util.Format.number(value, '0,000') + '</b>';
						            },
						            renderer: function(value, summaryData, dataIndex) {
						                return Ext.util.Format.number(value, '0,000');
						            },
					                field: {
					                    xtype: 'numberfield'
					                }
				            }, {
								text: '시간',
								cls:'rfx-grid-header', 
				                dataIndex: 'v2',
				                width: 60,
				                 autoSizeColumn : true,
				                 // width:160,
					                style: 'text-align:center',
					                align:'right',
					                summaryType: 'sum',
									summaryRenderer: function(value, summaryData, dataIndex) {
						                return '<b>' + Ext.util.Format.number(value, '0,000') + '</b>';
						            },
						            renderer: function(value, summaryData, dataIndex) {
						                return Ext.util.Format.number(value, '0,000');
						            },
					                field: {
					                    xtype: 'numberfield'
					                }
				            }, {
								text: '인건비',
								cls:'rfx-grid-header', 
				                dataIndex: 'v3',
				                resizable: true,
				                 autoSizeColumn : true,
				                  //width:160,
					                style: 'text-align:center',
					                align:'right',
					                summaryType: 'sum',
									summaryRenderer: function(value, summaryData, dataIndex) {
						                return '<b>' + Ext.util.Format.number(value, '0,000') + '</b>';
						            },
						            renderer: function(value, summaryData, dataIndex) {
						                return Ext.util.Format.number(value, '0,000');
						            },
					                field: {
					                    xtype: 'numberfield'
					                }
				            }]
				    }
				  ],
				  viewConfig: {
					            stripeRows: true,
					            enableTextSelection: true,
	     			            getRowClass: function(record) { 
	     			            	//console_logs('viewConfig record', record);
	     			            	
		     			              return checkRecordMatch(record) ? 'matched-row' : 'not-matched-row'; 
	     			            } ,
					            listeners: {
					        		'afterrender' : function(grid) {
										var elments = Ext.select(".x-column-header",true);//.x-grid3-hd
										elments.each(function(el) {
														//el.setStyle("color", 'black');
														//el.setStyle("background", '#ff0000');
														//el.setStyle("font-size", '12px');
														//el.setStyle("font-weight", 'bold');
								
													}, this);
											
										}
					            }
					        }
//				, listeners: {
//			        viewready: function (grid) {
//			        	console_logs('viewready grid', grid);
//			            var view = grid.view;
//			            
//			            // record the current cellIndex
//			            grid.mon(view, {
//			                uievent: function (type, view, cell, recordIndex, cellIndex, e) {
//			                	console_logs('uievent recordIndex,cellIndex ',  recordIndex + ',' + cellIndex);
//			                    grid.cellIndex = cellIndex;
//			                    grid.recordIndex = recordIndex;
//			                    
//			                    	 grid.tip = Ext.create('Ext.tip.ToolTip', {
//						                target: view.el,
//						                delegate: '.x-grid-cell',
//						                trackMouse: true,
//						                renderTo: Ext.getBody(),
//						                listeners: {
//						                    beforeshow: function updateTipBody(tip) {
//						                    	//console_logs('beforeshow tip ',  tip);
//						                    	
//						                        //if (!Ext.isEmpty(grid.cellIndex) && grid.cellIndex !== -1) {
//						                            //header = grid.headerCt.getGridColumns()[grid.cellIndex];
//						                            //tip.update(grid.getStore().getAt(grid.recordIndex).get(header.dataIndex));
//						                    	if(grid.recordIndex>-1) {
//													var rec = grid.getStore().getAt(grid.recordIndex);
//						                            var s = '';
//						                            var pre_mass = rec.get('pre_mass');
//						                            var pj_code = rec.get('pj_code');
//						                            var pj_name = rec.get('pj_name');
//						                            var car = rec.get('car');
//						                            var product = rec.get('product');
//						                            var tech = rec.get('tech');
//						                            var task = rec.get('task');
//						                            s = s + pre_mass + ' : [' + pj_code + '] ' + pj_name + '<br>';
//						                            s = s + '(차종) ' +  car+ '<br><hr>';
//						                            s = s + '(제품) ' + product+ '<br>';
//						                            s = s + '(기술) '+ tech+ '<br>';
//						                            s = s + '(태스크)' + task;  
//						                        	tip.update(s);
//						                        }
//						                    }
//						                }
//						            });
//			                }
//			            });
//			            
//			
//			        }
//			    }
			}); //Table생성2
			
//			var view = gridPopupTable2.getView();
//			var tip = Ext.create('Ext.tip.ToolTip', {
//			    // The overall target element.
//			    target: view.el,
//			    // Each grid row causes its own separate show and hide.
//			    delegate: view.itemSelector,
//			    // Moving within the row should not hide the tip.
//			    trackMouse: true,
//			    // Render immediately so that tip.body can be referenced prior to the first show.
//			    renderTo: Ext.getBody(),
//			    listeners: {
//			        // Change content dynamically depending on which element triggered the show.
//			        beforeshow: function updateTipBody(tip) {
//			            tip.update('Over company "' + view.getRecord(tip.triggerElement).get('company') + '"');
//			        }
//			    }
//			});
		
		 gridPopupTable1.getSelectionModel().on({
		    selectionchange: function(sm, selections) {
		    	
		    	//console_logs(selections.length);
		    	if (selections.length) {
		    		//console_logs(selections[0]);
		    		var record = selections[0];
		    		//console_logs('id', o.get('id') );
		    		var id = record.get('id');
		    		//console_logs('user id', id);
		    		var position = record.get('position');
		    		var name = record.get('name');
		    		
		    		gridPopupTable2.setTitle( makeGridTitle(   '<span style="color:#003471">' + name + ' ' + position  + '</span> 월간  투입비중' ) );
		
					storePopupTable2.getProxy().setExtraParam('cubeCode', "PJ_MEMBER");
					storePopupTable2.getProxy().setExtraParam('projectChartType', "POPUP_MEMBER_TABLE2");
				
					storePopupTable2.getProxy().setExtraParam('popup-userId',  id);
			
					Ext.getCmp('gridPopupTable2').setLoading(true);
					
					storePopupTable2.load(function(tab2Recs){
						//console_logs('storePopupTable2 records', records);
						for(var i=0; i<tab2Recs.length; i++) {
							var rec = tab2Recs[i];
							if(rec.get('car')=='NULL') {
								rec.set('car', '-');
							} 
							//console_logs('tab2Recs record', tab2Recs[i]);
						}
						
						Ext.getCmp('gridPopupTable2').setLoading(false);
						
					});
		
				 	
		    	}//endof selections length
		    }//endof selchange
	 
	
		}); //selection.on
		
		 //윈도우 뛰우기
		 //winUserProjectDetail(title, target, gridPopupTable1, gridPopupTable2);
		 
		 
		win = Ext.create('Ext.window.Window', {
	    	//id: 'popup-grid-window',
	        title: title,
	        header: {
	            //titlePosition: 2,
	            titleAlign: 'center'
	        },
	        modal : true,
	        resizable   : false,
	        animateTarget : target,
	        autoShow: true,
	        closable: true,
	        //loseAction: 'hide',
	        //maximizable: true,
	        //animateTarget: button,
	        width: 1000,
	        //minHeight: 500,
	        height: 700,
	        //tools: [{type: 'pin'}],
	        layout: {
	            type: 'border',
	            padding: 5
	        },
	        items: [gridPopupTable1, gridPopupTable2],
	        
	        listeners: { 
	            beforeclose: function () { 
	              //  searchVisible = false;                      
	            } 
	        },
	        buttons: [
	        {
	             text:'닫기', 
	             handler: function() {
	            	 	if(win) 
				                       	{
				                       		win.close();
				                       	} 
	            	 	
//		            win.hide(this, function() {
//		            	win = null;
//		            	//gridTeam1 = null;
//		            	//gridTeam2 = null;
//		                //button.dom.disabled = false;
//		            });                      
	             }
	         }
	        ]   
	    });
	    //Ext.getCmp('popup-grid-window').center();
	   win.show(this, function() {});
		 
	}); //	storePopupTable1.load end

	
}

//IDP, 프로젝트리스트 팝업
function popIdpPage(str) {
	if(selectedUser==null) {
		Ext.Msg.alert('안내', '조회할 임직원을 먼저 선택하세요.', function() {});
		return ;
	}
	
	var url = "";
	var prop= "";
	var pop_name = "";
	var width = 1024;
	var height = 790;
	
	if ( str == 'I') {
		url = "/statisticquery/idp_popMagicMES.do"; 
		pop_name = "idp_projects";
	}else if ( str == 'P') {
		url = "/statisticquery/reportPopupMagicMES.do?userID=" + selectedUser + '&research_yn=' + selectedResrarchYn; 
		pop_name = "rd_prints";
	}

	var left = (window.screen.width - width) / 2;
	var top = (window.screen.height - height) / 2;
	
	prop = "width="+width+",height="+height+",left="+left+",top="+top+",toolbar=no,menubar=no,titlebar=no,status=no,resizable=yes,scrollbars=yes";


	var  idpPop = window.open(url, pop_name ,prop );
	idpPop.focus();
	 
	
}
