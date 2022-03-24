var propsGrid= null;
var store = null;

function modifyConfirm(btn){
	var unique_id  = propertyGrid.getSource()["unique_id"];
	var tel_no  = propertyGrid.getSource()["tel_no"];
	var fax_no  = propertyGrid.getSource()["fax_no"];
	var emp_no  = propertyGrid.getSource()["emp_no"];
	var user_name  = propertyGrid.getSource()["user_name"];
	var email  = propertyGrid.getSource()["email"];
	var hp_no  = propertyGrid.getSource()["hp_no"];
	
	var result = MessageBox.msg('{0}', btn);
	if(result=='yes') {	         
	        var usrAst = Ext.create('UsrAst', {
	     		 unique_id: unique_id,
	             tel_no: tel_no,
	             fax_no: fax_no,
	             emp_no: emp_no,
	             user_name: user_name,
	             email: email,
	             hp_no: hp_no
	     	});
	    		
	        usrAst.save( {
	             success: function(){ 
	            	 lfn_gotoHome();
	           	 }
	        });
	        
	 }

};


var addAction = Ext.create('Ext.Action', {
	iconCls:'save',
	text: CMD_OK,
    handler: function(widget, event){
    	Ext.MessageBox.show({
            title:delete_msg_title,
            msg: 'You are modify records. <br />Are you sure?',
            buttons: Ext.MessageBox.YESNO,
            fn: modifyConfirm,
            icon: Ext.MessageBox.QUESTION
        });
 	 }//end handler
});

var propertyGrid = null;
Ext.onReady(function() {  
	console_log('start');
	
	Ext.define('UsrAst', {
		extend : 'Ext.data.Model',
		fields : gUserFields,
		proxy : {
			type : 'ajax',
			api: {
					read: CONTEXT_PATH + '/userMgmt/user.do?method=readMyinfo',
//		            create: CONTEXT_PATH + '/userMgmt/user.do?method=create',
		            create: CONTEXT_PATH + '/userMgmt/user.do?method=changeMyinfo'
		        },
			reader : {
				type : 'json',
				root : 'datas',
				successProperty : 'success'
			},
				writer: {
 		            type: 'singlepost',
 		            writeAllFields: false,
 		            root: 'datas'
 		        } 
		}
	});
	console_log('defined...');
	UsrAst.load('', {
		success : function(usrAst) {

			console_log(usrAst);
			console_log('succeed!!!');
			 var unique_id = usrAst.get('unique_id');
			 var tel_no = usrAst.get('tel_no');
			 var fax_no = usrAst.get('fax_no');		 
			 var user_name = usrAst.get('user_name');
			 var email = usrAst.get('email');		
			 var hp_no = usrAst.get('hp_no');			 
			 propertyGrid = Ext.create('Ext.grid.property.Grid', {
				id: 'useredit-property-panel',
				title: getMenuTitle(),
			    collapsible: true,
			    multiSelect: true,
			    stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
			    autoScroll: true,
			    autoHeight: true,
			    height: getCenterPanelHeight(),
			  //paging bar on the bottom
		        propertyNames: {
		         	unique_id: getTextName(gUserFields, 'unique_id'),
		  			dept_code: getTextName(gUserFields, 'dept_code'),
		  			dept_name: getTextName(gUserFields, 'dept_name'),
		  			tel_no: getTextName(gUserFields, 'tel_no'),
		  			fax_no: getTextName(gUserFields, 'fax_no'),
		  			emp_no: getTextName(gUserFields, 'emp_no'),
		  			user_id: getTextName(gUserFields, 'user_id'),
		  			user_name: getTextName(gUserFields, 'user_name'),
		  			position: getTextName(gUserFields, 'position'),
		  			email: getTextName(gUserFields, 'email'),
		  			hp_no: getTextName(gUserFields, 'hp_no'),
		  			user_type: getTextName(gUserFields, 'user_type'),
		  			user_grade: getTextName(gUserFields, 'user_grade')
		         },//propnames
		         source: {
		             "unique_id": unique_id,
		             "tel_no": tel_no,
		             "fax_no": fax_no,
		             "user_name": user_name,
		             "email": email,
		             "hp_no": hp_no
		         }, 
		 	    listeners: { 
			    	beforeedit: function(editor, e, opts){
			    		if( e.record.get( 'name' )=='unique_id') {
			                return false;            
			            }                
			        }
			    },
		         dockedItems: [{
		     		dock: 'top',
		             xtype: 'toolbar',
		     		items: [
		     		        addAction,'->',
		     		        {		        	
		     		        }
		     		        ]
		     	}]
			 });//create
			 console_log('propertyGrid creatred');

			 fLAYOUT_CONTENT(propertyGrid);
			 	console_log('propertyGrid fLAYOUT_CONTENT');
			cenerFinishCallback();
				console_log('propertyGrid cenerFinishCallback');
		}// endofsuccess
	
	});// load
});

function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;

    while (true) {
         now = new Date();
         if (now.getTime() > exitTime)
             return;
    }
}

