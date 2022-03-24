Ext.define('Rfx2.view.company.hanjung.purStock.PurchaseSendHistoryView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'list-supplier-view',
    initComponent: function(){
    	//검색툴바 필드 초기화
    	this.initSearchField();
		switch(vCompanyReserved4) {
            case 'SKNH01KR':
            case 'KBTC01KR':
            case 'HJSV01KR':
                this.addSearchField('po_no');
                this.addSearchField('supplier_name');
                //Readonly Field 정의
                this.initReadonlyField();
                this.addReadonlyField('unique_id');
                this.addReadonlyField('create_date');
                this.addReadonlyField('creator');
                break;
            
			default:
                this.addSearchField('po_no');
                this.addSearchField('supplier_name');
                //Readonly Field 정의
                this.initReadonlyField();
                this.addReadonlyField('unique_id');
                this.addReadonlyField('create_date');
                this.addReadonlyField('creator');
		}

        Ext.each(this.columns, function(columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            console_logs('dataIndex', dataIndex);
            switch (dataIndex) {
                case 'company_info':
                    columnObj["editor"] = {};
                    columnObj["css"] = 'edit-cell';
                    columnObj["renderer"] = function(value, meta) {
                        meta.css = 'custom-column';
                        return value;
                    };
                    break;
            }
        });
   
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS: [
                'REGIST', 'EDIT', 'COPY'
            ],
        });
        var arr = [];

        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        this.setRowClass(function (record, index) {
            console_logs('record>>>', record);
            var c = record.get('view_flag');
            switch (c) {
                case 'C':
                    return 'yellow-row';
                    break;
                default:
                    break;
            }
        });
        var secontToolbar =  console_logs('this.fields', this.fields);
        
        var o =[];
        var fields=o['this.fields'];
        console_logs('fields>>>>>>>>>>', fields);
        var cellEditing = new Ext.grid.plugin.CellEditing({clicksToEdit: 1});
        Ext.each (
        		fields,
				function(o, index) {
					o['sortable'] = false;
					switch (o['dataIndex']) {
					case 'company_info':
						o['style'] = 'text-align:right';
						o['align'] = 'right';
						o['css'] = 'edit-cell';
						o["renderer"] =function(value, meta) {
							meta.css = 'custom-column';
							return value;
						};
						o['editor'] = {
							id:gu.id(this.link+'price'),
							allowBlank : false,
							xtype : 'textfield',
							minValue : 0
						};
						break;
					}
        });
                
        this.createStore('Rfx.model.ListSendingEmail', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        ,{}
        	,['mailmsg']
        );

        //grid 생성.
        this.createGrid(searchToolbar, buttonToolbar);
        this.createCrudTab();
        Ext.apply(this, {
            items: [this.grid,  this.crudTab, arr]
        });
        this.callParent(arguments);
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.load(function(records){
        });
    },
    items : [],
});
