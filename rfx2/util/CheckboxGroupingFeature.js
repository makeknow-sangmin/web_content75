//writer define
Ext.define('Rfx2.util.CheckboxGroupingFeature', {
	extend: 'Ext.grid.feature.Grouping',
    alias: 'feature.checkboxGrouping',

    /** @property */
    targetCls: 'group-checkbox',
    /** @property */
    checkDataIndex: 'rownum',
//    startCollapsed: true,
    
    getDataIndex : function() {
    	
    },

    constructor: function(config) {
      config.groupHeaderTpl = [
    	  
    	  '<input type="checkbox" class="' + this.targetCls + '" {[values.record.get("rownum") ? "checked" : ""]} > {name} ({rows.length} 건) </input>'
    	 // '<input type="checkbox" class="' + this.targetCls + '" {[values && values.record && values.record.get("' + this.checkDataIndex + '") ? "checked" : ""]} id=chk{[values.record.get("id")]} > {name} </input>'                   
                                                
                               ];
      this.callParent(arguments);
    },

    init: function(grid) {
      var store = grid.getStore();
      if (store) {
        store.on('update', this.onStoreUpdate, this);
      }
      this.callParent(arguments);
    },

    setupRowData: function(record, idx, rowValues) {
    	//console_logs('setupRowData record', record);
    	
      this.callParent(arguments);
      // Ext JS 6 vs Ext JS 5.1.1 vs Ext JS 5.1.0-
      var groupInfo = this.groupRenderInfo || this.metaGroupCache || this.groupInfo;
      groupInfo.record = this.getParentRecord(record.get(this.getGroupField()));
    },

    /**
     * This method will only run once... on the initial load of the view... this
     * is so we can check the store for the grouped item's children... if they're
     * all checked, then we need to set the private variable to checked
     */
    checkAllGroups: function(groupName) {
    	
      console_logs('checkAllGroups groupName', groupName);
      var store = this.view.getStore();
      var groupField = this.getGroupField();
      if (store) {
        var groups = store.getGroups();
        if (groups) {
          groups.each(function(groupRec) {
            var allChecked = true;
            var groupKey = groupRec.getGroupKey();
            var checkGroup = true;
            if (groupName) {
              if (groupKey !== groupName) {
                checkGroup = false;
              }
            }
            if (checkGroup) {
              groupRec.each(function(rec) {
                allChecked = rec.get(this.checkDataIndex);
                groupName = rec.get(groupField);
                if (allChecked === false) {
                  return false;
                }
              }, this);
              this.updateParentRecord(groupName, allChecked);
            }
          }, this);
        }
      }
    },

    updateParentRecord: function(groupName, checked) {
    	//console_logs('updateParentRecord groupName', groupName);
      var parentRecord = this.getParentRecord(groupName);
      if (parentRecord) {
        parentRecord.set(this.checkDataIndex, checked);
        this.refreshView();
      }
    },

    getParentRecord: function(groupName) {
    	//console_logs('getParentRecord groupName', groupName);
      var parentRecord;
      var metaGroup;
      // For Ext JS 6 and 5.1.1
      if (this.getMetaGroup) {
          metaGroup = this.getMetaGroup(groupName);
      }
      // For Ext JS 5.1-
      else {
          metaGroup = this.groupCache[groupName];
      }
      if (metaGroup) {
        parentRecord = metaGroup.placeholder;
      }
      return parentRecord;
    },

    /**
     * TODO: This might break... we're using a private variable here... but this
     * is the only way we can refresh the view without breaking any sort of
     * scrolling... I'm not sure how to only refresh the group header itself, so
     * I'm keeping the groupName as a param passing in... might be able to figure
     * this out later
     * @param {String} groupName
     */
    refreshView: function(groupName) {
    	//console_logs('refreshView groupName', groupName);
      var view = this.view;
      if (view) {
        view.refreshView();
      }
    },

    onStoreUpdate: function(store, record, operation, modifiedFieldNames, details, eOpts) {
    	//console_logs('onStoreUpdate record', record);
    	var grid = this.grid;
      if (!this.updatingRecords && grid && record) {
        var groupName = record.get(this.getGroupField());
        this.checkAllGroups(groupName);
        grid.setSelection(record);
        this.refreshView(groupName);
      }
    },
    onGroupClick: function(grid, node, group, event, eOpts) {
    	
    	console_logs('onGroupClick group', group);
      if (event && grid) {
        var target = event.getTarget('.' + this.targetCls);
        var store = grid.getStore();
        var groupRecord = this.getRecordGroup(event.record);
        console_logs('onGroupClick groupRecord', groupRecord);
        console_logs('onGroupClick target', target);
        console_logs('onGroupClick store', store);

        if (target !=null) {
          var checked = target.checked;
          target.checked = checked;
          this.updatingRecords = true;
          
          groupRecord.each(function(rec, index) {
            rec.beginEdit();
            rec.set(this.checkDataIndex, checked);
            rec.endEdit(true);
          }, this);
          this.updatingRecords = false;
          this.updateParentRecord(group, checked);
          
          gm.me().checkCheckbox(groupRecord.items, checked);
        } else {
          this.callParent(arguments);
        }
      }
    }
});