Ext.ns('vn.demand.scholarship');

vn.demand.scholarship.PaymentGrid_action = new Ext.ux.grid.RowActions({
	fixed: true
	,autoWidth: true
	//,width: 100    
    ,keepSelection: true,
    actions: [
	{
        qtipIndex: _('Edit'),
        iconCls: 'icon-edit-payment'
    }, {
        qtipIndex: _('Delete'),
        iconCls: 'icon-delete'
    }
	],
    callbacks: {
		'icon-edit-payment': function(grid, record, action, row, col){
			new Ext.Window({
                title: 'New sponsor for ' + record.get('name'),
				iconCls: 'icon-new-sponsor',
                modal: true,
                layout: 'fit',
                width: 600,
                height: 450,
                items: {
					kid: record,
					payment: record,
                    xtype: 'SponsorForm'
                }
            }).show();
		}, 
		'icon-delete': function(grid, record, action, row, col){
			Ext.Msg.confirm(_('Delete payment'), "Do you want to delete this payment?", function(btn) {
				var reportId = record.get('report_id'),
					report_name = record.get('report_name')
				if (btn == 'yes') {
					grid.getStore().remove(record)
				}
			});
		}
	}
});

vn.demand.scholarship.PaymentGrid = Ext.extend(Ext.grid.GridPanel, {
	kidId: null,

    // configurables
    border: true // {{{    
    ,
    initComponent: function(){
        // hard coded - cannot be changed from outside
		var store = new PaymentStore(App.data.conn)
        var config = {
            // store
            store: store,
            plugins: ['msgbus', vn.demand.scholarship.PaymentGrid_action],//Ext.ux.PanelCollapsedTitle
            columns: [{
                dataIndex: 'sponsorId',
                header: _('Sponsor'),
				renderer: this.renderSponsor.createDelegate(this)
            }, {
                dataIndex: 'amount',
                header: _('Amount')
            }, {
                dataIndex: 'date_start',
                header: _('Start'),
				renderer: Ext.util.Format.dateRenderer('d/m/Y')
            }, {
                dataIndex: 'date_end',
                header: _('End'),
				renderer: Ext.util.Format.dateRenderer('d/m/Y')
            }, {
                dataIndex: 'date_in',
                header: _('Input'),
				renderer: Ext.util.Format.dateRenderer('d/m/Y')
            }, {
                dataIndex: 'extra_support',
                header: _('Extra support')
            }, {
                dataIndex: 'note',
                header: _('Note')
            }, vn.demand.scholarship.PaymentGrid_action]
            ,
            viewConfig: {
	            forceFit:true,
	            emptyText: 'No Payments to display'
	        }
            ,
            bbar: new Ext.PagingToolbar({ // paging bar on the bottom
                pageSize: 20,
                store: store,
                displayInfo: true,
                displayMsg: 'Displaying payments {0} - {1} of {2}',
                emptyMsg: "No payment to display"
            })// eo tbar,
        }; // eo config object
        // apply config
        Ext.apply(this, Ext.apply(this.initialConfig, config));
        // call parent
        vn.demand.scholarship.PaymentGrid.superclass.initComponent.apply(this, arguments);
        
        
    } // eo function initComponent
    ,renderSponsor: function(val, cell, record) {
		var sponsor = App.data.sponsorStore.getById(val);
		return sponsor ? sponsor.get('name') : val;
	}
    ,
    onRender: function(){
    
        // call parent
        vn.demand.scholarship.PaymentGrid.superclass.onRender.apply(this, arguments);
        if (this.kidId) {
			this.store.setBaseParam('where', "where kidId = '" + this.kidId + "'")
		}
		this.store.load()
		
		this.subscribe('vn.demand.scholarships.payment_select')
		
    } // eo function onRender
    ,
	onMessage: function(message, subject) {
		
	},
	onLoadException: function() {
		Ext.Msg.show({
			title:'Opps something wrong!!!',
		   	msg: 'Have problem to connect with server. May be your session has been timeout or else. Please try logout and re-login.',
			buttons: Ext.Msg.OK, 
		   	fn: function() {
				
			},
		   	animEl: 'elId',
		   	icon: Ext.MessageBox.ERROR
		});
	}
}); // eo extend
// register xtype
Ext.reg('PaymentGrid', vn.demand.scholarship.PaymentGrid);

// eof