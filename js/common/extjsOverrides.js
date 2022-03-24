/**
 * GridView 재정의
 * - sort option이 false인 경우 hdMenu에서 sort 메뉴가 않나오게 한다.
 */
Ext.override(Ext.grid.GridView, {
	//Sorting 메뉴 제거
	handleHdDown : function(e, t){
		if(Ext.fly(t).hasClass('x-grid3-hd-btn')){
			e.stopEvent();
			var hd = this.findHeaderCell(t);
			Ext.fly(hd).addClass('x-grid3-hd-menu-open');
			var index = this.getCellIndex(hd);
			this.hdCtxIndex = index;
			var ms = this.hmenu.items, cm = this.cm;
			ms.get("asc").setVisible(cm.isSortable(index));
			ms.get("desc").setVisible(cm.isSortable(index));
			ms.items[2].setVisible(cm.isSortable(index)); // -- 메뉴제거
			this.hmenu.on("hide", function(){
				Ext.fly(hd).removeClass('x-grid3-hd-menu-open');
			}, this, {single:true});
			this.hmenu.show(t, "tl-bl?");
		}
	}
		
	
});

/**
 * TextField 재정의
 * - convertToUpperCase 대문자 변환  속성 추가 
 */
Ext.override(Ext.form.TextField, {
    // Deafult values:
    convertToUpperCase: false
    ,initComponent: Ext.form.TextField.prototype.initComponent.createSequence(function(){
        if (this.convertToUpperCase) {
            var s = this.style;
            s = (s === null || s === undefined ? '' : s + ' ;');
            this.style = s + "textTransform: uppercase";
            //키 입력후 마지막이 아닌경우 fucus가 이동 되는 현상 수정
            this.validationEvent = 'blur';
        }
        return true;
    })
    ,originalProcessValue: Ext.form.TextField.prototype.processValue
    ,processValue: function(value){
        var v = value;
        if (this.convertToUpperCase) {
            var v = v.toUpperCase();
            this.setRawValue(v);
        }
        return this.originalProcessValue.call(this, v);
    }
});

/**
 * GridPanel 재정의 
 * - 초기값 정의
 */
Ext.override(Ext.grid.GridPanel,{
	columnLines: true,
	enableColumnMove : false
    ,enableColumnHide : false
    ,enableHdMenu : false
});

/**
 * EditorGridPanel 재정의
 * - formField일 경우 method 정의
 */
Ext.override(Ext.grid.EditorGridPanel,{
	columnLines: true,
	getName : function() {return 'grid'},			//for formField
	validate: function() {return true; },			//for formField
	isValid : function() {return true; },			//for formField
	clearInvalid : function() {return true; },		//for formField
	reset : function() {this.store.removeAll();},	//for formField		
	isDirty : function(){							//for formField
		if(this.store.getModifiedRecords().length > 0)
			return true;
		else
			return false;
	}												
});

/**
 * DateField 재정의
 * - clear 기능 추가
 */
Ext.override(Ext.form.DateField, {
	format : 'Y.m.d',
    initComponent : function() {
        Ext.form.DateField.superclass.initComponent.call(this);
        this.triggerConfig = {
            tag : 'span',
            cls : 'x-form-twin-triggers',
            cn : [{
                tag : "img",
                src : Ext.BLANK_IMAGE_URL,
                cls : "x-form-trigger " + this.trigger1Class
            },{
                tag : "img",
                src : Ext.BLANK_IMAGE_URL,
                cls : "x-form-trigger " + this.trigger2Class
            }]
        };

//        this.on('change',function(f,newValue,oldValue){
//        	if(newValue != '')
//        		this.triggers[0].show();
//        },this);
    },
    getTrigger : Ext.form.TwinTriggerField.prototype.getTrigger,
    initTrigger : Ext.form.TwinTriggerField.prototype.initTrigger,
    trigger1Class : Ext.form.DateField.prototype.triggerClass,
    onTrigger1Click : Ext.form.DateField.prototype.onTriggerClick,
	trigger2Class : 'x-form-clear-trigger',
    onTrigger2Click: function() {
  		this.fireEvent("change", this, this.getValue(), '');
  		this.setValue('') ;
//  		this.triggers[0].hide();
	},
    hideTrigger1:false,    
    setValue : function(date){
        Ext.form.DateField.superclass.setValue.call(this, this.formatDate(this.parseDate(date)));
        this.fireEvent("change", this, this.getValue(), '');
    }
});


/**
 * DateField 재정의
 * - clear 기능 추가
 */
Ext.override(Ext.tree.TreeLoader, {
	processResponse : function(response, node, callback, scope){
	    var json = response.responseText;
	    try {
	        var o = response.responseData || Ext.decode(json);
	        if(o.root != null) o = o.root;
	        node.beginUpdate();
	        for(var i = 0, len = o.length; i < len; i++){
	            var n = this.createNode(o[i]);
	            if(n){
	                node.appendChild(n);
	            }
	        }
	        node.endUpdate();
	        this.runCallback(callback, scope || node, [node]);
	    }catch(e){
	        this.handleFailure(response);
	    }
	}
});

/**
 * FormLayout override
 */
Ext.override(Ext.layout.FormLayout, {
	labelSeparator : '',
	padding : '0px',
	margin : '0px',
	frame : true,
	
    /**
     * @private
     * 
     */
    renderItem : function(c, position, target){
        if(c && (c.isFormField || c.fieldLabel) && c.inputType != 'hidden'){
        	if(c.allowBlank==false){
    			c.fieldLabel = "<span style=\"position:relative\"><span class=\"required-flag\" ext:qtip=\"This field is required\">*</span><span style=\"position:absolute\">"+ c.fieldLabel+"</span></span>";
    		}

            var args = this.getTemplateArgs(c);
            if(Ext.isNumber(position)){
                position = target.dom.childNodes[position] || null;
            }
            if(position){
                c.itemCt = this.fieldTpl.insertBefore(position, args, true);
            }else{
                c.itemCt = this.fieldTpl.append(target, args, true);
            }
            if(!c.getItemCt){
                // Non form fields don't have getItemCt, apply it here
                // This will get cleaned up in onRemove
                Ext.apply(c, {
                    getItemCt: function(){
                        return c.itemCt;
                    },
                    customItemCt: true
                });
            }
            c.label = c.getItemCt().child('label.x-form-item-label');
            if(!c.rendered){
                c.render('x-form-el-' + c.id);
            }else if(!this.isValidParent(c, target)){
                Ext.fly('x-form-el-' + c.id).appendChild(c.getPositionEl());
            }
            if(this.trackLabels){
                if(c.hidden){
                    this.onFieldHide(c);
                }
                c.on({
                    scope: this,
                    show: this.onFieldShow,
                    hide: this.onFieldHide
                });
            }
            this.configureItem(c);
        }else {
            Ext.layout.FormLayout.superclass.renderItem.apply(this, arguments);
        }
    },

	/**
     * The {@link Ext.Template Ext.Template} used by Field rendering layout classes (such as
     * {@link Ext.layout.FormLayout}) to create the DOM structure of a fully wrapped,
     * labeled and styled form Field. A default Template is supplied, but this may be
     * overriden to create custom field structures. The template processes values returned from
     * {@link Ext.layout.FormLayout#getTemplateArgs}.
     * @property fieldTpl
     * @type Ext.Template
     */
    fieldTpl: (function() {
        var t = new Ext.Template(
            '<div class="x-form-item form-item {itemCls}" tabIndex="-1">',
                '<label for="{id}" style="{labelStyle}" class="x-form-item-label form-title">{label}{labelSeparator}</label>',
                '<div class="x-form-element form-field" id="x-form-el-{id}" style="{elementStyle}">',
                '</div>',
            '</div>'
        );
        t.disableFormats = true;
        return t.compile();
    })()
});

/**
 * CardLayout override
 */
Ext.override(Ext.layout.CardLayout, {
	/**
	 * 성능향상을 위해 deferredRender를 항상 true 고정
	 * @type Boolean
	 */
	deferredRender : true	
});

/**
 * Window override
 */
Ext.override(Ext.Window, {
	/**
	 * MessageBox 버튼을 일괄적으로 변경하기위해서 cls를 지정함
	 * @type Boolean
	 */
	minButtonWidth : '40', //defaults to 75
	cls : 'fbar_blue_button'	
});