Ext.ns('vn.demand.scholarship');

vn.demand.scholarship.KidGrid_action = new Ext.ux.grid.RowActions({
	fixed: true
	,autoWidth: true
	//,width: 100    
    ,keepSelection: true,
    actions: [
	{
        qtipIndex: 'Edit',
        iconCls: 'icon-edit-report'
    }, {
        qtipIndex: 'Delete',
        iconCls: 'icon-delete-report'
    }
	],
    callbacks: {
		'icon-edit-report': function(grid, record, action, row, col){
			// TODO: use Ext.Action to prevent duplicate these code and JobOrderTab.js 
			new Ext.Window({
                title: 'Edit report',
				iconCls: 'icon-edit-report',
                modal: true,
                layout: 'fit',
                width: 600,
                height: 450,
                items: {
					reportTypeId: record.get('report_type_id'),
					reportId: record.get('report_id'),
                    xtype: 'edit_report_form'
                }
            }).show();
		}, 
		'icon-delete-report': function(grid, record, action, row, col){
			// TODO: use Ext.Action to prevent duplicate these code and JobOrderTab.js 
			Ext.Msg.confirm('Delete report', "Do you want to delete this report ['"+record.get('report_name')+"']?", function(btn) {
				var reportId = record.get('report_id'),
					report_name = record.get('report_name')
				if (btn == 'yes') {
					Ext.Ajax.request({
						scope: this,
	                    url: App.data.report_delete,
	                    params: {
	                        report_id: reportId
	                    }
						,
	                    success: function(res){
	                        var result = Ext.util.JSON.decode(res.responseText)
							App.publish('vn.demand.scholarships.delete_report', {success: result.success, report_id: reportId})
							
	                        new Ext.ux.window.MessageWindow({
	                            title: 'Report has been deleted',
								help: false,
	                            autoDestroy: true,//default = true
	                            autoHeight: true,
	                            autoHide: true,//default = true
	                            bodyStyle: 'text-align:center; ',
								padding: 10,
	                            closable: true,
	                            html: 'Report [' + reportName + '] has been deleted',
	                            iconCls: result.success ? 'icon-ok' : 'icon-error',
	                            width: 250 //optional (can also set minWidth which = 200 by default)
	                        }).show(Ext.getDoc());
	                    },
	                    failure: function(){
	                        new Ext.ux.window.MessageWindow({
	                            title: 'Report deleting failed',
								help: false,
	                            autoDestroy: true,//default = true
	                            autoHeight: true,
	                            autoHide: true,//default = true
	                            bodyStyle: 'text-align:center; ',
								padding: 10,
	                            closable: true,
	                            html: 'Report [' + reportName + '] deleting failed',
	                            iconCls: 'icon-error',
	                            width: 250 //optional (can also set minWidth which = 200 by default)
	                        }).show(Ext.getDoc());
	                        
	                    }
	                });
	//							this.get(0).getForm().loadRecord(this.reportInfo)
	//							this.get(1).doRestore();
				}
			}, grid)
		}
	}
});

vn.demand.scholarship.KidGrid = Ext.extend(Ext.grid.GridPanel, {

    // configurables
    border: true // {{{    
    ,
    initComponent: function(){
        // hard coded - cannot be changed from outside
        var config = {
            // store
            store: App.data.kidStore,
            plugins: ['msgbus'],//Ext.ux.PanelCollapsedTitle
            columns: [{
                dataIndex: 'code',
                header: _('Code')
            }, {
                dataIndex: 'name',
                header: _('Name')
            }]
            ,
            viewConfig: {
                forceFit: true
            } // tooltip template
            ,
            bbar: new Ext.PagingToolbar({ // paging bar on the bottom
                pageSize: 20,
                store: App.data.kidStore,
                displayInfo: true,
                displayMsg: 'Displaying reports {0} - {1} of {2}',
                emptyMsg: "No report to display"
            })// eo tbar,
        }; // eo config object
        // apply config
        Ext.apply(this, Ext.apply(this.initialConfig, config));
        console.log('go =============================== go')
        // call parent
        vn.demand.scholarship.KidGrid.superclass.initComponent.apply(this, arguments);
        
        
    } // eo function initComponent
    ,
    onRender: function(){
    
        // call parent
        vn.demand.scholarship.KidGrid.superclass.onRender.apply(this, arguments);
        
		this.subscribe('vn.demand.scholarships.run_report.result')
		this.subscribe('vn.demand.scholarships.store.load_exception')
		this.subscribe('vn.demand.scholarship.report_edit_done')
		this.subscribe('vn.demand.scholarships.delete_report')
		this.subscribe('vn.demand.scholarships.report_select')
		
    } // eo function onRender
    ,
	onMessage: function(message, subject) {
		if (message == 'vn.demand.scholarships.run_report.result') {
			if (subject.success) {
				var results = this.getStore().query('report_id', parseInt(subject.report_id));
				if (results.getCount()) {
					results.get(0).set('report_status', 1);
					this.getStore().commitChanges();
				}
			}
		}
		else 
			if (message == 'vn.demand.scholarships.store.load_exception') {
				this.onLoadException();
			}
			else 
				if (message == 'vn.demand.scholarship.report_edit_done') {
					var report = subject.report
					
					var tab = Ext.getCmp('tabReport_' + report.report_id);
					if (tab) {
						tab.setTitle(report.report_name)
					}
					
					//					var record = this.getStore().getById(report.report_id)
					//					record.set('report_name', report.report_name)
					//					record.commit();
					this.getStore().load()
				}
				else 
					if (message == 'vn.demand.scholarships.delete_report' && subject.success) {
						var tab = Ext.getCmp('tabReport_' + subject.report_id);
						var mainArea = Ext.getCmp('mainArea');
						if (tab) {
							mainArea.remove(tab.getId())
						}
						this.getStore().load()
					} else if (message == 'vn.demand.scholarships.report_select') {
						var index = this.getStore().indexOf(subject);
						if (index > -1) {
							this.fireEvent('rowclick', this, index);
						}
					}
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
Ext.reg('KidGrid', vn.demand.scholarship.KidGrid);

// eof