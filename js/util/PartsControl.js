var gPartList = [];
var gPartFields = [];

var winPartpopup = null;
var partWidth = 240;
var partHeight= 300;

function getPartInfoXpos() {
	return tempX-240+50;
}
function getPartInfoYpos() {
	var panelH = getCenterPanelHeight();
	
	var Ypos = tempY-partWidth/2;
	var gap = Ypos+partHeight - panelH;
	if( gap > 0) {
		Ypos = tempY-partHeight +10;
	}
	
	return Ypos;
}

//User ingo display
function showPartInfoGridPopup(srcAhd) {
	
	//console_log(usrAst);
	if( srcAhd == undefined ||  srcAhd=='undefined' || srcAhd==null) {
		//Ext.MessageBox.alert('Erro','unknown user');
		return;
	}
		
	 //UniqueId
	 var unique_id = srcAhd.get('unique_id'); //id
	 var barcode = srcAhd.get('barcode');
	 var item_code = srcAhd.get('item_code'); //부품코드
	 var item_code_dash = srcAhd.get('item_code_dash');//부품코드
	 var standard_flag = srcAhd.get('standard_flag');//부품코드
	 var description = srcAhd.get('description');//규격
	 var specification = srcAhd.get('specification');//치수
	 var sales_price = srcAhd.get('sales_price');//가격		 		 
	 var creator = srcAhd.get('creator');//등록자
	 var model_no = srcAhd.get('model_no');//
	 var comment = srcAhd.get('comment');		
	 var maker_name = srcAhd.get('maker_name');			 
	 
	 var source = {};
	 source['unique_id'] = unique_id;
	 source['barcode'] = barcode;
	 source['item_code'] = item_code;
	 source['item_code_dash'] = item_code_dash;
	 source['standard_flag'] = standard_flag;
	 source['description'] = description;
	 source['sales_price'] = sales_price;
	 source['specification'] = specification;
	 source['creator'] = creator;
	 source['model_no'] = model_no;
	 source['comment'] = comment;
	 source['maker_name'] = maker_name;

	 
	 
   var propsGrid = Ext.create('Ext.grid.property.Grid', {
       width: partWidth,
       height: partHeight,
       propertyNames: {
       	unique_id: getTextName(gPartFields, 'unique_id'),
       	barcode: getTextName(gPartFields, 'barcode'),
       	item_code: getTextName(gPartFields, 'item_code'),
       	item_code_dash: getTextName(gPartFields, 'item_code_dash'),
       	standard_flag: getTextName(gPartFields, 'standard_flag'),
       	description: getTextName(gPartFields, 'description'),
       	sales_price: getTextName(gPartFields, 'sales_price'),
       	specification: getTextName(gPartFields, 'specification'),
       	creator: getTextName(gPartFields, 'creator'),
       	model_no: getTextName(gPartFields, 'model_no'),
       	comment: getTextName(gPartFields, 'comment'),
       	maker_name: getTextName(gPartFields, 'maker_name')    	
       },
       source: source,
       listeners : {
       	beforeedit : function(e) {
       		return false;
       	}
       }
   });

   if(winPartpopup!=null) {
	   closePartByUserId();
   }
	   //console_log('(' +tempX + ',' +tempY +')' );
		   winPartpopup = new Ext.Window({
			     title: '자재정보',
				 layout: 'fit',
				 closable: false,
				 position: 'absolute',
			     plain: false,
	             x: getPartInfoXpos(),
	             y: getPartInfoYpos() ,
			    items: [
			            propsGrid
			    ],
		   listeners: {
			    mouseleave : {
			      element : 'el',
			      fn : function(){
			    	  closePartByUserId();
			    	 
			        //Expand the north region on mouseover
			        //Ext.getCmp('region-north').expand();
			      }
			    }
			  }
				});

   
   winPartpopup.show();
}

//get UserInfo by unique_id
/*
function popupUser(unique_id) {
	if( unique_id == undefined ||  unique_id=='undefined') {
		Ext.MessageBox.alert('Erro','not defined creator_uid');
	} else {
		CommonSrcAhd.load(unique_id ,{
			 success: function(usrAst) {
				 showPartInfoGridPopup(usrAst);
	 		 }//endofsuccess
		 });//emdofload
	}//endofelse
}
*/

//get UserInfo by user_id
function popupPartByUserId(item_code) {
	for(var i=0;i<3;i++){
	item_code=item_code.replace("-","");
	}
	if( item_code == undefined ||  item_code=='undefined' || item_code == null || item_code =='') {
		closePartByUserId();
		//Ext.MessageBox.alert('Erro','not defined creator');
	} else {
		var part = null;
		
		for(var i=0; i<gPartList.length; i++) {
			var obj = gPartList[i];
			if(obj['item_code'] == item_code) {
				//console_log('found user');
				part = obj['srcAhd'];
				break;
			}
		}
		
		if(part==null) {
			//console_log('call new user');
			comSrcAhd.load(item_code ,{
				 success: function(srcAhd) {
					 gPartList.push({'item_code': item_code, 'srcAhd': srcAhd });
					 showPartInfoGridPopup(srcAhd);
		 		 }//endofsuccess
			 });//emdofload
		} else {
			showPartInfoGridPopup(part);
		}
	}//endofelse
}


function closePartByUserId() {
	if(winPartpopup!=null) {
		winPartpopup.close();
		 winPartpopup=null;
	}
}

Ext.onReady(function() {  
	//user field info load

	
	(new Ext.data.Store({ model: 'ExtFieldColumn'}) ).load({//Field 정보를 먼저로딩
	    params: {
	    	menuCode: 'PMT1'//사용자 정보 필드 정보
	    },
	    callback: function(records, operation, success) {

	        for (var i=0; i<records.length; i++){
	        	
	        	var objfieldColumn = records[i];
	        	var name = objfieldColumn.get('name');
	        	var type =  objfieldColumn.get('type');
	        	var text =  objfieldColumn.get('text');
	        	var fieldObj = {};

	        	fieldObj["name"] = name;
	        	fieldObj["type"] = type;
	        	fieldObj["text"] = text;
	        	//console_log('Field:' + name);
	        	gPartFields.push(fieldObj);
	 
	        }//endoffor
	        
	        Ext.define('comSrcAhd', {
				extend: 'Ext.data.Model',
				fields: gPartFields,
				proxy: {
					type: 'ajax',
					url: CONTEXT_PATH + '/purchase/material.do?method=read',
					reader: {
						type: 'json',
						root: 'datas',
						successProperty: 'success'
					}
		   		}
		   });
	    },
	    scope: this
	});
});

