'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RelayClientSSR = function () {
  function RelayClientSSR(cache) {
    _classCallCheck(this, RelayClientSSR);

    if (Array.isArray(cache)) {
      this.cache = new Map(cache);
    } else {
      this.cache = null;
    }
  }

  _createClass(RelayClientSSR, [{
    key: 'getMiddleware',
    value: function getMiddleware(args) {
      var _this = this;

      return {
        execute: function execute(operation, variables) {
          var cache = _this.cache;
          if (cache) {
            var cacheKey = (0, _utils.getCacheKey)(operation.name, variables);
            if (cache.has(cacheKey)) {
              var payload = cache.get(cacheKey);
              _this.log('SSR_CACHE_GET', cacheKey, payload);

              var _lookup = args && args.lookup;
              if (!_lookup) {
                cache.delete(cacheKey);
                if (cache.size === 0) {
                  _this.cache = null;
                }
              }

              return payload;
            }
            _this.log('SSR_CACHE_MISS', cacheKey, operation);
          }
          return undefined;
        }
      };
    }
  }, {
    key: 'clear',
    value: function clear() {
      if (this.cache) {
        this.cache.clear();
      }
    }
  }, {
    key: 'log',
    value: function log() {
      if (this.debug) {
        var _console;

        (_console = console).log.apply(_console, arguments);
      }
    }
  }]);

  return RelayClientSSR;
}();

exports.default = RelayClientSSR;