Ext.require([
    'Ext.data.*',
    'Ext.grid.*',
    'Ext.tree.*',
    'Ext.tip.*',
    'Ext.ux.CheckColumn'
]);

//자재 관리
Ext.define('Rfx2.view.company.dabp01kr.designPlan.Stock_R_InoutView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'stock-inoutr-view',
    
    
    initComponent: function(){
    	 var sdate = Ext.Date.add(new Date(), Ext.Date.MONTH, -1);
         var edte = new Date();
         
     	//order by 에서 자동 테이블명 붙이기 켜기. 
     	this.orderbyAutoTable = true;
     	useMultitoolbar = false;
     	//검색툴바 필드 초기화
     	this.initSearchField();
     	//검색툴바 추가
     	
     	//this.addSearchField('unique_id');
     	//this.setDefComboValue('standard_flag', 'valueField', 'R');

//     	this.addSearchField ({
// 			type: 'dateRange',
// 			field_id: 'dateRange',
// 			text: "기간",
// 			sdate: sdate,
//             edate: edte,
//             editable: true
// 		});
// 		this.addSearchField (
// 				{
// 					type: 'combo',
// 					emptyText:'월 선택',
// 					field_id: 'year_month'
// 					,store: "YearMonthStore"
// 					,displayField: 'second'
// 					,valueField: 'first'
// 					,innerTpl	: '<div data-qtip="{first}">{second}</div>'
// 				});		
//     	
//     	switch(vCompanyReserved4){
// 			case 'SKNH01KR':
// 				this.addSearchField({
// 				    type: 'condition', 
// 				    width: 140, 
// 				    sqlName: 'stocklinesrcahd',
// 				    tableName: 's',
// 				    field_id: 'special_spec_flag', 
// 				    fieldName: 'special_spec_flag',
// 				    params: { 
// 				    	delete_flag:'N'
// 				    	
// 				    }
// 		    	});
// 				break;
// 			default:
// 				
// 				break;
//     	}
 		this.addSearchField('year_month1');
 	    this.addSearchField('item_code');
 	    this.addSearchField('item_name');
 	    this.addSearchField('specification');
 		
// 		this.addCallback('CHECK_SP_CODE', function(combo, record){
 //
// 		});
// 		
// 		//Readonly Field 정의
// 		this.initReadonlyField();
// 		this.addReadonlyField('unique_id');
// 		this.addReadonlyField('create_date');

 		//명령툴바 생성
         var buttonToolbar = this.createCommandToolbar();
         

         //부자재 선택시 구분(sg_code) disabled로 이벤트처리
         this.addCallback('STANDARD_FLAG', function(o){
         	console_logs('addCallback>>>>>>>>>', o);
         });

         //console_logs('this.fields', this.fields);
         this.createStore('Rfx.model.InnOutMonthDayR', [{
	            property: 'item_code',
	            direction: 'ASC'
	        }],
	        gMain.pageSize/*pageSize*/
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
	        ,{
//	        	item_code_dash: 's.item_code',
//	        	comment: 's.comment1'
	        },
	        ['srcahd']
	        );
     
        
     
        
        //검색툴바 생성
       	if(	useMultitoolbar == true ) {
       		var multiToolbar =  this.createMultiSearchToolbar({first:9, length:11});
       		console_logs('multiToolbar', multiToolbar);
               for(var i=0; i<multiToolbar.length; i++) {
//           		arr.push(multiToolbar[i]);
               }
       	} else {
       		var searchToolbar =  this.createSearchToolbar();
       	} 
       	

        
        (buttonToolbar.items).each(function(item,index,length){
        	  if(index==1||index==2||index==3||index==4||index==5) {
              	buttonToolbar.items.remove(item);
        	  }
          });
        
        var columns = [];
        for(var i=0;i < this.columns.length; i++) {
        	var o = this.columns[i];
        	o['locked'] = true;
        	columns.push(o);
        }
        
        var target = new Date();
        
        for(var i=0; i<gu.getLastDay(target); i++) {
        	//console_logs('i', i);
	        columns.push({
	            text: (i+1) + '일',
	            columns: [{
	                text     : '入',
	                width    : 60,
	                sortable : false,
	                type : 'numberfield',
	                dataIndex: 'di' + (i+1)
	            }, {
	                text     : '出',
	                width    : 60,
	                sortable : false,
	                type : 'numberfield',
	                dataIndex: 'do' + (i+1)
	            }]
	        });
        }
		console_logs('----------------columns', columns);

		var pageToolbar = [];
		
		var paging = Ext.create('Ext.PagingToolbar', {
			store: this.store,
			displayInfo: true,
			dock : 'bottom', 
			displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
			emptyMsg: "표시할 항목이 없습니다."
			,listeners: {
				beforechange: function (page, currentPage) {
					this.getStore().getProxy().setExtraParam('start', (currentPage-1)*gMain.pageSize);
					this.getStore().getProxy().setExtraParam('page', currentPage);
					this.getStore().getProxy().setExtraParam('limit', gMain.pageSize);
					// 페이지 넘겼을때 맨 윗줄로 이동.
					// gm.me().grid.view.bufferedRenderer.scrollTo(1, true);
					gm.me().pageflag = true;
				},
				change: function() {
					gm.me().pageflag = false;
				}
			}

		});

		pageToolbar = [paging];

       this.grid = Ext.create('Rfx.base.BaseGrid', {
            columns: columns,
            scroll:true,
            store: this.store,
            //layout: 'fit',
            //forceFit: true,
			dockedItems: [buttonToolbar, searchToolbar,
				paging
				],
			// bbar: getPageToolbar(this.store),
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
						
					}
			}
            
        });


        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

       //버튼 추가.
       buttonToolbar.insert(2, '-');

        this.callParent(arguments);
        
      //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
            if (selections.length) {
            	rec = selections[0];
                console_logs('request_comment>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>!>', rec.get('request_comment'));
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('unique_id');

           		gMain.selPanel.printBarcodeAction.enable();
             } else {

            	 gMain.selPanel.printBarcodeAction.disable();
             }
             })	

        //디폴트 로드
//        gMain.setCenterLoading(false);
//        this.store.getProxy().setExtraParam('year_month', gu.yyyymm(new Date(), '-'));
        this.storeLoad();
    },
    items : [],
    matType: 'RAW',
    stockviewType: "ALL",
	storeLoadCallbackSub: function(records, store, model) {
		console_logs('Stockin', records);
	},
});



