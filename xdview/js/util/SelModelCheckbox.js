/**
 * Process Name Store
 */

Ext.define('Mplm.util.SelModelCheckbox', {
	extend : 'Ext.selection.CheckboxModel',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	onlyCheckOwner: params.onlyCheckOwner,
        	singleSelect:params.singleSelect
            // some else customization
        });

    },
	onlyCheckOwner: false,
//	checkOnly: true,
//    mode: 'MULTI',
	listeners: {
        selectionchange: function(sm, selections) {	
        	if(vCUR_MENU_CODE != 'DBM1_ELE' && vCUR_MENU_CODE !='VMF8' ){
        		if(grid.down('#removeButton')){
        			grid.down('#removeButton').setDisabled(selections.length == 0);
        		}
        	}
        }
	}
    
	,renderer : function(val, meta, record, rowIndex, colIndex, store,view){
		//console_log('vCUR_USER_UID:' + vCUR_USER_UID);
		//console_log(fPERM_DISABLING());
		if(fPERM_DISABLING()==true) {//수정권한이 없으면. checkBox를 생성않한다.
			return null;
		}
        
        if(this.onlyCheckOwner==false) {
            meta.tdCls = Ext.baseCSSPrefix + 'grid-cell-special';
            return '<div class="' + Ext.baseCSSPrefix + 'grid-row-checker">&#160;</div>';   
        } else if( record.get('creator_uid') == vCUR_USER_UID){
            meta.tdCls = Ext.baseCSSPrefix + 'grid-cell-special';
            return '<div class="' + Ext.baseCSSPrefix + 'grid-row-checker">&#160;</div>';  
        } else {
        	return null;
        }
      
    }
});