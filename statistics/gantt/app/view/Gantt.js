
function popup3rdParty(id, name, pj_uid, StartDate,EndDate, parentId) {
	
	if(parent==null) {
		var formInner3 =  Ext.create('Ext.form.Panel', {
			        defaultType: 'textfield',
			        border: false,
			        bodyPadding: 1,
			        id : 'formpopup3rdParty',
			        html: '이 영역을 다른 사내시스템에 연결할 수 있습니다.'
		});
	
		
		var win = Ext.create('ModalWindow', {
	    	title: name  + ' :: ' + '3rd party application program Link',
	        width: 400,
	        height: 300,
	        minWidth: 250,
	        minHeight: 180,
	        layout: 'fit',
	        plain:true,
	        items: formInner3,
	        buttons: [{
	            text: '확인',
	        	handler: function(){
		               
			       	if(win){
			       		win.close();
			       		// lfn_gotoHome();
			       	} 
			       }
			     },{
			     	text: '취소',
			     	handler: function(){
			     		if(win){
				       		win.close();
				       	} 
			     	}
		     }]//endofbutton arr
		});
		
		win.show();
	}else {
		try {
			parent.popup3rdParty(id, name, pj_uid, StartDate,EndDate, parentId);
		} catch (e) {
			var formInner3 =  Ext.create('Ext.form.Panel', {
				        defaultType: 'textfield',
				        border: false,
				        bodyPadding: 1,
				        id : 'formpopup3rdParty',
				        html: '이 영역을 다른 사내시스템에 연결할 수 있습니다.'
			});
		
			
			var win = Ext.create('ModalWindow', {
		    	title: name  + ' :: ' + '3rd party application program Link',
		        width: 400,
		        height: 300,
		        minWidth: 250,
		        minHeight: 180,
		        layout: 'fit',
		        plain:true,
		        items: formInner3,
		        buttons: [{
		            text: '확인',
		        	handler: function(){
			               
				       	if(win){
				       		win.close();
				       		// lfn_gotoHome();
				       	} 
				       }
				     },{
				     	text: '취소',
				     	handler: function(){
				     		if(win){
					       		win.close();
					       	} 
				     	}
			     }]//endofbutton arr
			});
			
			win.show();
		}
	}
}

function popupFileDown(id, name) {
	
	if(parent==null) {
		var myWin = Ext.create('ModalWindow', {
	    	title: name  + ' :: ' + '파일 보기',
	        width: 420,
	        height: 300,
	        minWidth: 250,
	        minHeight: 180,
	        layout: 'fit',
	        plain:true,
	        items: Ext.create('Mplm.grid.FileDownGrid', {group_code: id})//,
	//        buttons: [{
	//            text: '확인',
	//        	handler: function(){ 
	//		       	if(win){
	//		       		myWin.close();
	//		       		// lfn_gotoHome();
	//		       	} 
	//		       }
	//		     }]//endofbutton arr
		});
		
		myWin.show();
	} else {
		try {
			parent.popupFileDown(id, name);
		} catch(e) {
				var myWin = Ext.create('ModalWindow', {
			    	title: name  + ' :: ' + '파일 보기',
			        width: 420,
			        height: 300,
			        minWidth: 250,
			        minHeight: 180,
			        layout: 'fit',
			        plain:true,
			        items: Ext.create('Mplm.grid.FileDownGrid', {group_code: id})//,
			//        buttons: [{
			//            text: '확인',
			//        	handler: function(){ 
			//		       	if(win){
			//		       		myWin.close();
			//		       		// lfn_gotoHome();
			//		       	} 
			//		       }
			//		     }]//endofbutton arr
				});
				myWin.show();
		}
	}
}

var formInner = null;
function freeLoading() {
	formInner.setLoading(false);
}
	
var vFILE_ITEM_CODE = ''; 

function popupFileAttach(id, name) {
	
	formInner =  Ext.create('Ext.form.Panel', {
		        defaultType: 'textfield',
		        border: false,
		        bodyPadding: 1,
		        id : 'formPanel',
		        items: [{
					id : 'tempport3333',
					 margin: '0 0 0 0',
				    height: '100%',
				    width: '100%',
			        xtype : "component",
			        autoEl : {
			            tag : "iframe",
			            height: '100%',
			    	    width: '100%',
			    	    margin: '0 0 0 0',
			    	    border: 0,
			    	    width: '100%',
			            src : CONTEXT_PATH + '/test/multiFileUpload.jsp',
				        frameBorder: 0
				        ,onLoad: "freeLoading()"
				     }
				}]
	});

	
	var win = Ext.create('ModalWindow', {
    	title: name  + ' :: ' + '파일 첨부',
        width: 420,
        height: 300,
        minWidth: 250,
        minHeight: 180,
        layout: 'fit',
        plain:true,
        items: formInner,
        buttons: [{
            text: '확인',
        	handler: function(){
	               
		       	Ext.Ajax.request({
					url: CONTEXT_PATH + '/fileObject.do?method=finishTaskFile',				
					params:{
						file_item_code : vFILE_ITEM_CODE,
						task_uid: id
					},
					success : function(result, request) {
						console_log('attach ok');
					},//Ajax success
					
					failure: extjsUtil.failureMessage
				}); 
		       	if(win){
		       		win.close();
		       		// lfn_gotoHome();
		       	} 
		       }
		     },{
		     	text: '취소',
		     	handler: function(){
		     		if(win){
			       		win.close();
			       	} 
		     	}
	     }]//endofbutton arr
	});
	
	formInner.setLoading(true);
	win.show();
}

Ext.define("MyApp.view.Gantt", {
    extend              : 'Gnt.panel.Gantt',
    alias               : 'widget.gantt',

    requires            : [
        'MyApp.store.TaskStore',
        'MyApp.view.GanttToolbar'
    ],

    flex                : 1,
    lockedGridConfig    : { width : 300 },
    loadMask            : true,

    // Gantt configs
    leftLabelField      : 'Name',
    highlightWeekends   : true,
    viewPreset          : 'weekAndDayLetter',
    columnLines         : true,
    cascadeChanges      : true,

    initComponent : function() {
        var me = this;


        Ext.apply(this, {
            tipCfg : { cls : 'tasktip' },

            // Define an HTML template for the tooltip
            tooltipTpl : new Ext.XTemplate(
                '<table>',
                    '<tr><th class="caption" colspan="2">#{Id} {Name}</th></tr>',
                    '<tr>',
                        '<th>Start:</th><td>{[values._record.getDisplayStartDate("y-m-d")]}</td>',
                    '</tr>',
                    '<tr>',
                        '<th>End:</th><td>{[values._record.getDisplayEndDate("y-m-d")]}</td>',
                    '</tr>',
                    '<tr>',
                        '<th>Progress:</th><td>{[Math.round(values.PercentDone)]}%</td>',
                    '</tr>',
                '</table>'
            ),

            tbar : {
                xtype : 'gantttoolbar',
                gantt : this
            },

            viewConfig : {
                getRowClass : function(record) {
                    // Output a custom CSS class with some task property that we can use for styling
                    return 'TASKID_' + record.data.Id;
                }
            },

            // Setup your static columns
            columns : [
                {
                	header      : '업무',
                    xtype       : 'namecolumn',
                    tdCls       : 'namecell',
                    width       : 200
                },
                {
                    header      : '담당자',
                    width       : 60,
                    tdCls       : 'resourcecell',
                    xtype       : 'resourceassignmentcolumn'
                },{
                	header : '파일',
                	 width       : 60,
                	 align: 'center',
                	 dataIndex: 'fileQty',
                	 renderer : function (value, metadata, record, rowIndex, colIndex, store) {
						 
						 if ( value == 'null' || value == null ) {
							 return 'null';
						 } else {
						 	record['fileQty'] = Number(record['fileQty']) + 1; 
//						 console_log('[' + value + ']');
//						 console_log(record);
						 var retVal = value;
						 if(Number(value) >0) {
						 	retVal = Ext.String.format(
					            '<a href="javascript:popupFileDown(\'{1}\', \'{2}\')">{0}</a>',
					            value, 
					            record.get('Id'),
					            record.get('Name')
					         );
						 }
						 return retVal + Ext.String.format(
					              ' <img onmousedown="javascript:popupFileAttach(\'{1}\', \'{2}\')" src="' 									 + CONTEXT_PATH +  '/extjs/shared/icons/fam/attach.png" style="cursor: pointer;margin:1px;"></img>'
					            + ' <img onmousedown="javascript:popup3rdParty(\'{1}\', \'{2}\', \'{3}\', \'{4}\', \'{5}\', \'{6}\')" src="' + CONTEXT_PATH +  '/extjs/shared/icons/fam/link.png" style="cursor: pointer;margin:1px;"></img>',
					            value, 
					            record.get('Id'),
					            record.get('Name'),
					            record.get('pj_uid'),
					            record.get('StartDate'),
					            record.get('EndDate'),
								record.get('parentId')
					        );
						 }
                	 }
                },
                {
                	header      : '시작일자',
                    xtype       : 'startdatecolumn'
                },
                {
                	header      : '기간',
                    xtype       : 'durationcolumn'
                },
                {
                	header      : '선행업무',
                	 width       : 80,
                    xtype       : 'predecessorcolumn'
                },{
                	header : 'UID',
                	 width       : 80,
                	dataIndex: 'Id' 
                }
            ],
            plugins : [
                new Gnt.plugin.TaskEditor(),
                new Sch.plugin.TreeCellEditing({ }),
                new Gnt.plugin.TaskContextMenu({ })
            ]
        });

        this.callParent(arguments);
        this.on('afterlayout', this.triggerLoad, this, { single : true, delay : 100 });
        this.taskStore.on('load', function() 
        		{ 
        			this.expandAll();
        			this.body.unmask();
        			
        		}, this);
    },

    triggerLoad : function() {
        this.body.mask('Loading...', '.x-mask-loading');
        this.taskStore.loadDataSet();
    }
});
