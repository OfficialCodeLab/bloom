
import Ember from 'ember';
import Table from 'ember-light-table';
import TableCommon from '../mixins/table-common';
import { task, timeout } from 'ember-concurrency';

export default Ember.Component.extend(TableCommon, {
  model: '',
  currentScrollOffset: 0,
  scrollTo: 0,
  scrollToRow: null,
  enableSync: false,
  isLoading: Ember.computed.or('fetchRecords.isRunning', 'setRows.isRunning').readOnly(),
  queryChanged: Ember.observer('query', function() {
    this.get('filterAndSortModel').perform();
  }),

  // Sort Logic
    sortedModel: Ember.computed.sort('model', 'sortBy').readOnly(),
    sortBy: Ember.computed('dir', 'sort', function() {
      return [`${this.get('sort')}:${this.get('dir')}`];
    }).readOnly(),

    // Filter Input Setup
    selectedFilter: Ember.computed.oneWay('possibleFilters.firstObject'),
    possibleFilters: Ember.computed('table.columns', function() {
      return this.get('table.columns').filterBy('sortable', true);
    }).readOnly(),

   fetchRecords: task(function*() {
    let records = yield this.get('store').query('user', { page: 1, limit: 100 });
    this.get('model').setObjects(records.toArray());
    this.set('meta', records.get('meta'));
    yield this.get('filterAndSortModel').perform();
  }).on('init'),

  setRows: task(function*(rows) {
    this.get('table').setRows([]);
    yield timeout(100); // Allows isLoading state to be shown
    this.get('table').setRows(rows);
  }).restartable(),

  filterAndSortModel: task(function*(debounceMs = 300) {
    yield timeout(debounceMs); // debounce

    let query = this.get('query');
    let oldQ = this.get('oldQ');
    if(query === oldQ){

    } else {
      let model = this.get('sortedModel');
      let valuePath = this.get('selectedFilter.valuePath');
      let result = model;

      if (query !== '' && query !== undefined) {
        result = model.filter((m) => {
          return m.get(valuePath).toLowerCase().includes(query.toLowerCase());
        });
        this.set('oldQ', query);
      }

      yield this.get('setRows').perform(result);
    }
  }).restartable(),


  columns: Ember.computed(function() {
    return [{
      label: 'Name',
      valuePath: 'fullName',
      width: '200px',
      resizable: true,
      minResizeWidth: 100
    }, {
      label: 'Email',
      valuePath: 'email',
      width: '250px',
      resizable: true,
      sortable: true,
      minResizeWidth: 200
    }, {
      label: 'Joined',
      valuePath: 'joinedDate',
      sortable: true,
      width: '200px',
    }, {
      label: 'Accounts',
      valuePath: 'email',
      width: '100px',
      sortable: false,
      cellComponent: 'user-account'
    }, {
      label: 'Delete',
      valuePath: '',
      width: '50px',
      sortable: false,
      cellComponent: 'user-delete'
    }, {
      label: 'Account Type',
      valuePath: 'accType',
      sortable: true,
      width: '150px'
    }];
  }),

  actions: {
    resetSearch: function() {
      this.set('query', undefined);
    },
     onColumnClick(column) {
       if (column.sorted) {
         this.setProperties({
           dir: column.ascending ? 'asc' : 'desc',
           sort: column.get('valuePath')
         });

         this.get('filterAndSortModel').perform(0);
       }
     },

     onSearchChange() {
       this.get('filterAndSortModel').perform();
     }
   }
});
