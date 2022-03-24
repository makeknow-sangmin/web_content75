Ext.define('Rfx.view.produceMgmt.WorkResourceView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'work-resource-view',
    initComponent: function(){

    	this.toDay = new Date();
    	this.yearMonthDay = gUtil.getFullYear() + '-' + gUtil.getMonth() + '-' + this.toDay.getDate();
    	
//    	console_logs('toDay', toDay);
//    	console_logs('thisYear', thisYear);
//    	console_logs('thisMonth', thisMonth);
//    	
//    	//검색툴바 필드 초기화
    	this.initSearchField();
//    	
//    	//검색툴바 추가
//		this.addSearchField ('year-month');
		
    	this.setDefComboValue('year_month', 'valueField', '2016/10');//목형유형
    	
		this.addSearchField (
				{
					type: 'combo',
					field_id: 'year_month'
					,store: "YearMonthStore"
					,displayField: 'second'
					,valueField: 'first'
					,innerTpl	: '<div data-qtip="{first}">{second}</div>'
				});	
//		
//		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		
		//명령툴바 생성
        
		var searchAction = Ext.create('Ext.Action', {
			 iconCls: 'af-search',
			 text: CMD_SEARCH/*'검색'*/,
			 tooltip: '조건 검색',
			 handler: function() {

					var myId = gMain.selPanel.link + '-'+ gMain.getSearchField('year_month');
					
					console_logs('myId', myId);
					var combo =  Ext.getCmp(myId);
					console_logs('combo', combo);
					var value = combo.getValue();
					console_logs('value', value);

			        //gMain.setCenterLoading(true);
			        gMain.selPanel.store.load({
			        	params:{
			        		year_month : value
			        	},
			        	callback: function(records) {
			        		
			        		//gMain.setCenterLoading(false);

			        	}
			        });
			 }
			});
		
		var buttonToolbar = Ext.create('widget.toolbar', {
    		cls: 'my-x-toolbar-default2',
    		items: [searchAction]
    	});
		
		var myId = this.link + '-'+ gMain.getSearchField('year_month');
		
		console_logs('myId', myId);
		var combo =  Ext.getCmp(myId);
		console_logs('combo', combo);
		combo.store.load(function(records) {
			
	    	var toDay = new Date();
	    	var yearMonth = gUtil.getFullYear() + '/' + gUtil.getMonth();
			
			for (var i=0; i<records.length; i++){ 
		       	var obj = records[i];
		       	try {
 			       	if(obj.get(combo.valueField)== yearMonth ) {
 			       		combo.select(obj);
 			       	}	
		       	} catch(e){}
			}
		});
//
//		//명령툴바 생성
//        var buttonToolbar = this.createCommandToolbar({
//        	REMOVE_BUTTONS : [
//        	        	       'SEARCH', 'COPY', 'REMOVE', 'VIEW', 'EDIT'
//        	        	],
//        	        	RENAME_BUTTONS : [
//        	        	        { key: 'REGIST', text: '저장하기'}
//        	        	]
//        });
        
        //모델 정의
        this.createStore('Rfx.model.WorkResource', [{
 	       	property: 'crate_date',
 	       	direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        );
        
//        
//        // remove the items
//        (buttonToolbar.items).each(function(item,index,length){
//        	
//        switch(index) {
//        case 0:
//        //case 1:
//        case 2:
//        case 3:
//        case 4:
//        case 5:
//        	buttonToolbar.items.remove(item);
//        }
//
//        });
        
        var nDay = this.toDay.getDate();
        //column remove
        var columns = [];
        columns.push({
			text:    this.yearMonthDay + '<br>작업 LOT',
			width: 120,
			sortable: false,
			dataIndex: 'po_no',
			style: 'text-align:center',
			locked: true,
			align: 'left',
			summaryType: 'count',
            summaryRenderer: function(value, summaryData, dataIndex) {
                return  value + ' 건';
            },
        });

        
       var weigthTotal = {
			text: '중량',
			width: 60,
			sortable: false,
			dataIndex: 'reserved_double4',
			style: 'text-align:center',
			locked: true,
			align: 'right',
			summaryType: 'sum',
            summaryRenderer: function(value, summaryData, dataIndex) {
                return  isNaN(value) ? 'Kg' : value + ' Kg';
            },
        };

    	var aTotal = {
    			text: '인원',
				locked: true,
				width: 60,
				sortable: false,
				dataIndex: 'v100',
				style: 'text-align:right',
				align: 'right',
				useThousandSeparator: true,
				thousandSeparator: ',',
				summaryType: 'sum',
				summaryRenderer: function(value, summaryData, dataIndex) {
    	            return isNaN(value) ? '' : Ext.util.Format.number(value, '0,00/i');
    	        }
    	};
    	var bTotal = {
    			text: '시간',
				locked: true,
				width: 60,
				sortable: false,
				dataIndex: 'v000',
				style: 'text-align:right',
				align: 'right',
				useThousandSeparator: true,
				thousandSeparator: ',',
				summaryType: 'sum',
				summaryRenderer: function(value, summaryData, dataIndex) {
    	            return isNaN(value) ? '' : Ext.util.Format.number(value, '0,00/i');
    	        }
    	};
      	
    	var abTotal ={
    			text: '합계',
				locked: true,
				columns : [weigthTotal, aTotal, bTotal]
    	};
		
		//this.columns.push(ab);
		columns.push(abTotal);        
        
        
        var nDay = (new Date() ).getDate();
        
        for(var i=1; i<gUtil.getLastDay() +1; i++) {
        	
        	var human = 'v1' + ( (i<10) ? ('0' + i) : ''+i); //mh1
        	//var index = 
        	var a = {};
			var b = {};
			a["text"] = '인원';
			a["width"] = 60;
			a["sortable"] = false;
			a["dataIndex"] = human;
			a["style"] = 'text-align:right';
			a["align"] = 'right';
			
//			if(nDay==i) {
//				a["field"] = {
//		    			minValue:0,
//		    			maxValue:1000,
//		    			xtype:  'numberfield',
//		    			useThousandSeparator: true,
//		    			baseChars: '0123456789,.' ,
//		    			thousandSeparator:',',
//		    			allowBlank: false,
//		    			hideTrigger:true
//		            };
//				a["style"] ='background-color:#0271BC;text-align:center';
//                
//                a["tdCls"] = 'custom-column';
//			}
			

			
			a["summaryType"] = 'sum';
			a["summaryRenderer"] = function(value, summaryData, dataIndex) {
                return isNaN(value) ? '' : value;
            };

            
//            a["renderer"] = function(value, metaData, record, rowIndex, colIndex, store, view) {
//
//            	//console_logs('renderer value',  value);
//            	//console_logs('renderer metaData',  metaData );
//            	//console_logs('renderer record',  record );
//            	//console_logs('renderer rowIndex',  rowIndex);
//            	//console_logs('renderer colIndex', colIndex);
//            	//console_logs('renderer store',  store );
//            	//console_logs('renderer view',   view );
//            					
//            	// metaData.tdAttr = 'style="background-color:#b0e987;color:black;"';
//            	metaData.tdCls =  metaData.tdCls+  " yellow-row";
//            	metaData.classes.push('yellow-row');
//            	  return isNaN(value) ? '' : Ext.util.Format.number(value, '0,00/i');
//
//            	};
            
            var time = 'v0' + ( (i<10) ? ('0' + i) : ''+i); //mh1
			
			b["text"] = '시간';
			b["width"] = 60;
			b["sortable"] = false;
			b["dataIndex"] = time;
			b["style"] = 'text-align:right';
			b["align"] = 'right';
			
//			if(nDay==i) {
//				b["field"] = {
//		    			minValue:0,
//		    			maxValue:1000,
//		    			xtype:  'numberfield',
//		    			useThousandSeparator: true,
//		    			baseChars: '0123456789,.' ,
//		    			thousandSeparator:',',
//		    			allowBlank: false,
//		    			hideTrigger:true
//		            };
//				b["renderer"] = function (value, meta) {
//                    meta.css = 'custom-column';
//                    return value;
//                };
//                b["style"] ='background-color:#0271BC;text-align:center';
//                b["tdCls"] = 'custom-column';
//			}

			b["summaryType"] = 'sum';
			b["summaryRenderer"] = function(value, summaryData, dataIndex) {
                return  isNaN(value) ? '' : value;
            };
            
//            b["renderer"] = function(value, metaData, record, rowIndex, colIndex, store, view) {
//            	  metaData.tdCls =  metaData.tdCls+  " yellow-row";
//            	  metaData.classes.push('yellow-row');
//            	  return isNaN(value) ? '' : Ext.util.Format.number(value, '0,00/i');
//            	};
        	var ab ={};
        	ab['text'] =  i+ '일';
        	
        	
			if(nDay==i) {
                ab["style"] ='background-color:#0271BC;text-align:center';
                ab['text'] = ab['text'] + ' 오늘';
			}
        	
        	
			
        	var arr = [];
        	arr.push(a);
        	arr.push(b);
			ab["columns"] = arr;
			
			//this.columns.push(ab);
			columns.push(ab);
        }

        console_logs('columns', columns);
        
        //grid 생성.
        var cellEditing = new Ext.grid.plugin.CellEditing({ clicksToEdit: 1 });
        
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
    	   lockedGridConfig: {
               header: false,
               collapsible: true,
               width: 180 +60*2,
               forceFit: true
           },
           lockedViewConfig: {
               scroll: 'horizontal'
           },
            columns: columns,
            store: this.store,
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
	            	
//	            	var nDay = gMain.selPanel.toDay.getDate();
//	            	var hKey = 'human' + 1;//nDay;
//	            	console_logs('getRowClass nDay', hKey);
//
//	            	var c = record.get(hKey);
//	            	console_logs('getRowClass c', c);
//	            	if(c == 0) {
//		            	return 'yellow-row';
//	            	} else {
//	            		return 'green-row';
//	            	}


	                
	            }
             },
 			listeners: {
        		afterrender : function(grid) {
					var elments = Ext.select(".x-column-header",true);
					elments.each(function(el) {
									
								}, this);
						
					}
            		,
 				cellclick: function(iView, iCellEl, iColIdx, iRecord, iRowEl, iRowIdx, iEvent) {
 					this.selColIdx = iColIdx;
 					console_logs('iColIdx', this.selColIdx);
 					//console_logs('iRecord', iRecord);
			 		},
			    edit: function (editor, e, eOpts) {
			    	console_logs('record', e.record);
			    	var idx = this.selColIdx;
			    	
			    	var pos = Math.trunc(idx/2);
			    	var type = idx%2 == 1 ? 'time' : 'human';
			    	
			    	var name = type + (pos+1);
			        var val = e.record.get(name);
			        console.log(name, val);
			        
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
        	params:{},
        	callback: function(records) {        		

        	}
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
    items : []
});