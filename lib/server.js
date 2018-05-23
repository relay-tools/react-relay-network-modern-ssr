'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // eslint-disable-line


var _util = require('util');

var _RelayResponse = require('react-relay-network-modern/lib/RelayResponse');

var _RelayResponse2 = _interopRequireDefault(_RelayResponse);

var _graphql = require('graphql');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RelayServerSSR = function () {
  function RelayServerSSR() {
    _classCallCheck(this, RelayServerSSR);

    this.cache = new Map();
  }

  _createClass(RelayServerSSR, [{
    key: 'getMiddleware',
    value: function getMiddleware(args) {
      var _this = this;

      return function (next) {
        return function () {
          var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(r) {
            var req, cacheKey, cachedResponse, graphqlArgs, hasSchema, gqlResponse, res;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    req = r;
                    cacheKey = (0, _utils.getCacheKey)(req.operation.name, req.variables);
                    cachedResponse = _this.cache.get(cacheKey);

                    if (!cachedResponse) {
                      _context2.next = 10;
                      break;
                    }

                    _this.log('Get graphql query from cache', cacheKey);
                    _context2.t0 = _RelayResponse2.default;
                    _context2.next = 8;
                    return cachedResponse;

                  case 8:
                    _context2.t1 = _context2.sent;
                    return _context2.abrupt('return', _context2.t0.createFromGraphQL.call(_context2.t0, _context2.t1));

                  case 10:

                    _this.log('Run graphql query', cacheKey);

                    if (!(0, _utils.isFunction)(args)) {
                      _context2.next = 17;
                      break;
                    }

                    _context2.next = 14;
                    return args();

                  case 14:
                    _context2.t2 = _context2.sent;
                    _context2.next = 18;
                    break;

                  case 17:
                    _context2.t2 = args;

                  case 18:
                    graphqlArgs = _context2.t2;
                    hasSchema = graphqlArgs && graphqlArgs.schema;
                    gqlResponse = new Promise(function () {
                      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve, reject) {
                        var payload;
                        return regeneratorRuntime.wrap(function _callee$(_context) {
                          while (1) {
                            switch (_context.prev = _context.next) {
                              case 0:
                                setTimeout(function () {
                                  reject(new Error('RelayRequest timeout'));
                                }, 30000);

                                payload = null;

                                if (!hasSchema) {
                                  _context.next = 8;
                                  break;
                                }

                                _context.next = 5;
                                return (0, _graphql.graphql)(_extends({}, graphqlArgs, {
                                  source: req.getQueryString(),
                                  variableValues: req.getVariables()
                                }));

                              case 5:
                                payload = _context.sent;
                                _context.next = 11;
                                break;

                              case 8:
                                _context.next = 10;
                                return next(r);

                              case 10:
                                payload = _context.sent;

                              case 11:
                                resolve(payload);

                              case 12:
                              case 'end':
                                return _context.stop();
                            }
                          }
                        }, _callee, _this);
                      }));

                      return function (_x2, _x3) {
                        return _ref2.apply(this, arguments);
                      };
                    }());

                    _this.cache.set(cacheKey, gqlResponse);

                    _context2.next = 24;
                    return gqlResponse;

                  case 24:
                    res = _context2.sent;

                    _this.log('Recieved response for', cacheKey, (0, _util.inspect)(res, { colors: true, depth: 4 }));
                    return _context2.abrupt('return', _RelayResponse2.default.createFromGraphQL(res));

                  case 27:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, _callee2, _this);
          }));

          return function (_x) {
            return _ref.apply(this, arguments);
          };
        }();
      };
    }
  }, {
    key: 'getCache',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var arr, keys, i, payload;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                arr = [];
                keys = Array.from(this.cache.keys());
                i = 0;

              case 3:
                if (!(i < keys.length)) {
                  _context3.next = 11;
                  break;
                }

                _context3.next = 6;
                return this.cache.get(keys[i]);

              case 6:
                payload = _context3.sent;

                arr.push([keys[i], payload]);

              case 8:
                i++;
                _context3.next = 3;
                break;

              case 11:
                this.log('Recieved all payloads', arr.length);
                return _context3.abrupt('return', arr);

              case 13:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getCache() {
        return _ref3.apply(this, arguments);
      }

      return getCache;
    }()
  }, {
    key: 'log',
    value: function log() {
      if (this.debug) {
        var _console;

        (_console = console).log.apply(_console, arguments);
      }
    }
  }]);

  return RelayServerSSR;
}();

exports.default = RelayServerSSR;