/**
 * Process Name Store
 */

Ext.define('Mplm.util.SelModelCheckboxLock', {
	extend : 'Ext.selection.CheckboxModel',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	onlyCheckOwner: params.onlyCheckOwner
            // some else customization
        });

    },
	onlyCheckOwner: false,
	
	listeners: {
        selectionchange: function(sm, selections) {	
        	if(gridPcsAst.down('#removeButton')){
        		gridPcsAst.down('#removeButton').setDisabled(selections.length == 0);
        	}
        }
	}
    
	,renderer : function(val, meta, record, rowIndex, colIndex, store,view){
		//console_log('vCUR_USER_UID:' + vCUR_USER_UID);
		//console_log(fPERM_DISABLING());
		if(fPERM_DISABLING()==true) {//수정권한이 없으면. checkBox를 생성않한다.
			return null;
		}
        //console_log(this.onlyCheckOwner);
        
        if(this.onlyCheckOwner==false) {
            meta.tdCls = Ext.baseCSSPrefix + 'grid-cell-special';
            return '<div class="' + Ext.baseCSSPrefix + 'grid-row-checker">&#160;</div>';   
        } else if( record.get('lock_flag') == "N"){
            meta.tdCls = Ext.baseCSSPrefix + 'grid-cell-special';
            return '<div class="' + Ext.baseCSSPrefix + 'grid-row-checker">&#160;</div>';  
        } 
        else if( record.get('creator_uid') == vCUR_USER_UID){
            meta.tdCls = Ext.baseCSSPrefix + 'grid-cell-special';
            return '<div class="' + Ext.baseCSSPrefix + 'grid-row-checker">&#160;</div>';  
        }else {
        	return null;
        }
      
    }
});