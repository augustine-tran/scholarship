Ext.ns('vn.demand.scholarship');

vn.demand.scholarship.SponsorForm = Ext.extend(Ext.form.FormPanel, {
    // defaults - can be changed from outside
    border: false,
    frame: true,
    labelWidth: 80,
    url: null,
	plugins: ['msgbus'],
    
    constructor: function(config){
        config = config ||
        {};
        config.listeners = config.listeners ||
        {};
        Ext.applyIf(config.listeners, {
            actioncomplete: function(){
                if (console && console.log) {
                    console.log('actioncomplete:', arguments);
                }
            },
            actionfailed: function(){
                if (console && console.log) {
                    console.log('actionfailed:', arguments);
                }
            }
        });
        vn.demand.scholarship.SponsorForm.superclass.constructor.call(this, config);
    },
    initComponent: function(){
        // hard coded - cannot be changed from outsid
        var config = {
            defaultType: 'textfield',
			defaults: {
                anchor: '-24'
            },
            monitorValid: true,
            autoScroll: true, // ,buttonAlign:'right'
            labelAlign: 'top',
            labelWidth: 120,
            items: [{
				name: 'name',
                fieldLabel: _('Name'),
				allowBlank: false
            }, {
				name: 'title',
                fieldLabel: _('Title')
            }, {
				name: 'phone',
				fieldLabel: _('Phone')
            }, {
				name: 'email',
				fieldLabel: _('Email'),
				vtype: 'email'
            }, {
				name: 'address',
				fieldLabel: _('Address'),
				xtype: 'textarea',
				height: 50
			}],
            buttons: [{
                text: 'Submit',
                formBind: true,
                scope: this,
				plugins: 'defaultButton',
                handler: this.submit
            }, {
                text: 'Reset',
                scope: this,
                handler: this.onResetClick
            }]
        }; // eo config object
        // apply config
        Ext.apply(this, Ext.apply(this.initialConfig, config));
        
        // call parent
        vn.demand.scholarship.SponsorForm.superclass.initComponent.apply(this, arguments);
        
    } // eo function initComponent
    /**
     * Form onRender override
     */
    ,
    onRender: function(){
    
        // call parent
        vn.demand.scholarship.SponsorForm.superclass.onRender.apply(this, arguments);
        
        // set wait message target
        this.getForm().waitMsgTarget = this.getEl();
        
        // loads form after initial layout
        // this.on('afterlayout', this.onLoadClick, this, {single:true});
    
    } // eo function onRender
    /**
     * Submits the form. Called after Submit buttons is clicked
     * @private
     */
    ,
    submit: function(){
        this.getForm().submit({
            url: this.url,
            scope: this,
            success: this.onSuccess,
            failure: this.onFailure,
            params: {
                format: 'json'
            },
            waitMsg: 'Saving...'
        });		
    } // eo function submit
    /**
     * Success handler
     * @param {Ext.form.BasicForm} form
     * @param {Ext.form.Action} action
     * @private
     */
    ,
    onSuccess: function(form, action){
		Ext.ux.Toast.msg('Password change', 'Your password has been changed');
    } // eo function onSuccess
    /**
     * Failure handler
     * @param {Ext.form.BasicForm} form
     * @param {Ext.form.Action} action
     * @private
     */
    ,
    onFailure: function(form, action){
        this.showError(action.result.error || action.response.responseText);
    } // eo function onFailure
    /**
     * Shows Message Box with error
     * @param {String} msg Message to show
     * @param {String} title Optional. Title for message box (defaults to Error)
     * @private
     */
    ,
    showError: function(msg, title){
        title = title || 'Error';
        Ext.Msg.show({
            title: title,
            msg: msg,
            modal: true,
            icon: Ext.Msg.ERROR,
            buttons: Ext.Msg.OK
        });
    } // eo function showError
}) //eo SponsorForm
// register xtype
Ext.reg('SponsorForm', vn.demand.scholarship.SponsorForm);