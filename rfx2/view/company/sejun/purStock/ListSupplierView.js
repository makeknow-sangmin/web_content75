Ext.define('Rfx2.view.company.sejun.purStock.ListSupplierView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'list-supplier-view',
    initComponent: function(){

        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField({
            field_id: 'blocking_flag'
            , emptyText: '거래중단'
            , store: "Rfx2.store.company.bioprotech.BlockingFlagStore"
            , displayField: 'codeName'
            , valueField: 'systemCode'
            , defaultValue: 'N'
            , autoLoad: true
            , innerTpl: '<div data-qtip="{unique_id}">{code_name_kr}</div>'
        });

        // this.addSearchField (
        //     {
        //         field_id: 'supplier_type'
        //         ,store: 'SupplyTypeStore'
        //         ,displayField: 'code_name_kr'
        //         ,valueField: 'system_code'
        //         //,width: 230
        //         ,innerTpl	: '[{system_code}] {code_name_kr}'
        //     });

        this.addSearchField('supplier_name');
        //Readonly Field 정의
        this.initReadonlyField();
        this.addReadonlyField('unique_id');
        this.addReadonlyField('create_date');
        this.addReadonlyField('creator');


        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();



        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        var secontToolbar =

            console_logs('this.fields', this.fields);
        var o =[];
        var fields=o['this.fields'];
        console_logs('fields>>>>>>>>>>', fields);
        //var cellEditing = new Ext.grid.plugin.CellEditing({clicksToEdit: 1});
        // Ext.each(
        //     fields,
        //     function(o, index) {
        //         o['sortable'] = false;
        //         switch (o['dataIndex']) {
        //             case 'company_info':
        //                 o['style'] = 'text-align:right';
        //                 o['align'] = 'right';
        //                 o['css'] = 'edit-cell';
        //                 o["renderer"] =function(value, meta) {
        //                     meta.css = 'custom-column';
        //                     return value;
        //                 };
        //                 o['editor'] = {
        //                     id:gu.id(this.link+'price'),
        //                     allowBlank : false,
        //                     xtype : 'textfield',
        //                     minValue : 0
        //                 };
        //                 break;
        //         }
        //     });

        this.createStore('Rfx.model.ListSupplier', [{
                property: 'supplier_name',
                direction: 'DESC'
            }],
            gMain.pageSize
            ,{}
            ,['supast']

        );

        this.addCallback('CHECK_CODE', function(o){
            var target = gMain.selPanel.getInputTarget('area_code');

            var code = target.getValue();

            var uppercode = code.toUpperCase();

            //if(code == null || code == ""){
            if(code.length < 2){
                Ext.Msg.alert('안내', '코드는 두자리 영문으로 입력해주세요', function() {});
            }else {

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/purchase/supplier.do?method=checkCode',
                    params: {
                        code: code
                    },
                    success : function(result, request){
                        var resultText = result.responseText;

                        if(resultText=='0') {
                            Ext.Msg.alert('안내', '사용가능한 코드입니다', function() {});
                            gMain.selPanel.getInputTarget('area_code').setValue(uppercode);
                        }else {
                            Ext.Msg.alert('사용불가', '이미 사용중인 코드입니다', function() {});
                            gMain.selPanel.getInputTarget('area_code').setValue('');
                        }
                    },
                    failure: extjsUtil.failureMessage
                }); //end of ajax
            }


        });  // end of addCallback



        this.addCallback('SUPPLIER_CODE', function(o){
            var target = gMain.selPanel.getInputTarget('supplier_code');

            var code = target.getValue();

            var uppercode = code.toUpperCase();

            //if(code == null || code == ""){
            if(code.length < 2){
                Ext.Msg.alert('안내', '코드는 두자리 영문으로 입력해주세요', function() {});
            }else {

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/purchase/supplier.do?method=checkCodeSupCode',
                    params: {
                        code: code
                    },
                    success : function(result, request){
                        var resultText = result.responseText;

                        if(resultText=='0') {
                            Ext.Msg.alert('안내', '사용가능한 코드입니다', function() {});
                            gMain.selPanel.getInputTarget('supplier_code').setValue(uppercode);
                        }else {
                            Ext.Msg.alert('사용불가', '이미 사용중인 코드입니다', function() {});
                            gMain.selPanel.getInputTarget('supplier_code').setValue('');
                        }
                    },
                    failure: extjsUtil.failureMessage
                }); //end of ajax
            }


        });  // end of addCallback

        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar);
//		var gridBoard = this.createGrid('Rfx.view.grid.BoardGrid');
//        this.grid = Ext.create('Rfx.base.BaseGrid', {
//            store: this.store,
//            dockedItems: [buttonToolbar, searchToolbar],
//            columns: this.columns
//        });
//        this.grid.getSelectionModel().on({
//        	selectionchange: function(sm, selections) {
//	            if (selections.length) {
//	            	console_logs(' selections[0]',  selections[0]);
//	            }
//        	}
//        });

//		//명령툴바 이벤트 정의
//        this.registAction.setHandler(function(){
//        	var crudTab = Ext.getCmp('board-view' +'-'+ 'crudTab');
//        	crudTab.setActiveItem(0);
//        	crudTab.expand();
//        });
//        this.editAction.setHandler(function(){
//            Ext.Msg.alert('Click','You clicked on "'+ this.text +'".');
//        });
//        this.copyAction.setHandler(function(){
//            Ext.Msg.alert('Click','You clicked on "'+ this.text +'".');
//        });
//        this.viewAction.setHandler(function(){
//        	var crudTab = Ext.getCmp('board-view' +'-'+ 'crudTab');
//
//        	var idx = crudTab.items.indexOf(crudTab.getLayout().getActiveItem());
//        	idx==0 ? crudTab.setActiveItem(1) : crudTab.collapsed ? crudTab.expand() : crudTab.collapse();
//        });
//        this.removeAction.setHandler(function(){
//            Ext.Msg.alert('Click','You clicked on "'+ this.text +'".');
//        });
//        this.excelAction.setHandler(function(){
//            Ext.Msg.alert('Click','You clicked on "'+ this.text +'".');
//        });


        this.createCrudTab();

        Ext.apply(this, {
//            layout: 'border',
            items: [this.grid,  this.crudTab]
        });


        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function(records){

        });
    },
    // editRedord: function(field, rec) {
    //     console_logs('====> edited field', field);
    //     console_logs('====> edited record', rec);
    //
    //     switch (field) {
    //         case 'company_info':
    //             this.updateComment(rec);
    //
    //             break;
    //     }
    // },
    // updateComment: function(rec) {
    //     var child = gMain.selPanel.vSELECTED_UNIQUE_ID;
    //     var unique_id = rec.get('id');
    //     var supplier_name = rec.get('supplier_name');
    //     console_logs('unique_id>>>', unique_id);
    //     var company_info = rec.get('company_info');
    //
    //     Ext.Ajax.request({
    //         url: CONTEXT_PATH + '/purchase/supplier.do?method=updateCompanyInfo',
    //         params: {
    //             unique_id:unique_id,
    //             company_info:company_info
    //         },
    //         success: function(result, request) {
    //
    //             var result = result.responseText;
    //             //console_logs("", result);
    //             gm.me().showToast('결과','[ ' + supplier_name +' ]'+ ' 의 업체정보가  변경되었습니다.');
    //         },
    //         failure: extjsUtil.failureMessage
    //     });
    // },
    items : []
});
