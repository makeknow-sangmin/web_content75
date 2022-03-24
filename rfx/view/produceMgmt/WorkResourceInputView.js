Ext.define('Rfx.view.produceMgmt.WorkResourceInput', {
    extend: 'Rfx.base.BaseView',
    xtype: 'work-resource-input',
    vFILE_ITEM_CODE: null,
    inputBuyer : null,
    initComponent: function(){
    	
    	this.toDay = new Date();
    	this.yearMonthDay = gUtil.getFullYear() + '/' + gUtil.getMonth() + '/' + this.toDay.getDate();
    	
    	this.setDefValue('regist_date', new Date());
    	
//    	this.period = 7;
//    	this.makeDayList(this.period);
    	
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	
    	this.addSearchField ({
			type: 'date',
			field_id: 'regist_date',
			text: "날짜",
			date: new Date()
		});
    	
        //모델 정의
        this.createStore('Rfx.model.WorkResourceInputDH', [{
 	       	property: 'crate_date',
 	       	direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        );
        
        var nDay = this.toDay.getDate();
        
        var columns = this.columns;
        for(var i=0; i<columns.length; i++) {
        	var o = columns[i];
        if(o['canEdit'] == true) {
        		o['style'] = 'background-color:#0271BC;text-align:center';
        		o['tdCls'] =  'custom-column';
            	o['field'] = {
            		minValue:0,
        			maxValue:1000,
        			xtype:  'numberfield',
        			useThousandSeparator: true,
        			baseChars: '0123456789,.' ,
        			thousandSeparator:',',
        			allowBlank: false,
        			hideTrigger:true,
        			decimalPrecision:1
            	}
        	}
      }
        
//        this.createGrid(searchToolbar);
        
//        for(var i=0; i< this.columns.length; i++) {
//        	
//        	var o = this.columns[i];
//        	var dataIndex = o['dataIndex'];
//        	console_logs('==dataIndex==', dataIndex);
//        	
//        	switch(dataIndex) {
//	        	case 'mass':
//	        	case 'reserved_double1':
//	        		o['summaryType'] = 'sum';
//	        		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
//	                	value = Ext.util.Format.number(value, '0,00.000/i');
//	                	
//	                	value = '<div  style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:10pt; color:#FF0040;">'+value +'(KG)</font></div>'
//	                	return value;
//	                };
//	        		break; 
//	        	//case 'reserved_double2':
//	        	//case 'reserved_double3':
//	        	case 'quan':
//	        	case 'bm_quan':
//	        		o['summaryType'] = 'sum';
//	        		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
//	                	value = '<div align="center" style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:10pt; color:#FF0040;">'+value +'</font></div>'
//	                	return value;
//	                };
//	        		break;
//	        	/*case 'h_reserved9':
//	        		o['summaryType'] = 'count';
//	        		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
//	                	value = '<div align="center" style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:15pt; color:blue;">합계</font></div>'
//	                	return value;
//	                };*/
//	        		
//	        		default:
//        	}
//	  }//endoffor 

        
//        console_logs('gUtil.mesStdProcess', gUtil.mesStdProcess);
        
        var searchToolbar =  this.createSearchToolbar();
        
        var buttonToolbar = this.createCommandToolbar({
    		REMOVE_BUTTONS : [
    		        	        /*'REGIST',*/'COPY'
    			]		
    });
        
        // 검색 이외 버튼 삭제
        (buttonToolbar.items).each(function(item,index,length){
        	  if(index==1||index==2||index==3||index==4) {
              	buttonToolbar.items.remove(item);
        	  } 
          });
        
//        //grid 생성.
        var cellEditing = new Ext.grid.plugin.CellEditing({ clicksToEdit: 1 });
//        
       this.grid = Ext.create('Rfx.base.BaseGrid', {
    	   features: [{
               id: 'group',
               ftype: 'groupingsummary',
               groupHeaderTpl: '{name}',
               hideGroupedHeader: true,
               enableGroupingMenu: true
           }, {
               ftype: 'summary',
               dock: 'bottom'
           }],
//    	   lockedGridConfig: {
//               header: false,
//               collapsible: true,
//               width: 180 +60*2,
//               forceFit: true
//           },
//           lockedViewConfig: {
//               scroll: 'horizontal'
//           },
            columns: this.columns,
            scroll:true,
            store: this.store,
            layout: 'fit',
            forceFit: true,
            plugins: [cellEditing],
            dockedItems: [buttonToolbar, searchToolbar],
            viewConfig: {
          	   	markDirty:false,
                stripeRows: true,
                enableTextSelection: false,
                preserveScrollOnReload: true,
	            getRowClass: function(record, index) {
	            	
	         //   	console_logs('getRowClass record', record);
	            	
	            	var recv_flag = record.get('recv_flag');
	            	switch(recv_flag) {
	            	case 'EM' : 
	            		return 'yellow-row';
	            		break;
	            	case 'SE':
	            		return 'red-row';
	            		break;
	            	}
	            }
             },
 			listeners: {
        		afterrender : function(grid) {
					var elments = Ext.select(".x-column-header",true);
					elments.each(function(el) {
									
								}, this);
						
					},
					
 				cellclick: function(iView, iCellEl, iColIdx, iRecord, iRowEl, iRowIdx, iEvent) {
 					this.selColIdx = iColIdx;
 					console_logs('iColIdx', this.selColIdx);
 					//console_logs('iRecord', iRecord);
			 		},
			    edit: function (editor, e, eOpts) {
			    	var r = e.record;
			    	var user_uid = r.get('user_uid');
			    	var value = this.selColIdx;
			    	var task_uid = r.get('task' + (value-2) + '_uid');
			    	if(task_uid == 0) {
			    		task_uid = -1;
			    	}  
			    	var time = 0;
			    	var iColIdx =  this.selColIdx;
			    	if(iColIdx == 21) {
			    		time = r.get('worktime');
			    	} else if (iColIdx == 22) {
			    		time = r.get('produce');
				    } else if (iColIdx == 23) {
				    	time = r.get('pcs_h');
				    } else {
			    		time = r.get('task_' + (value-2));
			    	}
			    	if(time == '') {
			    		time = 0;
			    	}
			    	var textL = columns.length;
			    	var map_date = gUtil.yyyymmdd(new Date(), '-');
			    	console_logs('user_uid', user_uid);
					 Ext.Ajax.request({
						 url: CONTEXT_PATH + '/production/schdule.do?method=updateResourceTaskMap',
						 params:{
							 textL: textL,
							 task_uid : task_uid,  // tskmap_uid
							 map_date: map_date, 
							 user_uid : user_uid,
							 time : time,   // resource_mh
						},
	         			success : function(response, request) {
	         				console_logs('save response',response.responseText);
	         				var msg = '';
	         				if(time==0 || time=='') {
	         					msg = 'UID ' + task_uid +'의  값이 ' + ' 초기화 되었습니다.'
	         				} else {
	         					msg = 'UID ' + task_uid +'의 값이 ' + '"' + time + '" (으)로 수정되었습니다.'
	         				}
	         				gm.me().showToast('셀수정 결과', msg);
	         			},
	         			failure: function(val, action){
	         				Ext.Msg.alert('오류', '저장 오류.\n 연결상태를 확인하세요.', function() {});
	         			}
					 });
			    	
			    	
			    	
			    	
//			    	var idx = this.selColIdx;
//			    	
//			    	var pos = Math.trunc(idx/2);
//			    	var type = idx%2 == 1 ? 'time' : 'human';
//			    	
//			    	var name = type + (pos+1);
//			        var val = e.record.get(name);
//			        console.log(name, val);
			        
			        //Ajax 호출하여 업데이트
			        
			    }
			}
            
        });

        //입력/상세 창 생성.
        //this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid/*,  this.crudTab*/]
        });


        this.callParent(arguments);
        
        //디폴트 로딩
        gMain.setCenterLoading(false);
        this.store.load({
        	params:{
        		pcs_code: this.selectedPcs
        	},
        	callback: this.storeCallback
        });
    },
    checkHighlight: function(record) {
    	var nDay = this.toDay.getDate();
    	
    	if(record.get('human' + nDay)==0) {
    		return true;
    	}else if(record.get('time' + nDay)==0){
    		return true;
    	} else {
    		return false;
    	}
    	
    },
    dayList: [],
    dayDispList: [],
//    makeDayList: function(n) {
//    	
//    	var firstDay = new Date();
//    	firstDay.setDate(firstDay.getDate() + (-1)*n);
//    	
//    	var dayNum = firstDay.getDate();
//    	for(var i=1; i<n+1; i++) {
//    		firstDay.setDate( dayNum + i);
//    		
//    		var sMon = (firstDay.getMonth()+1) + '';
//    		if(sMon.length==1) {
//    			sMon=  '0' + sMon;
//    		}
//    		var nDay = firstDay.getDay();
//    		var sDay = '';
//    		switch(nDay) {
//    		case 0:
//    			sDay = '일';
//    			break;
//    		case 1:
//    			sDay = '월';
//    			break;
//    		case 2:
//    			sDay = '화';
//    			break;
//    		case 3:
//    			sDay = '수';
//    			break;
//    		case 4:
//    			sDay = '목';
//    			break;
//    		case 5:
//    			sDay = '금';
//    			break;
//    		case 6:
//    			sDay = '토';
//    			break;
//    		}
//    		
//    		this.dayDispList.push(
//    				sMon + '/' + firstDay.getDate() + ' (' + sDay +  ')'
//    				);
//    		this.dayList.push(
//    				'' + firstDay.getFullYear() +
//    				sMon +
//    				firstDay.getDate()
//    		);
//    		
//    	}
//    	console_logs('dayList', this.dayList);
//
//            	
//    },
    
    items : [],
    
    selectedPcs: '',
    
    storeCallback : function(records) {
//		var nDay = gMain.selPanel.toDay.getDate();
////		var models = gMain.selPanel.store.getRange();
//		
////	    var grid = gMain.selPanel.grid;
////	    //grid.scrollBy(500, 500, true);
////	    //grid.getView().el.dom.scrollLeft = 100;
////	    
////	    grid.getView().el.dom.scrollLeft = 100;
//	    
////        var selModel = grid.getSelectionModel();
////        // set the position
////        selModel.setPosition({row:1, column:(nDay-1)*2}, false);
////        // get the newly established position
////        var pos = selModel.getPosition();
////        // focus the cell
////        grid.getView().focusCell( pos );
//		 
//		 
//		 
//		for(var no=0; no<records.length; no++) {
//			
//			var rec = records[no];
//
//    		//var model = models[no];
//    		//console_logs('model', model);
//    		console_logs('rec', rec);
//    		
//    		for(var i=0; i<gMain.selPanel.dayList.length-1; i++) {
//    			
//    			
//        		//sum 계산
//        		var humantotal = 0;
//        		var timetotal = 0;
//    			
//    			var day = gMain.selPanel.dayList[i];
//    			//console_logs('workResource day', day);
//    			
////   			var count = Math.ceil(20*Math.random());
//    			
////    			if(i==nDay) { //highlight test
////    				model.set('human' +day,  0);
////    				model.set('time' +day,  0);
////    			} else if(i>nDay) {
////    				model.set('human' +i,  null);
////    				model.set('time' +i,  null);
////    			} else {
//        			var vHuman = model.get('human_' +(i+1));
//        			humantotal = humantotal +vHuman;
//        			var vTime = model.get('time_' +(i+1));
//        			timetotal =  timetotal + vTime;
//    			//}
//    			
//
//    		}//endoffor
//    		
//
////    		
////    		for(var i=1; i<gUtil.getLastDay() +1; i++) {
////    			humantotal = humantotal + model.get('human' +i);
////    			timetotal =  timetotal + model.get('time' +i);
////    		}
////    		model.set('humantotal',  humantotal);
////    		model.set('timetotal', timetotal);
//    		
//		}//endoffor

	}//endoffunction


});