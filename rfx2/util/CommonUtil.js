
var POPUP_SUB_TITLE = null;
var POPUP_CALL_FROM = null;
    
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
//  		for(var i=0; i<ocProjectTotalEastCenter.series.length; i++) {
//			var o = ocProjectTotalEastCenter.series[i];
//			console_logs('ocProjectTotalEastCenter.series ' + i, ocProjectTotalEastCenter.series[i]);
//			var name = o['name'];
//			if(name=="Total consumption") {
//				o['center'] = [(eastCenterWidth/5)/2, eastCenterHeight/2];
//				o['size'] = eastCenterHeight*4/5/2;
//			}
//		}
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
      
		var body = document.body,
	    html = document.documentElement;

		try {
//			var windowWidth = Math.max( body.scrollWidth, body.offsetWidth, 
//	                html.clientWidth, html.scrollWidth, html.offsetWidth );
//			alert('windowWidth', windowWidth);
//			
//			var windowHeight = Math.max( body.scrollHeight, body.offsetHeight, 
//		                       html.clientHeight, html.scrollHeight, html.offsetHeight );
//			alert('windowHeight', windowHeight);
			
			gMain.onMainResize(myWidth, myHeight);	
		} catch(e) {
			//console_logs('window resize', e);
		}
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

       
//function refreshCheckBoxAll() {
//	for(var i=0; i<8; i++) {
//		var o = Ext.getCmp('chkAutorefresh' + (i+1));
//		if(o!=null && o!=undefined) {
//		 o.setRawValue(AUTO_REFRESH);
//		}
//	}
//}

 function setStringById(id,value) {
	var o = document.getElementById(id);
	if(o!=null) {
		o.innerHTML = value;
	}
	

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

function makeGridTitle(v, link, className) {
	
	var name = '';
	if(className!=null) {
		var arr = className.split('.');
		name = arr[arr.length-1];
	}
	
	var a = '<div class="title01" title="' + className + '">' + v;
	if(link!=null) {
		a = a + ' <span style="font-size:11px;font-weight:normal;">('+link;
		if(className!=null) {
			a =a + ' : ' + name;
		}
		a = a +')</span>';
	}
	a =a + '</div>'; 
	return a;
	//return '<h2 class=subTitleBold><span></span>' + v + '</h2>';
}

function makeGridTitleSimple(v, link, className) {
	
	var name = '';
	if(className!=null) {
		var arr = className.split('.');
		name = arr[arr.length-1];
	}
	
	var a = v;  //'<div class="title01" title="' + className + '">' + v;
	if(link!=null) {
		a = a + ' <span style="font-size:11px;font-weight:normal;">('+link;
		if(className!=null) {
			a =a + ' : ' + name;
		}
		a = a +')</span>';
	}
	a =a + '</div>'; 
	return a;
	//return '<h2 class=subTitleBold><span></span>' + v + '</h2>';
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

