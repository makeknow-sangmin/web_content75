Ext.define('Rfx2.view.company.dabp01kr.accountMgmt.WorkTimeView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'worktime-view',
    initComponent: function(){

    	//생성시 디폴트 값.

        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.WorkTime', [{
                property: 'create_date',
                direction: 'ASC'
            }],
            /*pageSize*/
            gMain.pageSize
            ,{}
            , ['wktime']
        );


		//검색툴바 필드 초기화
    	this.initSearchField();

    	//검색툴바 추가
        this.addSearchField({
            type: 'radio',
            field_id :'holiday_yn',
            items: [
                {
                    text :  '모두',
                    value: '',
                    name : 'holiday_yn'
                },
                {
                    text :  '생산평일',
                    value: '생산평일',
                    name : 'holiday_yn'
                },
                {
                    text :  '토요일',
                    value: '토요일',
                    name : 'holiday_yn'
                },
                {
                    text :  '휴일',
                    value: '휴일',
                    name : 'holiday_yn'
                }
            ]
        });

		//검색툴바 생성
		var searchToolbar = this.createSearchToolbar();
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        //grid 생성.
        this.createGrid(arr);
        
        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });


        this.callParent(arguments);
        
        //디폴트 로드
        gMain.setCenterLoading(false);

        this.storeLoad();
  
    },
    items : [],
    itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
    	//console_logs('boardview itemdblclick record', record);
    	  	
    	Rfx.model.Board.load(record.get('unique_id'), {
    	    success: function(board) {
            	console_logs('board', board);
    	    	var form = gm.me().createViewForm(board);
    	    	var win = Ext.create('ModalWindow', {
    	            title: gm.me().getMC('CMD_VIEW_DTL','상세보기'),
    	            width: 700,
    	            height: 530,
    	            minWidth: 250,
    	            minHeight: 180,
    	            layout: 'absolute',
    	            plain:true,
    	            items: form,
    	            buttons: [{
    	                text: CMD_OK,
    	            	handler: function(){
    	                       	if(win) 
    	                       	{
    	                       		win.close();
    	                       	} 
    	                  }
    	            }]
    	        });
    	    	win.show();
    	    }
    	});
    	
    	
    },
    createViewForm: function (board) {
    	//Ext.MessageBox.alert('Find Board', "unique_id : " + board.get('unique_id'));
    	console_logs('board', board);
//    	var lineGap = 30;
     	var unique_id = board.get('unique_id');
    	var user_id = board.get('user_id');
    	var board_email = board.get('board_email'  );
    	var board_title = board.get('board_title' );
    	var board_content = board.get('board_content' );
    	var htmlFileNames = board.get('htmlFileNames' );
    	var fileQty = board.get('fileQty' );
    	var form = Ext.create('Ext.form.Panel', {
            defaultType: 'displayfield',
            bodyPadding: 3,
            height: 650,
            defaults: {
                anchor: '100%',
                allowBlank: false,
                msgTarget: 'side',
                labelWidth: 60
            },
            items: [{
	    			fieldLabel: '등록자',
	    			value: user_id + '(' + board_email + ')'
    		    },{
    		    	fieldLabel: gm.getColName('board_title'),
    		    	value: board_title,
    		    	name: 'board_title'
    		    },{
    		    	fieldLabel: '첨부파일',
    		    	value: htmlFileNames
    		    },{
                    value: board_content,
                    xtype:          'textarea',
                    fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
                    height: 340,
                    readOnly: true,
                    anchor: '100%'
                }  
    		    ]
        }); //endof form
    	
    	return form;
    }
});
