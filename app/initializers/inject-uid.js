export function initialize(container, application) {
  application.inject('controller', 'currentUser', 'service:uid');
    application.inject('route', 'currentUser', 'service:uid');
  // application.inject('route', 'foo', 'service:foo');
}

export default {
  name: 'inject-uid',
  initialize: initialize
};
