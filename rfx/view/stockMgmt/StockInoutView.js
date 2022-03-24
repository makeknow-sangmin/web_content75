Ext.require([
    'Ext.data.*',
    'Ext.grid.*',
    'Ext.tree.*',
    'Ext.tip.*',
    'Ext.ux.CheckColumn'
]);

//자재 관리
Ext.define('Rfx.view.stockMgmt.StockInoutView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'stock-inout-view',
    
    
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
         this.createStore('Rfx.model.InnOutMonth', [{
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
                        text     : '入',
                        width    : 35,
                        sortable : false,
                        dataIndex: 'd' + (i+1)
                    }, {
                        text     : '出',
                        width    : 35,
                        sortable : false,
                        dataIndex: 'm' + (i+1)
                    }]
                });
            }
            break;
        }
        
        console_logs('----------------columns', columns);

        if(vCompanyReserved4 == 'KYNL01KR') {
            buttonToolbar.insert(1, this.outqtyAction);
            this.setAllMatView = Ext.create('Ext.Action', {
                xtype : 'button',
                text: '전체',
                tooltip: '전체',
                //pressed: true,
                toggleGroup: 'stockviewType',
                handler: function() {
                    gMain.selPanel.stockviewType = 'ALL';
                    gMain.selPanel.store.getProxy().setExtraParam('standard_flag', '');
                    gMain.selPanel.store.getProxy().setExtraParam('sp_code', '');
                    gMain.selPanel.store.load(function(){});
                }
            });


            this.setRawMatView = Ext.create('Ext.Action', {
                xtype : 'button',
                text: '원자재',
                tooltip: '원자재 재고',
                //pressed: true,
                toggleGroup: 'stockviewType',
                handler: function() {
                    this.matType = 'RAW';
                    gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
                    gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'R');
                    gMain.selPanel.store.load(function(){});
                }
            });

            this.setPaintMatView = Ext.create('Ext.Action', {
                xtype : 'button',
                text: 'PAINT자재',
                tooltip: 'PAINT자재 재고',
                //pressed: true,
                toggleGroup: 'stockviewType',
                handler: function() {
                    this.matType = 'PNT';
                    gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'R');
                    gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'R2');
                    gMain.selPanel.store.load(function(){});
                }
            });

            this.setSaMatView = Ext.create('Ext.Action', {
                xtype : 'button',
                text: '공구',
                tooltip: '공구 재고',
                //pressed: true,
                toggleGroup: 'stockviewType',
                handler: function() {
                    this.matType = 'SUB';
                    gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
                    gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K1');
                    gMain.selPanel.store.load(function(){});
                }
            });
            this.setSubMatView = Ext.create('Ext.Action', {
                xtype : 'button',
                text: vCompanyReserved4 == 'KYNL01KR' ? '기계공구류' : '기타소모품',
                tooltip: vCompanyReserved4 == 'KYNL01KR' ? '기계공구류 재고' : '기타소모품 재고',
                //pressed: true,
                toggleGroup: 'stockviewType',
                handler: function() {
                    this.matType = 'MRO';
                    gMain.selPanel.store.getProxy().setExtraParam('standard_flag', 'K');
                    gMain.selPanel.store.getProxy().setExtraParam('sp_code', 'K2');
                    gMain.selPanel.store.load(function(){});
                }
            });

            //PO Type View Type
            this.setAllPoView = Ext.create('Ext.Action', {
                xtype: 'button',
                text: '전체',
                tooltip: '전체목록',
                pressed: true,
                //ctCls: 'x-toolbar-grey-btn',
                toggleGroup: 'poViewType',
                handler: function() {
                    gm.me().createAddPoAction.disable();
                    gm.me().vSELECTED_UNIQUE_ID = '';
                    gm.me().poviewType = 'ALL';
                    gm.me().store.getProxy().setExtraParam('standard_flag', '');
                    gm.me().store.getProxy().setExtraParam('sp_code', '');
                    gm.me().store.load(function() {});

                }
            });

            buttonToolbar.insert(7, this.setSubMatView);
            buttonToolbar.insert(7, this.setSaMatView);

            buttonToolbar.insert(7, this.setPaintMatView);

            buttonToolbar.insert(7, this.setRawMatView);
            buttonToolbar.insert(7, this.setAllMatView);

        }

        if(vCompanyReserved4 == 'KYNL01KR') {

            this.grid = Ext.create('Rfx.base.BaseGrid', {
                columns: columns,
                scroll:true,
                store: this.store,
                multiSelect: true,
                selModel: Ext.create("Ext.selection.CheckboxModel",{}),
                //layout: 'fit',
                //forceFit: true,
                dockedItems: [buttonToolbar, searchToolbar],
                viewConfig: {
                    markDirty:false,
                    stripeRows: true,
                    enableTextSelection: false,
                    preserveScrollOnReload: true,
                    getRowClass: function(record, index) {

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

            this.grid.getSelectionModel().on({
                selectionchange: function(sm, selections) {
                    console_logs('테스트', selections);
                }
            });

		} else {
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
		}




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
    }
});



