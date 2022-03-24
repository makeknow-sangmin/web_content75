/**
 * This example shows how to create a grid from Array data. The grid is stateful so you
 * can move or hide columns, reload the page, and come back to the grid in the same state
 * you left it in.
 *
 * The cells are selectable due to use of the `enableTextSelection` option.
 */
Ext.define('Rfx2.view.company.dabp01kr.executiveInfo.BusinessPlan', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'business-plan-view',
    
    
    initComponent: function(){
//    	 var sdate = Ext.Date.add(new Date(), Ext.Date.MONTH, -1);
//         var edte = new Date();
         
     	//order by 에서 자동 테이블명 붙이기 켜기. 
//     	this.orderbyAutoTable = true;
//     	useMultitoolbar = false;
     	//검색툴바 필드 초기화
     	this.initSearchField();
     	//검색툴바 추가
     	
     	//this.addSearchField('unique_id');
     	//this.setDefComboValue('standard_flag', 'valueField', 'R');

     	
 		//명령툴바 생성
         var buttonToolbar = this.createCommandToolbar();
         var searchToolbar =  this.createSearchToolbar();
         
//         this.createStore('Rfx.model.BuyerSales', [{
//	            property: 'item_code',
//	            direction: 'ASC'
//	        }],
//	        gMain.pageSize/*pageSize*/
//	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
//	        ,{
//	        	item_code_dash: 's.item_code',
//	        	comment: 's.comment1'
//	        },
//	        ['srcahd']
//	        );
         this.createStoreSimple({
	    		modelClass: 'Rfx.model.BuyerSales',
	    		sorters: [{
		        	property: 'combst_uid',
		        	direction: 'ASC'
		        }],
		        pageSize: gMain.pageSize,/*pageSize*/
		        byReplacer: {
		        },
		        deleteClass: ['bstsle']
			        
		    }, {
		    	groupField: 'wa_name'
     });
     
        (buttonToolbar.items).each(function(item,index,length){
        	  if(index==1||index==2||index==3||index==4||index==5) {
              	buttonToolbar.items.remove(item);
        	  }
          });
        
//        this.setRowClass(function(record, index) {
//        	
//        	console_logs('record11111', record);
//            var c = record.get('combst_uid');
//             console_logs('c', c);
//            switch(c) {
//                case -1:
//                	return 'green-row';
//                	break;
//                default:
//                	
//            }
//
//        });

        
        var columns = [];
        for(var i=0;i < this.columns.length; i++) {
        	var o = this.columns[i];
        	o['locked'] = vCompanyReserved4 == 'KYNL01KR' ? false : true;
        	columns.push(o);
        }
        
        
        columns.push({
            text: '구 분',
            columns: [{
                text     : '거래처',
                width    : 130,
                sortable : false,
                dataIndex: 'wa_name'
            }, {
                text     : '구분',
                width    : 70,
                sortable : false,
                dataIndex: 'type_name'
            }]
        });
	        
        var monthColumns = [];   
        
        
        for(var i=1; i<13; i++) {

        	monthColumns.push( {
                text     : i+'월',
                width    : 107,
                sortable : false,
                dataIndex: 'month' + i
            })
        }
        	//console_logs('i', i);
	        columns.push({
	            text: '월 정보',
	            columns: monthColumns
	        });
        
	    columns.push({
	            text: '합 계',
	            columns: [{
	                text     : '합 계',
	                width    : 130,
	                sortable : false,
	                dataIndex: 'sum'
	            }, {
	                text     : '비율',
	                width    : 70,
	                sortable : false,
	                dataIndex: 'percent'
	            }]
	    });
	    
        var target = new Date();
        
//        console_logs('----------------columns', columns);

        this.groupField = 'wa_name';
        this.groupDir = 'ASC';

        this.grid = Ext.create('Rfx.base.BaseGrid', {
            columns: columns,
            scroll:true,
            store: this.store,
            multiSelect: false,
//            selModel: Ext.create("Ext.selection.CheckboxModel",{}),
            //layout: 'fit',
            //forceFit: true,
            dockedItems: [buttonToolbar, searchToolbar],
            features: [{ ftype: 'grouping' }],
            viewConfig: {
                markDirty:false,
                stripeRows: true,
                enableTextSelection: false,
                preserveScrollOnReload: true,
                getRowClass: function(record, index) {
//                    var recv_flag = record.get('recv_flag');
                    var combst_uid = record.get('combst_uid');
                    switch(combst_uid) {
                        case -1 :
                            return 'green-row';
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

        this.grid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                console_logs('테스트', selections);
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


    outQty: function(){
        var form = null;

        form = Ext.create('Ext.form.Panel', {
            id: 'formPanel',
            xtype: 'form',
            frame: false ,
            border: false,
            bodyPadding: '3 3 0',
            region: 'center',
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                labelWidth: 60,
                margins: 10,
            },
            items   : [
                {
                    xtype: 'fieldset',
                    title: '입력',
                    collapsible: true,
                    defaults: {
                        labelWidth: 60,
                        anchor: '100%',
                        layout: {
                            type: 'hbox',
                            defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                        }
                    },
                    items   : [
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: '불출 개수',
                            combineErrors: true,
                            msgTarget : 'side',
                            layout: 'hbox',
                            defaults: {
                                flex: 1,
                                hideLabel: true,
                            },
                            items: [
                                {
                                    xtype     : 'numberfield',
                                    id : 'pr_quans',
                                    name      : 'pr_quans',
                                    fieldLabel: '불출 개수',
                                    margin: '0 5 0 0',
                                    width: 200,
                                    allowBlank: false,
//	                                   emptyText: '영문대문자와 숫자만 입력',
//	                                   validator: function(v) {
//	                                       if (/[^A-Z0-9_-]/g.test(v)) {
//	                                    	   v = v.replace(/[^A-Z0-9_-]/g,'');
//	                                       }
//	                                       this.setValue(v);
//	                                       return true;
//	                                   }  // end of validator
                                }  // end of xtype
                            ]  // end of itmes
                        }  // end of fieldcontainer
                    ]
                }
            ]

        });//Panel end...

        prwin = gMain.selPanel.prwinopen(form);

    },

    prwinopen: function(form) {
        prWin =	Ext.create('Ext.Window', {
            modal : true,
            title: '불출 개수 지정',
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function(){
                    var form = Ext.getCmp('formPanel').getForm();
                    var stoqtyarr = [];
                    var srcahdarr = [];
                    var wh_qtys = [];
                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                    for(var i=0; i< selections.length; i++) {
                        var rec = selections[i];
                        var uid =  rec.get('stoqty_uids');  //STOQTY unique_id
                        var srcahdUid = rec.get('unique_id');
                        var wh_qty = rec.get('wh_qty');
                        stoqtyarr.push(uid);
                        srcahdarr.push(srcahdUid);
                        wh_qtys.push(wh_qty);
                    }

                    form.submit({
                        url : CONTEXT_PATH + '/purchase/request.do?method=createBuyingRequestGoDirect',
                        params:{
                            srcahdUids: srcahdarr,
                            stoqtyUids: stoqtyarr,
                            wh_qtys: wh_qtys,
                        },
                        success: function(val, action){
                            prWin.close();
                            gMain.selPanel.store.load(function(){});
                        },
                        failure: function(val, action){
                            prWin.close();
                        }
                    });


                }//btn handler
            },{
                text: CMD_CANCEL,
                handler: function(){
                    if(prWin) {

                        prWin.close();

                    }
                }
            }]
        });
        prWin.show();
    },
//    monthColumns:[]
});
