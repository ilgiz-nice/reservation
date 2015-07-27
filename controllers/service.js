import Ember from "ember";

export default Ember.Controller.extend({
	//General setting
	hall_row: [],
	active: 1,
	changed: false,
	films: [],
	timeline: [],
	activeTimeline: 1,

	//Resource
	hallArray: function() {
		var array = this.get('hall_row');
		var response = [];
		array.filter(function (item) {
			response.pushObject(item.hall);
		});
		return response;
	}.property('hall_row.@each'),

	rowArray: function() {
		var active = this.get('active');
		var array = this.get('hall_row');
		var response = [];
		array.filter(function (item) {
			if (item.hall == active) {
				item.items.filter(function (inner) {
					response.pushObject(inner);
				});
			}
		});
		this.set('changed', false);
		return response;
	}.property('hall_row.@each', 'active', 'changed'),

	//Product
	filmArray: function() {
		var array = this.get('films');
		var max = 0;
		array.filter(function (item) {
			if (item.lenght > max) {
				max = item.lenght;
			}
		});
		var ratio = 35 / max;
		var response = [];
		array.filter(function (item) {
			var total = item.lenght * ratio;
			var css = 'width: '+total+'em;';
			response.pushObject({
				'title': item.title,
				'lenght': item.lenght,
				'css': css
			});
		});
		return response;
	}.property('films.@each'),

	//Schedule
	timelineArray: function() {
		var activeTimeline = this.get('activeTimeline');
		var array = this.get('timeline');
		var response = [];
		array.filter(function (item) {
			if (item.hall == activeTimeline && item.items.get('lastObject')) {
				item.filter(function (inner) {
					response.pushObject(inner);
				});
			}
		});
		return response;
	}.property('timeline.@each'),

	filmTimelineArray: function() {
		var array = this.get('films');
		var max = 0;
		array.filter(function (item) {
			if (item.lenght > max) {
				max = item.lenght;
			}
		});
		var ratio = 68 / 720;
		var response = [];
		array.filter(function (item) {
			var total = item.lenght * ratio;
			var css = 'width: '+total+'em;';
			response.pushObject({
				'title': item.title,
				'lenght': item.lenght,
				'css': css
			});
		});
		return response;
	}.property('films.@each'),

	//Actions
	actions: {
		//Tabs
		tab_change: function(tab) {
			Ember.$('.content .tab').hide();
			Ember.$('.content .'+tab).show();
		},

		//Resource
		hall_add: function() {
			var array = this.get('hall_row');
			var object = {};
			var timeline = this.get('timeline');
			if (!array.get('lastObject')) {
				object = {
					'hall': 1,
					'items': [
						{
							'row': 1,
							'seats': ''
						}
					]
				};
				array.pushObject(object);
				this.set('hall_row', array);
				object = {
					'hall': 1,
					'items': []
				};
				timeline.pushObject(object);
				this.set('timeline', timeline);
			}
			else {
				var el = array.get('lastObject');
				var index = el['hall'];
				var next = index + 1;
				object = {
					'hall': next,
					'items': [
						{
							'row': 1,
							'seats': ''
						}
					]
				};
				array.pushObject(object);
				this.set('hall_row', array);
				object = {
					'hall': next,
					'items': []
				};
				timeline.pushObject(object);
				this.set('timeline', timeline);
			}
		},

		hall_delete: function(hall) {
			var array = this.get('hall_row');
			var position;
			array.filter(function (item, index) {
				if (item.hall == hall) {
					position = index;
				}
			});
			array.removeAt(position);
			this.set('hall_row', array);
		},

		hall_active: function(item) {
			this.set('active', item);
		},

		row_add: function() {
			var active = this.get('active');
			var array = this.get('hall_row');
			var object = {};
			var el = {};
			array.filter(function (item) {
				if (item.hall  == active) {
					el = item.items.get('lastObject');
				}
			});
			var position = el.row;
			var next = position + 1;
			object = {
				'row': next,
				'seats': ''
			};
			array.filter(function (item) {
				if (item.hall == active) {
					item.items.pushObject(object);
				}
			});
			this.set('changed', true);
			this.set('hall_row', array);
		},

		//Product
		film_add: function(title, hours, minutes) {
			var array = this.get('films');
			var lenght = hours * 60 + minutes * 1;
			var object = {
				'title': title,
				'lenght': lenght
			};
			array.pushObject(object);
			this.set('films', array);
		}
	}
});