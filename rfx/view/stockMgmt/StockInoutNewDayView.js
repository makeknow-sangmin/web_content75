Ext.require([
    'Ext.data.*',
    'Ext.grid.*',
    'Ext.tree.*',
    'Ext.tip.*',
    'Ext.ux.CheckColumn'
]);

//자재 관리
Ext.define('Rfx.view.stockMgmt.StockInoutNewDayView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'stock-inout-new-day-view',
    
    
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

        this.addSearchField ({
            type: 'combo',
            emptyText:'월 선택',
            field_id: 'year_month'
            ,store: "YearMonthStore"
            ,displayField: 'second'
            ,valueField: 'first'
            ,innerTpl	: '<div data-qtip="{first}">{second}</div>'
        });

        switch(vCompanyReserved4) {
            case 'KYNL01KR':
                this.addSearchField({
                    type: 'condition',
                    width: 140,
                    sqlName: 'innoutmonth',
                    tableName: 'srcahd',
                    field_id: 'item_code',
                    fieldName: 'item_code',
                    params: {
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 200,
                    sqlName: 'innoutmonth',
                    tableName: 'srcahd',
                    field_id: 'item_name',
                    fieldName: 'item_name',
                    params: {
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 200,
                    sqlName: 'innoutmonth',
                    tableName: 'srcahd',
                    field_id: 'specification',
                    fieldName: 'specification',
                    params: {
                    }
                });
                break;
            default:
                this.addSearchField('item_code');
                this.addSearchField('item_name');
                this.addSearchField('specification');
        }


 		//명령툴바 생성
         var buttonToolbar = this.createCommandToolbar();
         

         //부자재 선택시 구분(sg_code) disabled로 이벤트처리
         this.addCallback('STANDARD_FLAG', function(o){
         	console_logs('addCallback>>>>>>>>>', o);
         });

         //console_logs('this.fields', this.fields);
         this.createStore('Rfx.model.InnOutMonth2', [{
	            property: 'item_code',
	            direction: 'ASC'
	        }],
	        gMain.pageSize/*pageSize*/
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
	        ,{
	        	item_code_dash: 's.item_code',
	        	comment: 's.comment1'
	        },
	        ['srcahd']
	        );

        this.outqtyAction = Ext.create('Ext.Action',{
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '불출하기',
            tooltip: '불출하기',
            disabled: true,
            handler: function() {
                gm.selPanel.outQty();
            }
        });
     
        
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
        	o['locked'] = vCompanyReserved4 == 'KYNL01KR' ? false : true;
        	columns.push(o);
        }
        
        var target = new Date();
        
        switch(vCompanyReserved4) {
            case 'KWLM01KR':
                for(var i=0; i<gu.getLastDay(target); i++) {
                //console_logs('i', i);
                columns.push({
                    text: (i+1) + '일',
                    columns: [{
                        text     : '입',
                        width    : 35,
                        sortable : false,
                        dataIndex: 'd' + (i+1)
                    }, {
                        text     : '출',
                        width    : 35,
                        sortable : false,
                        dataIndex: 'm' + (i+1)
                    }]
                });
            }
            break;
            default:
                for(var i=0; i<gu.getLastDay(target); i++) {
                //console_logs('i', i);
                columns.push({
                    text: (i+1) + '일',
                    columns: [{
                        text     : '입',
                        width    : 35,
                        sortable : false,
                        dataIndex: 'd' + (i+1)
                    }, {
                        text     : '출',
                        width    : 35,
                        sortable : false,
                        dataIndex: 'm' + (i+1)
                    }]
                });
            }
            break;
        }
        
        console_logs('----------------columns', columns);

      
    
            this.grid = Ext.create('Rfx.base.BaseGrid', {
                columns: columns,
                scroll:true,
                store: this.store,
                //layout: 'fit',
                //forceFit: true,
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


        if(vCompanyReserved4 == 'KYNL01KR') {
            this.outqtyAction.enable();
        }

if(vCompanyReserved4 != 'DABP01KR') {
    //디폴트 로드
  gMain.setCenterLoading(false);
  this.store.getProxy().setExtraParam('year_month', gu.yyyymm(new Date(), '-'));
  this.storeLoad();
}

    },
    items : [],
    matType: 'RAW',
    stockviewType: "ALL",
	storeLoadCallbackSub: function(records, store, model) {
		console_logs('Stockin', records);
	},


   

    
});



