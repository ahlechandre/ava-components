/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// Libraries.
	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(4);
	// Components.
	__webpack_require__(5);
	__webpack_require__(7);
	__webpack_require__(8);
	__webpack_require__(9);
	__webpack_require__(10);
	__webpack_require__(11);
	__webpack_require__(12);
	__webpack_require__(13);
	__webpack_require__(14);
	__webpack_require__(15);
	__webpack_require__(16);
	__webpack_require__(17);
	__webpack_require__(18);
	__webpack_require__(19);
	__webpack_require__(20);
	__webpack_require__(21);
	__webpack_require__(22);
	__webpack_require__(23);


/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Componentize.js - A handler for register and upgrade components dynamically.
	 * The design pattern is inspired (in parts) by the Google (MDL) componentHandler.
	 * 
	 * @author Alexandre Thebaldi <ahlechandre@gmail.com>
	 * @version v0.1.0
	 */

	// Module interface.
	var Componentize = {
	  /**
	   * The data config to register a component.
	   * 
	   * @typedef {{
	   *  constructor: function,
	   *  name: string | undefined,
	   *  cssClass: string,
	   * }}
	   */
	  ComponentConfig: {},

	  /**
	   * Registers a specific component for future use.
	   * 
	   * @param {Componentize.ComponentConfig}
	   */
	  register: function (config) { },

	  /**
	   * Upgrade a specific instance of a registered component.
	   * 
	   * @param {HTMLElement}
	   */
	  upgradeElement: function (element) { },

	  /**
	   * Upgrade a given component and make it created.
	   * 
	   * @param {Componentize.ComponentConfig.cssClass}
	   */
	  upgrade: function (cssClass) { },

	  /**
	   * Upgrade all registered components and makes them created.
	   * 
	   */
	  upgradeAll: function () { },

	  /**
	   * Apply the downgrade process on specific instance of a created component.
	   * 
	   * @param {HTMLElement}
	   */
	  downgradeElement: function (element) { },

	  /**
	   * Apply the downgrade process on a given created component.
	   * 
	   * @param {Componentize.ComponentConfig.cssClass}
	   */
	  downgrade: function (cssClass) { },

	  /**
	   * Apply the downgrade process on all created components.
	   * 
	   */
	  downgradeAll: function () { },

	  /**
	   * Returns all registered components.
	   * 
	   * @return {array<Componentize.ComponentConfig> | array}
	   */
	  getAllRegistered: function () { },

	  /**
	   * Returns all created components.
	   * 
	   * @return {array<object> | array}
	   */
	  getAllCreated: function () { },
	};

	Componentize = (function () {

	  /**
	   * Stories the css classes used by this module. 
	   * 
	   */
	  var _cssClasses = {};

	  /**
	   * Stories the constant strings used by this module. 
	   * 
	   */
	  var _constants = {
	    MESSAGE_ERROR_CONFIG: 'Please, provide a valid data config for component.',
	    INSTANCE_CONFIG_PROP: '_ComponentConfig',
	    DATASET_UPGRADED: 'upgraded-components',
	  };

	  /**
	   * Stories all registered (data config) components. 
	   * 
	   * @type {array<Componentize.ComponentConfig>}
	   */
	  var _registeredComponents = [];

	  /**
	   * Stories all instances of created components. 
	   * 
	   * @type {array<object>}
	   */
	  var _createdComponents = [];

	  /**
	   * Upgrade internally a given registered component.
	   * 
	   * @param {Componentize.ComponentConfig}
	   */
	  var _upgradeInternal = function (registered) {
	    var elements = document.querySelectorAll('.' + registered.cssClass);
	    var i;

	    for (i = 0; i < elements.length; i++) {
	      _upgradeElementInternal(elements[i], registered);
	    }
	  };

	  /**
	   * Upgrade internally a specific element of a registered component.
	   * 
	   * @param {HTMLElement} element
	   * @param {Componentize.ComponentConfig} componentConfig
	   */
	  var _upgradeElementInternal = function (element, componentConfig) {
	    var instance /** @type {object} */;
	    var componentList = [];

	    if (!element.classList.contains(componentConfig.cssClass)) {
	      console.warn('The element does not contain the defined class "' + componentConfig.cssClass + '"');
	      return;
	    }

	    // Check if the element is already upgraded.
	    if (_isUpgradedElement(element, componentConfig.name)) return;

	    componentList = _getComponentList(element);
	    componentList.push(componentConfig.name);
	    instance = new componentConfig.constructor(element);
	    // Injecting the element inside the instance by default.
	    instance['element'] = element;
	    // Stories the data config in component instance.
	    instance[_constants.INSTANCE_CONFIG_PROP] = componentConfig;
	    // Stories the component instance in element. 
	    element[componentConfig.name] = instance;
	    // Stories the all components from element in a dataset attribute.
	    element.setAttribute('data-' + _constants.DATASET_UPGRADED, componentList.join(','));
	    _createdComponents.push(instance);
	  };

	  /**
	   * Converts object elements to array.
	   * 
	   * @param {object} list
	   * @return {array}
	   */
	  var _getArray = function (list) {
	    var i;
	    var length = list.length;
	    var arr = [];

	    for (i = 0; i < list.length; i++) {
	      arr[i] = list[i];
	    }

	    return arr;
	  };

	  /**
	   * Returns the component list of a given element.
	   * 
	   * @param {HTMLElement} element 
	   * @return {array}
	   */
	  var _getComponentList = function (element) {
	    var componentList = [];
	    var cssClasses = _getArray(element.classList);
	    var component;
	    var i;

	    cssClasses.forEach(function (cssClass) {

	      for (i = 0; i < _createdComponents.length; i++) {
	        component = _createdComponents[i];

	        if (componentList.indexOf(component[_constants.INSTANCE_CONFIG_PROP].name) === -1 &&
	          (component.element === element))
	          componentList.push(component[_constants.INSTANCE_CONFIG_PROP].name);
	      }
	    });

	    return componentList;
	  };

	  /**
	   * Verifies if a given element is already upgraded for component.
	   *
	   * @param {HTMLElement} element 
	   * @param {Componentize.ComponentConfig.name} componentName 
	   * @return {boolean}
	   */
	  var _isUpgradedElement = function (element, componentName) {
	    var upgradeds = element.getAttribute('data-' + _constants.DATASET_UPGRADED);

	    // The dataset attribute was not defined.
	    if (!upgradeds) return false;

	    return (upgradeds.indexOf(componentName) !== -1);
	  };

	  /**
	   * Returns the registered component referred to css class.
	   * 
	   * @param {Componentize.ComponentConfig.cssClass} cssClass
	   * @return {Componentize.ComponentConfig | null}
	   */
	  var _getRegisteredByClass = function (cssClass) {
	    var registered = null;
	    var i;

	    for (i = 0; i < _registeredComponents.length; i++) {

	      if (_registeredComponents[i].cssClass === cssClass) {
	        registered = _registeredComponents[i];
	        break;
	      }
	    }
	    return registered;
	  };

	  /**
	   * Downgrade a given component from element.
	   * 
	   * @param {HTMLElement} element
	   * @param {Componentize.ComponentConfig.name} componentName
	   */
	  var _downgradeElementInternal = function (element, componentName) {
	    var componentsAsString = element.getAttribute('data-' + _constants.DATASET_UPGRADED);
	    var componentList = componentsAsString.split(',');
	    var componentIndex = componentList.indexOf(componentName);
	    var createdComponent /** @type {object} */;
	    var i;

	    if (componentIndex === -1) return;

	    // Removes the component to downgrade from list.
	    componentList.splice(componentIndex, 1);
	    // Updates dataset attribute.
	    element.setAttribute('data-' + _constants.DATASET_UPGRADED, componentList.join(','));

	    for (i = 0; i < _createdComponents.length; i++) {
	      createdComponent = _createdComponents[i];

	      if ((createdComponent.element === element) &&
	        createdComponent[_constants.INSTANCE_CONFIG_PROP].name === componentName) {
	        // Removes the instance from created list.
	        _createdComponents.splice(i, 1);
	        break;
	      }
	    }
	    // Deletes the instance from element.
	    delete element[componentName];
	  };

	  /**
	   * Registers a specific component for future use.
	   * 
	   * @param {Componentize.ComponentConfig} 
	   */
	  var _register = function (config) {
	    /** @type {Componentize.ComponentConfig} */
	    var configInternal = {};

	    // Basics validate of data for register component.
	    if (typeof config === 'undefined' ||
	      typeof config !== 'object' ||
	      typeof config['constructor'] !== 'function' ||
	      ((typeof config['name'] !== 'string' ||
	        !config['name'].length)) ||
	      (typeof config['cssClass'] !== 'string' ||
	        !config['cssClass'].length)) {
	      throw new Error(_constants.MESSAGE_ERROR_CONFIG);
	    }
	    configInternal['constructor'] = config['constructor'];
	    configInternal['name'] = config['name'];
	    configInternal['cssClass'] = config['cssClass'];

	    // Verifies if the css class is already registered by another component.
	    _registeredComponents.forEach(function (registered) {

	      if (registered['cssClass'] === configInternal['cssClass']) {
	        throw new Error('The css class "' + configInternal['cssClass'] + '" is already registered.');
	      }
	    });
	    // Store new config into registered components array.
	    _registeredComponents.push(configInternal);
	  };

	  /**
	   * Upgrade a specific instance of a registered component.
	   * 
	   * @param {HTMLElement}
	   * @param {string | undefined}
	   */
	  var _upgradeElement = function (element, optionalCssClass) {
	    var cssClasses = [];
	    var registeredComponent /** @type {Componentize.ComponentConfig | null} */;
	    var isHTMLElement = element instanceof HTMLElement;

	    if (!isHTMLElement) return;

	    cssClasses = _getArray(element.classList);

	    if (typeof optionalCssClass === 'string' && optionalCssClass.length) {
	      registeredComponent = _getRegisteredByClass(optionalCssClass);

	      if (registeredComponent) {
	        _upgradeElementInternal(element, registeredComponent);
	      }
	    } else {

	      cssClasses.forEach(function (cssClass) {
	        registeredComponent = _getRegisteredByClass(cssClass);

	        if (registeredComponent) {
	          _upgradeElementInternal(element, registeredComponent);
	        }
	      });
	    }
	  };

	  /**
	   * Upgrade a given component and make it created.
	   * 
	   * @param {Componentize.ComponentConfig.cssClass}
	   */
	  var _upgrade = function (cssClass) {

	    _registeredComponents.forEach(function (registered) {

	      if (registered['cssClass'] === cssClass) {
	        _upgradeInternal(registered);
	      }
	    });
	  };

	  /**
	   * Upgrade all registered components and makes them created.
	   * 
	   */
	  var _upgradeAll = function () {

	    _registeredComponents.forEach(function (registered) {
	      _upgradeInternal(registered);
	    });
	  };

	  /**
	   * Apply the downgrade process on specific instance of a created component.
	   * 
	   * @param {HTMLElement} element
	   * @param {string} optionalCssClass
	   */
	  var _downgradeElement = function (element, optionalCssClass) {
	    var componentsAsString = element.getAttribute('data-' + _constants.DATASET_UPGRADED);
	    var components = [];
	    var isHTMLElement = element instanceof HTMLElement;
	    var i;

	    if (!isHTMLElement) return;

	    if (typeof optionalCssClass === 'string' && optionalCssClass.length) {

	      for (i = 0; i < _registeredComponents.length; i++) {

	        if (_registeredComponents[i].cssClass === optionalCssClass) {
	          _downgradeElementInternal(element, _registeredComponents[i].name);
	          break;
	        }
	      }
	    } else {

	      if ((typeof componentsAsString !== 'string') || (componentsAsString.split(',') < 2)) return;

	      components = componentsAsString.split(',');

	      components.forEach(function (componentName) {
	        _downgradeElementInternal(element, componentName);
	      });
	    }
	  };

	  /**
	   * Apply the downgrade process on a given created component.
	   * 
	   * @param {Componentize.ComponentConfig.cssClass}
	   */
	  var _downgrade = function (cssClass) {
	    var componentName /** @type {string} */;
	    var elements /** @type {NodeList} */;
	    var elementsSelector /** @type {string} */;
	    var i;
	    var j;

	    if (typeof cssClass !== 'string' || !cssClass.length) return;

	    for (i = 0; i < _registeredComponents.length; i++) {

	      if (_registeredComponents[i].cssClass === cssClass) {
	        componentName = _registeredComponents[i].name;
	        break;
	      }
	    }
	    elementsSelector = '[data-' + _constants.DATASET_UPGRADED + '*=' + componentName + ']';
	    elements = document.querySelectorAll(elementsSelector);

	    for (j = 0; j < elements.length; j++) {
	      _downgradeElementInternal(elements[j], componentName);
	    }
	  };

	  /**
	   * Apply the downgrade process on all created components.
	   * 
	   */
	  var _downgradeAll = function () {
	    var componentName /** @type {string} */;
	    var createdComponent /** @type {object} */;
	    var createdComponentTotal = _createdComponents.length;
	    var i;

	    for (i = 0; i < createdComponentTotal; i++) {
	      // The components are being removed dynamically.
	      // The current created component to downgrade always 
	      // will be placed at the first position of list.
	      createdComponent = _createdComponents[0];
	      componentName = createdComponent[_constants.INSTANCE_CONFIG_PROP].name;
	      _downgradeElementInternal(createdComponent.element, componentName);
	    }
	  };

	  /**
	   * Returns all registered components.
	   * 
	   * @return {array<Componentize.ComponentConfig> | array}
	   */
	  var _getAllRegistered = function () {
	    return _registeredComponents;
	  };


	  /**
	   * Returns all created components.
	   * 
	   * @return {array<object> | array}
	   */
	  var _getAllCreated = function () {
	    return _createdComponents;
	  };

	  return {
	    register: _register,
	    upgradeElement: _upgradeElement,
	    upgrade: _upgrade,
	    upgradeAll: _upgradeAll,
	    downgradeElement: _downgradeElement,
	    downgrade: _downgrade,
	    downgradeAll: _downgradeAll,
	    getAllRegistered: _getAllRegistered,
	    getAllCreated: _getAllCreated,
	  };
	})();

	// Componentize is available globally.
	window['Componentize'] = Componentize;

	window.addEventListener('load', function () {
	  // Initializes all components.
	  Componentize.upgradeAll();
	});

/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * PluginHandler - A basic handler for register and upgrade javascript plugins.
	 * 
	 * @author Alexandre Thebaldi <ahlechandre@gmail.com>
	 */

	// Module interface.
	var pluginHandler = {

	  /**
	   * The plugin config data.
	   * 
	   * @type {{
	   *  plugin: string,
	   *  callback: function,
	   *  upgradeable: boolean|null 
	   * }} 
	   */
	  PluginConfig: {},

	  /**
	   * The plugin internal config data.
	   * 
	   * @type {{
	   *  plugin: string,
	   *  callback: function,
	   *  upgradeable: boolean|null, 
	   *  isUpgraded: boolean, 
	   * }} 
	   */
	  PluginConfigInternal: {},

	  /** 
	   * Registers an specific plugin.
	   * 
	   * @param {pluginHandler.PluginConfig} 
	   */
	  register: function (config) { },

	  /**
	   * Upgrade an specific registered plugin. 
	   * 
	   * @param {pluginHandler.PluginConfig.plugin}
	   */
	  upgrade: function (plugin) { },

	  /**
	   * Upgrade all registered plugins that is upgradeable or 
	   * all registered plugins that is not upgradeable and is not upgraded yet.
	   * 
	   */
	  upgradeAll: function () { },

	  /**
	   * Upgrade all registereds plugins.
	   * 
	   */
	  upgradeAllForce: function () { },

	  /**
	   * Removes an specific registered and/or upgraded plugin. 
	   * 
	   * @param {pluginHandler.PluginConfig.plugin}
	   */
	  destroy: function (plugin) { },

	  /**
	   * Removes all registered and upgraded plugins. 
	   * 
	   */
	  destroyAll: function () { },

	  /**
	   * Gets all registereds plugins.
	   * 
	   * @return {array<pluginHandler.PluginConfigInternal>}
	   */
	  getAllRegistered: function () { },

	  /**
	   * Gets all registereds and upgraded plugins.
	   * 
	   * @return {array<pluginHandler.PluginConfig>}
	   */
	  getAllUpgraded: function () { },

	  /**
	   * Checks if a given plugin is registered.
	   * 
	   * @return {boolean}
	   */
	  isRegistered: function (pluginName) { },

	  /**
	   * Checks if a given plugin is upgraded.
	   * 
	   * @return {boolean}
	   */
	  isUpgraded: function (pluginName) { },
	};

	pluginHandler = (function () {
	  'use strict';

	  /**
	   * All registereds plugins config.
	   * 
	   * @type {pluginHandler.PluginConfigInternal}
	   */
	  var _registeredPlugins = [];

	  /**
	   * All registereds and upgraded plugins config.
	   * 
	   * @type {pluginHandler.PluginConfigInternal}
	   */
	  var _upgradedPlugins = [];

	  /** 
	   * Registers an specific plugin.
	   * 
	   * @param {pluginHandler.PluginConfig} 
	   */
	  var _register = function (config) {
	    /** @type {pluginHandler.PluginConfigInternal} */
	    var newConfig = {};

	    if ((typeof (config) === 'undefined') || (typeof (config) !== 'object')) {
	      console.error('Please, register a valid plugin.');
	      return;
	    } else if (typeof (config['plugin']) !== 'string') {
	      console.error('Please, register a valid plugin name.');
	      return;
	    } else if (typeof (config['callback']) !== 'function') {
	      console.error('Please, register a valid function as plugin callback.');
	      return;
	    }

	    newConfig['plugin'] = config['plugin'];
	    newConfig['callback'] = config['callback'];
	    newConfig['upgradeable'] = ((typeof (config['upgradeable']) === 'undefined') || (config['upgradeable'] == true) ? true : false);
	    newConfig['isUpgraded'] = false;

	    // Check if the plugin is already registered.
	    for (var i = 0; i < _registeredPlugins.length; i++) {

	      if (_registeredPlugins[i].plugin === newConfig['plugin'])
	        throw new Error('The ' + newConfig['plugin'] + ' plugin is already registered.');
	    };

	    _registeredPlugins.push(newConfig);
	  };

	  /**
	   * Upgrade internally the given plugin.
	   * 
	   * @param {pluginHandler.PluginConfig}
	   */
	  var _upgradeInternal = function (config) {
	    /** @type {pluginHandler.PluginConfig} */
	    var configUpgraded = {};
	    // Initializes the plugin.
	    config.callback();
	    config.isUpgraded = true;

	    for (var i = 0; i < _upgradedPlugins.length; i++) {

	      if (_upgradedPlugins[i].plugin === config['plugin'])
	        return;
	    }

	    configUpgraded['plugin'] = config['plugin'];
	    configUpgraded['callback'] = config['callback'];
	    configUpgraded['upgradeable'] = config['upgradeable'];
	    _upgradedPlugins.push(configUpgraded);
	  };

	  /**
	   * Upgrade an specific registered plugin. 
	   * 
	   * @param {pluginHandler.PluginConfig.plugin}
	   */
	  var _upgrade = function (plugin) {

	    for (var i = 0; i < _registeredPlugins.length; i++) {

	      // Found the plugin to upgrade.
	      if (_registeredPlugins[i].plugin === plugin) {
	        _upgradeInternal(_registeredPlugins[i]);
	        break;
	      }
	    }
	  };

	  /**
	   * Upgrade all registered plugins that is upgradeable or 
	   * all registered plugins that is not upgradeable and is not upgraded yet.
	   * 
	   */
	  var _upgradeAll = function () {

	    for (var i = 0; i < _registeredPlugins.length; i++) {

	      if (_registeredPlugins[i].upgradeable || (!_registeredPlugins[i].upgradeable && !_registeredPlugins[i].isUpgraded)) {
	        _upgradeInternal(_registeredPlugins[i]);
	      }
	    }
	  };

	  /**
	   * Upgrade all registereds plugins.
	   * 
	   */
	  var _upgradeAllForce = function () {

	    for (var i = 0; i < _registeredPlugins.length; i++) {
	      _upgradeInternal(_registeredPlugins[i]);
	    }
	  };

	  /**
	   * Removes internally an specific registered and/or upgraded plugin. 
	   * 
	   * @param {number}
	   */
	  var _destroyInternal = function (registeredIndex) {
	    var pluginName = _registeredPlugins[registeredIndex].plugin;
	    
	    if (_registeredPlugins[registeredIndex].isUpgraded) {
	      
	      for (var i = 0; i < _upgradedPlugins.length; i++) {
	        
	        if (_upgradedPlugins[i].plugin === pluginName) {
	          // Removes from upgraded array.
	          _upgradedPlugins.splice(i, 1);
	          break;
	        }
	      }
	    }
	    // Removes from registereds array.
	    _registeredPlugins.splice(registeredIndex, 1);    
	  };

	  /**
	   * Removes an specific registered and/or upgraded plugin. 
	   * 
	   * @param {pluginHandler.PluginConfig.plugin}
	   */
	  var _destroy = function (pluginName) {
	    
	    for (var i = 0; i < _registeredPlugins.length; i++) {
	      
	      if (_registeredPlugins[i].plugin === pluginName) {
	        _destroyInternal(i);
	        break;
	      }
	    }
	  };

	  /**
	   * Removes all registered and upgraded plugins. 
	   * 
	   */
	  var _destroyAll = function () {
	    var registeredLength = _registeredPlugins.length;
	        
	    for (var i = 0; i < registeredLength; i++) {      
	      _destroyInternal(0);
	    }
	  };


	  /**
	   * Gets all registereds plugins.
	   * 
	   * @return {array<pluginHandler.PluginConfigInternal>}
	   */
	  var _getAllRegistered = function () {
	    return _registeredPlugins;
	  };

	  /**
	   * Gets all registereds and upgraded plugins.
	   * 
	   * @return {array<pluginHandler.PluginConfig>}
	   */
	  var _getAllUpgraded = function () {
	    return _upgradedPlugins;
	  };

	  /**
	   * Checks if a given plugin is registered.
	   * 
	   * @return {boolean}
	   */
	  var _isRegistered = function (pluginName) {
	    var isRegistered = false;

	    for (var i = 0; i < _registeredPlugins.length; i++) {

	      if (_registeredPlugins[i].plugin === pluginName) {
	        isRegistered = true;
	        break;
	      }
	    }
	    return isRegistered;
	  };

	  /**
	   * Checks if a given plugin is upgraded.
	   * 
	   * @return {boolean}
	   */
	  var _isUpgraded = function (pluginName) {
	    var isUpgraded = false;

	    for (var i = 0; i < _upgradedPlugins.length; i++) {

	      if (_upgradedPlugins[i].plugin === pluginName) {
	        isUpgraded = true;
	        break;
	      }
	    }
	    return isUpgraded;
	  };

	  return {
	    register: _register,
	    upgrade: _upgrade,
	    upgradeAll: _upgradeAll,
	    upgradeAllForce: _upgradeAllForce,
	    getAllRegistered: _getAllRegistered,
	    getAllUpgraded: _getAllUpgraded,
	    isRegistered: _isRegistered,
	    isUpgraded: _isUpgraded,
	    destroy: _destroy,
	    destroyAll: _destroyAll,
	  };
	})();

	window['pluginHandler'] = pluginHandler;

	// Initializes the all plugins on page load.
	window.addEventListener('load', function () {
	  pluginHandler.upgradeAll();
	});



/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Chart Handler - A module that handles the registration of multiple google charts 
	 * to render automatically on document load and also handle upgrades to be rendered 
	 * after initial page load. 
	 * 
	 * @author Alexandre Thebaldi <ahlechandre@gmail.com>
	 * @link <http://github.com/ahlechandre/chart-handler>
	 */
	var chartHandler = {
	  /**
	   * Registers the charts for future use. Can be called for register multiple
	   * charts or only one. This method append items in a registereds array.
	   * 
	   * @param {chartHandler.ChartConfig|Array<chartHandler.chartConfig>} The config data of charts
	   * to be registereds.
	   */
	  register: function (ChartConfig) { },

	  /**
	   * Renders the chart of a given container selector. The chart must be registered.
	   * 
	   * @param {chartHandler.ChartConfig.containerSelector} 
	   */
	  render: function (containerSelector) { },

	  /**
	   * Renders all registered charts.
	   * 
	   */
	  renderAll: function () { },

	  /**
	   * Renders all registered charts that is not rendered yet.
	   * 
	   */
	  renderAllDiff: function () { },

	  /**
	   * Draw again all rendered charts with their data and options updates.
	   * 
	   */
	  upgradeAll: function () { },

	  /**
	   * Returns the array with all registereds charts.
	   * 
	   * @return {array}
	   */
	  getRegistereds: function () { },


	  /**
	   * Returns the array with all rendereds charts.
	   * 
	   * @return {array}
	   */
	  getRendereds: function () { },

	  /**
	   * Initializes the basics of module.
	   * 
	   */
	  init: function () { },
	};

	chartHandler = (function () {
	  'use strict';

	  /**
	   * Stories the packages that must be loaded.
	   * 
	   */
	  var _defaultPackages = ['line', 'bar', 'corechart'];

	  /**
	   * Stories the strings used by the module.
	   * 
	   */
	  var _constants = {
	    GOOGLE_CHARTS_JS_FILE: '//www.gstatic.com/charts/loader.js',
	    DATASET_CHART_UPGRADED_CAMEL: 'chartUpgraded',
	    DATASET_CHART_UPGRADED: 'chart-upgraded',
	    CHART_CONTAINER_COMPONENT: 'Chart',
	    OPTIONS_HEIGHT: 400,
	  };

	  /** @type {Array<chartHandler.ChartConfig>} */
	  var _registeredCharts = [];


	  /** @type {Array<chartHandler.Chart>} */
	  var _renderedCharts = [];

	  /**
	   * Queries for a registered chart by your container selector and return it.
	   * 
	   * @param {chartHandler.ChartConfig.containerSelector}
	   * @return {chartHandler.ChartConfig.containerSelector|null} 
	   */
	  var _findRegisteredChart = function (containerSelector) {
	    var registered /** @type {string} */;

	    if (!containerSelector) throw new Error('Container selector was not defined.');

	    for (registered in _registeredCharts) {

	      if (_registeredCharts[registered]['containerSelector'] === containerSelector) return _registeredCharts[registered];
	    }
	    return null;
	  };

	  /**
	   * Searches for a already registered chart by your container.
	   * 
	   * @param {chartHandler.ChartConfig}
	   * @return {boolean}
	   */
	  var _existsRegisteredChart = function (ChartConfig) {
	    var registered /** @type {string} */;

	    if (!ChartConfig['containerSelector']) throw new Error('Container selector was not indentified for a chart of type: ' + ChartConfig['type']);

	    for (registered in _registeredCharts) {

	      if (_registeredCharts[registered]['containerSelector'] === ChartConfig['containerSelector']) return true;
	    }
	    return false;
	  };

	  /**
	   * Append the passed chart data to registered array.
	   * 
	   * @param {chartHandler.ChartConfig} Data to push in _registeredCharts.
	   * @return {boolean} True if sucessfully registered.
	   */
	  var _registerInternal = function (ChartConfig) {
	    // The item to append at registereds.
	    var config = {};

	    if (!ChartConfig) return false;

	    if (_existsRegisteredChart(ChartConfig)) throw new Error('Container selector already exists for: ' + ChartConfig['containerSelector']);

	    config['type'] = ChartConfig['type'];
	    config['containerSelector'] = ChartConfig['containerSelector'];
	    config['options'] = ChartConfig['options'];
	    config['dataTable'] = ChartConfig['dataTable'];

	    // Append the config.
	    _registeredCharts.push(config);
	    return true;
	  }

	  /**
	   * Registers the charts for future use. Can be called for register multiple
	   * charts or only one. This method append items in a registereds array.
	   * 
	   * @param {chartHandler.ChartConfig|Array<chartHandler.chartConfig>} The config data of charts
	   * to be registereds.
	   */
	  var _register = function (ChartConfig) {
	    var config;

	    if (ChartConfig instanceof Array) {
	      // Register multiple charts.

	      for (config in ChartConfig) {
	        _registerInternal(ChartConfig[config]);
	      }
	    } else if (ChartConfig instanceof Object) {
	      // Register only one chart.
	      _registerInternal(ChartConfig);
	    } else {
	      throw new Error('The data chart is not valid.');
	    }
	  };

	  /**
	   * Returns the google visualization object for type.
	   * 
	   * @param {object|array} The data of chart.
	   * @param {boolean} Defines the type of data table.
	   * @return {object|null}
	   */
	  var _getDataTable = function (dataTable, isArrayToDataTable) {
	    var data = {};
	    var column /** @type {string} */;

	    if (isArrayToDataTable) {
	      data = google.visualization.arrayToDataTable(dataTable);
	      return data;
	    }
	    // Must to specifies the data type and label of each column.
	    data = new google.visualization.DataTable();

	    for (column in dataTable.columns) {
	      // Passing the column type and title.
	      data.addColumn(dataTable.columns[column], column)
	    }
	    data.addRows(dataTable.rows);
	    return data;
	  }

	  /**
	   * Returns the essentials of a chart item.
	   * 
	   * @param {chartHandler.ChartConfig}
	   * @return {chartHandler.Chart}
	   */
	  var _getChart = function (ChartConfig) {
	    var chart = {};
	    var isArrayToDataTable /** @type {boolean} */;
	    chart = ChartConfig;
	    chart['container'] = document.querySelector(ChartConfig['containerSelector']) || null;

	    // chartHandler must not works without container element.
	    if (!chart['container']) throw new Error('The container element was not found for selector: ' + ChartConfig['containerSelector']);

	    // chartHandler must not works without data table.
	    if (!chart['dataTable']) throw new Error('The data table for chart "' + chart['containerSelector'] + '" was not defined.');

	    isArrayToDataTable = (chart['dataTable'] instanceof Array);
	    chart['data'] = _getDataTable(chart['dataTable'], isArrayToDataTable);

	    return chart;
	  };

	  /**
	   * Returns the essentials of a chart item.
	   * 
	   * @param {chartHandler.Chart}
	   * @return {chartHandler.Chart.googleChart}
	   */
	  var _getGoogleChart = function (Chart) {
	    var googleChart = {};

	    switch (Chart.type.toLowerCase()) {
	      case 'bar':
	        googleChart = new google.charts.Bar(Chart.container);
	        break;
	      case 'line':
	        googleChart = new google.charts.Line(Chart.container);
	        break;
	      case 'pie':
	        googleChart = new google.visualization.PieChart(Chart.container);
	        break;
	    }
	    return googleChart;
	  };

	  /**
	   * Append the chart in rendereds array and indicates the chart 
	   * container as upgraded.
	   * 
	   * @param {chartHandler.Chart}
	   */
	  var _upgradeChart = function (Chart) {
	    var rendered /** @type {string} */;
	    var isRendered = false;

	    for (rendered in _renderedCharts) {
	      // Chart already is upgraded.
	      if (_renderedCharts[rendered]['containerSelector'] === Chart['containerSelector']) return;
	    }
	    // Append the chart in rendereds array. 
	    _renderedCharts.push(Chart);
	    // Put the chart in container element. 
	    Chart.container[_constants.CHART_CONTAINER_COMPONENT] = Chart;
	    // Dataset flag to identifies if is already upgraded. 
	    Chart.container.dataset[_constants.DATASET_CHART_UPGRADED_CAMEL] = Chart['type'];
	  };

	  /**
	   * Returns the default width used to render the charts.
	   * 
	   * @param {chartHandler.Chart.container} The element used to get offset width.
	   * @return {number}
	   */
	  var _getOptionsWidth = function (container) {

	    if (!container) throw new Error('Container of chart was not found.');

	    return container.offsetWidth;
	  };


	  /**
	   * Returns the default height used to render the charts.
	   * 
	   * @return {number}
	   */
	  var _getOptionsHeight = function () {
	    return _constants.OPTIONS_HEIGHT;
	  };

	  /**
	   * Defines the default options for chart. 
	   * 
	   * @param {chartHandler.Chart}
	   * @return {chartHandler.Chart.options}
	   */
	  var _setDefaultOptions = function (chart) {

	    // Options must be a object. 
	    if (!(chart['options'] instanceof Object))
	      chart['options'] = {};

	    // Gets the width of chart if it is not defined. 
	    if (typeof (chart['options']['width']) === 'undefined')
	      chart['options']['width'] = _getOptionsWidth(chart['container']);

	    if (typeof (chart['options']['height']) === 'undefined')
	      chart['options']['height'] = _getOptionsHeight();
	  };

	  /**
	   * Draw the defined chart in your container element.
	   * 
	   * @param {chartHandler.Chart}
	   */
	  var _draw = function (Chart) {
	    _setDefaultOptions(Chart);
	    Chart['googleChart'].draw(Chart['data'], Chart['options']);
	    // Indicates the chart container as upgraded. 
	    _upgradeChart(Chart);
	  }


	  /**
	   * Renders the a chart item. 
	   * 
	   * @param {chartHandler.ChartConfig.containerSelector} 
	   */
	  var _renderInternal = function (containerSelector) {
	    var registeredChart = /** @type {chartHandler.ChartConfig|null} */ _findRegisteredChart(containerSelector);
	    var chart /** @type {chartHandler.Chart} */;

	    if (!registeredChart) throw new Error('Chart to render was not found.');

	    chart = _getChart(registeredChart);
	    chart['googleChart'] = _getGoogleChart(chart);

	    if (!chart['googleChart']) throw new Error('The type "' + chart['type'] + '" is not valid in chartHandler');

	    // Now draw the chart.
	    _draw(chart);
	  };

	  /**
	   * Verifies if the Google visualization is available. Renders the chart of 
	   * a given container selector. The chart must be registered.
	   * 
	   * @param {chartHandler.ChartConfig.containerSelector} 
	   */
	  var _render = function (containerSelector) {
	  
	    if (typeof google === 'undefined') return;
	        
	    if (typeof (google.visualization) === 'undefined') {
	      // Google charts library was not loaded yet.
	      google.charts.setOnLoadCallback((function () {
	        return function () {
	          _renderInternal(containerSelector);
	        };
	      })());
	      return;
	    }
	    _renderInternal(containerSelector);
	  };

	  /**
	   * Renders all registered charts. Only internal calls.
	   * 
	   */
	  var _renderAllInternal = function () {
	    var registered /** @type {string} */;

	    for (registered in _registeredCharts) {
	      // Renders the given item.
	      _renderInternal(_registeredCharts[registered]['containerSelector']);
	    }
	  }

	  /** 
	   * Renders all registered charts that is not rendered. Only internal calls.
	   * 
	   */
	  var _renderAllDiffInternal = function () {
	    var registered /** @type {string} */;
	    var rendered /** @type {string} */;
	    var isRendered /** @type {boolean} */;
	    // Defines if the container element is present in DOM.
	    var containerExists /** @type {boolean} */;

	    for (registered in _registeredCharts) {
	      // Initializes the flag as false.
	      isRendered = false;

	      // Searches for registered in rendereds.
	      for (rendered in _renderedCharts) {

	        if (_registeredCharts[registered]['containerSelector'] === _renderedCharts[rendered]['containerSelector']) isRendered = true;
	      }

	      // Only renders the chart if it is not rendered.
	      if (!isRendered) {
	        containerExists = (document.querySelector(_registeredCharts[registered]['containerSelector']) ? true : false);

	        // Only renders the chart if the container is present in the DOM.
	        if (containerExists) {
	          // Renders the given item.
	          _renderInternal(_registeredCharts[registered]['containerSelector']);
	        }
	      }
	    }
	  }

	  /**
	   * Upgrade all rendereds charts.
	   * 
	   */
	  var _upgradeAll = function () {
	    var renderedElements = document.querySelectorAll('[data-' + _constants.DATASET_CHART_UPGRADED + ']');

	    for (var i = 0; i < renderedElements.length; i++) {
	      _draw(renderedElements[i][_constants.CHART_CONTAINER_COMPONENT]);
	    }
	  };

	  /**
	   * Verifies if the Google visualization is available. Renders all registered charts.
	   * 
	   */
	  var _renderAll = function () {

	    if (typeof google === 'undefined') return;

	    if (typeof (google.visualization) === 'undefined') {
	      // Google charts library was not loaded yet.
	      google.charts.setOnLoadCallback((function () {
	        return function () {
	          _renderAllInternal();
	        };
	      })());
	      return;
	    }
	    _renderAllInternal();
	  };

	  /**
	   * Verifies if the Google visualization is available. Renders all registered charts that
	   * is not rendered yet.
	   * 
	   */
	  var _renderAllDiff = function () {

	    if (typeof (google.visualization) === 'undefined') {
	      // Google charts library was not loaded yet.
	      google.charts.setOnLoadCallback((function () {
	        return function () {
	          _renderAllDiffInternal();
	        };
	      })());
	      return;
	    }
	    _renderAllDiffInternal();
	  };

	  /**
	   * Load the google charts packages supported by the module.
	   * 
	   */
	  var _loadPackages = function () {

	    // Check if google charts library is available.
	    if (typeof (google) === 'undefined' || typeof (google.charts) === 'undefined') throw new Error('Please, load the Google Chart library.');

	    google.charts.load('43', {
	      packages: _defaultPackages
	    });
	  };

	  /**
	   * Creates the script element and loads dinamically the google charts library. 
	   * After append the script element in document head, tries to load the packages.
	   * 
	   */
	  var _forceLoadPackages = function () {
	    var scriptElement = document.createElement('script');
	    scriptElement.setAttribute('type', 'text/javascript');
	    scriptElement.setAttribute('src', _constants.GOOGLE_CHARTS_JS_FILE);
	    document.head.appendChild(scriptElement);

	    // Waits 1 second and try to load packages.
	    setTimeout(function () {
	      _loadPackages();
	      console.warn('chartHandler was forced to load Google charts library. We recommend that you must define manually this. Please, visit the Google charts website and see how include their script in your page.');
	    }, 1000)
	  };

	  /**
	   * Returns the array with all registereds charts.
	   * 
	   * @return {array}
	   */
	  var _getRegistereds = function () {
	    return _registeredCharts;
	  };


	  /**
	   * Returns the array with all rendereds charts.
	   * 
	   * @return {array}
	   */
	  var _getRendereds = function () {
	    return _renderedCharts;
	  };

	  /**
	   * Initializes the basics of module.
	   * 
	   */
	  var _init = function () {

	    if (typeof (google) === 'undefined' || typeof (google.charts) === 'undefined') return;

	    _loadPackages();
	  };

	  // Now return the functions that should be made public.
	  return {
	    register: _register,
	    render: _render,
	    renderAll: _renderAll,
	    renderAllDiff: _renderAllDiff,
	    upgradeAll: _upgradeAll,
	    getRegistereds: _getRegistereds,
	    getRendereds: _getRendereds,
	    init: _init,
	    forceLoadPackages: _forceLoadPackages,
	  };
	})();

	/**
	 * The config data of a chart to be registered.
	 * 
	 * @typedef {{
	 *   type: string,
	 *   containerSelector: string,
	 *   options: object,
	 *   dataTable: object|array,
	 * }}
	 */
	chartHandler.ChartConfig;

	/**
	 * The internal config data of a registered chart.
	 * 
	 * @typedef {{
	 *   type: string,
	 *   containerSelector: string,
	 *   container: HTMLElement,
	 *   options: object,
	 *   visualization: object,
	 *   googleChart: object,
	 *   dataTable: object|array,
	 * }}
	 */
	chartHandler.Chart;

	window['chartHandler'] = chartHandler;

	window.addEventListener('load', function () {
	  chartHandler.init();
	});

/***/ },
/* 4 */
/***/ function(module, exports) {

	(function () {

	  /**
	   * A module that send dinamically ajax requests for tabs. 
	   * 
	   */
	  var tabAjax = {
	    /**
	     * Initializes the module. 
	     * 
	     * @param {object} options - The ajax options for each tab.
	     * @return
	     */
	    init: function (options) { }
	  };


	  tabAjax = (function () {

	    /**
	     * Defines an item of options passed for module instance.
	     *
	     * @type {object}
	     * @typedef 
	     *  tabHref => {
	     *    url: string
	     *  }
	     */
	    var _option = {};

	    /**
	     * Defines the options passed for module instance.
	     *
	     * @type array<_option>
	     */
	    var _options = [];

	    /**
	     * Defines the config of a tab options.
	     *
	     * @typedef 
	     *  optionsConfig => {
	     *    url: string,
	     *  }  
	     */
	    var optionsConfig = {};

	    /**
	     * Defines the config of a tab item.
	     *
	     * @typedef 
	     *  tabConfig => {
	     *    trigger: HTMLElement,
	     *    panel: HTMLElement,
	     *    options: optionsConfig,
	     *    isLoaded: boolean,
	     *    name: string
	     *  }  
	     */
	    var _tabConfig = {};

	    /**
	     * Stories the config of all tabs in instance.
	     * 
	     * @typedef array<tabConfig>
	     */
	    var _tabs = [];

	    /**
	     * Process and returns the tabs.
	     * 
	     * @return array
	     */
	    var _getTabs = function () {
	      var tabs = [];
	      var config = _tabConfig;

	      for (option in _options) {
	        config = {};
	        config['name'] = option;
	        config['trigger'] = document.querySelector('[href="#' + option + '"]');
	        config['panel'] = document.querySelector('#' + option);
	        config['options'] = _options[option];
	        config['isLoaded'] = false;
	        tabs.push(config);
	      }
	      return tabs;
	    };

	    /**
	     * Handle the ajax response with success. 
	     * 
	     * @param {} response
	     * @return
	     */
	    var _processResponseSuccess = function (tab, response) {

	      if (!tab.panel) return;

	      tab.panel.innerHTML = response;

	      if (typeof (Componentize) !== 'undefined') {
	        // Upgrades all registered/available javascript plugins on page.
	        Componentize.upgradeAll();
	      } else {
	        console.warn('Please, load componentize.js to upgrade the components.');
	      }

	      if (tab.options.hasChart) {

	        if (typeof (chartHandler) === 'undefined') {
	          console.warn('Please, load chartHandler.js to render the charts.');
	          return;
	        }
	        chartHandler.renderAllDiff();
	      }
	    };

	    /**
	     * Sends a ajax request for server. 
	     * 
	     * @param {object} options
	     */
	    var _sendAjaxRequest = function (options) {
	      $.ajax(options);
	    };

	    /**
	     * Returns the ajax options for tab. 
	     * 
	     * @param {_tabConfig} tab
	     * @return {object|null}
	     */
	    var _getAjaxOptions = function (tab) {

	      // Abort ajax requests without url.
	      if (!tab.options || !tab.options.url) return null;

	      var url = tab.options.url;
	      var onSuccess = function (response) {
	        // Changes the flag if the content is successfully loaded.
	        tab.isLoaded = true;
	        _processResponseSuccess(tab, response);
	      };
	      var onError = function (jqXHR, textStatus, errorThrown) { };
	      var onComplete = function () { };

	      return {
	        method: 'GET',
	        url: url,
	        success: onSuccess.bind(this),
	        error: onError.bind(this),
	        complete: onComplete.bind(this),
	      };
	    };

	    /**
	     * Handle the tab on click. 
	     * 
	     * @param {_tabConfig} tab
	     * @return 
	     */
	    var _tabOnClick = function (tab) {
	      var ajaxOptions = {};

	      // Check if the tab already has your content loaded.
	      if (tab.isLoaded) return;

	      ajaxOptions = _getAjaxOptions(tab);

	      if (ajaxOptions) _sendAjaxRequest(ajaxOptions);

	    };


	    /**
	     * Defines the events for each tab.
	     *  
	     * @return 
	     */
	    var _setEvents = function () {
	      var trigger /** @type {HTMLElement|null} */;

	      for (tab in _tabs) {
	        trigger = _tabs[tab].trigger ? _tabs[tab].trigger : null;

	        if (!trigger) continue;

	        trigger.addEventListener('click', (function (tabItem) {

	          return function () {
	            _tabOnClick(tabItem);
	          };
	        })(_tabs[tab]));

	        // Simulates the click on tab that is active.
	        if (_tabs[tab].options && _tabs[tab].options.isActive) trigger.click();
	      }
	    };

	    /**
	     * Initializes the module. 
	     * 
	     * @param {object} options - The ajax options for each tab.
	     * @return
	     */
	    var init = function (options) {

	      if (!options) return;

	      _options = options;
	      _tabs = _getTabs();
	      _setEvents();
	    };

	    return {
	      init: init
	    };
	  })();

	  // Defines the tab ajax module in global scope.
	  window['tabAjax'] = tabAjax;
	})();


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * datefield.js - a component to handle date inputs. 
	 * 
	 * @author Alexandre Thebaldi <ahlechandre@gmail.com>
	 * @requires componentize
	 */
	(function () {
	  'use strict';
	  // Dependency.
	  __webpack_require__(6);
	  /**
	   * 
	   * @class
	   */
	  function AvaDatefield(element) {
	    this.element = element;

	    // Initializes the instance.
	    this.init();
	  };

	  /**
	   * Stories the datasets used by this component.
	   * 
	   */
	  AvaDatefield.prototype._datasets = {
	    FORMAT: 'format',
	  };
	    
	  /**
	   * Stories the css classes used by this component.
	   * 
	   */
	  AvaDatefield.prototype._cssClasses = {
	    INPUT: 'ava-datefield__input',
	    LABEL: 'ava-datefield__label',
	    LABEL_ACTIVE_MATERIALIZE: 'active',
	    INPUT_MATERIAL: 'ava-datefield--material',
	  };

	  /**
	   * Stories the constant strings used by this component.
	   * 
	   */
	  AvaDatefield.prototype._constants = {};

	  /**
	   * Stories the input element used by this component.
	   * 
	   */
	  AvaDatefield.prototype._input = {};

	  /**
	   * Stories the label element used by this component.
	   * 
	   */
	  AvaDatefield.prototype._label = {};

	  /**
	   * Stories the options of material datefield.
	   * 
	   * @type {object}
	   */
	  AvaDatefield.prototype.options = {
	    selectMonths: true,
	    selectYears: 15,
	    format: 'dd-mm-yyyy'
	  };

	  /**
	   * Returns the input element.
	   * 
	   * @return {HTMLElement | null} 
	   */
	  AvaDatefield.prototype._getInput = function () {
	    return this.element.querySelector('.' + this._cssClasses.INPUT);
	  };

	  /**
	   * Returns the label element.
	   * 
	   * @return {HTMLElement | null} 
	   */
	  AvaDatefield.prototype._getLabel = function () {
	    return this.element.querySelector('.' + this._cssClasses.LABEL);
	  };

	  /**
	   * Check if label is active.
	   * 
	   * @return {boolean}
	   */
	  AvaDatefield.prototype._isActiveLabel = function () {
	    return this._label.classList.contains(this._cssClasses.LABEL_ACTIVE_MATERIALIZE);
	  };

	  /**
	   * Defines label as active.
	   * 
	   */
	  AvaDatefield.prototype._setActiveLabel = function () {
	    return this._label.classList.add(this._cssClasses.LABEL_ACTIVE_MATERIALIZE);
	  };

	  /**
	   * Defines label as active.
	   * 
	   */
	  AvaDatefield.prototype._unsetActiveLabel = function () {
	    return this._label.classList.remove(this._cssClasses.LABEL_ACTIVE_MATERIALIZE);
	  };

	  /**
	   * Defines the format of input field.
	   */
	  AvaDatefield.prototype._getInputFormat = function () { 
	    var format;
	    var _input = this._getInput();

	    if (_input && _input.dataset[this._datasets.FORMAT]) {
	      format = _input.dataset[this._datasets.FORMAT];
	    } else {
	      format = this.options.format;
	    }
	    return format;
	  };
	  
	  /**
	   * Initializes the datefield.
	   * 
	   */
	  AvaDatefield.prototype.create = function () {

	    if (!this._isActiveLabel()) this._setActiveLabel();

	    if (this._isMaterialInput()) {
	      this._setMaterialInput();
	    } else {

	      if (typeof Inputmask !== 'undefined') {
	        // Putting date mask.
	        Inputmask(this._getInputFormat()).mask(this._getInput());
	      }
	    }
	  };

	  /**
	   * Destroy the datefield.
	   * 
	   */
	  AvaDatefield.prototype.destroy = function () {
	    this._unsetActiveLabel();
	  };

	  /**
	   * Update the datefield.
	   * 
	   */
	  AvaDatefield.prototype.update = function () {
	    this.destroy();
	    this.create();
	  };

	  /**
	   * Clear the datefield.
	   * 
	   */
	  AvaDatefield.prototype.clear = function () {
	    this._input.value = '';
	  };

	  /**
	   * Check if the datefield is material.
	   * 
	   * @return {boolean}
	   */
	  AvaDatefield.prototype._isMaterialInput = function () {
	    return this.element.classList.contains(this._cssClasses.INPUT_MATERIAL);
	  };

	  /**
	   * Defines the datefield as material.
	   * 
	   */
	  AvaDatefield.prototype._setMaterialInput = function () {
	    // jQuery way.
	    var jQueryInput = $(this._input);
	    jQueryInput.pickadate(this.options);
	  };

	  /**
	   * Defines the value of datefield.
	   * 
	   * @param {string} value
	   */
	  AvaDatefield.prototype.setValue = function (value) {
	    /** @type {DateConstructor} */
	    var dateObj;
	    var picker;
	    var dateArr = [];
	    var valueSplit = [];

	    if (this._isMaterialInput()) {
	      valueSplit = value.split('-');

	      if (!valueSplit[0].length ||
	        (!valueSplit[1] || !valueSplit[1].length) ||
	        (!valueSplit[2] || !valueSplit[2].length)) {
	        console.warn('Please, defines the date value in yyyy-mm-dd format');
	        return;
	      }
	      valueSplit.forEach(function (item) {
	        // Creating date integer array.
	        dateArr.push(parseInt(item));
	      });
	      // DateConstructor defines the month starting by index 0.
	      dateObj = new Date(dateArr[0], (dateArr[1] - 1), dateArr[2]);
	      picker = $(this._input).pickadate ? $(this._input).pickadate('picker') : false;
	      
	      if (!picker || !dateObj) return;
	      
	      picker.set('select', dateObj);
	    } else {
	      this._input.value = value;
	    }
	    this.update();
	  };

	  /**
	   * Initializes the instance.
	   * 
	   */
	  AvaDatefield.prototype.init = function () {

	    if (!this.element) return;
	    
	    if (typeof $ === 'undefined' || typeof jQuery === 'undefined') {
	      console.warn('Please, load jQuery. Datefield Component has jQuery as dependency.');
	      return;
	    }

	    this._input = this._getInput();
	    this._label = this._getLabel();

	    if (!this._input) return;

	    // Initial initialization.
	    this.create();
	  };

	  // Registers the component. "Componentize" object must be available globally.
	  Componentize.register({
	    name: 'AvaDatefield',
	    constructor: AvaDatefield,
	    cssClass: 'ava-datefield',
	  });
	})();

/***/ },
/* 6 */
/***/ function(module, exports) {

	/*!
	* jquery.inputmask.bundle.js
	* https://github.com/RobinHerbots/jquery.inputmask
	* Copyright (c) 2010 - 2016 Robin Herbots
	* Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
	* Version: 3.3.4
	*/
	!function($) {
	    function Inputmask(alias, options) {
	        return this instanceof Inputmask ? ($.isPlainObject(alias) ? options = alias : (options = options || {}, 
	        options.alias = alias), this.el = void 0, this.opts = $.extend(!0, {}, this.defaults, options), 
	        this.maskset = void 0, this.noMasksCache = options && void 0 !== options.definitions, 
	        this.userOptions = options || {}, this.events = {}, this.dataAttribute = "data-inputmask", 
	        this.isRTL = this.opts.numericInput, void resolveAlias(this.opts.alias, options, this.opts)) : new Inputmask(alias, options);
	    }
	    function resolveAlias(aliasStr, options, opts) {
	        var aliasDefinition = opts.aliases[aliasStr];
	        return aliasDefinition ? (aliasDefinition.alias && resolveAlias(aliasDefinition.alias, void 0, opts), 
	        $.extend(!0, opts, aliasDefinition), $.extend(!0, opts, options), !0) : (null === opts.mask && (opts.mask = aliasStr), 
	        !1);
	    }
	    function generateMaskSet(opts, nocache) {
	        function generateMask(mask, metadata, opts) {
	            if (null !== mask && "" !== mask) {
	                if (1 === mask.length && opts.greedy === !1 && 0 !== opts.repeat && (opts.placeholder = ""), 
	                opts.repeat > 0 || "*" === opts.repeat || "+" === opts.repeat) {
	                    var repeatStart = "*" === opts.repeat ? 0 : "+" === opts.repeat ? 1 : opts.repeat;
	                    mask = opts.groupmarker.start + mask + opts.groupmarker.end + opts.quantifiermarker.start + repeatStart + "," + opts.repeat + opts.quantifiermarker.end;
	                }
	                var masksetDefinition;
	                return void 0 === Inputmask.prototype.masksCache[mask] || nocache === !0 ? (masksetDefinition = {
	                    mask: mask,
	                    maskToken: Inputmask.prototype.analyseMask(mask, opts),
	                    validPositions: {},
	                    _buffer: void 0,
	                    buffer: void 0,
	                    tests: {},
	                    metadata: metadata,
	                    maskLength: void 0
	                }, nocache !== !0 && (Inputmask.prototype.masksCache[opts.numericInput ? mask.split("").reverse().join("") : mask] = masksetDefinition, 
	                masksetDefinition = $.extend(!0, {}, Inputmask.prototype.masksCache[opts.numericInput ? mask.split("").reverse().join("") : mask]))) : masksetDefinition = $.extend(!0, {}, Inputmask.prototype.masksCache[opts.numericInput ? mask.split("").reverse().join("") : mask]), 
	                masksetDefinition;
	            }
	        }
	        var ms;
	        if ($.isFunction(opts.mask) && (opts.mask = opts.mask(opts)), $.isArray(opts.mask)) {
	            if (opts.mask.length > 1) {
	                opts.keepStatic = null === opts.keepStatic || opts.keepStatic;
	                var altMask = opts.groupmarker.start;
	                return $.each(opts.numericInput ? opts.mask.reverse() : opts.mask, function(ndx, msk) {
	                    altMask.length > 1 && (altMask += opts.groupmarker.end + opts.alternatormarker + opts.groupmarker.start), 
	                    altMask += void 0 === msk.mask || $.isFunction(msk.mask) ? msk : msk.mask;
	                }), altMask += opts.groupmarker.end, generateMask(altMask, opts.mask, opts);
	            }
	            opts.mask = opts.mask.pop();
	        }
	        return opts.mask && (ms = void 0 === opts.mask.mask || $.isFunction(opts.mask.mask) ? generateMask(opts.mask, opts.mask, opts) : generateMask(opts.mask.mask, opts.mask, opts)), 
	        ms;
	    }
	    function maskScope(actionObj, maskset, opts) {
	        function getMaskTemplate(baseOnInput, minimalPos, includeMode) {
	            minimalPos = minimalPos || 0;
	            var ndxIntlzr, test, testPos, maskTemplate = [], pos = 0, lvp = getLastValidPosition();
	            maxLength = void 0 !== el ? el.maxLength : void 0, maxLength === -1 && (maxLength = void 0);
	            do baseOnInput === !0 && getMaskSet().validPositions[pos] ? (testPos = getMaskSet().validPositions[pos], 
	            test = testPos.match, ndxIntlzr = testPos.locator.slice(), maskTemplate.push(includeMode === !0 ? testPos.input : includeMode === !1 ? test.nativeDef : getPlaceholder(pos, test))) : (testPos = getTestTemplate(pos, ndxIntlzr, pos - 1), 
	            test = testPos.match, ndxIntlzr = testPos.locator.slice(), (opts.jitMasking === !1 || pos < lvp || "number" == typeof opts.jitMasking && isFinite(opts.jitMasking) && opts.jitMasking > pos) && maskTemplate.push(includeMode === !1 ? test.nativeDef : getPlaceholder(pos, test))), 
	            pos++; while ((void 0 === maxLength || pos < maxLength) && (null !== test.fn || "" !== test.def) || minimalPos > pos);
	            return "" === maskTemplate[maskTemplate.length - 1] && maskTemplate.pop(), getMaskSet().maskLength = pos + 1, 
	            maskTemplate;
	        }
	        function getMaskSet() {
	            return maskset;
	        }
	        function resetMaskSet(soft) {
	            var maskset = getMaskSet();
	            maskset.buffer = void 0, soft !== !0 && (maskset._buffer = void 0, maskset.validPositions = {}, 
	            maskset.p = 0);
	        }
	        function getLastValidPosition(closestTo, strict, validPositions) {
	            var before = -1, after = -1, valids = validPositions || getMaskSet().validPositions;
	            void 0 === closestTo && (closestTo = -1);
	            for (var posNdx in valids) {
	                var psNdx = parseInt(posNdx);
	                valids[psNdx] && (strict || null !== valids[psNdx].match.fn) && (psNdx <= closestTo && (before = psNdx), 
	                psNdx >= closestTo && (after = psNdx));
	            }
	            return before !== -1 && closestTo - before > 1 || after < closestTo ? before : after;
	        }
	        function stripValidPositions(start, end, nocheck, strict) {
	            function IsEnclosedStatic(pos) {
	                var posMatch = getMaskSet().validPositions[pos];
	                if (void 0 !== posMatch && null === posMatch.match.fn) {
	                    var prevMatch = getMaskSet().validPositions[pos - 1], nextMatch = getMaskSet().validPositions[pos + 1];
	                    return void 0 !== prevMatch && void 0 !== nextMatch;
	                }
	                return !1;
	            }
	            var i, startPos = start, positionsClone = $.extend(!0, {}, getMaskSet().validPositions), needsValidation = !1;
	            for (getMaskSet().p = start, i = end - 1; i >= startPos; i--) void 0 !== getMaskSet().validPositions[i] && (nocheck !== !0 && (!getMaskSet().validPositions[i].match.optionality && IsEnclosedStatic(i) || opts.canClearPosition(getMaskSet(), i, getLastValidPosition(), strict, opts) === !1) || delete getMaskSet().validPositions[i]);
	            for (resetMaskSet(!0), i = startPos + 1; i <= getLastValidPosition(); ) {
	                for (;void 0 !== getMaskSet().validPositions[startPos]; ) startPos++;
	                if (i < startPos && (i = startPos + 1), void 0 === getMaskSet().validPositions[i] && isMask(i)) i++; else {
	                    var t = getTestTemplate(i);
	                    needsValidation === !1 && positionsClone[startPos] && positionsClone[startPos].match.def === t.match.def ? (getMaskSet().validPositions[startPos] = $.extend(!0, {}, positionsClone[startPos]), 
	                    getMaskSet().validPositions[startPos].input = t.input, delete getMaskSet().validPositions[i], 
	                    i++) : positionCanMatchDefinition(startPos, t.match.def) ? isValid(startPos, t.input || getPlaceholder(i), !0) !== !1 && (delete getMaskSet().validPositions[i], 
	                    i++, needsValidation = !0) : isMask(i) || (i++, startPos--), startPos++;
	                }
	            }
	            resetMaskSet(!0);
	        }
	        function determineTestTemplate(tests, guessNextBest) {
	            for (var testPos, testPositions = tests, lvp = getLastValidPosition(), lvTest = getMaskSet().validPositions[lvp] || getTests(0)[0], lvTestAltArr = void 0 !== lvTest.alternation ? lvTest.locator[lvTest.alternation].toString().split(",") : [], ndx = 0; ndx < testPositions.length && (testPos = testPositions[ndx], 
	            !(testPos.match && (opts.greedy && testPos.match.optionalQuantifier !== !0 || (testPos.match.optionality === !1 || testPos.match.newBlockMarker === !1) && testPos.match.optionalQuantifier !== !0) && (void 0 === lvTest.alternation || lvTest.alternation !== testPos.alternation || void 0 !== testPos.locator[lvTest.alternation] && checkAlternationMatch(testPos.locator[lvTest.alternation].toString().split(","), lvTestAltArr))) || guessNextBest === !0 && (null !== testPos.match.fn || /[0-9a-bA-Z]/.test(testPos.match.def))); ndx++) ;
	            return testPos;
	        }
	        function getTestTemplate(pos, ndxIntlzr, tstPs) {
	            return getMaskSet().validPositions[pos] || determineTestTemplate(getTests(pos, ndxIntlzr ? ndxIntlzr.slice() : ndxIntlzr, tstPs));
	        }
	        function getTest(pos) {
	            return getMaskSet().validPositions[pos] ? getMaskSet().validPositions[pos] : getTests(pos)[0];
	        }
	        function positionCanMatchDefinition(pos, def) {
	            for (var valid = !1, tests = getTests(pos), tndx = 0; tndx < tests.length; tndx++) if (tests[tndx].match && tests[tndx].match.def === def) {
	                valid = !0;
	                break;
	            }
	            return valid;
	        }
	        function getTests(pos, ndxIntlzr, tstPs) {
	            function resolveTestFromToken(maskToken, ndxInitializer, loopNdx, quantifierRecurse) {
	                function handleMatch(match, loopNdx, quantifierRecurse) {
	                    function isFirstMatch(latestMatch, tokenGroup) {
	                        var firstMatch = 0 === $.inArray(latestMatch, tokenGroup.matches);
	                        return firstMatch || $.each(tokenGroup.matches, function(ndx, match) {
	                            if (match.isQuantifier === !0 && (firstMatch = isFirstMatch(latestMatch, tokenGroup.matches[ndx - 1]))) return !1;
	                        }), firstMatch;
	                    }
	                    function resolveNdxInitializer(pos, alternateNdx, targetAlternation) {
	                        var bestMatch, indexPos;
	                        return (getMaskSet().tests[pos] || getMaskSet().validPositions[pos]) && $.each(getMaskSet().tests[pos] || [ getMaskSet().validPositions[pos] ], function(ndx, lmnt) {
	                            var alternation = void 0 !== targetAlternation ? targetAlternation : lmnt.alternation, ndxPos = void 0 !== lmnt.locator[alternation] ? lmnt.locator[alternation].toString().indexOf(alternateNdx) : -1;
	                            (void 0 === indexPos || ndxPos < indexPos) && ndxPos !== -1 && (bestMatch = lmnt, 
	                            indexPos = ndxPos);
	                        }), bestMatch ? bestMatch.locator.slice((void 0 !== targetAlternation ? targetAlternation : bestMatch.alternation) + 1) : void 0 !== targetAlternation ? resolveNdxInitializer(pos, alternateNdx) : void 0;
	                    }
	                    function staticCanMatchDefinition(source, target) {
	                        return null === source.match.fn && null !== target.match.fn && target.match.fn.test(source.match.def, getMaskSet(), pos, !1, opts, !1);
	                    }
	                    if (testPos > 1e4) throw "Inputmask: There is probably an error in your mask definition or in the code. Create an issue on github with an example of the mask you are using. " + getMaskSet().mask;
	                    if (testPos === pos && void 0 === match.matches) return matches.push({
	                        match: match,
	                        locator: loopNdx.reverse(),
	                        cd: cacheDependency
	                    }), !0;
	                    if (void 0 !== match.matches) {
	                        if (match.isGroup && quantifierRecurse !== match) {
	                            if (match = handleMatch(maskToken.matches[$.inArray(match, maskToken.matches) + 1], loopNdx)) return !0;
	                        } else if (match.isOptional) {
	                            var optionalToken = match;
	                            if (match = resolveTestFromToken(match, ndxInitializer, loopNdx, quantifierRecurse)) {
	                                if (latestMatch = matches[matches.length - 1].match, !isFirstMatch(latestMatch, optionalToken)) return !0;
	                                insertStop = !0, testPos = pos;
	                            }
	                        } else if (match.isAlternator) {
	                            var maltMatches, alternateToken = match, malternateMatches = [], currentMatches = matches.slice(), loopNdxCnt = loopNdx.length, altIndex = ndxInitializer.length > 0 ? ndxInitializer.shift() : -1;
	                            if (altIndex === -1 || "string" == typeof altIndex) {
	                                var amndx, currentPos = testPos, ndxInitializerClone = ndxInitializer.slice(), altIndexArr = [];
	                                if ("string" == typeof altIndex) altIndexArr = altIndex.split(","); else for (amndx = 0; amndx < alternateToken.matches.length; amndx++) altIndexArr.push(amndx);
	                                for (var ndx = 0; ndx < altIndexArr.length; ndx++) {
	                                    if (amndx = parseInt(altIndexArr[ndx]), matches = [], ndxInitializer = resolveNdxInitializer(testPos, amndx, loopNdxCnt) || ndxInitializerClone.slice(), 
	                                    match = handleMatch(alternateToken.matches[amndx] || maskToken.matches[amndx], [ amndx ].concat(loopNdx), quantifierRecurse) || match, 
	                                    match !== !0 && void 0 !== match && altIndexArr[altIndexArr.length - 1] < alternateToken.matches.length) {
	                                        var ntndx = $.inArray(match, maskToken.matches) + 1;
	                                        maskToken.matches.length > ntndx && (match = handleMatch(maskToken.matches[ntndx], [ ntndx ].concat(loopNdx.slice(1, loopNdx.length)), quantifierRecurse), 
	                                        match && (altIndexArr.push(ntndx.toString()), $.each(matches, function(ndx, lmnt) {
	                                            lmnt.alternation = loopNdx.length - 1;
	                                        })));
	                                    }
	                                    maltMatches = matches.slice(), testPos = currentPos, matches = [];
	                                    for (var ndx1 = 0; ndx1 < maltMatches.length; ndx1++) {
	                                        var altMatch = maltMatches[ndx1], hasMatch = !1;
	                                        altMatch.alternation = altMatch.alternation || loopNdxCnt;
	                                        for (var ndx2 = 0; ndx2 < malternateMatches.length; ndx2++) {
	                                            var altMatch2 = malternateMatches[ndx2];
	                                            if (("string" != typeof altIndex || $.inArray(altMatch.locator[altMatch.alternation].toString(), altIndexArr) !== -1) && (altMatch.match.def === altMatch2.match.def || staticCanMatchDefinition(altMatch, altMatch2))) {
	                                                hasMatch = altMatch.match.nativeDef === altMatch2.match.nativeDef, altMatch.alternation == altMatch2.alternation && altMatch2.locator[altMatch2.alternation].toString().indexOf(altMatch.locator[altMatch.alternation]) === -1 && (altMatch2.locator[altMatch2.alternation] = altMatch2.locator[altMatch2.alternation] + "," + altMatch.locator[altMatch.alternation], 
	                                                altMatch2.alternation = altMatch.alternation, null == altMatch.match.fn && (altMatch2.na = altMatch2.na || altMatch.locator[altMatch.alternation].toString(), 
	                                                altMatch2.na.indexOf(altMatch.locator[altMatch.alternation]) === -1 && (altMatch2.na = altMatch2.na + "," + altMatch.locator[altMatch.alternation])));
	                                                break;
	                                            }
	                                        }
	                                        hasMatch || malternateMatches.push(altMatch);
	                                    }
	                                }
	                                "string" == typeof altIndex && (malternateMatches = $.map(malternateMatches, function(lmnt, ndx) {
	                                    if (isFinite(ndx)) {
	                                        var mamatch, alternation = lmnt.alternation, altLocArr = lmnt.locator[alternation].toString().split(",");
	                                        lmnt.locator[alternation] = void 0, lmnt.alternation = void 0;
	                                        for (var alndx = 0; alndx < altLocArr.length; alndx++) mamatch = $.inArray(altLocArr[alndx], altIndexArr) !== -1, 
	                                        mamatch && (void 0 !== lmnt.locator[alternation] ? (lmnt.locator[alternation] += ",", 
	                                        lmnt.locator[alternation] += altLocArr[alndx]) : lmnt.locator[alternation] = parseInt(altLocArr[alndx]), 
	                                        lmnt.alternation = alternation);
	                                        if (void 0 !== lmnt.locator[alternation]) return lmnt;
	                                    }
	                                })), matches = currentMatches.concat(malternateMatches), testPos = pos, insertStop = matches.length > 0, 
	                                ndxInitializer = ndxInitializerClone.slice();
	                            } else match = handleMatch(alternateToken.matches[altIndex] || maskToken.matches[altIndex], [ altIndex ].concat(loopNdx), quantifierRecurse);
	                            if (match) return !0;
	                        } else if (match.isQuantifier && quantifierRecurse !== maskToken.matches[$.inArray(match, maskToken.matches) - 1]) for (var qt = match, qndx = ndxInitializer.length > 0 ? ndxInitializer.shift() : 0; qndx < (isNaN(qt.quantifier.max) ? qndx + 1 : qt.quantifier.max) && testPos <= pos; qndx++) {
	                            var tokenGroup = maskToken.matches[$.inArray(qt, maskToken.matches) - 1];
	                            if (match = handleMatch(tokenGroup, [ qndx ].concat(loopNdx), tokenGroup)) {
	                                if (latestMatch = matches[matches.length - 1].match, latestMatch.optionalQuantifier = qndx > qt.quantifier.min - 1, 
	                                isFirstMatch(latestMatch, tokenGroup)) {
	                                    if (qndx > qt.quantifier.min - 1) {
	                                        insertStop = !0, testPos = pos;
	                                        break;
	                                    }
	                                    return !0;
	                                }
	                                return !0;
	                            }
	                        } else if (match = resolveTestFromToken(match, ndxInitializer, loopNdx, quantifierRecurse)) return !0;
	                    } else testPos++;
	                }
	                for (var tndx = ndxInitializer.length > 0 ? ndxInitializer.shift() : 0; tndx < maskToken.matches.length; tndx++) if (maskToken.matches[tndx].isQuantifier !== !0) {
	                    var match = handleMatch(maskToken.matches[tndx], [ tndx ].concat(loopNdx), quantifierRecurse);
	                    if (match && testPos === pos) return match;
	                    if (testPos > pos) break;
	                }
	            }
	            function mergeLocators(tests) {
	                var locator = [];
	                return $.isArray(tests) || (tests = [ tests ]), tests.length > 0 && (void 0 === tests[0].alternation ? (locator = determineTestTemplate(tests.slice()).locator.slice(), 
	                0 === locator.length && (locator = tests[0].locator.slice())) : $.each(tests, function(ndx, tst) {
	                    if ("" !== tst.def) if (0 === locator.length) locator = tst.locator.slice(); else for (var i = 0; i < locator.length; i++) tst.locator[i] && locator[i].toString().indexOf(tst.locator[i]) === -1 && (locator[i] += "," + tst.locator[i]);
	                })), locator;
	            }
	            function filterTests(tests) {
	                return opts.keepStatic && pos > 0 && tests.length > 1 + ("" === tests[tests.length - 1].match.def ? 1 : 0) && tests[0].match.optionality !== !0 && tests[0].match.optionalQuantifier !== !0 && null === tests[0].match.fn && !/[0-9a-bA-Z]/.test(tests[0].match.def) ? [ determineTestTemplate(tests) ] : tests;
	            }
	            var latestMatch, maskTokens = getMaskSet().maskToken, testPos = ndxIntlzr ? tstPs : 0, ndxInitializer = ndxIntlzr ? ndxIntlzr.slice() : [ 0 ], matches = [], insertStop = !1, cacheDependency = ndxIntlzr ? ndxIntlzr.join("") : "";
	            if (pos > -1) {
	                if (void 0 === ndxIntlzr) {
	                    for (var test, previousPos = pos - 1; void 0 === (test = getMaskSet().validPositions[previousPos] || getMaskSet().tests[previousPos]) && previousPos > -1; ) previousPos--;
	                    void 0 !== test && previousPos > -1 && (ndxInitializer = mergeLocators(test), cacheDependency = ndxInitializer.join(""), 
	                    testPos = previousPos);
	                }
	                if (getMaskSet().tests[pos] && getMaskSet().tests[pos][0].cd === cacheDependency) return filterTests(getMaskSet().tests[pos]);
	                for (var mtndx = ndxInitializer.shift(); mtndx < maskTokens.length; mtndx++) {
	                    var match = resolveTestFromToken(maskTokens[mtndx], ndxInitializer, [ mtndx ]);
	                    if (match && testPos === pos || testPos > pos) break;
	                }
	            }
	            return (0 === matches.length || insertStop) && matches.push({
	                match: {
	                    fn: null,
	                    cardinality: 0,
	                    optionality: !0,
	                    casing: null,
	                    def: "",
	                    placeholder: ""
	                },
	                locator: [],
	                cd: cacheDependency
	            }), void 0 !== ndxIntlzr && getMaskSet().tests[pos] ? filterTests($.extend(!0, [], matches)) : (getMaskSet().tests[pos] = $.extend(!0, [], matches), 
	            filterTests(getMaskSet().tests[pos]));
	        }
	        function getBufferTemplate() {
	            return void 0 === getMaskSet()._buffer && (getMaskSet()._buffer = getMaskTemplate(!1, 1), 
	            void 0 === getMaskSet().buffer && getMaskSet()._buffer.slice()), getMaskSet()._buffer;
	        }
	        function getBuffer(noCache) {
	            return void 0 !== getMaskSet().buffer && noCache !== !0 || (getMaskSet().buffer = getMaskTemplate(!0, getLastValidPosition(), !0)), 
	            getMaskSet().buffer;
	        }
	        function refreshFromBuffer(start, end, buffer) {
	            var i;
	            if (start === !0) resetMaskSet(), start = 0, end = buffer.length; else for (i = start; i < end; i++) delete getMaskSet().validPositions[i];
	            for (i = start; i < end; i++) resetMaskSet(!0), buffer[i] !== opts.skipOptionalPartCharacter && isValid(i, buffer[i], !0, !0);
	        }
	        function casing(elem, test, pos) {
	            switch (opts.casing || test.casing) {
	              case "upper":
	                elem = elem.toUpperCase();
	                break;

	              case "lower":
	                elem = elem.toLowerCase();
	                break;

	              case "title":
	                var posBefore = getMaskSet().validPositions[pos - 1];
	                elem = 0 === pos || posBefore && posBefore.input === String.fromCharCode(Inputmask.keyCode.SPACE) ? elem.toUpperCase() : elem.toLowerCase();
	            }
	            return elem;
	        }
	        function checkAlternationMatch(altArr1, altArr2) {
	            for (var altArrC = opts.greedy ? altArr2 : altArr2.slice(0, 1), isMatch = !1, alndx = 0; alndx < altArr1.length; alndx++) if ($.inArray(altArr1[alndx], altArrC) !== -1) {
	                isMatch = !0;
	                break;
	            }
	            return isMatch;
	        }
	        function isValid(pos, c, strict, fromSetValid, fromAlternate) {
	            function isSelection(posObj) {
	                var selection = isRTL ? posObj.begin - posObj.end > 1 || posObj.begin - posObj.end === 1 && opts.insertMode : posObj.end - posObj.begin > 1 || posObj.end - posObj.begin === 1 && opts.insertMode;
	                return selection && 0 === posObj.begin && posObj.end === getMaskSet().maskLength ? "full" : selection;
	            }
	            function _isValid(position, c, strict) {
	                var rslt = !1;
	                return $.each(getTests(position), function(ndx, tst) {
	                    for (var test = tst.match, loopend = c ? 1 : 0, chrs = "", i = test.cardinality; i > loopend; i--) chrs += getBufferElement(position - (i - 1));
	                    if (c && (chrs += c), getBuffer(!0), rslt = null != test.fn ? test.fn.test(chrs, getMaskSet(), position, strict, opts, isSelection(pos)) : (c === test.def || c === opts.skipOptionalPartCharacter) && "" !== test.def && {
	                        c: test.placeholder || test.def,
	                        pos: position
	                    }, rslt !== !1) {
	                        var elem = void 0 !== rslt.c ? rslt.c : c;
	                        elem = elem === opts.skipOptionalPartCharacter && null === test.fn ? test.placeholder || test.def : elem;
	                        var validatedPos = position, possibleModifiedBuffer = getBuffer();
	                        if (void 0 !== rslt.remove && ($.isArray(rslt.remove) || (rslt.remove = [ rslt.remove ]), 
	                        $.each(rslt.remove.sort(function(a, b) {
	                            return b - a;
	                        }), function(ndx, lmnt) {
	                            stripValidPositions(lmnt, lmnt + 1, !0);
	                        })), void 0 !== rslt.insert && ($.isArray(rslt.insert) || (rslt.insert = [ rslt.insert ]), 
	                        $.each(rslt.insert.sort(function(a, b) {
	                            return a - b;
	                        }), function(ndx, lmnt) {
	                            isValid(lmnt.pos, lmnt.c, !0, fromSetValid);
	                        })), rslt.refreshFromBuffer) {
	                            var refresh = rslt.refreshFromBuffer;
	                            if (strict = !0, refreshFromBuffer(refresh === !0 ? refresh : refresh.start, refresh.end, possibleModifiedBuffer), 
	                            void 0 === rslt.pos && void 0 === rslt.c) return rslt.pos = getLastValidPosition(), 
	                            !1;
	                            if (validatedPos = void 0 !== rslt.pos ? rslt.pos : position, validatedPos !== position) return rslt = $.extend(rslt, isValid(validatedPos, elem, !0, fromSetValid)), 
	                            !1;
	                        } else if (rslt !== !0 && void 0 !== rslt.pos && rslt.pos !== position && (validatedPos = rslt.pos, 
	                        refreshFromBuffer(position, validatedPos, getBuffer().slice()), validatedPos !== position)) return rslt = $.extend(rslt, isValid(validatedPos, elem, !0)), 
	                        !1;
	                        return (rslt === !0 || void 0 !== rslt.pos || void 0 !== rslt.c) && (ndx > 0 && resetMaskSet(!0), 
	                        setValidPosition(validatedPos, $.extend({}, tst, {
	                            input: casing(elem, test, validatedPos)
	                        }), fromSetValid, isSelection(pos)) || (rslt = !1), !1);
	                    }
	                }), rslt;
	            }
	            function alternate(pos, c, strict) {
	                var lastAlt, alternation, altPos, prevAltPos, i, validPos, altNdxs, decisionPos, validPsClone = $.extend(!0, {}, getMaskSet().validPositions), isValidRslt = !1, lAltPos = getLastValidPosition();
	                for (prevAltPos = getMaskSet().validPositions[lAltPos]; lAltPos >= 0; lAltPos--) if (altPos = getMaskSet().validPositions[lAltPos], 
	                altPos && void 0 !== altPos.alternation) {
	                    if (lastAlt = lAltPos, alternation = getMaskSet().validPositions[lastAlt].alternation, 
	                    prevAltPos.locator[altPos.alternation] !== altPos.locator[altPos.alternation]) break;
	                    prevAltPos = altPos;
	                }
	                if (void 0 !== alternation) {
	                    decisionPos = parseInt(lastAlt);
	                    var decisionTaker = void 0 !== prevAltPos.locator[prevAltPos.alternation || alternation] ? prevAltPos.locator[prevAltPos.alternation || alternation] : altNdxs[0];
	                    decisionTaker.length > 0 && (decisionTaker = decisionTaker.split(",")[0]);
	                    var possibilityPos = getMaskSet().validPositions[decisionPos], prevPos = getMaskSet().validPositions[decisionPos - 1];
	                    $.each(getTests(decisionPos, prevPos ? prevPos.locator : void 0, decisionPos - 1), function(ndx, test) {
	                        altNdxs = test.locator[alternation] ? test.locator[alternation].toString().split(",") : [];
	                        for (var mndx = 0; mndx < altNdxs.length; mndx++) {
	                            var validInputs = [], staticInputsBeforePos = 0, staticInputsBeforePosAlternate = 0, verifyValidInput = !1;
	                            if (decisionTaker < altNdxs[mndx] && (void 0 === test.na || $.inArray(altNdxs[mndx], test.na.split(",")) === -1)) {
	                                getMaskSet().validPositions[decisionPos] = $.extend(!0, {}, test);
	                                var possibilities = getMaskSet().validPositions[decisionPos].locator;
	                                for (getMaskSet().validPositions[decisionPos].locator[alternation] = parseInt(altNdxs[mndx]), 
	                                null == test.match.fn ? (possibilityPos.input !== test.match.def && (verifyValidInput = !0, 
	                                possibilityPos.generatedInput !== !0 && validInputs.push(possibilityPos.input)), 
	                                staticInputsBeforePosAlternate++, getMaskSet().validPositions[decisionPos].generatedInput = !/[0-9a-bA-Z]/.test(test.match.def), 
	                                getMaskSet().validPositions[decisionPos].input = test.match.def) : getMaskSet().validPositions[decisionPos].input = possibilityPos.input, 
	                                i = decisionPos + 1; i < getLastValidPosition(void 0, !0) + 1; i++) validPos = getMaskSet().validPositions[i], 
	                                validPos && validPos.generatedInput !== !0 && /[0-9a-bA-Z]/.test(validPos.input) ? validInputs.push(validPos.input) : i < pos && staticInputsBeforePos++, 
	                                delete getMaskSet().validPositions[i];
	                                for (verifyValidInput && validInputs[0] === test.match.def && validInputs.shift(), 
	                                resetMaskSet(!0), isValidRslt = !0; validInputs.length > 0; ) {
	                                    var input = validInputs.shift();
	                                    if (input !== opts.skipOptionalPartCharacter && !(isValidRslt = isValid(getLastValidPosition(void 0, !0) + 1, input, !1, fromSetValid, !0))) break;
	                                }
	                                if (isValidRslt) {
	                                    getMaskSet().validPositions[decisionPos].locator = possibilities;
	                                    var targetLvp = getLastValidPosition(pos) + 1;
	                                    for (i = decisionPos + 1; i < getLastValidPosition() + 1; i++) validPos = getMaskSet().validPositions[i], 
	                                    (void 0 === validPos || null == validPos.match.fn) && i < pos + (staticInputsBeforePosAlternate - staticInputsBeforePos) && staticInputsBeforePosAlternate++;
	                                    pos += staticInputsBeforePosAlternate - staticInputsBeforePos, isValidRslt = isValid(pos > targetLvp ? targetLvp : pos, c, strict, fromSetValid, !0);
	                                }
	                                if (isValidRslt) return !1;
	                                resetMaskSet(), getMaskSet().validPositions = $.extend(!0, {}, validPsClone);
	                            }
	                        }
	                    });
	                }
	                return isValidRslt;
	            }
	            function trackbackAlternations(originalPos, newPos) {
	                var vp = getMaskSet().validPositions[newPos];
	                if (vp) for (var targetLocator = vp.locator, tll = targetLocator.length, ps = originalPos; ps < newPos; ps++) if (void 0 === getMaskSet().validPositions[ps] && !isMask(ps, !0)) {
	                    var tests = getTests(ps), bestMatch = tests[0], equality = -1;
	                    $.each(tests, function(ndx, tst) {
	                        for (var i = 0; i < tll && (void 0 !== tst.locator[i] && checkAlternationMatch(tst.locator[i].toString().split(","), targetLocator[i].toString().split(","))); i++) equality < i && (equality = i, 
	                        bestMatch = tst);
	                    }), setValidPosition(ps, $.extend({}, bestMatch, {
	                        input: bestMatch.match.placeholder || bestMatch.match.def
	                    }), !0);
	                }
	            }
	            function setValidPosition(pos, validTest, fromSetValid, isSelection) {
	                if (isSelection || opts.insertMode && void 0 !== getMaskSet().validPositions[pos] && void 0 === fromSetValid) {
	                    var i, positionsClone = $.extend(!0, {}, getMaskSet().validPositions), lvp = getLastValidPosition(void 0, !0);
	                    for (i = pos; i <= lvp; i++) delete getMaskSet().validPositions[i];
	                    getMaskSet().validPositions[pos] = $.extend(!0, {}, validTest);
	                    var j, valid = !0, vps = getMaskSet().validPositions, needsValidation = !1, initialLength = getMaskSet().maskLength;
	                    for (i = j = pos; i <= lvp; i++) {
	                        var t = positionsClone[i];
	                        if (void 0 !== t) for (var posMatch = j; posMatch < getMaskSet().maskLength && (null === t.match.fn && vps[i] && (vps[i].match.optionalQuantifier === !0 || vps[i].match.optionality === !0) || null != t.match.fn); ) {
	                            if (posMatch++, needsValidation === !1 && positionsClone[posMatch] && positionsClone[posMatch].match.def === t.match.def) getMaskSet().validPositions[posMatch] = $.extend(!0, {}, positionsClone[posMatch]), 
	                            getMaskSet().validPositions[posMatch].input = t.input, fillMissingNonMask(posMatch), 
	                            j = posMatch, valid = !0; else if (positionCanMatchDefinition(posMatch, t.match.def)) {
	                                var result = isValid(posMatch, t.input, !0, !0);
	                                valid = result !== !1, j = result.caret || result.insert ? getLastValidPosition() : posMatch, 
	                                needsValidation = !0;
	                            } else valid = t.generatedInput === !0;
	                            if (getMaskSet().maskLength < initialLength && (getMaskSet().maskLength = initialLength), 
	                            valid) break;
	                        }
	                        if (!valid) break;
	                    }
	                    if (!valid) return getMaskSet().validPositions = $.extend(!0, {}, positionsClone), 
	                    resetMaskSet(!0), !1;
	                } else getMaskSet().validPositions[pos] = $.extend(!0, {}, validTest);
	                return resetMaskSet(!0), !0;
	            }
	            function fillMissingNonMask(maskPos) {
	                for (var pndx = maskPos - 1; pndx > -1 && !getMaskSet().validPositions[pndx]; pndx--) ;
	                var testTemplate, testsFromPos;
	                for (pndx++; pndx < maskPos; pndx++) void 0 === getMaskSet().validPositions[pndx] && (opts.jitMasking === !1 || opts.jitMasking > pndx) && (testsFromPos = getTests(pndx, getTestTemplate(pndx - 1).locator, pndx - 1).slice(), 
	                "" === testsFromPos[testsFromPos.length - 1].match.def && testsFromPos.pop(), testTemplate = determineTestTemplate(testsFromPos), 
	                testTemplate && (testTemplate.match.def === opts.radixPointDefinitionSymbol || !isMask(pndx, !0) || $.inArray(opts.radixPoint, getBuffer()) < pndx && testTemplate.match.fn && testTemplate.match.fn.test(getPlaceholder(pndx), getMaskSet(), pndx, !1, opts)) && (result = _isValid(pndx, testTemplate.match.placeholder || (null == testTemplate.match.fn ? testTemplate.match.def : "" !== getPlaceholder(pndx) ? getPlaceholder(pndx) : getBuffer()[pndx]), !0), 
	                result !== !1 && (getMaskSet().validPositions[result.pos || pndx].generatedInput = !0)));
	            }
	            strict = strict === !0;
	            var maskPos = pos;
	            void 0 !== pos.begin && (maskPos = isRTL && !isSelection(pos) ? pos.end : pos.begin);
	            var result = !1, positionsClone = $.extend(!0, {}, getMaskSet().validPositions);
	            if (fillMissingNonMask(maskPos), isSelection(pos) && (handleRemove(void 0, Inputmask.keyCode.DELETE, pos), 
	            maskPos = getMaskSet().p), maskPos < getMaskSet().maskLength && (result = _isValid(maskPos, c, strict), 
	            (!strict || fromSetValid === !0) && result === !1)) {
	                var currentPosValid = getMaskSet().validPositions[maskPos];
	                if (!currentPosValid || null !== currentPosValid.match.fn || currentPosValid.match.def !== c && c !== opts.skipOptionalPartCharacter) {
	                    if ((opts.insertMode || void 0 === getMaskSet().validPositions[seekNext(maskPos)]) && !isMask(maskPos, !0)) {
	                        var testsFromPos = getTests(maskPos).slice();
	                        "" === testsFromPos[testsFromPos.length - 1].match.def && testsFromPos.pop();
	                        var staticChar = determineTestTemplate(testsFromPos, !0);
	                        staticChar && null === staticChar.match.fn && (staticChar = staticChar.match.placeholder || staticChar.match.def, 
	                        _isValid(maskPos, staticChar, strict), getMaskSet().validPositions[maskPos].generatedInput = !0);
	                        for (var nPos = maskPos + 1, snPos = seekNext(maskPos); nPos <= snPos; nPos++) if (result = _isValid(nPos, c, strict), 
	                        result !== !1) {
	                            trackbackAlternations(maskPos, void 0 !== result.pos ? result.pos : nPos), maskPos = nPos;
	                            break;
	                        }
	                    }
	                } else result = {
	                    caret: seekNext(maskPos)
	                };
	            }
	            return result === !1 && opts.keepStatic && !strict && fromAlternate !== !0 && (result = alternate(maskPos, c, strict)), 
	            result === !0 && (result = {
	                pos: maskPos
	            }), $.isFunction(opts.postValidation) && result !== !1 && !strict && fromSetValid !== !0 && (result = !!opts.postValidation(getBuffer(!0), result, opts) && result), 
	            void 0 === result.pos && (result.pos = maskPos), result === !1 && (resetMaskSet(!0), 
	            getMaskSet().validPositions = $.extend(!0, {}, positionsClone)), result;
	        }
	        function isMask(pos, strict) {
	            var test;
	            if (strict ? (test = getTestTemplate(pos).match, "" === test.def && (test = getTest(pos).match)) : test = getTest(pos).match, 
	            null != test.fn) return test.fn;
	            if (strict !== !0 && pos > -1) {
	                var tests = getTests(pos);
	                return tests.length > 1 + ("" === tests[tests.length - 1].match.def ? 1 : 0);
	            }
	            return !1;
	        }
	        function seekNext(pos, newBlock) {
	            var maskL = getMaskSet().maskLength;
	            if (pos >= maskL) return maskL;
	            for (var position = pos; ++position < maskL && (newBlock === !0 && (getTest(position).match.newBlockMarker !== !0 || !isMask(position)) || newBlock !== !0 && !isMask(position)); ) ;
	            return position;
	        }
	        function seekPrevious(pos, newBlock) {
	            var tests, position = pos;
	            if (position <= 0) return 0;
	            for (;--position > 0 && (newBlock === !0 && getTest(position).match.newBlockMarker !== !0 || newBlock !== !0 && !isMask(position) && (tests = getTests(position), 
	            tests.length < 2 || 2 === tests.length && "" === tests[1].match.def)); ) ;
	            return position;
	        }
	        function getBufferElement(position) {
	            return void 0 === getMaskSet().validPositions[position] ? getPlaceholder(position) : getMaskSet().validPositions[position].input;
	        }
	        function writeBuffer(input, buffer, caretPos, event, triggerInputEvent) {
	            if (event && $.isFunction(opts.onBeforeWrite)) {
	                var result = opts.onBeforeWrite(event, buffer, caretPos, opts);
	                if (result) {
	                    if (result.refreshFromBuffer) {
	                        var refresh = result.refreshFromBuffer;
	                        refreshFromBuffer(refresh === !0 ? refresh : refresh.start, refresh.end, result.buffer || buffer), 
	                        buffer = getBuffer(!0);
	                    }
	                    void 0 !== caretPos && (caretPos = void 0 !== result.caret ? result.caret : caretPos);
	                }
	            }
	            input.inputmask._valueSet(buffer.join("")), void 0 === caretPos || void 0 !== event && "blur" === event.type ? renderColorMask(input, buffer, caretPos) : caret(input, caretPos), 
	            triggerInputEvent === !0 && (skipInputEvent = !0, $(input).trigger("input"));
	        }
	        function getPlaceholder(pos, test) {
	            if (test = test || getTest(pos).match, void 0 !== test.placeholder) return test.placeholder;
	            if (null === test.fn) {
	                if (pos > -1 && void 0 === getMaskSet().validPositions[pos]) {
	                    var prevTest, tests = getTests(pos), staticAlternations = [];
	                    if (tests.length > 1 + ("" === tests[tests.length - 1].match.def ? 1 : 0)) for (var i = 0; i < tests.length; i++) if (tests[i].match.optionality !== !0 && tests[i].match.optionalQuantifier !== !0 && (null === tests[i].match.fn || void 0 === prevTest || tests[i].match.fn.test(prevTest.match.def, getMaskSet(), pos, !0, opts) !== !1) && (staticAlternations.push(tests[i]), 
	                    null === tests[i].match.fn && (prevTest = tests[i]), staticAlternations.length > 1 && /[0-9a-bA-Z]/.test(staticAlternations[0].match.def))) return opts.placeholder.charAt(pos % opts.placeholder.length);
	                }
	                return test.def;
	            }
	            return opts.placeholder.charAt(pos % opts.placeholder.length);
	        }
	        function checkVal(input, writeOut, strict, nptvl, initiatingEvent, stickyCaret) {
	            function isTemplateMatch() {
	                var isMatch = !1, charCodeNdx = getBufferTemplate().slice(initialNdx, seekNext(initialNdx)).join("").indexOf(charCodes);
	                if (charCodeNdx !== -1 && !isMask(initialNdx)) {
	                    isMatch = !0;
	                    for (var bufferTemplateArr = getBufferTemplate().slice(initialNdx, initialNdx + charCodeNdx), i = 0; i < bufferTemplateArr.length; i++) if (" " !== bufferTemplateArr[i]) {
	                        isMatch = !1;
	                        break;
	                    }
	                }
	                return isMatch;
	            }
	            var inputValue = nptvl.slice(), charCodes = "", initialNdx = 0, result = void 0;
	            if (resetMaskSet(), getMaskSet().p = seekNext(-1), !strict) if (opts.autoUnmask !== !0) {
	                var staticInput = getBufferTemplate().slice(0, seekNext(-1)).join(""), matches = inputValue.join("").match(new RegExp("^" + Inputmask.escapeRegex(staticInput), "g"));
	                matches && matches.length > 0 && (inputValue.splice(0, matches.length * staticInput.length), 
	                initialNdx = seekNext(initialNdx));
	            } else initialNdx = seekNext(initialNdx);
	            if ($.each(inputValue, function(ndx, charCode) {
	                if (void 0 !== charCode) {
	                    var keypress = new $.Event("keypress");
	                    keypress.which = charCode.charCodeAt(0), charCodes += charCode;
	                    var lvp = getLastValidPosition(void 0, !0), lvTest = getMaskSet().validPositions[lvp], nextTest = getTestTemplate(lvp + 1, lvTest ? lvTest.locator.slice() : void 0, lvp);
	                    if (!isTemplateMatch() || strict || opts.autoUnmask) {
	                        var pos = strict ? ndx : null == nextTest.match.fn && nextTest.match.optionality && lvp + 1 < getMaskSet().p ? lvp + 1 : getMaskSet().p;
	                        result = EventHandlers.keypressEvent.call(input, keypress, !0, !1, strict, pos), 
	                        initialNdx = pos + 1, charCodes = "";
	                    } else result = EventHandlers.keypressEvent.call(input, keypress, !0, !1, !0, lvp + 1);
	                    if (!strict && $.isFunction(opts.onBeforeWrite) && (result = opts.onBeforeWrite(keypress, getBuffer(), result.forwardPosition, opts), 
	                    result && result.refreshFromBuffer)) {
	                        var refresh = result.refreshFromBuffer;
	                        refreshFromBuffer(refresh === !0 ? refresh : refresh.start, refresh.end, result.buffer), 
	                        resetMaskSet(!0), result.caret && (getMaskSet().p = result.caret);
	                    }
	                }
	            }), writeOut) {
	                var caretPos = void 0, lvp = getLastValidPosition();
	                document.activeElement === input && (initiatingEvent || result) && (caretPos = caret(input).begin, 
	                initiatingEvent && result === !1 && (caretPos = seekNext(getLastValidPosition(caretPos))), 
	                result && stickyCaret !== !0 && (caretPos < lvp + 1 || lvp === -1) && (caretPos = opts.numericInput && void 0 === result.caret ? seekPrevious(result.forwardPosition) : result.forwardPosition)), 
	                writeBuffer(input, getBuffer(), caretPos, initiatingEvent || new $.Event("checkval"));
	            }
	        }
	        function unmaskedvalue(input) {
	            if (input && void 0 === input.inputmask) return input.value;
	            var umValue = [], vps = getMaskSet().validPositions;
	            for (var pndx in vps) vps[pndx].match && null != vps[pndx].match.fn && umValue.push(vps[pndx].input);
	            var unmaskedValue = 0 === umValue.length ? "" : (isRTL ? umValue.reverse() : umValue).join("");
	            if ($.isFunction(opts.onUnMask)) {
	                var bufferValue = (isRTL ? getBuffer().slice().reverse() : getBuffer()).join("");
	                unmaskedValue = opts.onUnMask(bufferValue, unmaskedValue, opts) || unmaskedValue;
	            }
	            return unmaskedValue;
	        }
	        function caret(input, begin, end, notranslate) {
	            function translatePosition(pos) {
	                if (notranslate !== !0 && isRTL && "number" == typeof pos && (!opts.greedy || "" !== opts.placeholder)) {
	                    var bffrLght = getBuffer().join("").length;
	                    pos = bffrLght - pos;
	                }
	                return pos;
	            }
	            var range;
	            if ("number" != typeof begin) return input.setSelectionRange ? (begin = input.selectionStart, 
	            end = input.selectionEnd) : window.getSelection ? (range = window.getSelection().getRangeAt(0), 
	            range.commonAncestorContainer.parentNode !== input && range.commonAncestorContainer !== input || (begin = range.startOffset, 
	            end = range.endOffset)) : document.selection && document.selection.createRange && (range = document.selection.createRange(), 
	            begin = 0 - range.duplicate().moveStart("character", -input.inputmask._valueGet().length), 
	            end = begin + range.text.length), {
	                begin: translatePosition(begin),
	                end: translatePosition(end)
	            };
	            begin = translatePosition(begin), end = translatePosition(end), end = "number" == typeof end ? end : begin;
	            var scrollCalc = parseInt(((input.ownerDocument.defaultView || window).getComputedStyle ? (input.ownerDocument.defaultView || window).getComputedStyle(input, null) : input.currentStyle).fontSize) * end;
	            if (input.scrollLeft = scrollCalc > input.scrollWidth ? scrollCalc : 0, mobile || opts.insertMode !== !1 || begin !== end || end++, 
	            input.setSelectionRange) input.selectionStart = begin, input.selectionEnd = end; else if (window.getSelection) {
	                if (range = document.createRange(), void 0 === input.firstChild || null === input.firstChild) {
	                    var textNode = document.createTextNode("");
	                    input.appendChild(textNode);
	                }
	                range.setStart(input.firstChild, begin < input.inputmask._valueGet().length ? begin : input.inputmask._valueGet().length), 
	                range.setEnd(input.firstChild, end < input.inputmask._valueGet().length ? end : input.inputmask._valueGet().length), 
	                range.collapse(!0);
	                var sel = window.getSelection();
	                sel.removeAllRanges(), sel.addRange(range);
	            } else input.createTextRange && (range = input.createTextRange(), range.collapse(!0), 
	            range.moveEnd("character", end), range.moveStart("character", begin), range.select());
	            renderColorMask(input, void 0, {
	                begin: begin,
	                end: end
	            });
	        }
	        function determineLastRequiredPosition(returnDefinition) {
	            var pos, testPos, buffer = getBuffer(), bl = buffer.length, lvp = getLastValidPosition(), positions = {}, lvTest = getMaskSet().validPositions[lvp], ndxIntlzr = void 0 !== lvTest ? lvTest.locator.slice() : void 0;
	            for (pos = lvp + 1; pos < buffer.length; pos++) testPos = getTestTemplate(pos, ndxIntlzr, pos - 1), 
	            ndxIntlzr = testPos.locator.slice(), positions[pos] = $.extend(!0, {}, testPos);
	            var lvTestAlt = lvTest && void 0 !== lvTest.alternation ? lvTest.locator[lvTest.alternation] : void 0;
	            for (pos = bl - 1; pos > lvp && (testPos = positions[pos], (testPos.match.optionality || testPos.match.optionalQuantifier || lvTestAlt && (lvTestAlt !== positions[pos].locator[lvTest.alternation] && null != testPos.match.fn || null === testPos.match.fn && testPos.locator[lvTest.alternation] && checkAlternationMatch(testPos.locator[lvTest.alternation].toString().split(","), lvTestAlt.toString().split(",")) && "" !== getTests(pos)[0].def)) && buffer[pos] === getPlaceholder(pos, testPos.match)); pos--) bl--;
	            return returnDefinition ? {
	                l: bl,
	                def: positions[bl] ? positions[bl].match : void 0
	            } : bl;
	        }
	        function clearOptionalTail(buffer) {
	            for (var rl = determineLastRequiredPosition(), lmib = buffer.length - 1; lmib > rl && !isMask(lmib); lmib--) ;
	            return buffer.splice(rl, lmib + 1 - rl), buffer;
	        }
	        function isComplete(buffer) {
	            if ($.isFunction(opts.isComplete)) return opts.isComplete(buffer, opts);
	            if ("*" !== opts.repeat) {
	                var complete = !1, lrp = determineLastRequiredPosition(!0), aml = seekPrevious(lrp.l);
	                if (void 0 === lrp.def || lrp.def.newBlockMarker || lrp.def.optionality || lrp.def.optionalQuantifier) {
	                    complete = !0;
	                    for (var i = 0; i <= aml; i++) {
	                        var test = getTestTemplate(i).match;
	                        if (null !== test.fn && void 0 === getMaskSet().validPositions[i] && test.optionality !== !0 && test.optionalQuantifier !== !0 || null === test.fn && buffer[i] !== getPlaceholder(i, test)) {
	                            complete = !1;
	                            break;
	                        }
	                    }
	                }
	                return complete;
	            }
	        }
	        function handleRemove(input, k, pos, strict) {
	            function generalize() {
	                if (opts.keepStatic) {
	                    for (var validInputs = [], lastAlt = getLastValidPosition(-1, !0), positionsClone = $.extend(!0, {}, getMaskSet().validPositions), prevAltPos = getMaskSet().validPositions[lastAlt]; lastAlt >= 0; lastAlt--) {
	                        var altPos = getMaskSet().validPositions[lastAlt];
	                        if (altPos) {
	                            if (altPos.generatedInput !== !0 && /[0-9a-bA-Z]/.test(altPos.input) && validInputs.push(altPos.input), 
	                            delete getMaskSet().validPositions[lastAlt], void 0 !== altPos.alternation && altPos.locator[altPos.alternation] !== prevAltPos.locator[altPos.alternation]) break;
	                            prevAltPos = altPos;
	                        }
	                    }
	                    if (lastAlt > -1) for (getMaskSet().p = seekNext(getLastValidPosition(-1, !0)); validInputs.length > 0; ) {
	                        var keypress = new $.Event("keypress");
	                        keypress.which = validInputs.pop().charCodeAt(0), EventHandlers.keypressEvent.call(input, keypress, !0, !1, !1, getMaskSet().p);
	                    } else getMaskSet().validPositions = $.extend(!0, {}, positionsClone);
	                }
	            }
	            if ((opts.numericInput || isRTL) && (k === Inputmask.keyCode.BACKSPACE ? k = Inputmask.keyCode.DELETE : k === Inputmask.keyCode.DELETE && (k = Inputmask.keyCode.BACKSPACE), 
	            isRTL)) {
	                var pend = pos.end;
	                pos.end = pos.begin, pos.begin = pend;
	            }
	            k === Inputmask.keyCode.BACKSPACE && (pos.end - pos.begin < 1 || opts.insertMode === !1) ? (pos.begin = seekPrevious(pos.begin), 
	            void 0 === getMaskSet().validPositions[pos.begin] || getMaskSet().validPositions[pos.begin].input !== opts.groupSeparator && getMaskSet().validPositions[pos.begin].input !== opts.radixPoint || pos.begin--) : k === Inputmask.keyCode.DELETE && pos.begin === pos.end && (pos.end = isMask(pos.end, !0) ? pos.end + 1 : seekNext(pos.end) + 1, 
	            void 0 === getMaskSet().validPositions[pos.begin] || getMaskSet().validPositions[pos.begin].input !== opts.groupSeparator && getMaskSet().validPositions[pos.begin].input !== opts.radixPoint || pos.end++), 
	            stripValidPositions(pos.begin, pos.end, !1, strict), strict !== !0 && generalize();
	            var lvp = getLastValidPosition(pos.begin, !0);
	            lvp < pos.begin ? getMaskSet().p = seekNext(lvp) : strict !== !0 && (getMaskSet().p = pos.begin);
	        }
	        function initializeColorMask(input) {
	            function findCaretPos(clientx) {
	                var caretPos, e = document.createElement("span");
	                for (var style in computedStyle) isNaN(style) && style.indexOf("font") !== -1 && (e.style[style] = computedStyle[style]);
	                e.style.textTransform = computedStyle.textTransform, e.style.letterSpacing = computedStyle.letterSpacing, 
	                e.style.position = "absolute", e.style.height = "auto", e.style.width = "auto", 
	                e.style.visibility = "hidden", e.style.whiteSpace = "nowrap", document.body.appendChild(e);
	                var itl, inputText = input.inputmask._valueGet(), previousWidth = 0;
	                for (caretPos = 0, itl = inputText.length; caretPos <= itl; caretPos++) {
	                    if (e.innerHTML += inputText.charAt(caretPos) || "_", e.offsetWidth >= clientx) {
	                        var offset1 = clientx - previousWidth, offset2 = e.offsetWidth - clientx;
	                        e.innerHTML = inputText.charAt(caretPos), offset1 -= e.offsetWidth / 3, caretPos = offset1 < offset2 ? caretPos - 1 : caretPos;
	                        break;
	                    }
	                    previousWidth = e.offsetWidth;
	                }
	                return document.body.removeChild(e), caretPos;
	            }
	            function position() {
	                colorMask.style.position = "absolute", colorMask.style.top = offset.top + "px", 
	                colorMask.style.left = offset.left + "px", colorMask.style.width = parseInt(input.offsetWidth) - parseInt(computedStyle.paddingLeft) - parseInt(computedStyle.paddingRight) - parseInt(computedStyle.borderLeftWidth) - parseInt(computedStyle.borderRightWidth) + "px", 
	                colorMask.style.height = parseInt(input.offsetHeight) - parseInt(computedStyle.paddingTop) - parseInt(computedStyle.paddingBottom) - parseInt(computedStyle.borderTopWidth) - parseInt(computedStyle.borderBottomWidth) + "px", 
	                colorMask.style.lineHeight = colorMask.style.height, colorMask.style.zIndex = isNaN(computedStyle.zIndex) ? -1 : computedStyle.zIndex - 1, 
	                colorMask.style.webkitAppearance = "textfield", colorMask.style.mozAppearance = "textfield", 
	                colorMask.style.Appearance = "textfield";
	            }
	            var offset = $(input).position(), computedStyle = (input.ownerDocument.defaultView || window).getComputedStyle(input, null);
	            input.parentNode;
	            colorMask = document.createElement("div"), document.body.appendChild(colorMask);
	            for (var style in computedStyle) isNaN(style) && "cssText" !== style && style.indexOf("webkit") == -1 && (colorMask.style[style] = computedStyle[style]);
	            input.style.backgroundColor = "transparent", input.style.color = "transparent", 
	            input.style.webkitAppearance = "caret", input.style.mozAppearance = "caret", input.style.Appearance = "caret", 
	            position(), $(window).on("resize", function(e) {
	                offset = $(input).position(), computedStyle = (input.ownerDocument.defaultView || window).getComputedStyle(input, null), 
	                position();
	            }), $(input).on("click", function(e) {
	                return caret(input, findCaretPos(e.clientX)), EventHandlers.clickEvent.call(this, [ e ]);
	            }), $(input).on("keydown", function(e) {
	                e.shiftKey || opts.insertMode === !1 || setTimeout(function() {
	                    renderColorMask(input);
	                }, 0);
	            });
	        }
	        function renderColorMask(input, buffer, caretPos) {
	            function handleStatic() {
	                static || null !== test.fn && void 0 !== testPos.input ? static && null !== test.fn && void 0 !== testPos.input && (static = !1, 
	                maskTemplate += "</span>") : (static = !0, maskTemplate += "<span class='im-static''>");
	            }
	            if (void 0 !== colorMask) {
	                buffer = buffer || getBuffer(), void 0 === caretPos ? caretPos = caret(input) : void 0 === caretPos.begin && (caretPos = {
	                    begin: caretPos,
	                    end: caretPos
	                });
	                var maskTemplate = "", static = !1;
	                if ("" != buffer) {
	                    var ndxIntlzr, test, testPos, pos = 0, lvp = getLastValidPosition();
	                    do pos === caretPos.begin && document.activeElement === input && (maskTemplate += "<span class='im-caret' style='border-right-width: 1px;border-right-style: solid;'></span>"), 
	                    getMaskSet().validPositions[pos] ? (testPos = getMaskSet().validPositions[pos], 
	                    test = testPos.match, ndxIntlzr = testPos.locator.slice(), handleStatic(), maskTemplate += testPos.input) : (testPos = getTestTemplate(pos, ndxIntlzr, pos - 1), 
	                    test = testPos.match, ndxIntlzr = testPos.locator.slice(), (opts.jitMasking === !1 || pos < lvp || "number" == typeof opts.jitMasking && isFinite(opts.jitMasking) && opts.jitMasking > pos) && (handleStatic(), 
	                    maskTemplate += getPlaceholder(pos, test))), pos++; while ((void 0 === maxLength || pos < maxLength) && (null !== test.fn || "" !== test.def) || lvp > pos);
	                }
	                colorMask.innerHTML = maskTemplate;
	            }
	        }
	        function mask(elem) {
	            function isElementTypeSupported(input, opts) {
	                function patchValueProperty(npt) {
	                    function patchValhook(type) {
	                        if ($.valHooks && (void 0 === $.valHooks[type] || $.valHooks[type].inputmaskpatch !== !0)) {
	                            var valhookGet = $.valHooks[type] && $.valHooks[type].get ? $.valHooks[type].get : function(elem) {
	                                return elem.value;
	                            }, valhookSet = $.valHooks[type] && $.valHooks[type].set ? $.valHooks[type].set : function(elem, value) {
	                                return elem.value = value, elem;
	                            };
	                            $.valHooks[type] = {
	                                get: function(elem) {
	                                    if (elem.inputmask) {
	                                        if (elem.inputmask.opts.autoUnmask) return elem.inputmask.unmaskedvalue();
	                                        var result = valhookGet(elem);
	                                        return getLastValidPosition(void 0, void 0, elem.inputmask.maskset.validPositions) !== -1 || opts.nullable !== !0 ? result : "";
	                                    }
	                                    return valhookGet(elem);
	                                },
	                                set: function(elem, value) {
	                                    var result, $elem = $(elem);
	                                    return result = valhookSet(elem, value), elem.inputmask && $elem.trigger("setvalue"), 
	                                    result;
	                                },
	                                inputmaskpatch: !0
	                            };
	                        }
	                    }
	                    function getter() {
	                        return this.inputmask ? this.inputmask.opts.autoUnmask ? this.inputmask.unmaskedvalue() : getLastValidPosition() !== -1 || opts.nullable !== !0 ? document.activeElement === this && opts.clearMaskOnLostFocus ? (isRTL ? clearOptionalTail(getBuffer().slice()).reverse() : clearOptionalTail(getBuffer().slice())).join("") : valueGet.call(this) : "" : valueGet.call(this);
	                    }
	                    function setter(value) {
	                        valueSet.call(this, value), this.inputmask && $(this).trigger("setvalue");
	                    }
	                    function installNativeValueSetFallback(npt) {
	                        EventRuler.on(npt, "mouseenter", function(event) {
	                            var $input = $(this), input = this, value = input.inputmask._valueGet();
	                            value !== getBuffer().join("") && $input.trigger("setvalue");
	                        });
	                    }
	                    var valueGet, valueSet;
	                    if (!npt.inputmask.__valueGet) {
	                        if (opts.noValuePatching !== !0) {
	                            if (Object.getOwnPropertyDescriptor) {
	                                "function" != typeof Object.getPrototypeOf && (Object.getPrototypeOf = "object" == typeof "test".__proto__ ? function(object) {
	                                    return object.__proto__;
	                                } : function(object) {
	                                    return object.constructor.prototype;
	                                });
	                                var valueProperty = Object.getPrototypeOf ? Object.getOwnPropertyDescriptor(Object.getPrototypeOf(npt), "value") : void 0;
	                                valueProperty && valueProperty.get && valueProperty.set ? (valueGet = valueProperty.get, 
	                                valueSet = valueProperty.set, Object.defineProperty(npt, "value", {
	                                    get: getter,
	                                    set: setter,
	                                    configurable: !0
	                                })) : "INPUT" !== npt.tagName && (valueGet = function() {
	                                    return this.textContent;
	                                }, valueSet = function(value) {
	                                    this.textContent = value;
	                                }, Object.defineProperty(npt, "value", {
	                                    get: getter,
	                                    set: setter,
	                                    configurable: !0
	                                }));
	                            } else document.__lookupGetter__ && npt.__lookupGetter__("value") && (valueGet = npt.__lookupGetter__("value"), 
	                            valueSet = npt.__lookupSetter__("value"), npt.__defineGetter__("value", getter), 
	                            npt.__defineSetter__("value", setter));
	                            npt.inputmask.__valueGet = valueGet, npt.inputmask.__valueSet = valueSet;
	                        }
	                        npt.inputmask._valueGet = function(overruleRTL) {
	                            return isRTL && overruleRTL !== !0 ? valueGet.call(this.el).split("").reverse().join("") : valueGet.call(this.el);
	                        }, npt.inputmask._valueSet = function(value, overruleRTL) {
	                            valueSet.call(this.el, null === value || void 0 === value ? "" : overruleRTL !== !0 && isRTL ? value.split("").reverse().join("") : value);
	                        }, void 0 === valueGet && (valueGet = function() {
	                            return this.value;
	                        }, valueSet = function(value) {
	                            this.value = value;
	                        }, patchValhook(npt.type), installNativeValueSetFallback(npt));
	                    }
	                }
	                var elementType = input.getAttribute("type"), isSupported = "INPUT" === input.tagName && $.inArray(elementType, opts.supportsInputType) !== -1 || input.isContentEditable || "TEXTAREA" === input.tagName;
	                if (!isSupported) if ("INPUT" === input.tagName) {
	                    var el = document.createElement("input");
	                    el.setAttribute("type", elementType), isSupported = "text" === el.type, el = null;
	                } else isSupported = "partial";
	                return isSupported !== !1 && patchValueProperty(input), isSupported;
	            }
	            var isSupported = isElementTypeSupported(elem, opts);
	            if (isSupported !== !1 && (el = elem, $el = $(el), ("rtl" === el.dir || opts.rightAlign) && (el.style.textAlign = "right"), 
	            ("rtl" === el.dir || opts.numericInput) && (el.dir = "ltr", el.removeAttribute("dir"), 
	            el.inputmask.isRTL = !0, isRTL = !0), opts.colorMask === !0 && initializeColorMask(el), 
	            android && (el.hasOwnProperty("inputmode") && (el.inputmode = opts.inputmode, el.setAttribute("inputmode", opts.inputmode)), 
	            "rtfm" === opts.androidHack && (opts.colorMask !== !0 && initializeColorMask(el), 
	            el.type = "password")), EventRuler.off(el), isSupported === !0 && (EventRuler.on(el, "submit", EventHandlers.submitEvent), 
	            EventRuler.on(el, "reset", EventHandlers.resetEvent), EventRuler.on(el, "mouseenter", EventHandlers.mouseenterEvent), 
	            EventRuler.on(el, "blur", EventHandlers.blurEvent), EventRuler.on(el, "focus", EventHandlers.focusEvent), 
	            EventRuler.on(el, "mouseleave", EventHandlers.mouseleaveEvent), opts.colorMask !== !0 && EventRuler.on(el, "click", EventHandlers.clickEvent), 
	            EventRuler.on(el, "dblclick", EventHandlers.dblclickEvent), EventRuler.on(el, "paste", EventHandlers.pasteEvent), 
	            EventRuler.on(el, "dragdrop", EventHandlers.pasteEvent), EventRuler.on(el, "drop", EventHandlers.pasteEvent), 
	            EventRuler.on(el, "cut", EventHandlers.cutEvent), EventRuler.on(el, "complete", opts.oncomplete), 
	            EventRuler.on(el, "incomplete", opts.onincomplete), EventRuler.on(el, "cleared", opts.oncleared), 
	            opts.inputEventOnly !== !0 && (EventRuler.on(el, "keydown", EventHandlers.keydownEvent), 
	            EventRuler.on(el, "keypress", EventHandlers.keypressEvent)), EventRuler.on(el, "compositionstart", $.noop), 
	            EventRuler.on(el, "compositionupdate", $.noop), EventRuler.on(el, "compositionend", $.noop), 
	            EventRuler.on(el, "keyup", $.noop), EventRuler.on(el, "input", EventHandlers.inputFallBackEvent)), 
	            EventRuler.on(el, "setvalue", EventHandlers.setValueEvent), getBufferTemplate(), 
	            "" !== el.inputmask._valueGet() || opts.clearMaskOnLostFocus === !1 || document.activeElement === el)) {
	                var initialValue = $.isFunction(opts.onBeforeMask) ? opts.onBeforeMask(el.inputmask._valueGet(), opts) || el.inputmask._valueGet() : el.inputmask._valueGet();
	                checkVal(el, !0, !1, initialValue.split(""));
	                var buffer = getBuffer().slice();
	                undoValue = buffer.join(""), isComplete(buffer) === !1 && opts.clearIncomplete && resetMaskSet(), 
	                opts.clearMaskOnLostFocus && document.activeElement !== el && (getLastValidPosition() === -1 ? buffer = [] : clearOptionalTail(buffer)), 
	                writeBuffer(el, buffer), document.activeElement === el && caret(el, seekNext(getLastValidPosition()));
	            }
	        }
	        maskset = maskset || this.maskset, opts = opts || this.opts;
	        var undoValue, $el, maxLength, colorMask, valueBuffer, el = this.el, isRTL = this.isRTL, skipKeyPressEvent = !1, skipInputEvent = !1, ignorable = !1, mouseEnter = !1, EventRuler = {
	            on: function(input, eventName, eventHandler) {
	                var ev = function(e) {
	                    if (void 0 === this.inputmask && "FORM" !== this.nodeName) {
	                        var imOpts = $.data(this, "_inputmask_opts");
	                        imOpts ? new Inputmask(imOpts).mask(this) : EventRuler.off(this);
	                    } else {
	                        if ("setvalue" === e.type || !(this.disabled || this.readOnly && !("keydown" === e.type && e.ctrlKey && 67 === e.keyCode || opts.tabThrough === !1 && e.keyCode === Inputmask.keyCode.TAB))) {
	                            switch (e.type) {
	                              case "input":
	                                if (skipInputEvent === !0) return skipInputEvent = !1, e.preventDefault();
	                                break;

	                              case "keydown":
	                                skipKeyPressEvent = !1, skipInputEvent = !1;
	                                break;

	                              case "keypress":
	                                if (skipKeyPressEvent === !0) return e.preventDefault();
	                                skipKeyPressEvent = !0;
	                                break;

	                              case "click":
	                                if (iemobile || iphone) {
	                                    var that = this, args = arguments;
	                                    return setTimeout(function() {
	                                        eventHandler.apply(that, args);
	                                    }, 0), !1;
	                                }
	                            }
	                            var returnVal = eventHandler.apply(this, arguments);
	                            return returnVal === !1 && (e.preventDefault(), e.stopPropagation()), returnVal;
	                        }
	                        e.preventDefault();
	                    }
	                };
	                input.inputmask.events[eventName] = input.inputmask.events[eventName] || [], input.inputmask.events[eventName].push(ev), 
	                $.inArray(eventName, [ "submit", "reset" ]) !== -1 ? null != input.form && $(input.form).on(eventName, ev) : $(input).on(eventName, ev);
	            },
	            off: function(input, event) {
	                if (input.inputmask && input.inputmask.events) {
	                    var events;
	                    event ? (events = [], events[event] = input.inputmask.events[event]) : events = input.inputmask.events, 
	                    $.each(events, function(eventName, evArr) {
	                        for (;evArr.length > 0; ) {
	                            var ev = evArr.pop();
	                            $.inArray(eventName, [ "submit", "reset" ]) !== -1 ? null != input.form && $(input.form).off(eventName, ev) : $(input).off(eventName, ev);
	                        }
	                        delete input.inputmask.events[eventName];
	                    });
	                }
	            }
	        }, EventHandlers = {
	            keydownEvent: function(e) {
	                function isInputEventSupported(eventName) {
	                    var el = document.createElement("input"), evName = "on" + eventName, isSupported = evName in el;
	                    return isSupported || (el.setAttribute(evName, "return;"), isSupported = "function" == typeof el[evName]), 
	                    el = null, isSupported;
	                }
	                var input = this, $input = $(input), k = e.keyCode, pos = caret(input);
	                if (k === Inputmask.keyCode.BACKSPACE || k === Inputmask.keyCode.DELETE || iphone && k === Inputmask.keyCode.BACKSPACE_SAFARI || e.ctrlKey && k === Inputmask.keyCode.X && !isInputEventSupported("cut")) e.preventDefault(), 
	                handleRemove(input, k, pos), writeBuffer(input, getBuffer(!0), getMaskSet().p, e, input.inputmask._valueGet() !== getBuffer().join("")), 
	                input.inputmask._valueGet() === getBufferTemplate().join("") ? $input.trigger("cleared") : isComplete(getBuffer()) === !0 && $input.trigger("complete"); else if (k === Inputmask.keyCode.END || k === Inputmask.keyCode.PAGE_DOWN) {
	                    e.preventDefault();
	                    var caretPos = seekNext(getLastValidPosition());
	                    opts.insertMode || caretPos !== getMaskSet().maskLength || e.shiftKey || caretPos--, 
	                    caret(input, e.shiftKey ? pos.begin : caretPos, caretPos, !0);
	                } else k === Inputmask.keyCode.HOME && !e.shiftKey || k === Inputmask.keyCode.PAGE_UP ? (e.preventDefault(), 
	                caret(input, 0, e.shiftKey ? pos.begin : 0, !0)) : (opts.undoOnEscape && k === Inputmask.keyCode.ESCAPE || 90 === k && e.ctrlKey) && e.altKey !== !0 ? (checkVal(input, !0, !1, undoValue.split("")), 
	                $input.trigger("click")) : k !== Inputmask.keyCode.INSERT || e.shiftKey || e.ctrlKey ? opts.tabThrough === !0 && k === Inputmask.keyCode.TAB ? (e.shiftKey === !0 ? (null === getTest(pos.begin).match.fn && (pos.begin = seekNext(pos.begin)), 
	                pos.end = seekPrevious(pos.begin, !0), pos.begin = seekPrevious(pos.end, !0)) : (pos.begin = seekNext(pos.begin, !0), 
	                pos.end = seekNext(pos.begin, !0), pos.end < getMaskSet().maskLength && pos.end--), 
	                pos.begin < getMaskSet().maskLength && (e.preventDefault(), caret(input, pos.begin, pos.end))) : e.shiftKey || opts.insertMode === !1 && (k === Inputmask.keyCode.RIGHT ? setTimeout(function() {
	                    var caretPos = caret(input);
	                    caret(input, caretPos.begin);
	                }, 0) : k === Inputmask.keyCode.LEFT && setTimeout(function() {
	                    var caretPos = caret(input);
	                    caret(input, isRTL ? caretPos.begin + 1 : caretPos.begin - 1);
	                }, 0)) : (opts.insertMode = !opts.insertMode, caret(input, opts.insertMode || pos.begin !== getMaskSet().maskLength ? pos.begin : pos.begin - 1));
	                opts.onKeyDown.call(this, e, getBuffer(), caret(input).begin, opts), ignorable = $.inArray(k, opts.ignorables) !== -1;
	            },
	            keypressEvent: function(e, checkval, writeOut, strict, ndx) {
	                var input = this, $input = $(input), k = e.which || e.charCode || e.keyCode;
	                if (!(checkval === !0 || e.ctrlKey && e.altKey) && (e.ctrlKey || e.metaKey || ignorable)) return k === Inputmask.keyCode.ENTER && undoValue !== getBuffer().join("") && (undoValue = getBuffer().join(""), 
	                setTimeout(function() {
	                    $input.trigger("change");
	                }, 0)), !0;
	                if (k) {
	                    46 === k && e.shiftKey === !1 && "," === opts.radixPoint && (k = 44);
	                    var forwardPosition, pos = checkval ? {
	                        begin: ndx,
	                        end: ndx
	                    } : caret(input), c = String.fromCharCode(k);
	                    getMaskSet().writeOutBuffer = !0;
	                    var valResult = isValid(pos, c, strict);
	                    if (valResult !== !1 && (resetMaskSet(!0), forwardPosition = void 0 !== valResult.caret ? valResult.caret : checkval ? valResult.pos + 1 : seekNext(valResult.pos), 
	                    getMaskSet().p = forwardPosition), writeOut !== !1) {
	                        var self = this;
	                        if (setTimeout(function() {
	                            opts.onKeyValidation.call(self, k, valResult, opts);
	                        }, 0), getMaskSet().writeOutBuffer && valResult !== !1) {
	                            var buffer = getBuffer();
	                            writeBuffer(input, buffer, opts.numericInput && void 0 === valResult.caret ? seekPrevious(forwardPosition) : forwardPosition, e, checkval !== !0), 
	                            checkval !== !0 && setTimeout(function() {
	                                isComplete(buffer) === !0 && $input.trigger("complete");
	                            }, 0);
	                        }
	                    }
	                    if (e.preventDefault(), checkval) return valResult.forwardPosition = forwardPosition, 
	                    valResult;
	                }
	            },
	            pasteEvent: function(e) {
	                var tempValue, input = this, ev = e.originalEvent || e, $input = $(input), inputValue = input.inputmask._valueGet(!0), caretPos = caret(input);
	                isRTL && (tempValue = caretPos.end, caretPos.end = caretPos.begin, caretPos.begin = tempValue);
	                var valueBeforeCaret = inputValue.substr(0, caretPos.begin), valueAfterCaret = inputValue.substr(caretPos.end, inputValue.length);
	                if (valueBeforeCaret === (isRTL ? getBufferTemplate().reverse() : getBufferTemplate()).slice(0, caretPos.begin).join("") && (valueBeforeCaret = ""), 
	                valueAfterCaret === (isRTL ? getBufferTemplate().reverse() : getBufferTemplate()).slice(caretPos.end).join("") && (valueAfterCaret = ""), 
	                isRTL && (tempValue = valueBeforeCaret, valueBeforeCaret = valueAfterCaret, valueAfterCaret = tempValue), 
	                window.clipboardData && window.clipboardData.getData) inputValue = valueBeforeCaret + window.clipboardData.getData("Text") + valueAfterCaret; else {
	                    if (!ev.clipboardData || !ev.clipboardData.getData) return !0;
	                    inputValue = valueBeforeCaret + ev.clipboardData.getData("text/plain") + valueAfterCaret;
	                }
	                var pasteValue = inputValue;
	                if ($.isFunction(opts.onBeforePaste)) {
	                    if (pasteValue = opts.onBeforePaste(inputValue, opts), pasteValue === !1) return e.preventDefault();
	                    pasteValue || (pasteValue = inputValue);
	                }
	                return checkVal(input, !1, !1, isRTL ? pasteValue.split("").reverse() : pasteValue.toString().split("")), 
	                writeBuffer(input, getBuffer(), seekNext(getLastValidPosition()), e, undoValue !== getBuffer().join("")), 
	                isComplete(getBuffer()) === !0 && $input.trigger("complete"), e.preventDefault();
	            },
	            inputFallBackEvent: function(e) {
	                var input = this, inputValue = input.inputmask._valueGet();
	                if (getBuffer().join("") !== inputValue) {
	                    var caretPos = caret(input);
	                    if (inputValue = inputValue.replace(new RegExp("(" + Inputmask.escapeRegex(getBufferTemplate().join("")) + ")*"), ""), 
	                    iemobile) {
	                        var inputChar = inputValue.replace(getBuffer().join(""), "");
	                        if (1 === inputChar.length) {
	                            var keypress = new $.Event("keypress");
	                            return keypress.which = inputChar.charCodeAt(0), EventHandlers.keypressEvent.call(input, keypress, !0, !0, !1, getMaskSet().validPositions[caretPos.begin - 1] ? caretPos.begin : caretPos.begin - 1), 
	                            !1;
	                        }
	                    }
	                    if (caretPos.begin > inputValue.length && (caret(input, inputValue.length), caretPos = caret(input)), 
	                    getBuffer().length - inputValue.length !== 1 || inputValue.charAt(caretPos.begin) === getBuffer()[caretPos.begin] || inputValue.charAt(caretPos.begin + 1) === getBuffer()[caretPos.begin] || isMask(caretPos.begin)) {
	                        for (var lvp = getLastValidPosition() + 1, bufferTemplate = getBufferTemplate().join(""); null === inputValue.match(Inputmask.escapeRegex(bufferTemplate) + "$"); ) bufferTemplate = bufferTemplate.slice(1);
	                        inputValue = inputValue.replace(bufferTemplate, ""), inputValue = inputValue.split(""), 
	                        checkVal(input, !0, !1, inputValue, e, caretPos.begin < lvp), isComplete(getBuffer()) === !0 && $(input).trigger("complete");
	                    } else e.keyCode = Inputmask.keyCode.BACKSPACE, EventHandlers.keydownEvent.call(input, e);
	                    e.preventDefault();
	                }
	            },
	            setValueEvent: function(e) {
	                var input = this, value = input.inputmask._valueGet();
	                checkVal(input, !0, !1, ($.isFunction(opts.onBeforeMask) ? opts.onBeforeMask(value, opts) || value : value).split("")), 
	                undoValue = getBuffer().join(""), (opts.clearMaskOnLostFocus || opts.clearIncomplete) && input.inputmask._valueGet() === getBufferTemplate().join("") && input.inputmask._valueSet("");
	            },
	            focusEvent: function(e) {
	                var input = this, nptValue = input.inputmask._valueGet();
	                opts.showMaskOnFocus && (!opts.showMaskOnHover || opts.showMaskOnHover && "" === nptValue) && (input.inputmask._valueGet() !== getBuffer().join("") ? writeBuffer(input, getBuffer(), seekNext(getLastValidPosition())) : mouseEnter === !1 && caret(input, seekNext(getLastValidPosition()))), 
	                opts.positionCaretOnTab === !0 && EventHandlers.clickEvent.apply(input, [ e, !0 ]), 
	                undoValue = getBuffer().join("");
	            },
	            mouseleaveEvent: function(e) {
	                var input = this;
	                if (mouseEnter = !1, opts.clearMaskOnLostFocus && document.activeElement !== input) {
	                    var buffer = getBuffer().slice(), nptValue = input.inputmask._valueGet();
	                    nptValue !== input.getAttribute("placeholder") && "" !== nptValue && (getLastValidPosition() === -1 && nptValue === getBufferTemplate().join("") ? buffer = [] : clearOptionalTail(buffer), 
	                    writeBuffer(input, buffer));
	                }
	            },
	            clickEvent: function(e, tabbed) {
	                function doRadixFocus(clickPos) {
	                    if ("" !== opts.radixPoint) {
	                        var vps = getMaskSet().validPositions;
	                        if (void 0 === vps[clickPos] || vps[clickPos].input === getPlaceholder(clickPos)) {
	                            if (clickPos < seekNext(-1)) return !0;
	                            var radixPos = $.inArray(opts.radixPoint, getBuffer());
	                            if (radixPos !== -1) {
	                                for (var vp in vps) if (radixPos < vp && vps[vp].input !== getPlaceholder(vp)) return !1;
	                                return !0;
	                            }
	                        }
	                    }
	                    return !1;
	                }
	                var input = this;
	                setTimeout(function() {
	                    if (document.activeElement === input) {
	                        var selectedCaret = caret(input);
	                        if (tabbed && (selectedCaret.begin = selectedCaret.end), selectedCaret.begin === selectedCaret.end) switch (opts.positionCaretOnClick) {
	                          case "none":
	                            break;

	                          case "radixFocus":
	                            if (doRadixFocus(selectedCaret.begin)) {
	                                var radixPos = $.inArray(opts.radixPoint, getBuffer().join(""));
	                                caret(input, opts.numericInput ? seekNext(radixPos) : radixPos);
	                                break;
	                            }

	                          default:
	                            var clickPosition = selectedCaret.begin, lvclickPosition = getLastValidPosition(clickPosition, !0), lastPosition = seekNext(lvclickPosition);
	                            if (clickPosition < lastPosition) caret(input, isMask(clickPosition) || isMask(clickPosition - 1) ? clickPosition : seekNext(clickPosition)); else {
	                                var placeholder = getPlaceholder(lastPosition);
	                                ("" !== placeholder && getBuffer()[lastPosition] !== placeholder && getTest(lastPosition).match.optionalQuantifier !== !0 || !isMask(lastPosition) && getTest(lastPosition).match.def === placeholder) && (lastPosition = seekNext(lastPosition)), 
	                                caret(input, lastPosition);
	                            }
	                        }
	                    }
	                }, 0);
	            },
	            dblclickEvent: function(e) {
	                var input = this;
	                setTimeout(function() {
	                    caret(input, 0, seekNext(getLastValidPosition()));
	                }, 0);
	            },
	            cutEvent: function(e) {
	                var input = this, $input = $(input), pos = caret(input), ev = e.originalEvent || e, clipboardData = window.clipboardData || ev.clipboardData, clipData = isRTL ? getBuffer().slice(pos.end, pos.begin) : getBuffer().slice(pos.begin, pos.end);
	                clipboardData.setData("text", isRTL ? clipData.reverse().join("") : clipData.join("")), 
	                document.execCommand && document.execCommand("copy"), handleRemove(input, Inputmask.keyCode.DELETE, pos), 
	                writeBuffer(input, getBuffer(), getMaskSet().p, e, undoValue !== getBuffer().join("")), 
	                input.inputmask._valueGet() === getBufferTemplate().join("") && $input.trigger("cleared");
	            },
	            blurEvent: function(e) {
	                var $input = $(this), input = this;
	                if (input.inputmask) {
	                    var nptValue = input.inputmask._valueGet(), buffer = getBuffer().slice();
	                    undoValue !== buffer.join("") && setTimeout(function() {
	                        $input.trigger("change"), undoValue = buffer.join("");
	                    }, 0), "" !== nptValue && (opts.clearMaskOnLostFocus && (getLastValidPosition() === -1 && nptValue === getBufferTemplate().join("") ? buffer = [] : clearOptionalTail(buffer)), 
	                    isComplete(buffer) === !1 && (setTimeout(function() {
	                        $input.trigger("incomplete");
	                    }, 0), opts.clearIncomplete && (resetMaskSet(), buffer = opts.clearMaskOnLostFocus ? [] : getBufferTemplate().slice())), 
	                    writeBuffer(input, buffer, void 0, e));
	                }
	            },
	            mouseenterEvent: function(e) {
	                var input = this;
	                mouseEnter = !0, document.activeElement !== input && opts.showMaskOnHover && input.inputmask._valueGet() !== getBuffer().join("") && writeBuffer(input, getBuffer());
	            },
	            submitEvent: function(e) {
	                undoValue !== getBuffer().join("") && $el.trigger("change"), opts.clearMaskOnLostFocus && getLastValidPosition() === -1 && el.inputmask._valueGet && el.inputmask._valueGet() === getBufferTemplate().join("") && el.inputmask._valueSet(""), 
	                opts.removeMaskOnSubmit && (el.inputmask._valueSet(el.inputmask.unmaskedvalue(), !0), 
	                setTimeout(function() {
	                    writeBuffer(el, getBuffer());
	                }, 0));
	            },
	            resetEvent: function(e) {
	                setTimeout(function() {
	                    $el.trigger("setvalue");
	                }, 0);
	            }
	        };
	        if (void 0 !== actionObj) switch (actionObj.action) {
	          case "isComplete":
	            return el = actionObj.el, isComplete(getBuffer());

	          case "unmaskedvalue":
	            return void 0 !== el && void 0 === actionObj.value || (valueBuffer = actionObj.value, 
	            valueBuffer = ($.isFunction(opts.onBeforeMask) ? opts.onBeforeMask(valueBuffer, opts) || valueBuffer : valueBuffer).split(""), 
	            checkVal(void 0, !1, !1, isRTL ? valueBuffer.reverse() : valueBuffer), $.isFunction(opts.onBeforeWrite) && opts.onBeforeWrite(void 0, getBuffer(), 0, opts)), 
	            unmaskedvalue(el);

	          case "mask":
	            mask(el);
	            break;

	          case "format":
	            return valueBuffer = ($.isFunction(opts.onBeforeMask) ? opts.onBeforeMask(actionObj.value, opts) || actionObj.value : actionObj.value).split(""), 
	            checkVal(void 0, !1, !1, isRTL ? valueBuffer.reverse() : valueBuffer), $.isFunction(opts.onBeforeWrite) && opts.onBeforeWrite(void 0, getBuffer(), 0, opts), 
	            actionObj.metadata ? {
	                value: isRTL ? getBuffer().slice().reverse().join("") : getBuffer().join(""),
	                metadata: maskScope.call(this, {
	                    action: "getmetadata"
	                }, maskset, opts)
	            } : isRTL ? getBuffer().slice().reverse().join("") : getBuffer().join("");

	          case "isValid":
	            actionObj.value ? (valueBuffer = actionObj.value.split(""), checkVal(void 0, !1, !0, isRTL ? valueBuffer.reverse() : valueBuffer)) : actionObj.value = getBuffer().join("");
	            for (var buffer = getBuffer(), rl = determineLastRequiredPosition(), lmib = buffer.length - 1; lmib > rl && !isMask(lmib); lmib--) ;
	            return buffer.splice(rl, lmib + 1 - rl), isComplete(buffer) && actionObj.value === getBuffer().join("");

	          case "getemptymask":
	            return getBufferTemplate().join("");

	          case "remove":
	            if (el) {
	                $el = $(el), el.inputmask._valueSet(unmaskedvalue(el)), EventRuler.off(el);
	                var valueProperty;
	                Object.getOwnPropertyDescriptor && Object.getPrototypeOf ? (valueProperty = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), "value"), 
	                valueProperty && el.inputmask.__valueGet && Object.defineProperty(el, "value", {
	                    get: el.inputmask.__valueGet,
	                    set: el.inputmask.__valueSet,
	                    configurable: !0
	                })) : document.__lookupGetter__ && el.__lookupGetter__("value") && el.inputmask.__valueGet && (el.__defineGetter__("value", el.inputmask.__valueGet), 
	                el.__defineSetter__("value", el.inputmask.__valueSet)), el.inputmask = void 0;
	            }
	            return el;

	          case "getmetadata":
	            if ($.isArray(maskset.metadata)) {
	                var maskTarget = getMaskTemplate(!0, 0, !1).join("");
	                return $.each(maskset.metadata, function(ndx, mtdt) {
	                    if (mtdt.mask === maskTarget) return maskTarget = mtdt, !1;
	                }), maskTarget;
	            }
	            return maskset.metadata;
	        }
	    }
	    var ua = navigator.userAgent, mobile = /mobile/i.test(ua), iemobile = /iemobile/i.test(ua), iphone = /iphone/i.test(ua) && !iemobile, android = /android/i.test(ua) && !iemobile;
	    return Inputmask.prototype = {
	        defaults: {
	            placeholder: "_",
	            optionalmarker: {
	                start: "[",
	                end: "]"
	            },
	            quantifiermarker: {
	                start: "{",
	                end: "}"
	            },
	            groupmarker: {
	                start: "(",
	                end: ")"
	            },
	            alternatormarker: "|",
	            escapeChar: "\\",
	            mask: null,
	            oncomplete: $.noop,
	            onincomplete: $.noop,
	            oncleared: $.noop,
	            repeat: 0,
	            greedy: !0,
	            autoUnmask: !1,
	            removeMaskOnSubmit: !1,
	            clearMaskOnLostFocus: !0,
	            insertMode: !0,
	            clearIncomplete: !1,
	            aliases: {},
	            alias: null,
	            onKeyDown: $.noop,
	            onBeforeMask: null,
	            onBeforePaste: function(pastedValue, opts) {
	                return $.isFunction(opts.onBeforeMask) ? opts.onBeforeMask(pastedValue, opts) : pastedValue;
	            },
	            onBeforeWrite: null,
	            onUnMask: null,
	            showMaskOnFocus: !0,
	            showMaskOnHover: !0,
	            onKeyValidation: $.noop,
	            skipOptionalPartCharacter: " ",
	            numericInput: !1,
	            rightAlign: !1,
	            undoOnEscape: !0,
	            radixPoint: "",
	            radixPointDefinitionSymbol: void 0,
	            groupSeparator: "",
	            keepStatic: null,
	            positionCaretOnTab: !0,
	            tabThrough: !1,
	            supportsInputType: [ "text", "tel", "password" ],
	            definitions: {
	                "9": {
	                    validator: "[0-9]",
	                    cardinality: 1,
	                    definitionSymbol: "*"
	                },
	                a: {
	                    validator: "[A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]",
	                    cardinality: 1,
	                    definitionSymbol: "*"
	                },
	                "*": {
	                    validator: "[0-9A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]",
	                    cardinality: 1
	                }
	            },
	            ignorables: [ 8, 9, 13, 19, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 93, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123 ],
	            isComplete: null,
	            canClearPosition: $.noop,
	            postValidation: null,
	            staticDefinitionSymbol: void 0,
	            jitMasking: !1,
	            nullable: !0,
	            inputEventOnly: !1,
	            noValuePatching: !1,
	            positionCaretOnClick: "lvp",
	            casing: null,
	            inputmode: "verbatim",
	            colorMask: !1,
	            androidHack: !1
	        },
	        masksCache: {},
	        mask: function(elems) {
	            function importAttributeOptions(npt, opts, userOptions, dataAttribute) {
	                function importOption(option, optionData) {
	                    optionData = void 0 !== optionData ? optionData : npt.getAttribute(dataAttribute + "-" + option), 
	                    null !== optionData && ("string" == typeof optionData && (0 === option.indexOf("on") ? optionData = window[optionData] : "false" === optionData ? optionData = !1 : "true" === optionData && (optionData = !0)), 
	                    userOptions[option] = optionData);
	                }
	                var option, dataoptions, optionData, p, attrOptions = npt.getAttribute(dataAttribute);
	                if (attrOptions && "" !== attrOptions && (attrOptions = attrOptions.replace(new RegExp("'", "g"), '"'), 
	                dataoptions = JSON.parse("{" + attrOptions + "}")), dataoptions) {
	                    optionData = void 0;
	                    for (p in dataoptions) if ("alias" === p.toLowerCase()) {
	                        optionData = dataoptions[p];
	                        break;
	                    }
	                }
	                importOption("alias", optionData), userOptions.alias && resolveAlias(userOptions.alias, userOptions, opts);
	                for (option in opts) {
	                    if (dataoptions) {
	                        optionData = void 0;
	                        for (p in dataoptions) if (p.toLowerCase() === option.toLowerCase()) {
	                            optionData = dataoptions[p];
	                            break;
	                        }
	                    }
	                    importOption(option, optionData);
	                }
	                return $.extend(!0, opts, userOptions), opts;
	            }
	            var that = this;
	            return "string" == typeof elems && (elems = document.getElementById(elems) || document.querySelectorAll(elems)), 
	            elems = elems.nodeName ? [ elems ] : elems, $.each(elems, function(ndx, el) {
	                var scopedOpts = $.extend(!0, {}, that.opts);
	                importAttributeOptions(el, scopedOpts, $.extend(!0, {}, that.userOptions), that.dataAttribute);
	                var maskset = generateMaskSet(scopedOpts, that.noMasksCache);
	                void 0 !== maskset && (void 0 !== el.inputmask && el.inputmask.remove(), el.inputmask = new Inputmask(), 
	                el.inputmask.opts = scopedOpts, el.inputmask.noMasksCache = that.noMasksCache, el.inputmask.userOptions = $.extend(!0, {}, that.userOptions), 
	                el.inputmask.el = el, el.inputmask.maskset = maskset, $.data(el, "_inputmask_opts", scopedOpts), 
	                maskScope.call(el.inputmask, {
	                    action: "mask"
	                }));
	            }), elems && elems[0] ? elems[0].inputmask || this : this;
	        },
	        option: function(options, noremask) {
	            return "string" == typeof options ? this.opts[options] : "object" == typeof options ? ($.extend(this.userOptions, options), 
	            this.el && noremask !== !0 && this.mask(this.el), this) : void 0;
	        },
	        unmaskedvalue: function(value) {
	            return this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache), 
	            maskScope.call(this, {
	                action: "unmaskedvalue",
	                value: value
	            });
	        },
	        remove: function() {
	            return maskScope.call(this, {
	                action: "remove"
	            });
	        },
	        getemptymask: function() {
	            return this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache), 
	            maskScope.call(this, {
	                action: "getemptymask"
	            });
	        },
	        hasMaskedValue: function() {
	            return !this.opts.autoUnmask;
	        },
	        isComplete: function() {
	            return this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache), 
	            maskScope.call(this, {
	                action: "isComplete"
	            });
	        },
	        getmetadata: function() {
	            return this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache), 
	            maskScope.call(this, {
	                action: "getmetadata"
	            });
	        },
	        isValid: function(value) {
	            return this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache), 
	            maskScope.call(this, {
	                action: "isValid",
	                value: value
	            });
	        },
	        format: function(value, metadata) {
	            return this.maskset = this.maskset || generateMaskSet(this.opts, this.noMasksCache), 
	            maskScope.call(this, {
	                action: "format",
	                value: value,
	                metadata: metadata
	            });
	        },
	        analyseMask: function(mask, opts) {
	            function MaskToken(isGroup, isOptional, isQuantifier, isAlternator) {
	                this.matches = [], this.openGroup = isGroup || !1, this.isGroup = isGroup || !1, 
	                this.isOptional = isOptional || !1, this.isQuantifier = isQuantifier || !1, this.isAlternator = isAlternator || !1, 
	                this.quantifier = {
	                    min: 1,
	                    max: 1
	                };
	            }
	            function insertTestDefinition(mtoken, element, position) {
	                var maskdef = opts.definitions[element];
	                position = void 0 !== position ? position : mtoken.matches.length;
	                var prevMatch = mtoken.matches[position - 1];
	                if (maskdef && !escaped) {
	                    maskdef.placeholder = $.isFunction(maskdef.placeholder) ? maskdef.placeholder(opts) : maskdef.placeholder;
	                    for (var prevalidators = maskdef.prevalidator, prevalidatorsL = prevalidators ? prevalidators.length : 0, i = 1; i < maskdef.cardinality; i++) {
	                        var prevalidator = prevalidatorsL >= i ? prevalidators[i - 1] : [], validator = prevalidator.validator, cardinality = prevalidator.cardinality;
	                        mtoken.matches.splice(position++, 0, {
	                            fn: validator ? "string" == typeof validator ? new RegExp(validator) : new function() {
	                                this.test = validator;
	                            }() : new RegExp("."),
	                            cardinality: cardinality ? cardinality : 1,
	                            optionality: mtoken.isOptional,
	                            newBlockMarker: void 0 === prevMatch || prevMatch.def !== (maskdef.definitionSymbol || element),
	                            casing: maskdef.casing,
	                            def: maskdef.definitionSymbol || element,
	                            placeholder: maskdef.placeholder,
	                            nativeDef: element
	                        }), prevMatch = mtoken.matches[position - 1];
	                    }
	                    mtoken.matches.splice(position++, 0, {
	                        fn: maskdef.validator ? "string" == typeof maskdef.validator ? new RegExp(maskdef.validator) : new function() {
	                            this.test = maskdef.validator;
	                        }() : new RegExp("."),
	                        cardinality: maskdef.cardinality,
	                        optionality: mtoken.isOptional,
	                        newBlockMarker: void 0 === prevMatch || prevMatch.def !== (maskdef.definitionSymbol || element),
	                        casing: maskdef.casing,
	                        def: maskdef.definitionSymbol || element,
	                        placeholder: maskdef.placeholder,
	                        nativeDef: element
	                    });
	                } else mtoken.matches.splice(position++, 0, {
	                    fn: null,
	                    cardinality: 0,
	                    optionality: mtoken.isOptional,
	                    newBlockMarker: void 0 === prevMatch || prevMatch.def !== element,
	                    casing: null,
	                    def: opts.staticDefinitionSymbol || element,
	                    placeholder: void 0 !== opts.staticDefinitionSymbol ? element : void 0,
	                    nativeDef: element
	                }), escaped = !1;
	            }
	            function verifyGroupMarker(maskToken) {
	                maskToken && maskToken.matches && $.each(maskToken.matches, function(ndx, token) {
	                    var nextToken = maskToken.matches[ndx + 1];
	                    (void 0 === nextToken || void 0 === nextToken.matches || nextToken.isQuantifier === !1) && token && token.isGroup && (token.isGroup = !1, 
	                    insertTestDefinition(token, opts.groupmarker.start, 0), token.openGroup !== !0 && insertTestDefinition(token, opts.groupmarker.end)), 
	                    verifyGroupMarker(token);
	                });
	            }
	            function defaultCase() {
	                if (openenings.length > 0) {
	                    if (currentOpeningToken = openenings[openenings.length - 1], insertTestDefinition(currentOpeningToken, m), 
	                    currentOpeningToken.isAlternator) {
	                        alternator = openenings.pop();
	                        for (var mndx = 0; mndx < alternator.matches.length; mndx++) alternator.matches[mndx].isGroup = !1;
	                        openenings.length > 0 ? (currentOpeningToken = openenings[openenings.length - 1], 
	                        currentOpeningToken.matches.push(alternator)) : currentToken.matches.push(alternator);
	                    }
	                } else insertTestDefinition(currentToken, m);
	            }
	            function reverseTokens(maskToken) {
	                function reverseStatic(st) {
	                    return st === opts.optionalmarker.start ? st = opts.optionalmarker.end : st === opts.optionalmarker.end ? st = opts.optionalmarker.start : st === opts.groupmarker.start ? st = opts.groupmarker.end : st === opts.groupmarker.end && (st = opts.groupmarker.start), 
	                    st;
	                }
	                maskToken.matches = maskToken.matches.reverse();
	                for (var match in maskToken.matches) {
	                    var intMatch = parseInt(match);
	                    if (maskToken.matches[match].isQuantifier && maskToken.matches[intMatch + 1] && maskToken.matches[intMatch + 1].isGroup) {
	                        var qt = maskToken.matches[match];
	                        maskToken.matches.splice(match, 1), maskToken.matches.splice(intMatch + 1, 0, qt);
	                    }
	                    void 0 !== maskToken.matches[match].matches ? maskToken.matches[match] = reverseTokens(maskToken.matches[match]) : maskToken.matches[match] = reverseStatic(maskToken.matches[match]);
	                }
	                return maskToken;
	            }
	            for (var match, m, openingToken, currentOpeningToken, alternator, lastMatch, groupToken, tokenizer = /(?:[?*+]|\{[0-9\+\*]+(?:,[0-9\+\*]*)?\})|[^.?*+^${[]()|\\]+|./g, escaped = !1, currentToken = new MaskToken(), openenings = [], maskTokens = []; match = tokenizer.exec(mask); ) if (m = match[0], 
	            escaped) defaultCase(); else switch (m.charAt(0)) {
	              case opts.escapeChar:
	                escaped = !0;
	                break;

	              case opts.optionalmarker.end:
	              case opts.groupmarker.end:
	                if (openingToken = openenings.pop(), openingToken.openGroup = !1, void 0 !== openingToken) if (openenings.length > 0) {
	                    if (currentOpeningToken = openenings[openenings.length - 1], currentOpeningToken.matches.push(openingToken), 
	                    currentOpeningToken.isAlternator) {
	                        alternator = openenings.pop();
	                        for (var mndx = 0; mndx < alternator.matches.length; mndx++) alternator.matches[mndx].isGroup = !1;
	                        openenings.length > 0 ? (currentOpeningToken = openenings[openenings.length - 1], 
	                        currentOpeningToken.matches.push(alternator)) : currentToken.matches.push(alternator);
	                    }
	                } else currentToken.matches.push(openingToken); else defaultCase();
	                break;

	              case opts.optionalmarker.start:
	                openenings.push(new MaskToken((!1), (!0)));
	                break;

	              case opts.groupmarker.start:
	                openenings.push(new MaskToken((!0)));
	                break;

	              case opts.quantifiermarker.start:
	                var quantifier = new MaskToken((!1), (!1), (!0));
	                m = m.replace(/[{}]/g, "");
	                var mq = m.split(","), mq0 = isNaN(mq[0]) ? mq[0] : parseInt(mq[0]), mq1 = 1 === mq.length ? mq0 : isNaN(mq[1]) ? mq[1] : parseInt(mq[1]);
	                if ("*" !== mq1 && "+" !== mq1 || (mq0 = "*" === mq1 ? 0 : 1), quantifier.quantifier = {
	                    min: mq0,
	                    max: mq1
	                }, openenings.length > 0) {
	                    var matches = openenings[openenings.length - 1].matches;
	                    match = matches.pop(), match.isGroup || (groupToken = new MaskToken((!0)), groupToken.matches.push(match), 
	                    match = groupToken), matches.push(match), matches.push(quantifier);
	                } else match = currentToken.matches.pop(), match.isGroup || (groupToken = new MaskToken((!0)), 
	                groupToken.matches.push(match), match = groupToken), currentToken.matches.push(match), 
	                currentToken.matches.push(quantifier);
	                break;

	              case opts.alternatormarker:
	                openenings.length > 0 ? (currentOpeningToken = openenings[openenings.length - 1], 
	                lastMatch = currentOpeningToken.matches.pop()) : lastMatch = currentToken.matches.pop(), 
	                lastMatch.isAlternator ? openenings.push(lastMatch) : (alternator = new MaskToken((!1), (!1), (!1), (!0)), 
	                alternator.matches.push(lastMatch), openenings.push(alternator));
	                break;

	              default:
	                defaultCase();
	            }
	            for (;openenings.length > 0; ) openingToken = openenings.pop(), currentToken.matches.push(openingToken);
	            return currentToken.matches.length > 0 && (verifyGroupMarker(currentToken), maskTokens.push(currentToken)), 
	            opts.numericInput && reverseTokens(maskTokens[0]), maskTokens;
	        }
	    }, Inputmask.extendDefaults = function(options) {
	        $.extend(!0, Inputmask.prototype.defaults, options);
	    }, Inputmask.extendDefinitions = function(definition) {
	        $.extend(!0, Inputmask.prototype.defaults.definitions, definition);
	    }, Inputmask.extendAliases = function(alias) {
	        $.extend(!0, Inputmask.prototype.defaults.aliases, alias);
	    }, Inputmask.format = function(value, options, metadata) {
	        return Inputmask(options).format(value, metadata);
	    }, Inputmask.unmask = function(value, options) {
	        return Inputmask(options).unmaskedvalue(value);
	    }, Inputmask.isValid = function(value, options) {
	        return Inputmask(options).isValid(value);
	    }, Inputmask.remove = function(elems) {
	        $.each(elems, function(ndx, el) {
	            el.inputmask && el.inputmask.remove();
	        });
	    }, Inputmask.escapeRegex = function(str) {
	        var specials = [ "/", ".", "*", "+", "?", "|", "(", ")", "[", "]", "{", "}", "\\", "$", "^" ];
	        return str.replace(new RegExp("(\\" + specials.join("|\\") + ")", "gim"), "\\$1");
	    }, Inputmask.keyCode = {
	        ALT: 18,
	        BACKSPACE: 8,
	        BACKSPACE_SAFARI: 127,
	        CAPS_LOCK: 20,
	        COMMA: 188,
	        COMMAND: 91,
	        COMMAND_LEFT: 91,
	        COMMAND_RIGHT: 93,
	        CONTROL: 17,
	        DELETE: 46,
	        DOWN: 40,
	        END: 35,
	        ENTER: 13,
	        ESCAPE: 27,
	        HOME: 36,
	        INSERT: 45,
	        LEFT: 37,
	        MENU: 93,
	        NUMPAD_ADD: 107,
	        NUMPAD_DECIMAL: 110,
	        NUMPAD_DIVIDE: 111,
	        NUMPAD_ENTER: 108,
	        NUMPAD_MULTIPLY: 106,
	        NUMPAD_SUBTRACT: 109,
	        PAGE_DOWN: 34,
	        PAGE_UP: 33,
	        PERIOD: 190,
	        RIGHT: 39,
	        SHIFT: 16,
	        SPACE: 32,
	        TAB: 9,
	        UP: 38,
	        WINDOWS: 91,
	        X: 88
	    }, window.Inputmask = Inputmask, Inputmask;
	}(jQuery), function($, Inputmask) {
	    return void 0 === $.fn.inputmask && ($.fn.inputmask = function(fn, options) {
	        var nptmask, input = this[0];
	        if (void 0 === options && (options = {}), "string" == typeof fn) switch (fn) {
	          case "unmaskedvalue":
	            return input && input.inputmask ? input.inputmask.unmaskedvalue() : $(input).val();

	          case "remove":
	            return this.each(function() {
	                this.inputmask && this.inputmask.remove();
	            });

	          case "getemptymask":
	            return input && input.inputmask ? input.inputmask.getemptymask() : "";

	          case "hasMaskedValue":
	            return !(!input || !input.inputmask) && input.inputmask.hasMaskedValue();

	          case "isComplete":
	            return !input || !input.inputmask || input.inputmask.isComplete();

	          case "getmetadata":
	            return input && input.inputmask ? input.inputmask.getmetadata() : void 0;

	          case "setvalue":
	            $(input).val(options), input && void 0 === input.inputmask && $(input).triggerHandler("setvalue");
	            break;

	          case "option":
	            if ("string" != typeof options) return this.each(function() {
	                if (void 0 !== this.inputmask) return this.inputmask.option(options);
	            });
	            if (input && void 0 !== input.inputmask) return input.inputmask.option(options);
	            break;

	          default:
	            return options.alias = fn, nptmask = new Inputmask(options), this.each(function() {
	                nptmask.mask(this);
	            });
	        } else {
	            if ("object" == typeof fn) return nptmask = new Inputmask(fn), void 0 === fn.mask && void 0 === fn.alias ? this.each(function() {
	                return void 0 !== this.inputmask ? this.inputmask.option(fn) : void nptmask.mask(this);
	            }) : this.each(function() {
	                nptmask.mask(this);
	            });
	            if (void 0 === fn) return this.each(function() {
	                nptmask = new Inputmask(options), nptmask.mask(this);
	            });
	        }
	    }), $.fn.inputmask;
	}(jQuery, Inputmask), function($, Inputmask) {}(jQuery, Inputmask), function($, Inputmask) {
	    function isLeapYear(year) {
	        return isNaN(year) || 29 === new Date(year, 2, 0).getDate();
	    }
	    return Inputmask.extendAliases({
	        "dd/mm/yyyy": {
	            mask: "1/2/y",
	            placeholder: "dd/mm/yyyy",
	            regex: {
	                val1pre: new RegExp("[0-3]"),
	                val1: new RegExp("0[1-9]|[12][0-9]|3[01]"),
	                val2pre: function(separator) {
	                    var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
	                    return new RegExp("((0[1-9]|[12][0-9]|3[01])" + escapedSeparator + "[01])");
	                },
	                val2: function(separator) {
	                    var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
	                    return new RegExp("((0[1-9]|[12][0-9])" + escapedSeparator + "(0[1-9]|1[012]))|(30" + escapedSeparator + "(0[13-9]|1[012]))|(31" + escapedSeparator + "(0[13578]|1[02]))");
	                }
	            },
	            leapday: "29/02/",
	            separator: "/",
	            yearrange: {
	                minyear: 1900,
	                maxyear: 2099
	            },
	            isInYearRange: function(chrs, minyear, maxyear) {
	                if (isNaN(chrs)) return !1;
	                var enteredyear = parseInt(chrs.concat(minyear.toString().slice(chrs.length))), enteredyear2 = parseInt(chrs.concat(maxyear.toString().slice(chrs.length)));
	                return !isNaN(enteredyear) && (minyear <= enteredyear && enteredyear <= maxyear) || !isNaN(enteredyear2) && (minyear <= enteredyear2 && enteredyear2 <= maxyear);
	            },
	            determinebaseyear: function(minyear, maxyear, hint) {
	                var currentyear = new Date().getFullYear();
	                if (minyear > currentyear) return minyear;
	                if (maxyear < currentyear) {
	                    for (var maxYearPrefix = maxyear.toString().slice(0, 2), maxYearPostfix = maxyear.toString().slice(2, 4); maxyear < maxYearPrefix + hint; ) maxYearPrefix--;
	                    var maxxYear = maxYearPrefix + maxYearPostfix;
	                    return minyear > maxxYear ? minyear : maxxYear;
	                }
	                if (minyear <= currentyear && currentyear <= maxyear) {
	                    for (var currentYearPrefix = currentyear.toString().slice(0, 2); maxyear < currentYearPrefix + hint; ) currentYearPrefix--;
	                    var currentYearAndHint = currentYearPrefix + hint;
	                    return currentYearAndHint < minyear ? minyear : currentYearAndHint;
	                }
	                return currentyear;
	            },
	            onKeyDown: function(e, buffer, caretPos, opts) {
	                var $input = $(this);
	                if (e.ctrlKey && e.keyCode === Inputmask.keyCode.RIGHT) {
	                    var today = new Date();
	                    $input.val(today.getDate().toString() + (today.getMonth() + 1).toString() + today.getFullYear().toString()), 
	                    $input.trigger("setvalue");
	                }
	            },
	            getFrontValue: function(mask, buffer, opts) {
	                for (var start = 0, length = 0, i = 0; i < mask.length && "2" !== mask.charAt(i); i++) {
	                    var definition = opts.definitions[mask.charAt(i)];
	                    definition ? (start += length, length = definition.cardinality) : length++;
	                }
	                return buffer.join("").substr(start, length);
	            },
	            postValidation: function(buffer, currentResult, opts) {
	                var dayMonthValue, year, bufferStr = buffer.join("");
	                return 0 === opts.mask.indexOf("y") ? (year = bufferStr.substr(0, 4), dayMonthValue = bufferStr.substr(4, 11)) : (year = bufferStr.substr(6, 11), 
	                dayMonthValue = bufferStr.substr(0, 6)), currentResult && (dayMonthValue !== opts.leapday || isLeapYear(year));
	            },
	            definitions: {
	                "1": {
	                    validator: function(chrs, maskset, pos, strict, opts) {
	                        var isValid = opts.regex.val1.test(chrs);
	                        return strict || isValid || chrs.charAt(1) !== opts.separator && "-./".indexOf(chrs.charAt(1)) === -1 || !(isValid = opts.regex.val1.test("0" + chrs.charAt(0))) ? isValid : (maskset.buffer[pos - 1] = "0", 
	                        {
	                            refreshFromBuffer: {
	                                start: pos - 1,
	                                end: pos
	                            },
	                            pos: pos,
	                            c: chrs.charAt(0)
	                        });
	                    },
	                    cardinality: 2,
	                    prevalidator: [ {
	                        validator: function(chrs, maskset, pos, strict, opts) {
	                            var pchrs = chrs;
	                            isNaN(maskset.buffer[pos + 1]) || (pchrs += maskset.buffer[pos + 1]);
	                            var isValid = 1 === pchrs.length ? opts.regex.val1pre.test(pchrs) : opts.regex.val1.test(pchrs);
	                            if (!strict && !isValid) {
	                                if (isValid = opts.regex.val1.test(chrs + "0")) return maskset.buffer[pos] = chrs, 
	                                maskset.buffer[++pos] = "0", {
	                                    pos: pos,
	                                    c: "0"
	                                };
	                                if (isValid = opts.regex.val1.test("0" + chrs)) return maskset.buffer[pos] = "0", 
	                                pos++, {
	                                    pos: pos
	                                };
	                            }
	                            return isValid;
	                        },
	                        cardinality: 1
	                    } ]
	                },
	                "2": {
	                    validator: function(chrs, maskset, pos, strict, opts) {
	                        var frontValue = opts.getFrontValue(maskset.mask, maskset.buffer, opts);
	                        frontValue.indexOf(opts.placeholder[0]) !== -1 && (frontValue = "01" + opts.separator);
	                        var isValid = opts.regex.val2(opts.separator).test(frontValue + chrs);
	                        return strict || isValid || chrs.charAt(1) !== opts.separator && "-./".indexOf(chrs.charAt(1)) === -1 || !(isValid = opts.regex.val2(opts.separator).test(frontValue + "0" + chrs.charAt(0))) ? isValid : (maskset.buffer[pos - 1] = "0", 
	                        {
	                            refreshFromBuffer: {
	                                start: pos - 1,
	                                end: pos
	                            },
	                            pos: pos,
	                            c: chrs.charAt(0)
	                        });
	                    },
	                    cardinality: 2,
	                    prevalidator: [ {
	                        validator: function(chrs, maskset, pos, strict, opts) {
	                            isNaN(maskset.buffer[pos + 1]) || (chrs += maskset.buffer[pos + 1]);
	                            var frontValue = opts.getFrontValue(maskset.mask, maskset.buffer, opts);
	                            frontValue.indexOf(opts.placeholder[0]) !== -1 && (frontValue = "01" + opts.separator);
	                            var isValid = 1 === chrs.length ? opts.regex.val2pre(opts.separator).test(frontValue + chrs) : opts.regex.val2(opts.separator).test(frontValue + chrs);
	                            return strict || isValid || !(isValid = opts.regex.val2(opts.separator).test(frontValue + "0" + chrs)) ? isValid : (maskset.buffer[pos] = "0", 
	                            pos++, {
	                                pos: pos
	                            });
	                        },
	                        cardinality: 1
	                    } ]
	                },
	                y: {
	                    validator: function(chrs, maskset, pos, strict, opts) {
	                        return opts.isInYearRange(chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
	                    },
	                    cardinality: 4,
	                    prevalidator: [ {
	                        validator: function(chrs, maskset, pos, strict, opts) {
	                            var isValid = opts.isInYearRange(chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
	                            if (!strict && !isValid) {
	                                var yearPrefix = opts.determinebaseyear(opts.yearrange.minyear, opts.yearrange.maxyear, chrs + "0").toString().slice(0, 1);
	                                if (isValid = opts.isInYearRange(yearPrefix + chrs, opts.yearrange.minyear, opts.yearrange.maxyear)) return maskset.buffer[pos++] = yearPrefix.charAt(0), 
	                                {
	                                    pos: pos
	                                };
	                                if (yearPrefix = opts.determinebaseyear(opts.yearrange.minyear, opts.yearrange.maxyear, chrs + "0").toString().slice(0, 2), 
	                                isValid = opts.isInYearRange(yearPrefix + chrs, opts.yearrange.minyear, opts.yearrange.maxyear)) return maskset.buffer[pos++] = yearPrefix.charAt(0), 
	                                maskset.buffer[pos++] = yearPrefix.charAt(1), {
	                                    pos: pos
	                                };
	                            }
	                            return isValid;
	                        },
	                        cardinality: 1
	                    }, {
	                        validator: function(chrs, maskset, pos, strict, opts) {
	                            var isValid = opts.isInYearRange(chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
	                            if (!strict && !isValid) {
	                                var yearPrefix = opts.determinebaseyear(opts.yearrange.minyear, opts.yearrange.maxyear, chrs).toString().slice(0, 2);
	                                if (isValid = opts.isInYearRange(chrs[0] + yearPrefix[1] + chrs[1], opts.yearrange.minyear, opts.yearrange.maxyear)) return maskset.buffer[pos++] = yearPrefix.charAt(1), 
	                                {
	                                    pos: pos
	                                };
	                                if (yearPrefix = opts.determinebaseyear(opts.yearrange.minyear, opts.yearrange.maxyear, chrs).toString().slice(0, 2), 
	                                isValid = opts.isInYearRange(yearPrefix + chrs, opts.yearrange.minyear, opts.yearrange.maxyear)) return maskset.buffer[pos - 1] = yearPrefix.charAt(0), 
	                                maskset.buffer[pos++] = yearPrefix.charAt(1), maskset.buffer[pos++] = chrs.charAt(0), 
	                                {
	                                    refreshFromBuffer: {
	                                        start: pos - 3,
	                                        end: pos
	                                    },
	                                    pos: pos
	                                };
	                            }
	                            return isValid;
	                        },
	                        cardinality: 2
	                    }, {
	                        validator: function(chrs, maskset, pos, strict, opts) {
	                            return opts.isInYearRange(chrs, opts.yearrange.minyear, opts.yearrange.maxyear);
	                        },
	                        cardinality: 3
	                    } ]
	                }
	            },
	            insertMode: !1,
	            autoUnmask: !1
	        },
	        "mm/dd/yyyy": {
	            placeholder: "mm/dd/yyyy",
	            alias: "dd/mm/yyyy",
	            regex: {
	                val2pre: function(separator) {
	                    var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
	                    return new RegExp("((0[13-9]|1[012])" + escapedSeparator + "[0-3])|(02" + escapedSeparator + "[0-2])");
	                },
	                val2: function(separator) {
	                    var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
	                    return new RegExp("((0[1-9]|1[012])" + escapedSeparator + "(0[1-9]|[12][0-9]))|((0[13-9]|1[012])" + escapedSeparator + "30)|((0[13578]|1[02])" + escapedSeparator + "31)");
	                },
	                val1pre: new RegExp("[01]"),
	                val1: new RegExp("0[1-9]|1[012]")
	            },
	            leapday: "02/29/",
	            onKeyDown: function(e, buffer, caretPos, opts) {
	                var $input = $(this);
	                if (e.ctrlKey && e.keyCode === Inputmask.keyCode.RIGHT) {
	                    var today = new Date();
	                    $input.val((today.getMonth() + 1).toString() + today.getDate().toString() + today.getFullYear().toString()), 
	                    $input.trigger("setvalue");
	                }
	            }
	        },
	        "yyyy/mm/dd": {
	            mask: "y/1/2",
	            placeholder: "yyyy/mm/dd",
	            alias: "mm/dd/yyyy",
	            leapday: "/02/29",
	            onKeyDown: function(e, buffer, caretPos, opts) {
	                var $input = $(this);
	                if (e.ctrlKey && e.keyCode === Inputmask.keyCode.RIGHT) {
	                    var today = new Date();
	                    $input.val(today.getFullYear().toString() + (today.getMonth() + 1).toString() + today.getDate().toString()), 
	                    $input.trigger("setvalue");
	                }
	            }
	        },
	        "dd.mm.yyyy": {
	            mask: "1.2.y",
	            placeholder: "dd.mm.yyyy",
	            leapday: "29.02.",
	            separator: ".",
	            alias: "dd/mm/yyyy"
	        },
	        "dd-mm-yyyy": {
	            mask: "1-2-y",
	            placeholder: "dd-mm-yyyy",
	            leapday: "29-02-",
	            separator: "-",
	            alias: "dd/mm/yyyy"
	        },
	        "mm.dd.yyyy": {
	            mask: "1.2.y",
	            placeholder: "mm.dd.yyyy",
	            leapday: "02.29.",
	            separator: ".",
	            alias: "mm/dd/yyyy"
	        },
	        "mm-dd-yyyy": {
	            mask: "1-2-y",
	            placeholder: "mm-dd-yyyy",
	            leapday: "02-29-",
	            separator: "-",
	            alias: "mm/dd/yyyy"
	        },
	        "yyyy.mm.dd": {
	            mask: "y.1.2",
	            placeholder: "yyyy.mm.dd",
	            leapday: ".02.29",
	            separator: ".",
	            alias: "yyyy/mm/dd"
	        },
	        "yyyy-mm-dd": {
	            mask: "y-1-2",
	            placeholder: "yyyy-mm-dd",
	            leapday: "-02-29",
	            separator: "-",
	            alias: "yyyy/mm/dd"
	        },
	        datetime: {
	            mask: "1/2/y h:s",
	            placeholder: "dd/mm/yyyy hh:mm",
	            alias: "dd/mm/yyyy",
	            regex: {
	                hrspre: new RegExp("[012]"),
	                hrs24: new RegExp("2[0-4]|1[3-9]"),
	                hrs: new RegExp("[01][0-9]|2[0-4]"),
	                ampm: new RegExp("^[a|p|A|P][m|M]"),
	                mspre: new RegExp("[0-5]"),
	                ms: new RegExp("[0-5][0-9]")
	            },
	            timeseparator: ":",
	            hourFormat: "24",
	            definitions: {
	                h: {
	                    validator: function(chrs, maskset, pos, strict, opts) {
	                        if ("24" === opts.hourFormat && 24 === parseInt(chrs, 10)) return maskset.buffer[pos - 1] = "0", 
	                        maskset.buffer[pos] = "0", {
	                            refreshFromBuffer: {
	                                start: pos - 1,
	                                end: pos
	                            },
	                            c: "0"
	                        };
	                        var isValid = opts.regex.hrs.test(chrs);
	                        if (!strict && !isValid && (chrs.charAt(1) === opts.timeseparator || "-.:".indexOf(chrs.charAt(1)) !== -1) && (isValid = opts.regex.hrs.test("0" + chrs.charAt(0)))) return maskset.buffer[pos - 1] = "0", 
	                        maskset.buffer[pos] = chrs.charAt(0), pos++, {
	                            refreshFromBuffer: {
	                                start: pos - 2,
	                                end: pos
	                            },
	                            pos: pos,
	                            c: opts.timeseparator
	                        };
	                        if (isValid && "24" !== opts.hourFormat && opts.regex.hrs24.test(chrs)) {
	                            var tmp = parseInt(chrs, 10);
	                            return 24 === tmp ? (maskset.buffer[pos + 5] = "a", maskset.buffer[pos + 6] = "m") : (maskset.buffer[pos + 5] = "p", 
	                            maskset.buffer[pos + 6] = "m"), tmp -= 12, tmp < 10 ? (maskset.buffer[pos] = tmp.toString(), 
	                            maskset.buffer[pos - 1] = "0") : (maskset.buffer[pos] = tmp.toString().charAt(1), 
	                            maskset.buffer[pos - 1] = tmp.toString().charAt(0)), {
	                                refreshFromBuffer: {
	                                    start: pos - 1,
	                                    end: pos + 6
	                                },
	                                c: maskset.buffer[pos]
	                            };
	                        }
	                        return isValid;
	                    },
	                    cardinality: 2,
	                    prevalidator: [ {
	                        validator: function(chrs, maskset, pos, strict, opts) {
	                            var isValid = opts.regex.hrspre.test(chrs);
	                            return strict || isValid || !(isValid = opts.regex.hrs.test("0" + chrs)) ? isValid : (maskset.buffer[pos] = "0", 
	                            pos++, {
	                                pos: pos
	                            });
	                        },
	                        cardinality: 1
	                    } ]
	                },
	                s: {
	                    validator: "[0-5][0-9]",
	                    cardinality: 2,
	                    prevalidator: [ {
	                        validator: function(chrs, maskset, pos, strict, opts) {
	                            var isValid = opts.regex.mspre.test(chrs);
	                            return strict || isValid || !(isValid = opts.regex.ms.test("0" + chrs)) ? isValid : (maskset.buffer[pos] = "0", 
	                            pos++, {
	                                pos: pos
	                            });
	                        },
	                        cardinality: 1
	                    } ]
	                },
	                t: {
	                    validator: function(chrs, maskset, pos, strict, opts) {
	                        return opts.regex.ampm.test(chrs + "m");
	                    },
	                    casing: "lower",
	                    cardinality: 1
	                }
	            },
	            insertMode: !1,
	            autoUnmask: !1
	        },
	        datetime12: {
	            mask: "1/2/y h:s t\\m",
	            placeholder: "dd/mm/yyyy hh:mm xm",
	            alias: "datetime",
	            hourFormat: "12"
	        },
	        "mm/dd/yyyy hh:mm xm": {
	            mask: "1/2/y h:s t\\m",
	            placeholder: "mm/dd/yyyy hh:mm xm",
	            alias: "datetime12",
	            regex: {
	                val2pre: function(separator) {
	                    var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
	                    return new RegExp("((0[13-9]|1[012])" + escapedSeparator + "[0-3])|(02" + escapedSeparator + "[0-2])");
	                },
	                val2: function(separator) {
	                    var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
	                    return new RegExp("((0[1-9]|1[012])" + escapedSeparator + "(0[1-9]|[12][0-9]))|((0[13-9]|1[012])" + escapedSeparator + "30)|((0[13578]|1[02])" + escapedSeparator + "31)");
	                },
	                val1pre: new RegExp("[01]"),
	                val1: new RegExp("0[1-9]|1[012]")
	            },
	            leapday: "02/29/",
	            onKeyDown: function(e, buffer, caretPos, opts) {
	                var $input = $(this);
	                if (e.ctrlKey && e.keyCode === Inputmask.keyCode.RIGHT) {
	                    var today = new Date();
	                    $input.val((today.getMonth() + 1).toString() + today.getDate().toString() + today.getFullYear().toString()), 
	                    $input.trigger("setvalue");
	                }
	            }
	        },
	        "hh:mm t": {
	            mask: "h:s t\\m",
	            placeholder: "hh:mm xm",
	            alias: "datetime",
	            hourFormat: "12"
	        },
	        "h:s t": {
	            mask: "h:s t\\m",
	            placeholder: "hh:mm xm",
	            alias: "datetime",
	            hourFormat: "12"
	        },
	        "hh:mm:ss": {
	            mask: "h:s:s",
	            placeholder: "hh:mm:ss",
	            alias: "datetime",
	            autoUnmask: !1
	        },
	        "hh:mm": {
	            mask: "h:s",
	            placeholder: "hh:mm",
	            alias: "datetime",
	            autoUnmask: !1
	        },
	        date: {
	            alias: "dd/mm/yyyy"
	        },
	        "mm/yyyy": {
	            mask: "1/y",
	            placeholder: "mm/yyyy",
	            leapday: "donotuse",
	            separator: "/",
	            alias: "mm/dd/yyyy"
	        },
	        shamsi: {
	            regex: {
	                val2pre: function(separator) {
	                    var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
	                    return new RegExp("((0[1-9]|1[012])" + escapedSeparator + "[0-3])");
	                },
	                val2: function(separator) {
	                    var escapedSeparator = Inputmask.escapeRegex.call(this, separator);
	                    return new RegExp("((0[1-9]|1[012])" + escapedSeparator + "(0[1-9]|[12][0-9]))|((0[1-9]|1[012])" + escapedSeparator + "30)|((0[1-6])" + escapedSeparator + "31)");
	                },
	                val1pre: new RegExp("[01]"),
	                val1: new RegExp("0[1-9]|1[012]")
	            },
	            yearrange: {
	                minyear: 1300,
	                maxyear: 1499
	            },
	            mask: "y/1/2",
	            leapday: "/12/30",
	            placeholder: "yyyy/mm/dd",
	            alias: "mm/dd/yyyy",
	            clearIncomplete: !0
	        }
	    }), Inputmask;
	}(jQuery, Inputmask), function($, Inputmask) {
	    return Inputmask.extendDefinitions({
	        A: {
	            validator: "[A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]",
	            cardinality: 1,
	            casing: "upper"
	        },
	        "&": {
	            validator: "[0-9A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]",
	            cardinality: 1,
	            casing: "upper"
	        },
	        "#": {
	            validator: "[0-9A-Fa-f]",
	            cardinality: 1,
	            casing: "upper"
	        }
	    }), Inputmask.extendAliases({
	        url: {
	            definitions: {
	                i: {
	                    validator: ".",
	                    cardinality: 1
	                }
	            },
	            mask: "(\\http://)|(\\http\\s://)|(ftp://)|(ftp\\s://)i{+}",
	            insertMode: !1,
	            autoUnmask: !1,
	            inputmode: "url"
	        },
	        ip: {
	            mask: "i[i[i]].i[i[i]].i[i[i]].i[i[i]]",
	            definitions: {
	                i: {
	                    validator: function(chrs, maskset, pos, strict, opts) {
	                        return pos - 1 > -1 && "." !== maskset.buffer[pos - 1] ? (chrs = maskset.buffer[pos - 1] + chrs, 
	                        chrs = pos - 2 > -1 && "." !== maskset.buffer[pos - 2] ? maskset.buffer[pos - 2] + chrs : "0" + chrs) : chrs = "00" + chrs, 
	                        new RegExp("25[0-5]|2[0-4][0-9]|[01][0-9][0-9]").test(chrs);
	                    },
	                    cardinality: 1
	                }
	            },
	            onUnMask: function(maskedValue, unmaskedValue, opts) {
	                return maskedValue;
	            },
	            inputmode: "numeric"
	        },
	        email: {
	            mask: "*{1,64}[.*{1,64}][.*{1,64}][.*{1,63}]@-{1,63}.-{1,63}[.-{1,63}][.-{1,63}]",
	            greedy: !1,
	            onBeforePaste: function(pastedValue, opts) {
	                return pastedValue = pastedValue.toLowerCase(), pastedValue.replace("mailto:", "");
	            },
	            definitions: {
	                "*": {
	                    validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~-]",
	                    cardinality: 1,
	                    casing: "lower"
	                },
	                "-": {
	                    validator: "[0-9A-Za-z-]",
	                    cardinality: 1,
	                    casing: "lower"
	                }
	            },
	            onUnMask: function(maskedValue, unmaskedValue, opts) {
	                return maskedValue;
	            },
	            inputmode: "email"
	        },
	        mac: {
	            mask: "##:##:##:##:##:##"
	        },
	        vin: {
	            mask: "V{13}9{4}",
	            definitions: {
	                V: {
	                    validator: "[A-HJ-NPR-Za-hj-npr-z\\d]",
	                    cardinality: 1,
	                    casing: "upper"
	                }
	            },
	            clearIncomplete: !0,
	            autoUnmask: !0
	        }
	    }), Inputmask;
	}(jQuery, Inputmask), function($, Inputmask) {
	    return Inputmask.extendAliases({
	        numeric: {
	            mask: function(opts) {
	                function autoEscape(txt) {
	                    for (var escapedTxt = "", i = 0; i < txt.length; i++) escapedTxt += opts.definitions[txt.charAt(i)] || opts.optionalmarker.start === txt.charAt(i) || opts.optionalmarker.end === txt.charAt(i) || opts.quantifiermarker.start === txt.charAt(i) || opts.quantifiermarker.end === txt.charAt(i) || opts.groupmarker.start === txt.charAt(i) || opts.groupmarker.end === txt.charAt(i) || opts.alternatormarker === txt.charAt(i) ? "\\" + txt.charAt(i) : txt.charAt(i);
	                    return escapedTxt;
	                }
	                if (0 !== opts.repeat && isNaN(opts.integerDigits) && (opts.integerDigits = opts.repeat), 
	                opts.repeat = 0, opts.groupSeparator === opts.radixPoint && ("." === opts.radixPoint ? opts.groupSeparator = "," : "," === opts.radixPoint ? opts.groupSeparator = "." : opts.groupSeparator = ""), 
	                " " === opts.groupSeparator && (opts.skipOptionalPartCharacter = void 0), opts.autoGroup = opts.autoGroup && "" !== opts.groupSeparator, 
	                opts.autoGroup && ("string" == typeof opts.groupSize && isFinite(opts.groupSize) && (opts.groupSize = parseInt(opts.groupSize)), 
	                isFinite(opts.integerDigits))) {
	                    var seps = Math.floor(opts.integerDigits / opts.groupSize), mod = opts.integerDigits % opts.groupSize;
	                    opts.integerDigits = parseInt(opts.integerDigits) + (0 === mod ? seps - 1 : seps), 
	                    opts.integerDigits < 1 && (opts.integerDigits = "*");
	                }
	                opts.placeholder.length > 1 && (opts.placeholder = opts.placeholder.charAt(0)), 
	                "radixFocus" === opts.positionCaretOnClick && "" === opts.placeholder && opts.integerOptional === !1 && (opts.positionCaretOnClick = "lvp"), 
	                opts.definitions[";"] = opts.definitions["~"], opts.definitions[";"].definitionSymbol = "~", 
	                opts.numericInput === !0 && (opts.positionCaretOnClick = "radixFocus" === opts.positionCaretOnClick ? "lvp" : opts.positionCaretOnClick, 
	                opts.digitsOptional = !1, isNaN(opts.digits) && (opts.digits = 2), opts.decimalProtect = !1);
	                var mask = "[+]";
	                if (mask += autoEscape(opts.prefix), mask += opts.integerOptional === !0 ? "~{1," + opts.integerDigits + "}" : "~{" + opts.integerDigits + "}", 
	                void 0 !== opts.digits) {
	                    opts.decimalProtect && (opts.radixPointDefinitionSymbol = ":");
	                    var dq = opts.digits.toString().split(",");
	                    isFinite(dq[0] && dq[1] && isFinite(dq[1])) ? mask += (opts.decimalProtect ? ":" : opts.radixPoint) + ";{" + opts.digits + "}" : (isNaN(opts.digits) || parseInt(opts.digits) > 0) && (mask += opts.digitsOptional ? "[" + (opts.decimalProtect ? ":" : opts.radixPoint) + ";{1," + opts.digits + "}]" : (opts.decimalProtect ? ":" : opts.radixPoint) + ";{" + opts.digits + "}");
	                }
	                return mask += autoEscape(opts.suffix), mask += "[-]", opts.greedy = !1, null !== opts.min && (opts.min = opts.min.toString().replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator), "g"), ""), 
	                "," === opts.radixPoint && (opts.min = opts.min.replace(opts.radixPoint, "."))), 
	                null !== opts.max && (opts.max = opts.max.toString().replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator), "g"), ""), 
	                "," === opts.radixPoint && (opts.max = opts.max.replace(opts.radixPoint, "."))), 
	                mask;
	            },
	            placeholder: "",
	            greedy: !1,
	            digits: "*",
	            digitsOptional: !0,
	            radixPoint: ".",
	            positionCaretOnClick: "radixFocus",
	            groupSize: 3,
	            groupSeparator: "",
	            autoGroup: !1,
	            allowPlus: !0,
	            allowMinus: !0,
	            negationSymbol: {
	                front: "-",
	                back: ""
	            },
	            integerDigits: "+",
	            integerOptional: !0,
	            prefix: "",
	            suffix: "",
	            rightAlign: !0,
	            decimalProtect: !0,
	            min: null,
	            max: null,
	            step: 1,
	            insertMode: !0,
	            autoUnmask: !1,
	            unmaskAsNumber: !1,
	            inputmode: "numeric",
	            postFormat: function(buffer, pos, opts) {
	                opts.numericInput === !0 && (buffer = buffer.reverse(), isFinite(pos) && (pos = buffer.join("").length - pos - 1));
	                var i, l;
	                pos = pos >= buffer.length ? buffer.length - 1 : pos < 0 ? 0 : pos;
	                var charAtPos = buffer[pos], cbuf = buffer.slice();
	                charAtPos === opts.groupSeparator && (cbuf.splice(pos--, 1), charAtPos = cbuf[pos]);
	                var isNegative = cbuf.join("").match(new RegExp("^" + Inputmask.escapeRegex(opts.negationSymbol.front)));
	                isNegative = null !== isNegative && 1 === isNegative.length, pos > (isNegative ? opts.negationSymbol.front.length : 0) + opts.prefix.length && pos < cbuf.length - opts.suffix.length && (cbuf[pos] = "!");
	                var bufVal = cbuf.join(""), bufValOrigin = cbuf.join();
	                if (isNegative && (bufVal = bufVal.replace(new RegExp("^" + Inputmask.escapeRegex(opts.negationSymbol.front)), ""), 
	                bufVal = bufVal.replace(new RegExp(Inputmask.escapeRegex(opts.negationSymbol.back) + "$"), "")), 
	                bufVal = bufVal.replace(new RegExp(Inputmask.escapeRegex(opts.suffix) + "$"), ""), 
	                bufVal = bufVal.replace(new RegExp("^" + Inputmask.escapeRegex(opts.prefix)), ""), 
	                bufVal.length > 0 && opts.autoGroup || bufVal.indexOf(opts.groupSeparator) !== -1) {
	                    var escapedGroupSeparator = Inputmask.escapeRegex(opts.groupSeparator);
	                    bufVal = bufVal.replace(new RegExp(escapedGroupSeparator, "g"), "");
	                    var radixSplit = bufVal.split(charAtPos === opts.radixPoint ? "!" : opts.radixPoint);
	                    if (bufVal = "" === opts.radixPoint ? bufVal : radixSplit[0], charAtPos !== opts.negationSymbol.front && (bufVal = bufVal.replace("!", "?")), 
	                    bufVal.length > opts.groupSize) for (var reg = new RegExp("([-+]?[\\d?]+)([\\d?]{" + opts.groupSize + "})"); reg.test(bufVal) && "" !== opts.groupSeparator; ) bufVal = bufVal.replace(reg, "$1" + opts.groupSeparator + "$2"), 
	                    bufVal = bufVal.replace(opts.groupSeparator + opts.groupSeparator, opts.groupSeparator);
	                    bufVal = bufVal.replace("?", "!"), "" !== opts.radixPoint && radixSplit.length > 1 && (bufVal += (charAtPos === opts.radixPoint ? "!" : opts.radixPoint) + radixSplit[1]);
	                }
	                bufVal = opts.prefix + bufVal + opts.suffix, isNegative && (bufVal = opts.negationSymbol.front + bufVal + opts.negationSymbol.back);
	                var needsRefresh = bufValOrigin !== bufVal.split("").join(), newPos = $.inArray("!", bufVal);
	                if (newPos === -1 && (newPos = pos), needsRefresh) {
	                    for (buffer.length = bufVal.length, i = 0, l = bufVal.length; i < l; i++) buffer[i] = bufVal.charAt(i);
	                    buffer[newPos] = charAtPos;
	                }
	                return newPos = opts.numericInput && isFinite(pos) ? buffer.join("").length - newPos - 1 : newPos, 
	                opts.numericInput && (buffer = buffer.reverse(), $.inArray(opts.radixPoint, buffer) < newPos && buffer.join("").length - opts.suffix.length !== newPos && (newPos -= 1)), 
	                {
	                    pos: newPos,
	                    refreshFromBuffer: needsRefresh,
	                    buffer: buffer,
	                    isNegative: isNegative
	                };
	            },
	            onBeforeWrite: function(e, buffer, caretPos, opts) {
	                var rslt;
	                if (e && ("blur" === e.type || "checkval" === e.type || "keydown" === e.type)) {
	                    var maskedValue = opts.numericInput ? buffer.slice().reverse().join("") : buffer.join(""), processValue = maskedValue.replace(opts.prefix, "");
	                    processValue = processValue.replace(opts.suffix, ""), processValue = processValue.replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator), "g"), ""), 
	                    "," === opts.radixPoint && (processValue = processValue.replace(opts.radixPoint, "."));
	                    var isNegative = processValue.match(new RegExp("[-" + Inputmask.escapeRegex(opts.negationSymbol.front) + "]", "g"));
	                    if (isNegative = null !== isNegative && 1 === isNegative.length, processValue = processValue.replace(new RegExp("[-" + Inputmask.escapeRegex(opts.negationSymbol.front) + "]", "g"), ""), 
	                    processValue = processValue.replace(new RegExp(Inputmask.escapeRegex(opts.negationSymbol.back) + "$"), ""), 
	                    isNaN(opts.placeholder) && (processValue = processValue.replace(new RegExp(Inputmask.escapeRegex(opts.placeholder), "g"), "")), 
	                    processValue = processValue === opts.negationSymbol.front ? processValue + "0" : processValue, 
	                    "" !== processValue && isFinite(processValue)) {
	                        var floatValue = parseFloat(processValue), signedFloatValue = isNegative ? floatValue * -1 : floatValue;
	                        if (null !== opts.min && isFinite(opts.min) && signedFloatValue < parseFloat(opts.min) ? (floatValue = Math.abs(opts.min), 
	                        isNegative = opts.min < 0, maskedValue = void 0) : null !== opts.max && isFinite(opts.max) && signedFloatValue > parseFloat(opts.max) && (floatValue = Math.abs(opts.max), 
	                        isNegative = opts.max < 0, maskedValue = void 0), processValue = floatValue.toString().replace(".", opts.radixPoint).split(""), 
	                        isFinite(opts.digits)) {
	                            var radixPosition = $.inArray(opts.radixPoint, processValue), rpb = $.inArray(opts.radixPoint, maskedValue);
	                            radixPosition === -1 && (processValue.push(opts.radixPoint), radixPosition = processValue.length - 1);
	                            for (var i = 1; i <= opts.digits; i++) opts.digitsOptional || void 0 !== processValue[radixPosition + i] && processValue[radixPosition + i] !== opts.placeholder.charAt(0) ? rpb !== -1 && void 0 !== maskedValue[rpb + i] && (processValue[radixPosition + i] = processValue[radixPosition + i] || maskedValue[rpb + i]) : processValue[radixPosition + i] = "0";
	                            processValue[processValue.length - 1] === opts.radixPoint && delete processValue[processValue.length - 1];
	                        }
	                        if (floatValue.toString() !== processValue && floatValue.toString() + "." !== processValue || isNegative) return processValue = (opts.prefix + processValue.join("")).split(""), 
	                        !isNegative || 0 === floatValue && "blur" === e.type || (processValue.unshift(opts.negationSymbol.front), 
	                        processValue.push(opts.negationSymbol.back)), opts.numericInput && (processValue = processValue.reverse()), 
	                        rslt = opts.postFormat(processValue, opts.numericInput ? caretPos : caretPos - 1, opts), 
	                        rslt.buffer && (rslt.refreshFromBuffer = rslt.buffer.join("") !== buffer.join("")), 
	                        rslt;
	                    }
	                }
	                if (opts.autoGroup) return rslt = opts.postFormat(buffer, opts.numericInput ? caretPos : caretPos - 1, opts), 
	                rslt.caret = caretPos < (rslt.isNegative ? opts.negationSymbol.front.length : 0) + opts.prefix.length || caretPos > rslt.buffer.length - (rslt.isNegative ? opts.negationSymbol.back.length : 0) ? rslt.pos : rslt.pos + 1, 
	                rslt;
	            },
	            regex: {
	                integerPart: function(opts) {
	                    return new RegExp("[" + Inputmask.escapeRegex(opts.negationSymbol.front) + "+]?\\d+");
	                },
	                integerNPart: function(opts) {
	                    return new RegExp("[\\d" + Inputmask.escapeRegex(opts.groupSeparator) + Inputmask.escapeRegex(opts.placeholder.charAt(0)) + "]+");
	                }
	            },
	            signHandler: function(chrs, maskset, pos, strict, opts) {
	                if (!strict && opts.allowMinus && "-" === chrs || opts.allowPlus && "+" === chrs) {
	                    var matchRslt = maskset.buffer.join("").match(opts.regex.integerPart(opts));
	                    if (matchRslt && matchRslt[0].length > 0) return maskset.buffer[matchRslt.index] === ("-" === chrs ? "+" : opts.negationSymbol.front) ? "-" === chrs ? "" !== opts.negationSymbol.back ? {
	                        pos: 0,
	                        c: opts.negationSymbol.front,
	                        remove: 0,
	                        caret: pos,
	                        insert: {
	                            pos: maskset.buffer.length - 1,
	                            c: opts.negationSymbol.back
	                        }
	                    } : {
	                        pos: 0,
	                        c: opts.negationSymbol.front,
	                        remove: 0,
	                        caret: pos
	                    } : "" !== opts.negationSymbol.back ? {
	                        pos: 0,
	                        c: "+",
	                        remove: [ 0, maskset.buffer.length - 1 ],
	                        caret: pos
	                    } : {
	                        pos: 0,
	                        c: "+",
	                        remove: 0,
	                        caret: pos
	                    } : maskset.buffer[0] === ("-" === chrs ? opts.negationSymbol.front : "+") ? "-" === chrs && "" !== opts.negationSymbol.back ? {
	                        remove: [ 0, maskset.buffer.length - 1 ],
	                        caret: pos - 1
	                    } : {
	                        remove: 0,
	                        caret: pos - 1
	                    } : "-" === chrs ? "" !== opts.negationSymbol.back ? {
	                        pos: 0,
	                        c: opts.negationSymbol.front,
	                        caret: pos + 1,
	                        insert: {
	                            pos: maskset.buffer.length,
	                            c: opts.negationSymbol.back
	                        }
	                    } : {
	                        pos: 0,
	                        c: opts.negationSymbol.front,
	                        caret: pos + 1
	                    } : {
	                        pos: 0,
	                        c: chrs,
	                        caret: pos + 1
	                    };
	                }
	                return !1;
	            },
	            radixHandler: function(chrs, maskset, pos, strict, opts) {
	                if (!strict && opts.numericInput !== !0 && chrs === opts.radixPoint && void 0 !== opts.digits && (isNaN(opts.digits) || parseInt(opts.digits) > 0)) {
	                    var radixPos = $.inArray(opts.radixPoint, maskset.buffer), integerValue = maskset.buffer.join("").match(opts.regex.integerPart(opts));
	                    if (radixPos !== -1 && maskset.validPositions[radixPos]) return maskset.validPositions[radixPos - 1] ? {
	                        caret: radixPos + 1
	                    } : {
	                        pos: integerValue.index,
	                        c: integerValue[0],
	                        caret: radixPos + 1
	                    };
	                    if (!integerValue || "0" === integerValue[0] && integerValue.index + 1 !== pos) return maskset.buffer[integerValue ? integerValue.index : pos] = "0", 
	                    {
	                        pos: (integerValue ? integerValue.index : pos) + 1,
	                        c: opts.radixPoint
	                    };
	                }
	                return !1;
	            },
	            leadingZeroHandler: function(chrs, maskset, pos, strict, opts, isSelection) {
	                if (!strict) {
	                    var buffer = maskset.buffer.slice("");
	                    if (buffer.splice(0, opts.prefix.length), buffer.splice(buffer.length - opts.suffix.length, opts.suffix.length), 
	                    opts.numericInput === !0) {
	                        var buffer = buffer.reverse(), bufferChar = buffer[0];
	                        if ("0" === bufferChar && void 0 === maskset.validPositions[pos - 1]) return {
	                            pos: pos,
	                            remove: buffer.length - 1
	                        };
	                    } else {
	                        pos -= opts.prefix.length;
	                        var radixPosition = $.inArray(opts.radixPoint, buffer), matchRslt = buffer.slice(0, radixPosition !== -1 ? radixPosition : void 0).join("").match(opts.regex.integerNPart(opts));
	                        if (matchRslt && (radixPosition === -1 || pos <= radixPosition)) {
	                            var decimalPart = radixPosition === -1 ? 0 : parseInt(buffer.slice(radixPosition + 1).join(""));
	                            if (0 === matchRslt[0].indexOf("" !== opts.placeholder ? opts.placeholder.charAt(0) : "0") && (matchRslt.index + 1 === pos || isSelection !== !0 && 0 === decimalPart)) return maskset.buffer.splice(matchRslt.index + opts.prefix.length, 1), 
	                            {
	                                pos: matchRslt.index + opts.prefix.length,
	                                remove: matchRslt.index + opts.prefix.length
	                            };
	                            if ("0" === chrs && pos <= matchRslt.index && matchRslt[0] !== opts.groupSeparator) return !1;
	                        }
	                    }
	                }
	                return !0;
	            },
	            definitions: {
	                "~": {
	                    validator: function(chrs, maskset, pos, strict, opts, isSelection) {
	                        var isValid = opts.signHandler(chrs, maskset, pos, strict, opts);
	                        if (!isValid && (isValid = opts.radixHandler(chrs, maskset, pos, strict, opts), 
	                        !isValid && (isValid = strict ? new RegExp("[0-9" + Inputmask.escapeRegex(opts.groupSeparator) + "]").test(chrs) : new RegExp("[0-9]").test(chrs), 
	                        isValid === !0 && (isValid = opts.leadingZeroHandler(chrs, maskset, pos, strict, opts, isSelection), 
	                        isValid === !0)))) {
	                            var radixPosition = $.inArray(opts.radixPoint, maskset.buffer);
	                            isValid = radixPosition !== -1 && (opts.digitsOptional === !1 || maskset.validPositions[pos]) && opts.numericInput !== !0 && pos > radixPosition && !strict ? {
	                                pos: pos,
	                                remove: pos
	                            } : {
	                                pos: pos
	                            };
	                        }
	                        return isValid;
	                    },
	                    cardinality: 1
	                },
	                "+": {
	                    validator: function(chrs, maskset, pos, strict, opts) {
	                        var isValid = opts.signHandler(chrs, maskset, pos, strict, opts);
	                        return !isValid && (strict && opts.allowMinus && chrs === opts.negationSymbol.front || opts.allowMinus && "-" === chrs || opts.allowPlus && "+" === chrs) && (isValid = !(!strict && "-" === chrs) || ("" !== opts.negationSymbol.back ? {
	                            pos: pos,
	                            c: "-" === chrs ? opts.negationSymbol.front : "+",
	                            caret: pos + 1,
	                            insert: {
	                                pos: maskset.buffer.length,
	                                c: opts.negationSymbol.back
	                            }
	                        } : {
	                            pos: pos,
	                            c: "-" === chrs ? opts.negationSymbol.front : "+",
	                            caret: pos + 1
	                        })), isValid;
	                    },
	                    cardinality: 1,
	                    placeholder: ""
	                },
	                "-": {
	                    validator: function(chrs, maskset, pos, strict, opts) {
	                        var isValid = opts.signHandler(chrs, maskset, pos, strict, opts);
	                        return !isValid && strict && opts.allowMinus && chrs === opts.negationSymbol.back && (isValid = !0), 
	                        isValid;
	                    },
	                    cardinality: 1,
	                    placeholder: ""
	                },
	                ":": {
	                    validator: function(chrs, maskset, pos, strict, opts) {
	                        var isValid = opts.signHandler(chrs, maskset, pos, strict, opts);
	                        if (!isValid) {
	                            var radix = "[" + Inputmask.escapeRegex(opts.radixPoint) + "]";
	                            isValid = new RegExp(radix).test(chrs), isValid && maskset.validPositions[pos] && maskset.validPositions[pos].match.placeholder === opts.radixPoint && (isValid = {
	                                caret: pos + 1
	                            });
	                        }
	                        return isValid;
	                    },
	                    cardinality: 1,
	                    placeholder: function(opts) {
	                        return opts.radixPoint;
	                    }
	                }
	            },
	            onUnMask: function(maskedValue, unmaskedValue, opts) {
	                if ("" === unmaskedValue && opts.nullable === !0) return unmaskedValue;
	                var processValue = maskedValue.replace(opts.prefix, "");
	                return processValue = processValue.replace(opts.suffix, ""), processValue = processValue.replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator), "g"), ""), 
	                opts.unmaskAsNumber ? ("" !== opts.radixPoint && processValue.indexOf(opts.radixPoint) !== -1 && (processValue = processValue.replace(Inputmask.escapeRegex.call(this, opts.radixPoint), ".")), 
	                Number(processValue)) : processValue;
	            },
	            isComplete: function(buffer, opts) {
	                var maskedValue = buffer.join(""), bufClone = buffer.slice();
	                if (opts.postFormat(bufClone, 0, opts), bufClone.join("") !== maskedValue) return !1;
	                var processValue = maskedValue.replace(opts.prefix, "");
	                return processValue = processValue.replace(opts.suffix, ""), processValue = processValue.replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator), "g"), ""), 
	                "," === opts.radixPoint && (processValue = processValue.replace(Inputmask.escapeRegex(opts.radixPoint), ".")), 
	                isFinite(processValue);
	            },
	            onBeforeMask: function(initialValue, opts) {
	                if (opts.numericInput === !0 && (initialValue = initialValue.split("").reverse().join("")), 
	                "" !== opts.radixPoint && isFinite(initialValue)) {
	                    var vs = initialValue.split("."), groupSize = "" !== opts.groupSeparator ? parseInt(opts.groupSize) : 0;
	                    2 === vs.length && (vs[0].length > groupSize || vs[1].length > groupSize) && (initialValue = initialValue.toString().replace(".", opts.radixPoint));
	                }
	                var kommaMatches = initialValue.match(/,/g), dotMatches = initialValue.match(/\./g);
	                if (dotMatches && kommaMatches ? dotMatches.length > kommaMatches.length ? (initialValue = initialValue.replace(/\./g, ""), 
	                initialValue = initialValue.replace(",", opts.radixPoint)) : kommaMatches.length > dotMatches.length ? (initialValue = initialValue.replace(/,/g, ""), 
	                initialValue = initialValue.replace(".", opts.radixPoint)) : initialValue = initialValue.indexOf(".") < initialValue.indexOf(",") ? initialValue.replace(/\./g, "") : initialValue = initialValue.replace(/,/g, "") : initialValue = initialValue.replace(new RegExp(Inputmask.escapeRegex(opts.groupSeparator), "g"), ""), 
	                0 === opts.digits && (initialValue.indexOf(".") !== -1 ? initialValue = initialValue.substring(0, initialValue.indexOf(".")) : initialValue.indexOf(",") !== -1 && (initialValue = initialValue.substring(0, initialValue.indexOf(",")))), 
	                "" !== opts.radixPoint && isFinite(opts.digits) && initialValue.indexOf(opts.radixPoint) !== -1) {
	                    var valueParts = initialValue.split(opts.radixPoint), decPart = valueParts[1].match(new RegExp("\\d*"))[0];
	                    if (parseInt(opts.digits) < decPart.toString().length) {
	                        var digitsFactor = Math.pow(10, parseInt(opts.digits));
	                        initialValue = initialValue.replace(Inputmask.escapeRegex(opts.radixPoint), "."), 
	                        initialValue = Math.round(parseFloat(initialValue) * digitsFactor) / digitsFactor, 
	                        initialValue = initialValue.toString().replace(".", opts.radixPoint);
	                    }
	                }
	                return opts.numericInput === !0 && (initialValue = initialValue.split("").reverse().join("")), 
	                initialValue.toString();
	            },
	            canClearPosition: function(maskset, position, lvp, strict, opts) {
	                var positionInput = maskset.validPositions[position].input, canClear = positionInput !== opts.radixPoint || null !== maskset.validPositions[position].match.fn && opts.decimalProtect === !1 || isFinite(positionInput) || position === lvp || positionInput === opts.groupSeparator || positionInput === opts.negationSymbol.front || positionInput === opts.negationSymbol.back;
	                return canClear;
	            },
	            onKeyDown: function(e, buffer, caretPos, opts) {
	                var $input = $(this);
	                if (e.ctrlKey) switch (e.keyCode) {
	                  case Inputmask.keyCode.UP:
	                    $input.val(parseFloat(this.inputmask.unmaskedvalue()) + parseInt(opts.step)), $input.trigger("setvalue");
	                    break;

	                  case Inputmask.keyCode.DOWN:
	                    $input.val(parseFloat(this.inputmask.unmaskedvalue()) - parseInt(opts.step)), $input.trigger("setvalue");
	                }
	            }
	        },
	        currency: {
	            prefix: "$ ",
	            groupSeparator: ",",
	            alias: "numeric",
	            placeholder: "0",
	            autoGroup: !0,
	            digits: 2,
	            digitsOptional: !1,
	            clearMaskOnLostFocus: !1
	        },
	        decimal: {
	            alias: "numeric"
	        },
	        integer: {
	            alias: "numeric",
	            digits: 0,
	            radixPoint: ""
	        },
	        percentage: {
	            alias: "numeric",
	            digits: 2,
	            radixPoint: ".",
	            placeholder: "0",
	            autoGroup: !1,
	            min: 0,
	            max: 100,
	            suffix: " %",
	            allowPlus: !1,
	            allowMinus: !1
	        }
	    }), Inputmask;
	}(jQuery, Inputmask), function($, Inputmask) {
	    function maskSort(a, b) {
	        var maska = (a.mask || a).replace(/#/g, "9").replace(/\)/, "9").replace(/[+()#-]/g, ""), maskb = (b.mask || b).replace(/#/g, "9").replace(/\)/, "9").replace(/[+()#-]/g, ""), maskas = (a.mask || a).split("#")[0], maskbs = (b.mask || b).split("#")[0];
	        return 0 === maskbs.indexOf(maskas) ? -1 : 0 === maskas.indexOf(maskbs) ? 1 : maska.localeCompare(maskb);
	    }
	    var analyseMaskBase = Inputmask.prototype.analyseMask;
	    return Inputmask.prototype.analyseMask = function(mask, opts) {
	        function reduceVariations(masks, previousVariation, previousmaskGroup) {
	            previousVariation = previousVariation || "", previousmaskGroup = previousmaskGroup || maskGroups, 
	            "" !== previousVariation && (previousmaskGroup[previousVariation] = {});
	            for (var variation = "", maskGroup = previousmaskGroup[previousVariation] || previousmaskGroup, i = masks.length - 1; i >= 0; i--) mask = masks[i].mask || masks[i], 
	            variation = mask.substr(0, 1), maskGroup[variation] = maskGroup[variation] || [], 
	            maskGroup[variation].unshift(mask.substr(1)), masks.splice(i, 1);
	            for (var ndx in maskGroup) maskGroup[ndx].length > 500 && reduceVariations(maskGroup[ndx].slice(), ndx, maskGroup);
	        }
	        function rebuild(maskGroup) {
	            var mask = "", submasks = [];
	            for (var ndx in maskGroup) $.isArray(maskGroup[ndx]) ? 1 === maskGroup[ndx].length ? submasks.push(ndx + maskGroup[ndx]) : submasks.push(ndx + opts.groupmarker.start + maskGroup[ndx].join(opts.groupmarker.end + opts.alternatormarker + opts.groupmarker.start) + opts.groupmarker.end) : submasks.push(ndx + rebuild(maskGroup[ndx]));
	            return mask += 1 === submasks.length ? submasks[0] : opts.groupmarker.start + submasks.join(opts.groupmarker.end + opts.alternatormarker + opts.groupmarker.start) + opts.groupmarker.end;
	        }
	        var maskGroups = {};
	        opts.phoneCodes && opts.phoneCodes.length > 1e3 && (mask = mask.substr(1, mask.length - 2), 
	        reduceVariations(mask.split(opts.groupmarker.end + opts.alternatormarker + opts.groupmarker.start)), 
	        mask = rebuild(maskGroups));
	        var mt = analyseMaskBase.call(this, mask, opts);
	        return mt;
	    }, Inputmask.extendAliases({
	        abstractphone: {
	            groupmarker: {
	                start: "<",
	                end: ">"
	            },
	            countrycode: "",
	            phoneCodes: [],
	            mask: function(opts) {
	                return opts.definitions = {
	                    "#": opts.definitions[9]
	                }, opts.phoneCodes.sort(maskSort);
	            },
	            keepStatic: !0,
	            onBeforeMask: function(value, opts) {
	                var processedValue = value.replace(/^0{1,2}/, "").replace(/[\s]/g, "");
	                return (processedValue.indexOf(opts.countrycode) > 1 || processedValue.indexOf(opts.countrycode) === -1) && (processedValue = "+" + opts.countrycode + processedValue), 
	                processedValue;
	            },
	            onUnMask: function(maskedValue, unmaskedValue, opts) {
	                return unmaskedValue;
	            },
	            inputmode: "tel"
	        }
	    }), Inputmask;
	}(jQuery, Inputmask), function($, Inputmask) {
	    return Inputmask.extendAliases({
	        Regex: {
	            mask: "r",
	            greedy: !1,
	            repeat: "*",
	            regex: null,
	            regexTokens: null,
	            tokenizer: /\[\^?]?(?:[^\\\]]+|\\[\S\s]?)*]?|\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9][0-9]*|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|c[A-Za-z]|[\S\s]?)|\((?:\?[:=!]?)?|(?:[?*+]|\{[0-9]+(?:,[0-9]*)?\})\??|[^.?*+^${[()|\\]+|./g,
	            quantifierFilter: /[0-9]+[^,]/,
	            isComplete: function(buffer, opts) {
	                return new RegExp(opts.regex).test(buffer.join(""));
	            },
	            definitions: {
	                r: {
	                    validator: function(chrs, maskset, pos, strict, opts) {
	                        function RegexToken(isGroup, isQuantifier) {
	                            this.matches = [], this.isGroup = isGroup || !1, this.isQuantifier = isQuantifier || !1, 
	                            this.quantifier = {
	                                min: 1,
	                                max: 1
	                            }, this.repeaterPart = void 0;
	                        }
	                        function analyseRegex() {
	                            var match, m, currentToken = new RegexToken(), opengroups = [];
	                            for (opts.regexTokens = []; match = opts.tokenizer.exec(opts.regex); ) switch (m = match[0], 
	                            m.charAt(0)) {
	                              case "(":
	                                opengroups.push(new RegexToken((!0)));
	                                break;

	                              case ")":
	                                groupToken = opengroups.pop(), opengroups.length > 0 ? opengroups[opengroups.length - 1].matches.push(groupToken) : currentToken.matches.push(groupToken);
	                                break;

	                              case "{":
	                              case "+":
	                              case "*":
	                                var quantifierToken = new RegexToken((!1), (!0));
	                                m = m.replace(/[{}]/g, "");
	                                var mq = m.split(","), mq0 = isNaN(mq[0]) ? mq[0] : parseInt(mq[0]), mq1 = 1 === mq.length ? mq0 : isNaN(mq[1]) ? mq[1] : parseInt(mq[1]);
	                                if (quantifierToken.quantifier = {
	                                    min: mq0,
	                                    max: mq1
	                                }, opengroups.length > 0) {
	                                    var matches = opengroups[opengroups.length - 1].matches;
	                                    match = matches.pop(), match.isGroup || (groupToken = new RegexToken((!0)), groupToken.matches.push(match), 
	                                    match = groupToken), matches.push(match), matches.push(quantifierToken);
	                                } else match = currentToken.matches.pop(), match.isGroup || (groupToken = new RegexToken((!0)), 
	                                groupToken.matches.push(match), match = groupToken), currentToken.matches.push(match), 
	                                currentToken.matches.push(quantifierToken);
	                                break;

	                              default:
	                                opengroups.length > 0 ? opengroups[opengroups.length - 1].matches.push(m) : currentToken.matches.push(m);
	                            }
	                            currentToken.matches.length > 0 && opts.regexTokens.push(currentToken);
	                        }
	                        function validateRegexToken(token, fromGroup) {
	                            var isvalid = !1;
	                            fromGroup && (regexPart += "(", openGroupCount++);
	                            for (var mndx = 0; mndx < token.matches.length; mndx++) {
	                                var matchToken = token.matches[mndx];
	                                if (matchToken.isGroup === !0) isvalid = validateRegexToken(matchToken, !0); else if (matchToken.isQuantifier === !0) {
	                                    var crrntndx = $.inArray(matchToken, token.matches), matchGroup = token.matches[crrntndx - 1], regexPartBak = regexPart;
	                                    if (isNaN(matchToken.quantifier.max)) {
	                                        for (;matchToken.repeaterPart && matchToken.repeaterPart !== regexPart && matchToken.repeaterPart.length > regexPart.length && !(isvalid = validateRegexToken(matchGroup, !0)); ) ;
	                                        isvalid = isvalid || validateRegexToken(matchGroup, !0), isvalid && (matchToken.repeaterPart = regexPart), 
	                                        regexPart = regexPartBak + matchToken.quantifier.max;
	                                    } else {
	                                        for (var i = 0, qm = matchToken.quantifier.max - 1; i < qm && !(isvalid = validateRegexToken(matchGroup, !0)); i++) ;
	                                        regexPart = regexPartBak + "{" + matchToken.quantifier.min + "," + matchToken.quantifier.max + "}";
	                                    }
	                                } else if (void 0 !== matchToken.matches) for (var k = 0; k < matchToken.length && !(isvalid = validateRegexToken(matchToken[k], fromGroup)); k++) ; else {
	                                    var testExp;
	                                    if ("[" == matchToken.charAt(0)) {
	                                        testExp = regexPart, testExp += matchToken;
	                                        for (var j = 0; j < openGroupCount; j++) testExp += ")";
	                                        var exp = new RegExp("^(" + testExp + ")$");
	                                        isvalid = exp.test(bufferStr);
	                                    } else for (var l = 0, tl = matchToken.length; l < tl; l++) if ("\\" !== matchToken.charAt(l)) {
	                                        testExp = regexPart, testExp += matchToken.substr(0, l + 1), testExp = testExp.replace(/\|$/, "");
	                                        for (var j = 0; j < openGroupCount; j++) testExp += ")";
	                                        var exp = new RegExp("^(" + testExp + ")$");
	                                        if (isvalid = exp.test(bufferStr)) break;
	                                    }
	                                    regexPart += matchToken;
	                                }
	                                if (isvalid) break;
	                            }
	                            return fromGroup && (regexPart += ")", openGroupCount--), isvalid;
	                        }
	                        var bufferStr, groupToken, cbuffer = maskset.buffer.slice(), regexPart = "", isValid = !1, openGroupCount = 0;
	                        null === opts.regexTokens && analyseRegex(), cbuffer.splice(pos, 0, chrs), bufferStr = cbuffer.join("");
	                        for (var i = 0; i < opts.regexTokens.length; i++) {
	                            var regexToken = opts.regexTokens[i];
	                            if (isValid = validateRegexToken(regexToken, regexToken.isGroup)) break;
	                        }
	                        return isValid;
	                    },
	                    cardinality: 1
	                }
	            }
	        }
	    }), Inputmask;
	}(jQuery, Inputmask);

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * timefield.js - a component to handle time inputs. 
	 * 
	 * @author Alexandre Thebaldi <ahlechandre@gmail.com>
	 * @requires componentize
	 */
	(function () {
	  'use strict';
	  // Dependency.
	  __webpack_require__(6);
	  /**
	   * 
	   * @class
	   */
	  function AvaTimefield(element) {
	    this.element = element;

	    // Initializes the instance.
	    this.init();
	  };

	  /**
	   * Stories the datasets used by this component.
	   * 
	   */
	  AvaTimefield.prototype._datasets = {
	    FORMAT: 'format',
	  };
	  
	  /**
	   * Stories the css classes used by this component.
	   * 
	   */
	  AvaTimefield.prototype._cssClasses = {
	    INPUT: 'ava-timefield__input',
	    LABEL: 'ava-timefield__label',
	    LABEL_ACTIVE_MATERIALIZE: 'active',
	  };

	  /**
	   * Stories the constant strings used by this component.
	   * 
	   */
	  AvaTimefield.prototype._constants = {};

	  /**
	   * Stories the input element used by this component.
	   * 
	   */
	  AvaTimefield.prototype._input = {};

	  /**
	   * Stories the label element used by this component.
	   * 
	   */
	  AvaTimefield.prototype._label = {};

	  /**
	   * Stories the options of material timefield.
	   * 
	   * @type {object}
	   */
	  AvaTimefield.prototype.options = {
	    format: 'hh:mm'
	  };

	  /**
	   * Returns the input element.
	   * 
	   * @return {HTMLElement | null} 
	   */
	  AvaTimefield.prototype._getInput = function () {
	    return this.element.querySelector('.' + this._cssClasses.INPUT);
	  };

	  /**
	   * Returns the label element.
	   * 
	   * @return {HTMLElement | null} 
	   */
	  AvaTimefield.prototype._getLabel = function () {
	    return this.element.querySelector('.' + this._cssClasses.LABEL);
	  };

	  /**
	   * Check if label is active.
	   * 
	   * @return {boolean}
	   */
	  AvaTimefield.prototype._isActiveLabel = function () {
	    return this._label.classList.contains(this._cssClasses.LABEL_ACTIVE_MATERIALIZE);
	  };

	  /**
	   * Defines label as active.
	   * 
	   */
	  AvaTimefield.prototype._setActiveLabel = function () {
	    return this._label.classList.add(this._cssClasses.LABEL_ACTIVE_MATERIALIZE);
	  };

	  /**
	   * Defines label as active.
	   * 
	   */
	  AvaTimefield.prototype._unsetActiveLabel = function () {
	    return this._label.classList.remove(this._cssClasses.LABEL_ACTIVE_MATERIALIZE);
	  };
	  
	  /**
	   * Defines the format of input field.
	   */
	  AvaTimefield.prototype._getInputFormat = function () { 
	    var format;
	    var _input = this._getInput();

	    if (_input && _input.dataset[this._datasets.FORMAT]) {
	      format = _input.dataset[this._datasets.FORMAT];
	    } else {
	      format = this.options.format;
	    }
	    return format;
	  };

	  /**
	   * Initializes the timefield.
	   * 
	   */
	  AvaTimefield.prototype.create = function () {

	    if (!this._isActiveLabel()) this._setActiveLabel();

	    if (typeof Inputmask !== 'undefined') {
	      // Putting date mask.
	      Inputmask(this._getInputFormat()).mask(this._getInput());
	    }
	  };

	  /**
	   * Destroy the timefield.
	   * 
	   */
	  AvaTimefield.prototype.destroy = function () {
	    this._unsetActiveLabel();
	  };

	  /**
	   * Update the timefield.
	   * 
	   */
	  AvaTimefield.prototype.update = function () {
	    this.destroy();
	    this.create();
	  };

	  /**
	   * Clear the timefield.
	   * 
	   */
	  AvaTimefield.prototype.clear = function () {
	    this._input.value = '';
	  };

	  /**
	   * Defines the value of timefield.
	   * 
	   * @param {string} value
	   */
	  AvaTimefield.prototype.setValue = function (value) {
	    /** @type {DateConstructor} */
	    var dateObj;
	    var picker;
	    var dateArr = [];
	    var valueSplit = [];
	    this._input.value = value;
	    this.update();
	  };

	  /**
	   * Initializes the instance.
	   * 
	   */
	  AvaTimefield.prototype.init = function () {

	    if (!this.element) return;
	    
	    if (typeof $ === 'undefined' || typeof jQuery === 'undefined') {
	      console.warn('Please, load jQuery. Datefield Component has jQuery as dependency.');
	      return;
	    }

	    this._input = this._getInput();
	    this._label = this._getLabel();

	    if (!this._input) return;

	    // Initial initialization.
	    this.create();
	  };

	  // Registers the component. "Componentize" object must be available globally.
	  Componentize.register({
	    name: 'AvaTimefield',
	    constructor: AvaTimefield,
	    cssClass: 'ava-timefield',
	  });
	})();

/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * dialog.js - a component to handle dialogs. 
	 * 
	 * @author Alexandre Thebaldi <ahlechandre@gmail.com>
	 * @requires componentize
	 */
	(function () {
	  'use strict';
	  /**
	   * 
	   * @class
	   */
	  function AvaDialog(element) {
	    this.element = element;

	    // Initializes the instance.
	    this.init();
	  };

	  /**
	   * Stories the css classes used by this component.
	   * 
	   */
	  AvaDialog.prototype._cssClasses = {};

	  /**
	   * Stories the constant strings used by this component.
	   * 
	   */
	  AvaDialog.prototype._constants = {};


	  /**
	   * Defines the custom events used by this component. 
	   * 
	   */
	  AvaDialog.prototype._customEvents = {
	    onready: new CustomEvent('onready', {
	      bubbles: true,
	      cancelable: true,
	    }),
	    onclose: new CustomEvent('onclose', {
	      bubbles: true,
	      cancelable: true,
	    }),
	  };

	  /**
	   * Initializes the dialog component.
	   * 
	   */
	  AvaDialog.prototype.create = function () {
	    var triggerElementHref = '#' + this.element.getAttribute('id');
	    var triggerElements = document.querySelectorAll('[href="' + triggerElementHref + '"]');
	    var onReady;
	    var onComplete;
	    var dialogObject;

	    if (!triggerElements) return;
	    
	    onReady = function () {
	      this.element.dispatchEvent(this._customEvents.onready);
	    };
	    onComplete = function () {
	      this.element.dispatchEvent(this._customEvents.onclose);      
	    };
	    dialogObject = {
	      ready: onReady.bind(this),
	      complete: onComplete.bind(this),
	    };
	    
	    // jQuery initialization.
	    if ($(triggerElements).modal) {
	      $(this.element).modal(dialogObject);
	    } else if ($(triggerElements).leanModal) {
	      $(triggerElements).leanModal(dialogObject);
	    }
	  };

	  /**
	   * Initializes the instance.
	   * 
	   */
	  AvaDialog.prototype.init = function () {

	    if (!this.element) return;

	    if (typeof $ === 'undefined' || typeof jQuery === 'undefined') {
	      console.warn('Please, load jQuery. Dialog Component has jQuery as dependency.');
	      return;
	    }

	    // Initializes the dialog.
	    this.create();
	  };

	  // Registers the component. "Componentize" object must be available globally.
	  Componentize.register({
	    name: 'AvaDialog',
	    constructor: AvaDialog,
	    cssClass: 'ava-dialog',
	  });
	})();

/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * dialogable.js - a component to dinamically get dialog contents. 
	 * 
	 * @author Alexandre Thebaldi <ahlechandre@gmail.com>
	 * @requires componentize
	 */
	(function () {
	  'use strict';
	  /**
	   * 
	   * @class
	   */
	  function AvaDialogable(element) {
	    this.element = element;

	    // Initializes the instance.
	    this.init();
	  };

	  /**
	   * Stories the css classes used by this component.
	   * 
	   */
	  AvaDialogable.prototype._cssClasses = {
	    DIALOG: 'ava-dialog',
	    DIALOG_CONTENT: 'ava-dialog__content',
	    DIALOG_CONTENT_LOADED: 'is-loaded',
	  };

	  /**
	   * Stories the constant strings used by this component.
	   * 
	   */
	  AvaDialogable.prototype._constants = {
	    DATASET_URL: 'dialog-url',
	    DATASET_EXPIRES: 'dialog-expires',
	    DATASET_URL_CAMEL: 'dialogUrl'
	  };

	  /**
	   * Defines the custom events.
	   * 
	   */
	  AvaDialogable.prototype._customEvents = {
	    onsuccess: new CustomEvent('onsuccess', {
	      bubbles: true,
	      cancelable: true,
	    }),
	  };

	  /**
	   * Stories the flag to indicate the content loading behavior.
	   *
	   * @type {boolean}
	   */
	  AvaDialogable.prototype._defaultBehavior = true;

	  /**
	   * Stories the dialog element.
	   *
	   * @type {HTMLElement}
	   */
	  AvaDialogable.prototype._dialog = {};

	  /**
	   * Stories the dialog content element.
	   *
	   * @type {HTMLElement} 
	   */
	  AvaDialogable.prototype._dialogContent = {};

	  /**
	   * Stories the url.
	   * 
	   * @type {string | undefined}
	   */
	  AvaDialogable.prototype.contentUrl = undefined;

	  /**
	   * Stories the callback function called on get content success.
	   * 
	   * @type {function | undefined}
	   */
	  AvaDialogable.prototype.onContentSuccess = undefined;

	  /**
	   * Stories the callback function called on get content complete.
	   * 
	   * @type {function | undefined}
	   */
	  AvaDialogable.prototype.onContentComplete = undefined;

	  /**
	   * Stories the callback function called on get content error.
	   * 
	   * @type {function | undefined}
	   */
	  AvaDialogable.prototype.onContentError = undefined;

	  /**
	   * Returns the dialog element.
	   * 
	   * @return {HTMLElement}
	   */
	  AvaDialogable.prototype._getDialog = function () {
	    var selectorId = this.element.getAttribute('href');
	    var element = document.querySelector('.' + this._cssClasses.DIALOG + selectorId);
	    var content = element.querySelector('.' + this._cssClasses.DIALOG_CONTENT);

	    return {
	      element: element,
	      content: content
	    };
	  };

	  /**
	   * Get ajax options. 
	   * 
	   * @param {string} url
	   * @return {object}
	   */
	  AvaDialogable.prototype._getAjaxOptions = function (url) {
	    var onSuccess = function (response) {
	      this._onRequestSuccess(response);
	      this.element.dispatchEvent(this._customEvents.onsuccess);

	      if (typeof this.onContentSuccess === 'function') {
	        this.onContentSuccess(response);
	      }
	    };
	    var onComplete = function () {

	      if (typeof this.onContentComplete === 'function') {
	        this.onContentComplete();
	      }
	    };
	    var onError = function (err, status, throwErr) {

	      if (typeof this.onContentError === 'function') {
	        this.onContentError(err, status, throwErr);
	      }
	    };
	    var options = {
	      method: 'get',
	      url: url,
	      complete: onComplete.bind(this),
	      error: onError.bind(this),
	      success: onSuccess.bind(this),
	    };

	    return options;
	  };

	  /**
	   * Defines the callback for get content request success. 
	   * 
	   * @param {object} response
	   */
	  AvaDialogable.prototype._onRequestSuccess = function (response) {
	    // Javascript vanilla. 
	    // this._dialogContent.innerHTML = response; 
	    // jQuery inserts.
	    $(this._dialogContent).html(response);

	    if (typeof Componentize !== 'undefined') {
	      Componentize.upgradeAll();
	    } else {
	      console.warn('Please, load Componentize to upgrade the components.');
	    }
	    this._setLoaded();
	  };

	  /**
	   * Defines the dialogable as loaded.
	   * 
	   */
	  AvaDialogable.prototype._setLoaded = function () {
	    // Flag to check if content already is loaded.
	    this._dialogContent.classList.add(this._cssClasses.DIALOG_CONTENT_LOADED);
	  };

	  /**
	   * Defines the dialogable as not loaded.
	   * 
	   */
	  AvaDialogable.prototype._unsetLoaded = function () {
	    // Flag to check if content already is loaded.
	    this._dialogContent.classList.remove(this._cssClasses.DIALOG_CONTENT_LOADED);
	  };

	  /**
	   * Sends a ajax request. 
	   *
	   * @param {object} options 
	   * @return {object}
	   */
	  AvaDialogable.prototype._sendAjaxRequest = function (options) {

	    if (!$ || !jQuery)
	      throw new Error('Please, load jQuery.');

	    $.ajax(options);
	  };

	  /**
	   * Get content of a given url and put into dialog.
	   * 
	   * @param {string} optionalUrl
	   */
	  AvaDialogable.prototype.getContent = function (optionalUrl) {
	    var url /** @type {object} */;
	    var options /** @type {object} */;
	    var datasetUrl = this.element.getAttribute('data-' + this._constants.DATASET_URL);

	    if (typeof optionalUrl === 'string' && optionalUrl.length) {
	      url = optionalUrl;
	    }
	    else if (datasetUrl && datasetUrl.length) {
	      url = datasetUrl;
	    }
	    else if (typeof this.contentUrl === 'string' && this.contentUrl.length) {
	      url = this.contentUrl;
	    }
	    else {
	      return;
	    }

	    options = this._getAjaxOptions(url);
	    this._sendAjaxRequest(options);
	  };

	  /**
	   * Check if dialog content is already loaded.
	   * 
	   * @return {boolean}
	   */
	  AvaDialogable.prototype.isLoaded = function () {
	    return this._dialogContent.classList.contains(this._cssClasses.DIALOG_CONTENT_LOADED);
	  };

	  /**
	   * Check if dialog content must expires.
	   * 
	   * @return {boolean}
	   */
	  AvaDialogable.prototype.isExpires = function () {
	    return (this.element.getAttribute('data-' + this._constants.DATASET_EXPIRES) !== null);
	  };

	  /**
	   * Disable default behavior.
	   * 
	   */
	  AvaDialogable.prototype.disableDefaultBehavior = function () {
	    this._defaultBehavior = false;
	  };

	  /**
	   * Enable default behavior.
	   * 
	   */
	  AvaDialogable.prototype.enableDefaultBehavior = function () {
	    this._defaultBehavior = true;
	  };

	  /**
	   * Event listener to element on click.
	   * 
	   */
	  AvaDialogable.prototype._elementOnClick = function (event) {

	    if ((this._defaultBehavior && !this.isLoaded()) || this.isExpires()) {
	      this.getContent();
	    }
	  };

	  /**
	   * Event listener to dialog element on open.
	   * 
	   */
	  AvaDialogable.prototype._dialogOnReady = function (event) { };

	  /**
	   * Event listener to dialog element on close.
	   * 
	   */
	  AvaDialogable.prototype._dialogOnClose = function (event) {

	    if (this.isExpires()) {
	      // Removes the content on close if the dialogable must expires.
	      while (this._dialogContent.firstChild) {
	        this._dialogContent.removeChild(this._dialogContent.firstChild);
	      }      
	      this._unsetLoaded();
	    }
	  };

	  /**
	   * Initializes the instance.
	   * 
	   */
	  AvaDialogable.prototype.init = function () {
	    var dialog /** @type {object} */;

	    if (!this.element) return;

	    dialog = this._getDialog();
	    this._dialog = dialog['element'];
	    this._dialogContent = dialog['content'];

	    if (!this._dialog) return;

	    if (!this._dialogContent) {
	      console.warn('Add a content element (' + this._cssClasses.DIALOG_CONTENT + ') into dialog (' + this._cssClasses.DIALOG + ')');
	      return;
	    }

	    this.element.addEventListener('click', this._elementOnClick.bind(this));
	    this._dialog.addEventListener('onready', this._dialogOnReady.bind(this));
	    this._dialog.addEventListener('onclose', this._dialogOnClose.bind(this));
	  };

	  // Registers the component. "Componentize" object must be available globally.
	  Componentize.register({
	    name: 'AvaDialogable',
	    constructor: AvaDialogable,
	    cssClass: 'ava-dialogable',
	  });
	})();

/***/ },
/* 10 */
/***/ function(module, exports) {

	/**
	 * drawer.js - a component to handle drawers (sidenav). 
	 * 
	 * @author Alexandre Thebaldi <ahlechandre@gmail.com>
	 * @requires componentize
	 */
	(function () {
	  'use strict';
	  /**
	   * 
	   * @class
	   */
	  function AvaDrawer(element) {
	    this.element = element;

	    // Initializes the instance.
	    this.init();
	  };

	  /**
	   * Stories the css classes used by this component.
	   * 
	   */
	  AvaDrawer.prototype._cssClasses = {};

	  /**
	   * Stories the constant strings used by this component.
	   * 
	   */
	  AvaDrawer.prototype._constants = {
	    DATASET_TRIGGER: 'activates'
	  };

	  /**
	   * Stories the trigger element used to activate the drawer.
	   * 
	   */
	  AvaDrawer.prototype._trigger = {};

	  /**
	   * Returns the trigger element used to activate the drawer.
	   * 
	   * @return {HTMLElement}
	   */
	  AvaDrawer.prototype._getTrigger = function () {
	    var drawerId = this.element.getAttribute('id');
	    return document.querySelector('[data-' + this._constants.DATASET_TRIGGER + '="' + drawerId + '"]');
	  };

	  /**
	   * Defines the options of drawer.
	   * 
	   */
	  AvaDrawer.prototype.options = {
	    menuWidth: 240,
	    edge: 'left',
	    closeOnClick: false
	  };

	  /**
	   * Initializes the drawer component.
	   * 
	   */
	  AvaDrawer.prototype.create = function () {

	    // jQuery initialization.
	    $(this._trigger).sideNav(this.options);
	  };

	  /**
	   * Initializes the instance.
	   * 
	   */
	  AvaDrawer.prototype.init = function () {

	    if (!this.element) return;


	    if (typeof $ === 'undefined' || typeof jQuery === 'undefined') {
	      console.warn('Please, load jQuery. Drawer Component has jQuery as dependency.');
	      return;
	    }
	    this._trigger = this._getTrigger();

	    if (this._trigger) {
	      this.create();
	    }
	  };

	  // Registers the component. "Componentize" object must be available globally.
	  Componentize.register({
	    name: 'AvaDrawer',
	    constructor: AvaDrawer,
	    cssClass: 'ava-drawer',
	  });
	})();

/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * expandable.js - a component to hide/show contents. 
	 * 
	 * @author Alexandre Thebaldi <ahlechandre@gmail.com>
	 * @requires componentize
	 */
	(function () {
	  'use strict';
	  /**
	   * 
	   * @class
	   */
	  function AvaExpandable(element) {
	    this.element = element;

	    // Initializes the instance.
	    this.init();
	  };

	  /**
	   * Stories the css classes used by this component.
	   * 
	   */
	  AvaExpandable.prototype._cssClasses = {
	    IS_OFF: 'is-off',
	    IS_ON: 'is-on',
	    CONTENT: 'ava-expandable__content',
	    ACTION: 'ava-expandable__action',
	    ACTION_ICON_ALIGN: 'right',
	    ACTION_ICON_MATERIAL_ICONS: 'material-icons',
	  };

	  /**
	   * Stories the constant strings used by this component.
	   * 
	   */
	  AvaExpandable.prototype._constants = {
	    MESSAGE_ACTION_TURN_OFF: 'ocultar',
	    MESSAGE_ACTION_TURN_ON: 'mostrar todos',
	    ICON_ACTION_TURN_OFF: 'expand_less',
	    ICON_ACTION_TURN_ON: 'expand_more',
	    STATE_OFF: 'off',
	    STATE_ON: 'on',
	  };

	  /**
	   * Stories the content to be expandable.
	   *
	   * @type {HTMLElement} 
	   */
	  AvaExpandable.prototype._content = {};

	  /**
	   * Stories the button trigger to expand content.
	   *
	   * @type {HTMLElement} 
	   */
	  AvaExpandable.prototype._action = {};

	  /**
	   * Returns the current state of expandable.
	   * 
	   * @return {string | null}
	   */
	  AvaExpandable.prototype._getState = function () {
	    var isOn = this.element.classList.contains(this._cssClasses.IS_ON);
	    var isOff = this.element.classList.contains(this._cssClasses.IS_OFF);
	    var state = isOn ? this._constants.STATE_ON :
	      (isOff ? this._constants.STATE_OFF : null);
	    return state;
	  };

	  /**
	   * Handles the on click event on expand button.
	   * 
	   */
	  AvaExpandable.prototype._expandOnClick = function (event) {
	    var state = this._getState();
	    event.preventDefault();
	    
	    // Needs to hide or show the contents.
	    if (state === this._constants.STATE_OFF) {
	      // Turn on.
	      this.on();
	    } else if (state === this._constants.STATE_ON) {
	      // Turn off.
	      this.off();
	    }
	  };

	  /**
	   * Returns the current content to be expandable.
	   * 
	   * @return {HTMLElement | null}
	   */
	  AvaExpandable.prototype._getContent = function () {
	    return this.element.querySelector('.' + this._cssClasses.CONTENT);
	  };

	  /**
	   * Returns the current action button that expand content.
	   * 
	   * @return {HTMLElement | null}
	   */
	  AvaExpandable.prototype._getAction = function () {
	    return this.element.querySelector('.' + this._cssClasses.ACTION);
	  };

	  /**
	   * Hides the expandable content and changes the state to "off".
	   * 
	   * @return {boolean} true - if turned off. 
	   *                   false - if already is off.
	   */
	  AvaExpandable.prototype.off = function () {

	    // Returns false if already is off.    
	    if (this._getState() === this._constants.STATE_OFF) return false;

	    this.element.classList.remove(this._cssClasses.IS_ON);
	    this.element.classList.add(this._cssClasses.IS_OFF);
	    this._updateAction(this._constants.STATE_OFF);
	    return true;
	  };

	  /**
	   * Shows the expandable content and changes the state to "on".
	   * 
	   * @return {boolean} true - if turned on. 
	   *                   false - if already is on.
	   */
	  AvaExpandable.prototype.on = function () {
	    // Returns false if already is on.    
	    if (this._getState() === this._constants.STATE_ON) return false;

	    this.element.classList.remove(this._cssClasses.IS_OFF);
	    this.element.classList.add(this._cssClasses.IS_ON);
	    this._updateAction(this._constants.STATE_ON);
	    return true;
	  };

	  /**
	   * Updates the action button content to current state. 
	   * 
	   */
	  AvaExpandable.prototype._updateAction = function (state) {
	    var iconTextContent /** @type {string} */;
	    var actionTextContent /** @type {string} */;
	    var icon = document.createElement('i');
	    icon.classList.add(this._cssClasses.ACTION_ICON_MATERIAL_ICONS);
	    icon.classList.add(this._cssClasses.ACTION_ICON_ALIGN);
	    
	    if (state === this._constants.STATE_OFF) {
	      iconTextContent = this._constants.ICON_ACTION_TURN_ON;
	      actionTextContent = this._constants.MESSAGE_ACTION_TURN_ON;
	    } else if (state === this._constants.STATE_ON) {
	      iconTextContent = this._constants.ICON_ACTION_TURN_OFF;
	      actionTextContent = this._constants.MESSAGE_ACTION_TURN_OFF;      
	    }
	    icon.textContent = iconTextContent;
	    this._action.innerHTML = '';
	    this._action.textContent = actionTextContent;
	    this._action.appendChild(icon);
	  };

	  /**
	   * Initializes the instance.
	   * 
	   */
	  AvaExpandable.prototype.init = function () {

	    if (!this.element) return;

	    this._content = this._getContent();
	    this._action = this._getAction();

	    if (!this._content || !this._action) return;

	    // Initial hide the content.
	    this.off();

	    this._action.addEventListener('click', this._expandOnClick.bind(this))
	  };

	  // Registers the component. "Componentize" object must be available globally.
	  Componentize.register({
	    name: 'AvaExpandable',
	    constructor: AvaExpandable,
	    cssClass: 'ava-expandable',
	  });
	})();

/***/ },
/* 12 */
/***/ function(module, exports) {

	/**
	 * navbar.js - a component to handle navbars. 
	 * 
	 * @author Alexandre Thebaldi <ahlechandre@gmail.com>
	 * @requires componentize
	 */
	(function () {
	  'use strict';
	  /**
	   * 
	   * @class
	   */
	  function AvaNavbar(element) {
	    this.element = element;

	    // Initializes the instance.
	    this.init();
	  };

	  /**
	   * Stories the css classes used by this component.
	   * 
	   */
	  AvaNavbar.prototype._cssClasses = {
	    NAVBAR_TABS: 'ava-navbar--tabs',
	    TABS: 'ava-tabs',
	    TABS_ONLY_ICONS: 'ava-tabs--icons',
	  };

	  /**
	   * Stories the constant strings used by this component.
	   * 
	   */
	  AvaNavbar.prototype._constants = {};

	  /**
	   * Stories the tabs element if exists.
	   * 
	   */
	  AvaNavbar.prototype._tabs = {};

	  /**
	   * Returns the tabs element.
	   * 
	   * @return {HTMLElement | null}
	   */
	  AvaNavbar.prototype._getTabs = function () {
	    return this.element.querySelector('.' + this._cssClasses.TABS);
	  };

	  /**
	   * Check if navbar is with tabs.
	   * 
	   * @return {boolean}
	   */
	  AvaNavbar.prototype._isTabs = function () {
	    return this.element.classList.contains(this._cssClasses.NAVBAR_TABS);
	  };
	  
	  /**
	   * Shows only icons in tabs on scroll.
	   * 
	   */
	  AvaNavbar.prototype._onScrollShowIcons = function () {
	    var navbarHeight = this.element.scrollHeight;
	    
	    if (!this._tabs) return;
	    
	    window.addEventListener('scroll', function (event) {
	      
	      if (window.scrollY > navbarHeight) {
	        this._tabs.classList.add(this._cssClasses.TABS_ONLY_ICONS);    
	      } else {
	        this._tabs.classList.remove(this._cssClasses.TABS_ONLY_ICONS);            
	      }
	    }.bind(this));
	  };
	  
	  /**
	   * Initializes the instance.
	   * 
	   */
	  AvaNavbar.prototype.init = function () {

	    if (!this.element) return;
	    
	    if (this._isTabs()) {
	      this._tabs = this._getTabs();
	      this._onScrollShowIcons();      
	    }
	  };

	  // Registers the component. "Componentize" object must be available globally.
	  Componentize.register({
	    name: 'AvaNavbar',
	    constructor: AvaNavbar,
	    cssClass: 'ava-navbar',
	  });
	})();

/***/ },
/* 13 */
/***/ function(module, exports) {

	/**
	 * drawer.js - a component to handle drawers (sidenav). 
	 * 
	 * @author Alexandre Thebaldi <ahlechandre@gmail.com>
	 * @requires componentize
	 */
	(function () {
	  'use strict';
	  /**
	   * 
	   * @class
	   */
	  function AvaPresentation(element) {
	    this.element = element;

	    // Initializes the instance.
	    this.init();
	  };

	  /**
	   * Stories the css classes used by this component.
	   * 
	   */
	  AvaPresentation.prototype._cssClasses = {};

	  /**
	   * Stories the constant strings used by this component.
	   * 
	   */
	  AvaPresentation.prototype._constants = {
	    DATASET_NEXT: 'slider-next',
	    DATASET_PREV: 'slider-prev',
	  };

	  /**
	   * Stories the triggers element used to next action on slider.
	   * 
	   */
	  AvaPresentation.prototype._nexts = {};

	  /**
	   * Stories the triggers element used to prev action on slider.
	   * 
	   */
	  AvaPresentation.prototype._prevs = {};

	  /**
	   * Returns the actions of slider.
	   * 
	   * @return {object}
	   */
	  AvaPresentation.prototype._getElements = function () {
	    var nexts = this.element.querySelectorAll('[data-' + this._constants.DATASET_NEXT + ']');
	    var prevs = this.element.querySelectorAll('[data-' + this._constants.DATASET_PREV + ']');

	    return {
	      nexts: nexts,
	      prevs: prevs,
	    };
	  };

	  /**
	   * Defines the options of slider.
	   * 
	   */
	  AvaPresentation.prototype.options = {
	    full_width: true,
	    interval: 20000
	  };

	  /**
	   * Defines the nexts/prevs actions.
	   * 
	   */
	  AvaPresentation.prototype._setControls = function () {
	    var i;
	    
	    if (this._nexts) {

	      for (i = 0; i < this._nexts.length; i++) {
	        
	        this._nexts[i].addEventListener('click', function (event) {
	          event.preventDefault();
	          // jQuery initialization.
	          $(this.element).slider('next');
	        }.bind(this));
	      }
	    }

	    if (this._prevs) {

	      for (i = 0; i < this._prevs.length; i++) {
	        
	        this._prevs[i].addEventListener('click', function (event) {
	          event.preventDefault();
	          // jQuery initialization.
	          $(this.element).slider('prev');
	        }.bind(this));
	      }
	    }
	  };

	  /**
	   * Initializes the drawer component.
	   * 
	   */
	  AvaPresentation.prototype.create = function () {
	    var i;

	    // jQuery initialization.
	    $(this.element).slider(this.options);
	    this._setControls();
	  };

	  /**
	   * Initializes the instance.
	   * 
	   */
	  AvaPresentation.prototype.init = function () {
	    var elements /** @type {object} */;

	    if (!this.element) return;

	    if (typeof $ === 'undefined' || typeof jQuery === 'undefined') {
	      console.warn('Please, load jQuery. Presentation Component has jQuery as dependency.');
	      return;
	    }

	    elements = this._getElements();
	    this._nexts = elements['nexts'];
	    this._prevs = elements['prevs'];
	    this.create();
	  };

	  // Registers the component. "Componentize" object must be available globally.
	  Componentize.register({
	    name: 'AvaPresentation',
	    constructor: AvaPresentation,
	    cssClass: 'ava-slider-presentation',
	  });
	})();

/***/ },
/* 14 */
/***/ function(module, exports) {

	/**
	 * select.js - a component to handle selects. 
	 * 
	 * @author Alexandre Thebaldi <ahlechandre@gmail.com>
	 * @requires componentize
	 */
	(function () {
	  'use strict';
	  /**
	   * 
	   * @class
	   */
	  function AvaSelectfield(element) {
	    this.element = element;
	    
	    // Initializes the instance.
	    this.init();
	  };

	  /**
	   * Stories the css classes used by this component.
	   * 
	   */
	  AvaSelectfield.prototype._cssClasses = {
	    SELECT: 'ava-selectfield__select',
	    LABEL: 'ava-selectfield__label',
	    IS_CREATED: 'is-created'
	  };

	  /**
	   * Stories the constant strings used by this component.
	   * 
	   */
	  AvaSelectfield.prototype._constants = {};


	  /**
	   * Stories the select element used by this component.
	   * 
	   * @type {HTMLElement}
	   */
	  AvaSelectfield.prototype._select = {};

	  /**
	   * Stories the label element used by this component.
	   * 
	   * @type {HTMLElement}
	   */
	  AvaSelectfield.prototype._label = {};
	  
	  /**
	   * Returns the select element used by this component.
	   * 
	   * @return {HTMLElement}
	   */
	  AvaSelectfield.prototype._getSelect = function () {
	    return this.element.querySelector('select.' + this._cssClasses.SELECT);
	  };

	  /**
	   * Returns the label element used by this component.
	   * 
	   * @return {HTMLElement}
	   */
	  AvaSelectfield.prototype._getLabel = function () {
	    return this.element.querySelector('.' + this._cssClasses.LABEL);
	  };

	  /**
	   * Check if the select already is initialized.
	   * 
	   * @return {boolean}
	   */
	  AvaSelectfield.prototype._isCreated = function () {
	    return this.element.classList.contains(this._cssClasses.IS_CREATED);
	  };
	  
	  /**
	   * Selects an option.
	   * 
	   * @param {string} value
	   */
	  AvaSelectfield.prototype.select = function (value) {
	    this._select.value = value;
	    this.update();
	  };
	  
	  /**
	   * Returns the current value of select.
	   * 
	   * @return {string}
	   */
	  AvaSelectfield.prototype.getValue = function () {
	    return this._select.value;
	  };
	  
	  /**
	   * Initializes the select.
	   * 
	   */
	  AvaSelectfield.prototype.create = function () {

	    if (this._isCreated()) return;

	    // jQuery initialization.
	    $(this._select).material_select();
	    this.element.classList.add(this._cssClasses.IS_CREATED);
	  };

	  /**
	   * Destroys the select.
	   * 
	   */
	  AvaSelectfield.prototype.destroy = function () {

	    if (!this._isCreated()) return;
	        
	    // jQuery initialization.
	    $(this._select).material_select('destroy');
	    this.element.classList.remove(this._cssClasses.IS_CREATED);
	  };

	  /**
	   * Creates a virtual DOM for option elements.
	   *
	   * @return {Array}
	   */
	  AvaSelectfield.prototype._getNodeList = function (options) {
	    var i;
	    var nodeList = [];
	    var attribute;

	    for (i = 0; i < options.length; i++) {
	      nodeList[i] = document.createElement('option');
	        
	      for (attribute in options[i].attributes) {
	        nodeList[i].setAttribute(attribute, options[i].attributes[attribute]);
	        nodeList[i].textContent = options[i].label;
	      }
	    }
	    return nodeList;
	  };

	  /**
	   * Removes options of the values passed as argument.
	   *
	   */
	  AvaSelectfield.prototype.remove = function (values) {
	    var i;
	    var optionElement;

	    for (i = 0; i < values.length; i++) {
	      optionElement = this._select.querySelector('option[value="' + values[i] + '"]');

	      if (optionElement) {
	        this._select.removeChild(optionElement);
	      }
	      optionElement = null;
	    }
	  };
	  
	  /**
	   * Defines the new options to the selectfield.
	   *
	   */
	  AvaSelectfield.prototype.set = function (options) {
	    var nodeList = this._getNodeList(options);
	    var optionElement;
	    
	    // Removing all children nodes of select before adding new options.
	    while (this._select.firstChild) {
	      this._select.removeChild(this._select.firstChild);
	    }

	    for (optionElement in nodeList) {
	      this._select.appendChild(nodeList[optionElement]);
	    }
	  };

	  /**
	   * Applies new options of selectfield to the end.
	   *
	   */
	  AvaSelectfield.prototype.append = function (options) {
	    var nodeList = this._getNodeList(options);
	    var optionElement;
	    
	    for (optionElement in nodeList) {
	      this._select.appendChild(nodeList[optionElement]);
	    }
	  };

	  /**
	   * Destroys and initializes the select.
	   * 
	   */
	  AvaSelectfield.prototype.update = function () {
	    this.destroy();
	    this.create();
	  };

	  /**
	   * Initializes the instance.
	   * 
	   */
	  AvaSelectfield.prototype.init = function () {

	    if (!this.element) return;
	    
	    if (typeof $ === 'undefined' || typeof jQuery === 'undefined') {
	      console.warn('Please, load jQuery. Select Component has jQuery as dependency.');
	      return;
	    }
	    this._select = this._getSelect();
	    this._label = this._getLabel();
	  
	    if (!this._select) return;    
	    
	    // Initial initialization.
	    this.create();
	  };

	  // Registers the component. "Componentize" object must be available globally.
	  Componentize.register({
	    name: 'AvaSelectfield',
	    constructor: AvaSelectfield,
	    cssClass: 'ava-selectfield',
	  });
	})();

/***/ },
/* 15 */
/***/ function(module, exports) {

	/**
	 * shelf.js - a component to display a content list with horizontal and vertical scrolling. 
	 * 
	 * @author Alexandre Thebaldi <ahlechandre@gmail.com>
	 * @requires componentize
	 */
	(function () {
	  'use strict';
	  /**
	   * 
	   * @class
	   */
	  function AvaShelf(element) {
	    this.element = element;

	    // Initializes the instance.
	    this.init();
	  };

	  /**
	   * Stories the css classes used by this component.
	   * 
	   */
	  AvaShelf.prototype._cssClasses = {
	    IS_COMPTACT: 'is-compact',
	    IS_EXPANDED: 'is-expanded',
	    ACTION_LEFT: 'ava-shelf__action-left',
	    ACTION_RIGHT: 'ava-shelf__action-right',
	    CONTENT: 'ava-shelf__content',
	    ACTION_EXPAND: 'ava-shelf__action-expand',
	    ACTION_ICON_ALIGN: 'right',
	    ACTION_ICON_MATERIAL_ICONS: 'material-icons',
	  };

	  /**
	   * Stories the constant strings used by this component.
	   * 
	   */
	  AvaShelf.prototype._constants = {
	    MESSAGE_ACTION_TURN_OFF: 'ocultar',
	    MESSAGE_ACTION_TURN_ON: 'mostrar todos',
	    ICON_ACTION_TURN_OFF: 'expand_less',
	    ICON_ACTION_TURN_ON: 'expand_more',
	  };

	  /**
	   * Stories the content of shelf.
	   *
	   * @type {HTMLElement} 
	   */
	  AvaShelf.prototype._content = {};

	  /**
	   * Stories the button trigger to left scrolling.
	   *
	   * @type {HTMLElement} 
	   */
	  AvaShelf.prototype._actionLeft = {};

	  /**
	   * Stories the button trigger to right scrolling.
	   *
	   * @type {HTMLElement} 
	   */
	  AvaShelf.prototype._actionRight = {};

	  /**
	   * Stories the button trigger to left scrolling.
	   *
	   * @type {HTMLElement} 
	   */
	  AvaShelf.prototype._actionExpand = {};

	  /**
	   * Returns the current state of shelf.
	   * 
	   * @return {string | null}
	   */
	  AvaShelf.prototype._isCompacted = function () {
	    return this.element.classList.contains(this._cssClasses.IS_COMPTACT);
	  };

	  /**
	   * Handles the on click event on expand button.
	   * 
	   */
	  AvaShelf.prototype._expandOnClick = function (event) {
	    event.preventDefault();

	    if (this._isCompacted()) {
	      // Horizontal shelf.
	      this.expand();
	    } else {
	      // Vertical shelf.
	      this.compact();
	    }
	  };

	  /**
	   * Handles the on click event on left button.
	   * 
	   */
	  AvaShelf.prototype._leftOnClick = function (event) {
	    event.preventDefault();

	    if (!this._isCompacted()) return;

	    this._onScrolling(true);
	  };

	  /**
	   * Handles the on click event on right button.
	   * 
	   */
	  AvaShelf.prototype._rightOnClick = function (event) {
	    event.preventDefault();

	    if (!this._isCompacted()) return;

	    this._onScrolling(false);
	  };

	  /**
	   * Scrolls the shelf to left/right direction.
	   * 
	   * @param {boolean} toLeft Determines if must be scrolled to left or right.
	   */
	  AvaShelf.prototype._onScrolling = function (toLeft) {
	    var range = 25;
	    var i;
	    var _scroll = function (content) {
	      var j;
	      var increments = toLeft ? -1 : 1;

	      for (j = 0; j < 15; j++) {
	        content.scrollLeft += increments;
	      }
	    };

	    for (i = 1; i <= range; i++) {
	      setTimeout((function (content) {
	        return function () {
	          _scroll(content);
	        };
	      })(this._content), ((range + (range / (range / 2))) * (i * 0.5)));
	    }
	  };

	  /**
	   * Returns the elements of shelf.
	   * 
	   * @return {HTMLElement | null}
	   */
	  AvaShelf.prototype._getElements = function () {
	    var content = this.element.querySelector('.' + this._cssClasses.CONTENT);
	    var actionExpand = this.element.querySelector('.' + this._cssClasses.ACTION_EXPAND);
	    var actionLeft = this.element.querySelector('.' + this._cssClasses.ACTION_LEFT);
	    var actionRight = this.element.querySelector('.' + this._cssClasses.ACTION_RIGHT);

	    return {
	      content: content,
	      actionExpand: actionExpand,
	      actionLeft: actionLeft,
	      actionRight: actionRight,
	    };
	  };

	  /**
	   * Compacts the content in a horizontal shelf. 
	   * 
	   * @return {boolean} 
	   */
	  AvaShelf.prototype.compact = function () {

	    if (this._isCompacted()) return false;

	    this.element.classList.remove(this._cssClasses.IS_EXPANDED);
	    this.element.classList.add(this._cssClasses.IS_COMPTACT);
	    this._updateButtonExpand(true);
	    return true;
	  };

	  /**
	   * Compacts the content in a vertical shelf. 
	   * 
	   * @return {boolean} 
	   */
	  AvaShelf.prototype.expand = function () {

	    if (!this._isCompacted()) return false;

	    this.element.classList.remove(this._cssClasses.IS_COMPTACT);
	    this.element.classList.add(this._cssClasses.IS_EXPANDED);
	    this._updateButtonExpand(false);
	    return true;
	  };

	  /**
	   * Updates the action button content to current state. 
	   * 
	   */
	  AvaShelf.prototype._updateButtonExpand = function (isCompacted) {
	    var iconTextContent /** @type {string} */;
	    var actionTextContent /** @type {string} */;
	    var icon = document.createElement('i');
	    icon.classList.add(this._cssClasses.ACTION_ICON_MATERIAL_ICONS);
	    icon.classList.add(this._cssClasses.ACTION_ICON_ALIGN);

	    if (isCompacted) {
	      iconTextContent = this._constants.ICON_ACTION_TURN_ON;
	      actionTextContent = this._constants.MESSAGE_ACTION_TURN_ON;
	    } else {
	      iconTextContent = this._constants.ICON_ACTION_TURN_OFF;
	      actionTextContent = this._constants.MESSAGE_ACTION_TURN_OFF;
	    }
	    icon.textContent = iconTextContent;
	    this._actionExpand.innerHTML = '';
	    this._actionExpand.textContent = actionTextContent;
	    this._actionExpand.appendChild(icon);
	  };

	  /**
	   * Initializes the instance.
	   * 
	   */
	  AvaShelf.prototype.init = function () {
	    var elements = {};

	    if (!this.element) return;

	    elements = this._getElements();
	    this._actionExpand = elements['actionExpand'];
	    this._actionLeft = elements['actionLeft'];
	    this._actionRight = elements['actionRight'];
	    this._content = elements['content'];

	    if (!this._content || !this._actionLeft || !this._actionRight) return;

	    // Initial compact.
	    this.compact();
	    this._actionExpand.addEventListener('click', this._expandOnClick.bind(this))
	    this._actionLeft.addEventListener('click', this._leftOnClick.bind(this))
	    this._actionRight.addEventListener('click', this._rightOnClick.bind(this))
	  };

	  // Registers the component. "Componentize" object must be available globally.
	  Componentize.register({
	    name: 'AvaShelf',
	    constructor: AvaShelf,
	    cssClass: 'ava-shelf',
	  });
	})();

/***/ },
/* 16 */
/***/ function(module, exports) {

	/**
	 * drawer.js - a component to handle drawers (sidenav). 
	 * 
	 * @author Alexandre Thebaldi <ahlechandre@gmail.com>
	 * @requires componentize
	 */
	(function () {
	  'use strict';
	  /**
	   * 
	   * @class
	   */
	  function AvaSlider(element) {
	    this.element = element;

	    // Initializes the instance.
	    this.init();
	  };

	  /**
	   * Stories the css classes used by this component.
	   * 
	   */
	  AvaSlider.prototype._cssClasses = {};

	  /**
	   * Stories the constant strings used by this component.
	   * 
	   */
	  AvaSlider.prototype._constants = {};

	  /**
	   * Defines the options of slider.
	   * 
	   */
	  AvaSlider.prototype.options = {
	    'indicators': false,
	    'interval': 6000,
	    'height': 450
	  };
	  
	  /**
	   * Initializes the drawer component.
	   * 
	   */
	  AvaSlider.prototype.create = function () {

	    // jQuery initialization.
	    $(this.element).slider(this.options);
	  };

	  /**
	   * Initializes the instance.
	   * 
	   */
	  AvaSlider.prototype.init = function () {

	    if (!this.element) return;


	    if (typeof $ === 'undefined' || typeof jQuery === 'undefined') {
	      console.warn('Please, load jQuery. Slider Component has jQuery as dependency.');
	      return;
	    }
	    this.create();
	  };

	  // Registers the component. "Componentize" object must be available globally.
	  Componentize.register({
	    name: 'AvaSlider',
	    constructor: AvaSlider,
	    cssClass: 'ava-slider',
	  });
	})();

/***/ },
/* 17 */
/***/ function(module, exports) {

	/**
	 * dialog.js - a component to handle dialogs. 
	 * 
	 * @author Alexandre Thebaldi <ahlechandre@gmail.com>
	 * @requires componentize
	 */
	(function () {
	  'use strict';
	  /**
	   * 
	   * @class
	   */
	  function AvaTabs(element) {
	    this.element = element;

	    // Initializes the instance.
	    this.init();
	  };

	  /**
	   * Stories the css classes used by this component.
	   * 
	   */
	  AvaTabs.prototype._cssClasses = {};

	  /**
	   * Stories the constant strings used by this component.
	   * 
	   */
	  AvaTabs.prototype._constants = {};
	    
	  /**
	   * Initializes the dialog component.
	   * 
	   */
	  AvaTabs.prototype.active = function (tab) {    
	    var tabTrigger = this.element.querySelector('[href="#' + tab + '"]');
	    
	    if (!tabTrigger) {
	      console.warn('The tab ' + tab + ' does not exists.');
	      return;
	    }
	    
	    // jQuery style.
	    // $(this.element).tabs('select_tab', tab);
	    // Simulates a click to preserve all listeners.    
	    tabTrigger.click();
	  };
	    
	  /**
	   * Initializes the dialog component.
	   * 
	   */
	  AvaTabs.prototype.create = function () {    
	    // jQuery initialization.
	    $(this.element).tabs();    
	  };
	  
	  /**
	   * Initializes the instance.
	   * 
	   */
	  AvaTabs.prototype.init = function () {
	        
	    if (!this.element) return;

	    if (typeof $ === 'undefined' || typeof jQuery === 'undefined') {
	      console.warn('Please, load jQuery. Tabs Component has jQuery as dependency.');
	      return;
	    }
	    
	    // Initializes the dialog.
	    this.create();
	  };

	  // Registers the component. "Componentize" object must be available globally.
	  Componentize.register({
	    name: 'AvaTabs',
	    constructor: AvaTabs,
	    cssClass: 'ava-tabs',
	  });
	})();

/***/ },
/* 18 */
/***/ function(module, exports) {

	/**
	 * tester.js - a component to handle tests with questions. 
	 * 
	 * @author Alexandre Thebaldi <ahlechandre@gmail.com>
	 * @requires componentize
	 */
	(function () {
	  'use strict';
	  /**
	   * 
	   * @class
	   */
	  function AvaTester(element) {
	    this.element = element;

	    // Initializes the instance.
	    this.init();
	  };

	  /**
	   * Stories the css classes used by this component.
	   * 
	   */
	  AvaTester.prototype._cssClasses = {
	    TEST: 'ava-test',
	    TEST_ACTIVE: 'is-active',
	    TEST_COMPLETED: 'is-completed',
	    LABEL: 'ava-test__label',
	    LABEL_INDICATOR: 'ava-test__label-indicator',
	    LABEL_INDICATOR_ITEM: 'ava-test__label-indicator-item',
	    LABEL_TITLE: 'ava-test__label-title',
	    LABEL_TITLE_TEXT: 'ava-test__label-title-text',
	    LABEL_DESCRIPTION: 'ava-test__label-description',
	    LABEL_SUPPORT: 'ava-test__label-support',
	    CONTENT: 'ava-test__content',
	    ACTIONS: 'ava-test__actions',
	    IS_TRANSITION: 'is-transition',
	    IS_TRANSITION_NEXT: 'is-transition-next',
	    IS_TRANSITION_BACK: 'is-transition-back',
	    ACTIVATOR_NAV: 'ava-tester__activator',
	    ACTIVATOR_ITEM: 'ava-tester__activator-item',
	  };

	  /**
	   * Stories the constant strings used by this component.
	   * 
	   */
	  AvaTester.prototype._constants = {
	    DATASET_ACTION_COMPLETE: 'test-complete',
	    DATASET_ACTION_BACK: 'test-back',
	    DATASET_ACTION_SKIP: 'test-skip',
	    DATASET_ACTIVATOR_ACTIVATES: 'tester-activates',
	  };

	  /**
	   * Stories the tester config.
	   * 
	   * @typedef {{
	   *  activeIndex: number,
	   *  total: number,
	   *  totalCompleted: number,
	   * }}
	   */
	  AvaTester.prototype._tester = {};

	  /**
	   * Stories the list of tests.
	   * 
	   * @type {array<AvaTester._test>}
	   */
	  AvaTester.prototype._tests = [];

	  /**
	   * Defines the config of a test item.
	   * 
	   * @typedef {{
	   *  index: number,
	   *  completed: boolean,
	   *  element: HTMLElement,
	   *  elements: AvaTester._testElements,
	   * }}
	   */
	  AvaTester.prototype._test;

	  /**
	   * All elements of a test item.
	   * 
	   * @typedef {{
	   *  label: HTMLElement,
	   *  labelTitle: HTMLElement,
	   *  labelTitleText: HTMLElement,
	   *  labelDescription: HTMLElement,
	   *  labelIndicator: HTMLElement,
	   *  labelIndicatorItem: HTMLElement,
	   *  labelSupport: HTMLElement,
	   *  content: HTMLElement,
	   *  actions: HTMLElement,
	   *  actionComplete: HTMLElement,
	   *  actionSkip: HTMLElement,
	   *  actionBack: HTMLElement
	   * }}
	   */
	  AvaTester.prototype._testElements;

	  /**
	   * Defines the custom events used by this component. 
	   * 
	   */
	  AvaTester.prototype._customEvents = {
	    ongoto: new CustomEvent('ongoto', {
	      bubbles: true,
	      cancelable: true,
	    }),
	    onback: new CustomEvent('onback', {
	      bubbles: true,
	      cancelable: true,
	    }),
	    oncomplete: new CustomEvent('oncomplete', {
	      bubbles: true,
	      cancelable: true,
	    }),
	    onskip: new CustomEvent('onskip', {
	      bubbles: true,
	      cancelable: true,
	    }),
	    onsupport: new CustomEvent('onsupport', {
	      bubbles: true,
	      cancelable: true,
	    }),
	    onend: new CustomEvent('onend', {
	      bubbles: true,
	      cancelable: true,
	    }),
	  };

	  /**
	   * Check if a given test element is completed.
	   * 
	   * @param {HTMLElement | number} test
	   * @return {boolean}
	   */
	  AvaTester.prototype.isCompleted = function (test) {
	    var element;
	    var _test;

	    if (typeof test === 'number') {
	      _test = this._getTest(test);

	      if (_test) {
	        element = _test.element;
	      } else {
	        return false;
	      }
	    } else if (test instanceof HTMLElement) {
	      element = test;
	    } else {
	      return false;
	    }

	    return element.classList.contains(this._cssClasses.TEST_COMPLETED);
	  };

	  /**
	   * Check if a given test is active.
	   * 
	   * @param {HTMLElement | number} test
	   * @return {boolean}
	   */
	  AvaTester.prototype.isActive = function (test) {
	    var testElement /** @type {HTMLElement} */;

	    if (test instanceof HTMLElement) {
	      testElement = test;
	    } else if (typeof test === 'number') {
	      testElement = this.getTestElementByIndex(test);
	    } else {
	      return false;
	    }
	    return testElement.classList.contains(this._cssClasses.TEST_ACTIVE);
	  };

	  /**
	   * Defines a given test element as active.
	   * 
	   * @param {HTMLElement | number} test
	   * @return {boolean}
	   */
	  AvaTester.prototype.setActive = function (test) {
	    var toActiveElement /** @type {HTMLElement} */;
	    var activeElement /** @type {HTMLElement} */;
	    /** @type {number | undefined} */
	    var newActiveIndex;

	    if (test instanceof HTMLElement) {
	      toActiveElement = test;
	    } else if (typeof test === 'number') {
	      toActiveElement = this.getTestElementByIndex(test);

	      if (!toActiveElement) return false;

	      newActiveIndex = test;
	    } else {
	      return false;
	    }
	    activeElement = this.getActive();

	    // Do nothing if the active is the same.
	    if (toActiveElement === activeElement) return true;

	    // Check if the active element exists.
	    if (activeElement instanceof HTMLElement) {
	      activeElement.classList.remove(this._cssClasses.TEST_ACTIVE);
	    }
	    toActiveElement.classList.add(this._cssClasses.TEST_ACTIVE);

	    if (!newActiveIndex) {
	      newActiveIndex = this.getTestIndexByElement(toActiveElement);
	    }
	    this._tester.activeIndex = newActiveIndex;
	    return true;
	  };

	  /**
	   * Returns the active test element. 
	   * 
	   * @return {HTMLElement | null}
	   */
	  AvaTester.prototype.getActive = function () {
	    /** @type {HTMLElement | null} */
	    var element = null;
	    var i;

	    for (i = 0; i < this._tests.length; i++) {

	      if (this._tests[i].index === this._tester.activeIndex) {
	        element = this._tests[i].element;
	        break;
	      }
	    }

	    return element;
	  };

	  /**
	   * Returns the active index. 
	   * 
	   * @return {number | null}
	   */
	  AvaTester.prototype.getActiveIndex = function () {
	    return this._tester.activeIndex;
	  };

	  /**
	   * Returns the test element of a given index. 
	   * 
	   * @param {number} index
	   * @return {HTMLElement | null}
	   */
	  AvaTester.prototype.getTestElementByIndex = function (index) {
	    var test = this._getTest(index);
	    var element = null;

	    if (test) element = test.element;

	    return element;
	  };

	  /**
	   * Returns the test index of a given element. 
	   * 
	   * @param {HTMLElement} element
	   * @return {number | null}
	   */
	  AvaTester.prototype.getTestIndexByElement = function (element) {
	    /** @type {HTMLElement | null} */
	    var index = null;
	    var i;
	    var isElement = element instanceof HTMLElement;

	    if (!isElement) return null;

	    for (i = 0; i < this._tests.length; i++) {

	      if (this._tests[i].element === element) {
	        index = this._tests[i].index;
	        break;
	      }
	    }

	    return index;
	  };

	  /**
	   * Creates a transition effect.
	   * 
	   * @param {number} index 
	   * @param {string} direction 
	   */
	  AvaTester.prototype._createTransition = function (index, direction) {
	    var test = this._getTest(index);

	    if (!test) return;

	    test.element.classList.add(this._cssClasses.IS_TRANSITION);

	    switch (direction) {
	      case 'next':
	      case 'skip': {
	        test.element.classList.add(this._cssClasses.IS_TRANSITION_NEXT);
	        break;
	      }
	      case 'back': {
	        test.element.classList.add(this._cssClasses.IS_TRANSITION_BACK);
	        break;
	      }
	    }

	    setTimeout(function () {
	      test.element.classList.remove(this._cssClasses.IS_TRANSITION);
	      test.element.classList.remove(this._cssClasses.IS_TRANSITION_NEXT);
	      test.element.classList.remove(this._cssClasses.IS_TRANSITION_BACK);
	    }.bind(this), 350);
	  };

	  /**
	   * Returns the next test that must be completed after given index. 
	   * 
	   * @param {number} base
	   * @param {number} top
	   * @return {number | null}
	   */
	  AvaTester.prototype._searchIndexNext = function (base, top) {
	    var next = null;
	    var i;

	    if (base > top) return null;

	    for (i = 0; i < this._tests.length; i++) {

	      if (((this._tests[i].index >= base) && (this._tests[i].index <= top)) && !this._tests[i].completed) {
	        // Matchs the first index (after base) that is not completed.
	        next = this._tests[i].index;
	        break;
	      }
	    }
	    return next;
	  }

	  /**
	   * Returns the next test that must be completed before given index. 
	   * 
	   * @param {number} base
	   * @param {number} top
	   * @return {number | null}
	   */
	  AvaTester.prototype._searchIndexBack = function (base, top) {
	    var previous = null;
	    var i;

	    if (base > top) return null;

	    for (i = (this._tests.length - 1); i >= 0; i--) {

	      if (((this._tests[i].index <= top) && (this._tests[i].index >= base)) && !this._tests[i].completed) {
	        // Matchs the first index (after base) that is not completed.
	        previous = this._tests[i].index;
	        break;
	      }
	    }

	    return previous;
	  }

	  /**
	   * Returns the test that must be completed based on direction. 
	   * 
	   * @param {number} base
	   * @param {number} top 
	   * @return {number | null} 
	   */
	  AvaTester.prototype.searchIndex = function (base, top, direction) {
	    /** @type {number | null} */
	    var index = null;

	    if ((typeof base !== 'number' && typeof base !== 'undefined') ||
	      (typeof top !== 'number' && typeof top !== 'undefined') &&
	      (typeof direction !== 'string' && typeof direction !== 'undefined')) {
	      return null;
	    }

	    if (base > top && base > (this._tests.length + 1)) return null;

	    base = base || 0;
	    top = top || this._tests.length;

	    switch (direction) {
	      case 'next':
	      case 'skip':
	      default: {
	        index = this._searchIndexNext(base, top);

	        // Re-search when the index was not found, the tester is not completed
	        // and the search did not walked in all list. 
	        if (index === null && (this._tester.total > this._tester.totalCompleted) && (base > 0)) {
	          return this.searchIndex(0, base, direction);
	        }
	        break;
	      }
	      case 'back': {
	        index = this._searchIndexBack(base, top);

	        // Re-search when the index was not found, the tester is not completed
	        // and the search did not walked in all list. 
	        if (index === null && (this._tester.total > this._tester.totalCompleted) && (top <= this._tests.length)) {
	          return this.searchIndex(0, (this._tests.length + 1), 'back');
	        }
	        break;
	      }
	    }

	    return index;
	  };

	  /**
	   * Defines a test item as completed.
	   * 
	   * @param {number} index 
	   */
	  AvaTester.prototype._setCompletedTest = function (index) {
	    var i;
	    var test = this._getTest(index);

	    if (test && !test.completed) {
	      test.completed = true;
	      test.element.classList.add(this._cssClasses.TEST_COMPLETED);
	      this._tester.totalCompleted++;
	    }
	  };

	  /**
	   * Defines a test item as uncompleted.
	   * 
	   * @param {number} index 
	   */
	  AvaTester.prototype._setUncompletedTest = function (index) {
	    var i;
	    var test = this._getTest(index);

	    if (test && test.completed) {
	      test.completed = false;
	      test.element.classList.remove(this._cssClasses.TEST_COMPLETED);
	      this._tester.totalCompleted--;
	    }
	  };

	  /**
	   * Get test item by index. 
	   * 
	   * @param {number} index
	   * @return {AvaTester._test | null}
	   */
	  AvaTester.prototype._getTest = function (index) {
	    var testsLength = this._tests.length;
	    var test = null;
	    var i;

	    if (typeof index !== 'number' || index <= 0 || index > testsLength) return null;

	    for (i = 0; i < testsLength; i++) {

	      if (this._tests[i].index === index) {
	        test = this._tests[i];
	        break;
	      }
	    }

	    return test;
	  };

	  /**
	   * Goes forward to the next test at list. Changes the state of current test to "completed".
	   * 
	   * @return {boolean}
	   */
	  AvaTester.prototype.complete = function () {
	    var oldIndex = this._tester.activeIndex;
	    var newIndex = this.searchIndex((oldIndex + 1), this.getTestsSize(), 'next');
	    var didComplete = this.setActive(newIndex);

	    if (didComplete) {

	      if (oldIndex !== newIndex) {
	        this._createTransition(oldIndex, 'next');
	      }
	      // Defines the old test as complete after this proccess.
	      this._setCompletedTest(oldIndex);
	      this._updateActivators();
	      
	      if (this.isAllCompleted()) {
	        // Dispatch on end event.
	        this._dispatchEvent(this.element, 'onend');
	      }
	    }

	    return didComplete;
	  };

	  /**
	   * Goes back to the previous test that must be completed at list.
	   * 
	   * @return {boolean}
	   */
	  AvaTester.prototype.skipBack = function () {
	    var oldIndex = this._tester.activeIndex;
	    var newIndex = this.searchIndex(0, (oldIndex - 1), 'back');
	    var didBack = this.setActive(newIndex);

	    if (didBack) {

	      if (oldIndex !== newIndex) {
	        this._createTransition(oldIndex, 'back');
	      } else {
	        didBack = false;
	      }
	    }

	    return didBack;
	  };

	  /**
	   * Goes back to the previous test at list.
	   * 
	   * @return {boolean}
	   */
	  AvaTester.prototype.back = function () {
	    var prev = this.getActiveIndex() - 1;

	    if (prev === 0) prev = this.getTestsSize();

	    return this.goto(prev);
	  };

	  /** 
	   * Returns the length of tests list.
	   *
	   * @return {number} 
	   */
	  AvaTester.prototype.getTestsSize = function () {
	    return this._tests.length;
	  };

	  /**
	   * Goes forward to the next test at list. Does not changes the state 
	   * of current test to "completed".
	   * 
	   * @return {boolean}
	   */
	  AvaTester.prototype.skip = function () {
	    var oldIndex = this.getActiveIndex();
	    var newIndex = this.searchIndex((oldIndex + 1), this.getTestsSize(), 'skip');
	    var didSkip = this.setActive(newIndex);

	    if (didSkip) {

	      if (oldIndex !== newIndex) {
	        this._createTransition(oldIndex, 'next');
	        this._updateActivators();
	      } else {
	        didSkip = false;
	      }
	    }

	    return didSkip;
	  };

	  /**
	   * Goes to the test of a given index. Reset the state of test item if it is "completed".   
	   * 
	   * @param {number} newIndex
	   * @return {boolean}
	   */
	  AvaTester.prototype.goto = function (newIndex) {
	    var test = this._getTest(newIndex);
	    var activated = false;
	    var activeIndex;
	    var direction;

	    if (test && test.element) {
	      activeIndex = this.getActiveIndex();
	      // Turns new index as active.
	      activated = this.setActive(test.element);

	      if (activated && (activeIndex !== newIndex)) {
	        direction = (newIndex > activeIndex) ? 'next' : 'back';
	        this._createTransition(activeIndex, direction);
	        // Uncomplete the new activated test to trigger complete event.
	        this._setUncompletedTest(newIndex);
	        this._updateActivators();
	        this._dispatchEvent(this._tester.element, 'ongoto');
	        this._dispatchEvent(test.element, 'ongoto');
	      } else {
	        activated = false;
	      }
	    }

	    return activated;
	  };

	  /**
	   * Check if tester is complete. Verifies if all tests are completed.
	   * 
	   * @return {boolean}
	   */
	  AvaTester.prototype.isAllCompleted = function () {
	    return (this._tester.total === this._tester.totalCompleted);
	  };

	  /**
	   * Returns the absolute number of completed tests.
	   *
	   * @return {number} 
	   */
	  AvaTester.prototype.getTotalCompleted = function () {
	    return this._tester.totalCompleted;
	  };

	  /**
	   * Returns the relative (percent) number of completed tests.
	   *
	   * @return {number} 
	   */
	  AvaTester.prototype.getTotalCompletedRelative = function () {
	    return ((this._tester.totalCompleted * 100) / this._tester.total);
	  };

	  /** 
	   * Creates and returns the label indicator of a given index.
	   * 
	   * @param {number} index
	   * @param {HTMLElement}
	   */
	  AvaTester.prototype._createIndicator = function (index) {
	    var indicator = document.createElement('span');
	    var indicatorItem = document.createElement('span');
	    indicator.classList.add(this._cssClasses.LABEL_INDICATOR);
	    indicatorItem.classList.add(this._cssClasses.LABEL_INDICATOR_ITEM);
	    indicatorItem.textContent = index;
	    indicator.appendChild(indicatorItem);
	    return indicator;
	  };

	  /**
	   * Returns the elements of a given test element.
	   * 
	   * @return {HTMLElement} testElement
	   * @return {AvaTester._testElements}
	   */
	  AvaTester.prototype._getTestElements = function (testElement, index) {
	    /** @type {AvaTester._testElements} */
	    var elements = {};
	    elements['label'] = testElement.querySelector('.' + this._cssClasses.LABEL);

	    if (!elements['label']) {
	      throw new Error('Missing label element (.' + this._cssClasses.LABEL + ') in test ' + index + '.');
	    }
	    elements['labelTitle'] = elements['label'].querySelector('.' + this._cssClasses.LABEL_TITLE);

	    if (!elements['labelTitle']) {
	      throw new Error('Missing label title element (.' + this._cssClasses.LABEL_TITLE + ') in test ' + index + '.');
	    }
	    elements['labelTitleText'] = elements['labelTitle'].querySelector('.' + this._cssClasses.LABEL_TITLE_TEXT)
	    elements['labelDescription'] = elements['labelTitle'].querySelector('.' + this._cssClasses.LABEL_DESCRIPTION);
	    elements['labelIndicator'] = this._createIndicator(index);
	    // Inserts the label indicator in the DOM before label title.
	    elements['label'].insertBefore(elements['labelIndicator'], elements['labelTitle']);
	    elements['labelIndicatorItem'] = elements['labelIndicator'].querySelector('.' + this._cssClasses.LABEL_INDICATOR_ITEM);
	    elements['labelSupport'] = elements['label'].querySelector('.' + this._cssClasses.LABEL_SUPPORT);
	    elements['content'] = testElement.querySelector('.' + this._cssClasses.CONTENT);

	    if (!elements['content']) {
	      throw new Error('Missing content element (.' + this._cssClasses.CONTENT + ') in test ' + index + '.');
	    }
	    elements['actions'] = testElement.querySelector('.' + this._cssClasses.ACTIONS);

	    if (!elements['actions']) {
	      throw new Error('Missing actions element (.' + this._cssClasses.ACTIONS + ') in test ' + index + '.');
	    }
	    elements['actionComplete'] = elements['actions'].querySelector('[data-' + this._constants.DATASET_ACTION_COMPLETE + ']');

	    if (!elements['actionComplete']) {
	      throw new Error('Missing action next element (data-' + this._constants.DATASET_ACTION_COMPLETE + ') in test ' + index + '.');
	    }
	    elements['actionBack'] = elements['actions'].querySelector('[data-' + this._constants.DATASET_ACTION_BACK + ']');

	    if (!elements['actionBack']) {
	      throw new Error('Missing action next element (data-' + this._constants.DATASET_ACTION_BACK + ') in test ' + index + '.');
	    }
	    elements['actionSkip'] = elements['actions'].querySelector('[data-' + this._constants.DATASET_ACTION_SKIP + ']');

	    if (!elements['actionSkip']) {
	      throw new Error('Missing action next element (data-' + this._constants.DATASET_ACTION_SKIP + ') in test ' + index + '.');
	    }

	    return elements;
	  };

	  /**
	   * Returns the config of a given test element.
	   * 
	   * @return {HTMLElement} testElement
	   * @return {number} index
	   * @return {AvaTester._test}
	   */
	  AvaTester.prototype._getTestConfig = function (testElement, index) {
	    var completed /** @type {boolean} */;
	    /** @type {AvaTester._testElements} */
	    var elements = this._getTestElements(testElement, index);
	    completed = this.isCompleted(testElement);

	    return {
	      index: index,
	      completed: completed,
	      element: testElement,
	      elements: elements,
	    };
	  };

	  /**
	   * Returns the config of the tester used by this component.
	   * 
	   * @return {AvaTester._tester}
	   */
	  AvaTester.prototype._getTesterConfig = function () {
	    var activeIndex /** @type {number} */;
	    var hasActive = false;
	    /** @type {AvaTester._test} */
	    var test = {};
	    /** @type {array<AvaTester._test>} */
	    var tests = [];
	    var total = 0;
	    var totalCompleted = 0;
	    var testElements = this.element.querySelectorAll('.' + this._cssClasses.TEST);
	    var activatorNav = this.element.querySelector('.' + this._cssClasses.ACTIVATOR_NAV);
	    var activatorItems = activatorNav ? activatorNav.querySelectorAll('.' + this._cssClasses.ACTIVATOR_ITEM) : [];
	    var i;

	    for (i = 0; i < testElements.length; i++) {
	      // Creates the test config and defines it index.
	      test = this._getTestConfig(testElements[i], (i + 1));

	      if (hasActive === false && this.isActive(testElements[i])) {
	        hasActive = true;
	        activeIndex = test.index;
	      }
	      total++;
	      totalCompleted += test.completed ? 1 : 0;
	      tests.push(test);
	    }

	    // Set the first test as active if it was not defined by user.
	    if (hasActive === false) {
	      this.setActive(tests[0].element);
	      activeIndex = tests[0].index;
	    }
	    return {
	      activeIndex: activeIndex,
	      tests: tests,
	      total: total,
	      totalCompleted: totalCompleted,
	      activator: {
	        element: activatorNav,
	        items: activatorItems,
	      }
	    };
	  };

	  /**
	   * Returns the tests list assigned by index.
	   * 
	   * @return {object}
	   */
	  AvaTester.prototype.getTestsList = function () {
	    var list = {};
	    var i;

	    for (i = 0; i < this._tests.length; i++) {
	      list[this._tests[i].index] = this._tests[i].element;
	    }

	    return list;
	  };

	  /**
	   * Defines the event dispatched on click on complete test button. 
	   * 
	   */
	  AvaTester.prototype._setEventOnComplete = function () {
	    var i;
	    var onComplete = function (event, testElement) {
	      event.preventDefault();
	      this._dispatchEvent(testElement, 'oncomplete');
	    }.bind(this).bind(this).bind(this);

	    for (i = 0; i < this._tests.length; i++) {

	      this._tests[i].elements.actionComplete.addEventListener('click', (function (element) {

	        return function (event) {
	          onComplete(event, element);
	        };
	      })(this._tests[i].element));
	    }
	  };

	  /**
	   * Defines the event dispatched on click on skip test button. 
	   * 
	   */
	  AvaTester.prototype._setEventOnSkip = function () {
	    var i;
	    var onSkip = function (event, testElement) {
	      event.preventDefault();
	      this._dispatchEvent(testElement, 'onskip');
	    }.bind(this).bind(this).bind(this);

	    for (i = 0; i < this._tests.length; i++) {

	      this._tests[i].elements.actionSkip.addEventListener('click', (function (element) {

	        return function (event) {
	          onSkip(event, element);
	        };
	      })(this._tests[i].element));
	    }
	  };

	  /**
	   * Defines the event dispatched on click on back test button. 
	   * 
	   */
	  AvaTester.prototype._setEventOnBack = function () {
	    var i;
	    var onBack = function (event, testElement) {
	      event.preventDefault();
	      this._dispatchEvent(testElement, 'onback');
	    }.bind(this).bind(this).bind(this);

	    for (i = 0; i < this._tests.length; i++) {

	      this._tests[i].elements.actionBack.addEventListener('click', (function (element) {

	        return function (event) {
	          onBack(event, element);
	        };
	      })(this._tests[i].element));
	    }
	  };

	  /**
	   * Defines the event dispatched on click on support test button. 
	   * 
	   */
	  AvaTester.prototype._setEventOnSupport = function () {
	    var i;
	    var onSupport = function (event, testElement) {
	      event.preventDefault();
	      this._dispatchEvent(testElement, 'onsupport');
	    }.bind(this).bind(this).bind(this);

	    for (i = 0; i < this._tests.length; i++) {

	      this._tests[i].elements.labelSupport.addEventListener('click', (function (element) {

	        return function (event) {
	          onSupport(event, element);
	        };
	      })(this._tests[i].element));
	    }
	  };

	  /**
	   * Dispatches the on end event. Applied on all items of tests list is completed.
	   * 
	   * @param {HTMLElement} element
	   * @param {string} eventName
	   */
	  AvaTester.prototype._dispatchEvent = function (element, eventName) {
	    var isElement = element instanceof HTMLElement;

	    if (typeof this._customEvents[eventName] === 'undefined' ||
	      !isElement) return;

	    element.dispatchEvent(this._customEvents[eventName]);
	  };

	  /**
	   * Defines the events dispatched by this component.
	   * 
	   */
	  AvaTester.prototype._setEvents = function () {
	    this._setEventOnComplete();
	    this._setEventOnSkip();
	    this._setEventOnBack();
	    this._setEventOnSupport();
	    this._setEventActivators();
	  };
	  
	  /**
	   * Defines the activors links behavior.
	   * 
	   */
	  AvaTester.prototype._setEventActivators = function () {
	    var activatorItem /** @type {HTMLElement} */;
	    var i;
	    
	    if (!this._tester.activator.element) return;

	    for (i = 0; i < this._tester.activator.items.length; i++) {
	      activatorItem = this._tester.activator.items[i];
	      
	      activatorItem.addEventListener('click', function (event) {
	        var activates /** @type {string} */;
	        event.preventDefault();
	        
	        if (event.target) {
	          activates = event.target.getAttribute('data-' + this._constants.DATASET_ACTIVATOR_ACTIVATES);
	        } else {
	          return;
	        }   
	        activates = parseInt(activates);   
	         
	        if (!activates) return;
	        
	        this.goto(activates);
	      }.bind(this));
	    }
	  };
	  
	  /**
	   * Updates the activator items state.
	   * 
	   */
	  AvaTester.prototype._updateActivators = function () {
	    var i;
	    var activatorItem /** @type {HTMLElement} */;
	    var activatorSelector /** @type {string} */;
	    
	    if (typeof this._tester['activator'] === 'undefined' || !this._tester.activator.element) return;
	        
	    for (i = 0; i < this._tests.length; i++) {
	      activatorSelector = '[data-' + this._constants.DATASET_ACTIVATOR_ACTIVATES + '="' + this._tests[i].index + '"]';
	      activatorItem = this._tester.activator.element.querySelector(activatorSelector);
	      
	      if (!activatorItem) continue;
	      // Check if test is completed.
	      if (this._tests[i].completed) {
	        activatorItem.classList.add(this._cssClasses.TEST_COMPLETED);
	      } else {
	        activatorItem.classList.remove(this._cssClasses.TEST_COMPLETED);        
	      }     

	      // Check if test is actives.
	      if (this._tests[i].index === this._tester.activeIndex) {
	        activatorItem.classList.add(this._cssClasses.TEST_ACTIVE);
	      } else {
	        activatorItem.classList.remove(this._cssClasses.TEST_ACTIVE);
	      }     
	    }
	  };
	  
	  /**
	   * Initializes the instance.
	   * 
	   */
	  AvaTester.prototype.init = function () {
	    var testerConfig = {};

	    if (!this.element) return;

	    testerConfig = this._getTesterConfig();
	    this._tests = testerConfig['tests'];
	    // Deletes the lists of tests of config.
	    delete testerConfig['tests'];
	    this._tester = testerConfig;
	    this._setEvents();
	    this._updateActivators();
	  };

	  // Registers the component. "Componentize" object must be available globally.
	  Componentize.register({
	    name: 'AvaTester',
	    constructor: AvaTester,
	    cssClass: 'ava-tester',
	  });
	})();

/***/ },
/* 19 */
/***/ function(module, exports) {

	/**
	 * textfield.js - a component to handle textfields. 
	 * 
	 * @author Alexandre Thebaldi <ahlechandre@gmail.com>
	 * @requires componentize
	 */
	(function () {
	  'use strict';
	  /**
	   * 
	   * @class
	   */
	  function AvaTextfield(element) {
	    this.element = element;

	    // Initializes the instance.
	    this.init();
	  };

	  /**
	   * Stories the css classes used by this component.
	   * 
	   */
	  AvaTextfield.prototype._cssClasses = {
	    INPUT: 'ava-textfield__input',
	    INPUT_MULTILINE: 'ava-textfield__input--multiline',
	    LABEL: 'ava-textfield__label',
	    LABEL_ACTIVE_MATERIALIZE: 'active',
	  };

	  /**
	   * Stories the constant strings used by this component.
	   * 
	   */
	  AvaTextfield.prototype._constants = {};

	  /**
	   * Stories the input element used by this component.
	   * 
	   */
	  AvaTextfield.prototype._input = {};

	  /**
	   * Stories the label element used by this component.
	   * 
	   */
	  AvaTextfield.prototype._label = {};

	  /**
	   * Returns the input element.
	   * 
	   * @return {HTMLElement | null} 
	   */
	  AvaTextfield.prototype._getInput = function () {
	    return this.element.querySelector('.' + this._cssClasses.INPUT);
	  };

	  /**
	   * Returns the label element.
	   * 
	   * @return {HTMLElement | null} 
	   */
	  AvaTextfield.prototype._getLabel = function () {
	    return this.element.querySelector('.' + this._cssClasses.LABEL);
	  };

	  /**
	   * Check if label is active.
	   * 
	   */
	  AvaTextfield.prototype._isActiveLabel = function () {
	    return this._label.classList.contains(this._cssClasses.LABEL_ACTIVE_MATERIALIZE);
	  };

	  /**
	   * Defines label as active.
	   * 
	   */
	  AvaTextfield.prototype._setActiveLabel = function () {
	    return this._label.classList.add(this._cssClasses.LABEL_ACTIVE_MATERIALIZE);
	  };

	  /**
	   * Defines label as active.
	   * 
	   */  AvaTextfield.prototype._unsetActiveLabel = function () {
	    return this._label.classList.remove(this._cssClasses.LABEL_ACTIVE_MATERIALIZE);
	  };

	  /**
	   * Initializes the textfield.
	   * 
	   */
	  AvaTextfield.prototype.create = function () {

	    if (!this._isActiveLabel()) this._setActiveLabel();
	    
	  };
	  
	  /**
	   * Destroy the textfield.
	   * 
	   */
	  AvaTextfield.prototype.destroy = function () {
	    this._unsetActiveLabel();    
	  };
	  
	  /**
	   * Update the textfield.
	   * 
	   */
	  AvaTextfield.prototype.update = function () {
	    this.destroy();    
	    this.create();    
	  };

	  /**
	   * Update the textfield.
	   * 
	   */
	  AvaTextfield.prototype.update = function () {
	    this.destroy();    
	    this.create();    
	  };
	  
	  /**
	   * Clear the textfield.
	   * 
	   */
	  AvaTextfield.prototype.clear = function () {
	    this._input.value = '';
	  };
	  
	  /**
	   * Check if input is multiline. 
	   *
	   * @return {boolean}
	   */
	  AvaTextfield.prototype._isMultiline = function () {
	    return this._input.classList.contains(this._cssClasses.INPUT_MULTILINE);
	  };

	  /**
	   * Resize the multiline input. 
	   *
	   */
	  AvaTextfield.prototype.autoresize = function () {
	    if (this._isMultiline()) {
	      this._setActiveLabel();
	      $(this._input).trigger('autoresize');
	    }
	  };
	  
	  /**
	   * Defines the value of textfield input.
	   * 
	   */
	  AvaTextfield.prototype.setValue = function (value) {
	    this._input.value = value;
	    this.autoresize();
	    this.update();
	  };
	  
	  /**
	   * Initializes the instance.
	   * 
	   */
	  AvaTextfield.prototype.init = function () {

	    if (!this.element) return;

	    if (typeof Materialize === 'undefined') {
	      console.warn('Please, load Materialize. Textfield Component has Materialize as dependency.');
	      return;
	    }

	    this._input = this._getInput();
	    this._label = this._getLabel();

	    if (!this._input) return;

	    // Initial initialization.
	    this.create();
	  };

	  // Registers the component. "Componentize" object must be available globally.
	  Componentize.register({
	    name: 'AvaTextfield',
	    constructor: AvaTextfield,
	    cssClass: 'ava-textfield',
	  });
	})();

/***/ },
/* 20 */
/***/ function(module, exports) {

	/**
	 * timer.js - a component to handle timers. 
	 * 
	 * @author Alexandre Thebaldi <ahlechandre@gmail.com>
	 * @requires componentize
	 */
	(function () {
	  'use strict';

	  /**
	   * 
	   * @class
	   */
	  function AvaTimer(element) {
	    this.element = element;

	    // Initializes the instance.
	    this.init();
	  };

	  /**
	   * Stories the css classes used by this component.
	   * 
	   */
	  AvaTimer.prototype._cssClasses = {
	    TIMER: 'ava-timer',
	    TIMER_HOURS: 'ava-timer__hours',
	    TIMER_MINS: 'ava-timer__mins',
	    TIMER_SECS: 'ava-timer__secs',
	    TIMER_STARTED: 'is-started',
	    TIMER_PAUSED: 'is-paused',
	  };

	  /**
	   * Stories the constant strings used by this component.
	   * 
	   */
	  AvaTimer.prototype._constants = {
	    DATASET_MILISECS: 'timer',
	    DATASET_HOURS: 'timer-hours',
	    DATASET_MINS: 'timer-mins',
	    DATASET_SECS: 'timer-secs',
	    DATASET_AUTO: 'timer-auto',
	  };

	  /**
	   * Stories the hours element.
	   *  
	   * @type {HTMLElement}
	   */
	  AvaTimer.prototype._elementHours = null;

	  /**
	   * Stories the minutes element.
	   *  
	   * @type {HTMLElement}
	   */
	  AvaTimer.prototype._elementMins = null;

	  /**
	   * Stories the seconds element.
	   *  
	   * @type {HTMLElement}
	   */
	  AvaTimer.prototype._elementSecs = null;

	  /**
	   * Stories the time of timer in miliseconds.
	   *  
	   * @type {number}
	   */
	  AvaTimer.prototype._timer = 0;

	  /**
	   * Stories the time interval.
	   *  
	   * @type {number | null}
	   */
	  AvaTimer.prototype._timeInterval = null;

	  /**
	   * Stories the time out.
	   *  
	   * @type {number | null}
	   */
	  AvaTimer.prototype._timeOut = null;

	  /**
	   * Defines the custom events.
	   * 
	   */
	  AvaTimer.prototype._customEvents = {
	    oninit: new CustomEvent('oninit', {
	      bubbles: true,
	      cancelable: true,
	    }),
	    onend: new CustomEvent('onend', {
	      bubbles: true,
	      cancelable: true,
	    }),
	    onpause: new CustomEvent('onpause', {
	      bubbles: true,
	      cancelable: true,
	    }),
	    onstart: new CustomEvent('onstart', {
	      bubbles: true,
	      cancelable: true,
	    }),
	    onrestart: new CustomEvent('onrestart', {
	      bubbles: true,
	      cancelable: true,
	    }),
	    oneachsecond: new CustomEvent('oneachsecond', {
	      bubbles: true,
	      cancelable: true,
	    }),
	  };

	  /**
	   * Returns the timers elements.
	   * 
	   * @return {object}
	   */
	  AvaTimer.prototype._getElements = function () {
	    var hours = this.element.querySelector('.' + this._cssClasses.TIMER_HOURS);
	    var mins = this.element.querySelector('.' + this._cssClasses.TIMER_MINS);
	    var secs = this.element.querySelector('.' + this._cssClasses.TIMER_SECS);

	    return {
	      hours: hours,
	      mins: mins,
	      secs: secs,
	    };
	  };

	  /**
	   * Check if timer must be automatically initialized.
	   * 
	   * @return {boolean}
	   */
	  AvaTimer.prototype._isAuto = function () {
	    return this.element.hasAttribute('data-' + this._constants.DATASET_AUTO);
	  };

	  /**
	   * Returns a given value converted to miliseconds.
	   *
	   * @param {number} value 
	   * @param {string} type 
	   */
	  AvaTimer.prototype._getMilisecs = function (value, type) {
	    var miliseconds = value;

	    switch (type) {
	      case 's': {
	        miliseconds = value * 1000;
	        break;
	      }
	      case 'm': {
	        miliseconds = (value * 60) * 1000;
	        break;
	      }
	      case 'h': {
	        miliseconds = ((value * 60) * 60) * 1000;
	        break;
	      }
	    }

	    return miliseconds;
	  };

	  /**
	   * Returns a given value converted from miliseconds.
	   *
	   * @param {number} miliseconds 
	   * @param {string} type 
	   */
	  AvaTimer.prototype._getFromMilisecs = function (miliseconds, type) {
	    var time = miliseconds;

	    switch (type) {
	      case 's': {
	        time = miliseconds / 1000;
	        break;
	      }
	      case 'm': {
	        time = (miliseconds / 60) / 1000;
	        break;
	      }
	      case 'h': {
	        time = ((miliseconds / 60) / 60) / 1000;
	        break;
	      }
	    }

	    return time;
	  };

	  /**
	   * Check for dataset timers and initializes the time.
	   * 
	   */
	  AvaTimer.prototype._setInitialTime = function () {
	    var miliseconds = this.element.getAttribute('data-' + this._constants.DATASET_MILISECS);
	    var secs = this.element.getAttribute('data-' + this._constants.DATASET_SECS);
	    var mins = this.element.getAttribute('data-' + this._constants.DATASET_MINS);
	    var hours = this.element.getAttribute('data-' + this._constants.DATASET_HOURS);
	    var realTime = 0;

	    if (miliseconds && parseInt(miliseconds)) {
	      realTime = parseInt(miliseconds);
	    } else if (secs && parseInt(secs)) {
	      realTime = this._getMilisecs(parseInt(secs), 's');
	    } else if (mins && parseInt(mins)) {
	      realTime = this._getMilisecs(parseInt(mins), 'm');
	    } else if (hours && parseInt(hours)) {
	      realTime = this._getMilisecs(parseInt(hours), 'h');
	    }

	    this.set(realTime);
	  };

	  /**
	   * Defines the time of timer in miliseconds.
	   *
	   * @param {number} time 
	   * @param {string} optionalType 
	   */
	  AvaTimer.prototype.set = function (time, optionalType) {

	    if (typeof time !== 'number' || time <= 0) {
	      console.warn('Please, the time must be a valid integer.');
	      return;
	    }

	    if (optionalType) {
	      time = this._getMilisecs(time, optionalType);
	    }

	    this._time = time;
	    this._renderSecs();
	    this._renderMins();
	    this._renderHours();
	  };

	  /**
	   * Defines the time of timer in seconds.
	   *
	   * @param {number} time 
	   */
	  AvaTimer.prototype.setSecs = function (time) {
	    this.set(time, 's');
	  };

	  /**
	   * Defines the time of timer in minutes.
	   *
	   * @param {number} time 
	   */
	  AvaTimer.prototype.setMins = function (time) {
	    this.set(time, 'm');
	  };

	  /**
	   * Defines the time of timer in hours.
	   *
	   * @param {number} time 
	   */
	  AvaTimer.prototype.setHours = function (time) {
	    this.set(time, 'h');
	  };

	  /**
	   * Increments the time of timer in miliseconds.
	   *
	   * @param {number} time 
	   * @param {string} optionalType 
	   */
	  AvaTimer.prototype.add = function (time, optionalType) {

	    if (typeof time !== 'number' || time <= 0) {
	      console.warn('Please, the time must be a valid integer.');
	      return;
	    }

	    if (optionalType) {
	      time = this._getMilisecs(time, optionalType);
	    }

	    this._time += time;
	    this._renderSecs();
	    this._renderMins();
	    this._renderHours();
	  };

	  /**
	   * Increments the time of timer in seconds.
	   *
	   * @param {number} time 
	   */
	  AvaTimer.prototype.addSecs = function (time) {
	    this.add(time, 's');
	  };

	  /**
	   * Increments the time of timer in minutes.
	   *
	   * @param {number} time 
	   */
	  AvaTimer.prototype.addMins = function (time) {
	    this.add(time, 'm');
	  };

	  /**
	   * Increments the time of timer in minutes.
	   *
	   * @param {number} time 
	   */
	  AvaTimer.prototype.addHours = function (time) {
	    this.add(time, 'h');
	  };

	  /**
	   * Decrements the time of timer in miliseconds.
	   *
	   * @param {number} time 
	   */
	  AvaTimer.prototype.remove = function (time, optionalType) {

	    if (typeof time !== 'number' || time <= 0) {
	      console.warn('Please, the time must be a valid integer.');
	      return;
	    }

	    if (optionalType) {
	      time = this._getMilisecs(time, optionalType);
	    }

	    if (this._time - time <= 0) {
	      return false;
	    }

	    this._time -= time;
	    this._renderSecs();
	    this._renderMins();
	    this._renderHours();
	    return true;
	  };

	  /**
	   * Decrements the time of timer in seconds.
	   *
	   * @param {number} time 
	   */
	  AvaTimer.prototype.removeSecs = function (time) {
	    return this.remove(time, 's');
	  };

	  /**
	   * Decrements the time of timer in minutos.
	   *
	   * @param {number} time 
	   */
	  AvaTimer.prototype.removeMins = function (time) {
	    return this.remove(time, 'm');
	  };

	  /**
	   * Decrements the time of timer in minutos.
	   *
	   * @param {number} time 
	   */
	  AvaTimer.prototype.removeHours = function (time) {
	    return this.remove(time, 'h');
	  };

	  /**
	   * Returns the current time in miliseconds.
	   * 
	   */
	  AvaTimer.prototype.getTime = function () {
	    return this._time;
	  };

	  /**
	   * Returns the current time in seconds.
	   * 
	   */
	  AvaTimer.prototype.getTimeSecs = function () {
	    return parseInt(this._getFromMilisecs(this._time, 's'));
	  };

	  /**
	   * Returns the current time in miliseconds.
	   * 
	   */
	  AvaTimer.prototype.getTimeMins = function () {
	    return parseInt(this._getFromMilisecs(this._time, 'm'));
	  };

	  /**
	   * Returns the current time in miliseconds.
	   * 
	   */
	  AvaTimer.prototype.getTimeHours = function () {
	    return parseInt(this._getFromMilisecs(this._time, 'h'));
	  };

	  /**
	   * Pauses the timer.
	   * 
	   */
	  AvaTimer.prototype.pause = function () {
	    clearInterval(this._timeInterval);
	    this._timeInterval = null;
	    this.element.classList.remove(this._cssClasses.TIMER_STARTED);
	    this.element.classList.add(this._cssClasses.TIMER_PAUSED);
	    this.element.dispatchEvent(this._customEvents.onpause);
	  };

	  /**
	   * Renders the seconds on HTML.
	   * 
	   */
	  AvaTimer.prototype._renderSecs = function () {
	    var elementCurrentSecs;
	    var secs = this.getRelativeSecs();

	    if (!this._elementSecs) return;

	    elementCurrentSecs = parseInt(this._elementSecs.textContent);

	    if (elementCurrentSecs != secs) {
	      this._elementSecs.textContent = secs < 10 ? '0' + secs : secs;
	    }
	  };

	  /**
	   * Renders the minutes on HTML.
	   * 
	   */
	  AvaTimer.prototype._renderMins = function () {
	    var elementCurrentMins;
	    var mins = this.getRelativeMins();

	    if (!this._elementMins) return;

	    elementCurrentMins = parseInt(this._elementMins.textContent);

	    if (elementCurrentMins != mins) {
	      this._elementMins.textContent = mins < 10 ? '0' + mins : mins;
	    }
	  };


	  /**
	   * Renders the hours on HTML.
	   * 
	   */
	  AvaTimer.prototype._renderHours = function () {
	    var elementCurrentHours;
	    var hours = this.getRelativeHours();
	    var hoursText /** @type {number} */;

	    if (!this._elementHours) return;

	    elementCurrentHours = parsetInt(this._elementHours.textContent);

	    if (elementCurrentHours != hours) {
	      this._elementHours.textContent = hours < 10 ? '0' + hours : hours;
	    }
	  };

	  /**
	   * Gets relative seconds. 
	   * 
	   * @return {number}
	   */
	  AvaTimer.prototype.getRelativeSecs = function () {
	    var secs = parseInt(this._getFromMilisecs(this._time, 's'));

	    if (this._elementMins) {
	      secs = parseInt(secs % 60);
	    }
	    return secs;
	  }

	  /**
	   * Gets relative mins. 
	   * 
	   * @return {number}
	   */
	  AvaTimer.prototype.getRelativeMins = function () {
	    var mins = parseInt(this._getFromMilisecs(this._time, 'm'));

	    if (this._elementHours) {
	      mins = parseInt(mins % 60);
	    }
	    return mins;
	  }

	  /**
	   * Gets relative hours. 
	   * 
	   * @return {number}
	   */
	  AvaTimer.prototype.getRelativeHours = function () {
	    var hours = parseInt(this._getFromMilisecs(this._time, 'h'));
	    return hours;
	  }

	  /**
	   * Ends the timer. 
	   * 
	   */
	  AvaTimer.prototype.end = function () {
	    clearInterval(this._timeInterval);
	    clearTimeout(this._timeOut);
	    this._timeInterval = null;
	    this._timeTimout = null;
	    this._time = 0;
	    this.element.classList.remove(this._cssClasses.TIMER_STARTED);
	    this.element.classList.remove(this._cssClasses.TIMER_PAUSED);
	    this._renderSecs();
	    this._renderMins();
	    this._renderHours();
	    this.element.dispatchEvent(this._customEvents.onend);
	  };

	  /**
	   * Defines the behavior of component on each seconds running.
	   * 
	   */
	  AvaTimer.prototype._onEachSecond = function () {
	    // Each seconds decrements 1000 miliseconds.
	    this._time -= 1000;

	    if (this._time <= 0) {
	      this.end();
	      return;
	    }
	    this._renderSecs();
	    this._renderMins();
	    this._renderHours();
	    this.element.dispatchEvent(this._customEvents.oneachsecond);
	  };

	  /**
	   * Initializes the timer.
	   * 
	   */
	  AvaTimer.prototype.start = function () {

	    if (!this._time) {
	      console.warn('Defines the time of timer.');
	      return;
	    }

	    if (!this._timeInterval) {
	      this._timeInterval = setInterval(this._onEachSecond.bind(this), 1000);
	      this.element.classList.remove(this._cssClasses.TIMER_PAUSED);
	      this.element.classList.add(this._cssClasses.TIMER_STARTED);
	      this.element.dispatchEvent(this._customEvents.onstart);
	    }
	  };

	  /**
	   * Restarts the timer.
	   * 
	   */
	  AvaTimer.prototype.restart = function () {
	    this.end();
	    this._setInitialTime();
	    this.start();
	    this.element.dispatchEvent(this._customEvents.oninit);
	    this.element.dispatchEvent(this._customEvents.onrestart);
	  };

	  /**
	   * Initializes the instance.
	   * 
	   */
	  AvaTimer.prototype.init = function () {
	    var timers /** @type {object} */;

	    if (!this.element) return;

	    timers = this._getElements();
	    this._elementHours = timers['hours'];
	    this._elementMins = timers['mins'];
	    this._elementSecs = timers['secs'];
	    this._setInitialTime();

	    if (this._isAuto()) {
	      this.start();
	      this.element.dispatchEvent(this._customEvents.oninit);
	    }
	  };

	  // Registers the component. "Componentize" object must be available globally.
	  Componentize.register({
	    name: 'AvaTimer',
	    constructor: AvaTimer,
	    cssClass: 'ava-timer',
	  });
	})();

/***/ },
/* 21 */
/***/ function(module, exports) {

	/**
	 * collapsible.js - a component that expands when clicked on. 
	 * 
	 * @author Alexandre Thebaldi <ahlechandre@gmail.com>
	 * @requires componentize
	 */
	(function () {
	  'use strict';
	  /**
	   * 
	   * @class
	   */
	  function AvaCollapsible(element) {
	    this.element = element;

	    // Initializes the instance.
	    this.init();
	  };

	  /**
	   * Stories the css classes used by this component.
	   * 
	   */
	  AvaCollapsible.prototype._cssClasses = {
	    COLLAPSIBLE_NATIVE: 'collapsible',
	    HEADER: 'ava-collapsible__header',
	    BODY: 'ava-collapsible__body',
	    POPOUT: 'ava-collapsible--popout',
	    POPOUT_NATIVE: 'popout',
	    ACCORDION: 'ava-collapsible--accordion',
	  };

	  /**
	   * Stories the constant strings used by this component.
	   * 
	   */
	  AvaCollapsible.prototype._constants = {};

	  /**
	   * Check if component is of accordion type.
	   *
	   * @return {boolean}
	   */
	  AvaCollapsible.prototype._isAccordion = function () {
	    return this.element.classList.contains(this._cssClasses.ACCORDION);
	  };
	  
	  /**
	   * Check if component is of popout type.
	   *
	   * @return {boolean}
	   */
	  AvaCollapsible.prototype._isPopout = function () {
	    return this.element.classList.contains(this._cssClasses.POPOUT);
	  };
	 
	  /**
	   * Check if component is of popout type.
	   *
	   */
	  AvaCollapsible.prototype._setPopout = function () {

	    if (this._isPopout()) {
	      this.element.classList.add(this._cssClasses.POPOUT_NATIVE);
	    } 
	  };
	  
	  /**
	   * Creates the component.
	   *
	   */
	  AvaCollapsible.prototype.create = function () {
	    var isAccordion = this._isAccordion();

	    // Adding Materialize native css class.
	    this.element.classList.add(this._cssClasses.COLLAPSIBLE_NATIVE);

	    $(this.element).collapsible({
	      accordion: isAccordion,
	    });
	  };

	  /**
	   * Initializes the instance.
	   * 
	   */
	  AvaCollapsible.prototype.init = function () {

	    if (!this.element) return;

	    if (typeof $ === 'undefined' || typeof jQuery === 'undefined') {
	      console.warn('Please, load jQuery. Datefield Component has jQuery as dependency.');
	      return;
	    }
	    
	    this._setPopout();

	    // Initial initialization.
	    this.create();
	  };

	  // Registers the component. "Componentize" object must be available globally.
	  Componentize.register({
	    name: 'AvaCollapsible',
	    constructor: AvaCollapsible,
	    cssClass: 'ava-collapsible',
	  });
	})();

/***/ },
/* 22 */
/***/ function(module, exports) {

	/**
	 * divider.js - a component to hide/show contents with short labels. 
	 * 
	 * @author Alexandre Thebaldi <ahlechandre@gmail.com>
	 * @requires componentize
	 */
	(function () {
	  'use strict';
	  /**
	   * 
	   * @class
	   */
	  function AvaDivider(element) {
	    this.element = element;

	    // Initializes the instance.
	    this.init();
	  };

	  /**
	   * Stories the css classes used by this component.
	   * 
	   */
	  AvaDivider.prototype._cssClasses = {
	    IS_OFF: 'is-off',
	    IS_ON: 'is-on',
	    CONTENT: 'ava-divider__content',
	    LABEL: 'ava-divider__label',
	    LABEL_ICON_MATERIAL_ICONS: 'material-icons',
	  };

	  /**
	   * Stories the constant strings used by this component.
	   * 
	   */
	  AvaDivider.prototype._constants = {
	    ICON_LABEL_TURN_OFF: 'expand_less',
	    ICON_LABEL_TURN_ON: 'expand_more',
	    STATE_OFF: 'off',
	    STATE_ON: 'on',
	  };

	  /**
	   * Stories the content to be expandable.
	   *
	   * @type {HTMLElement} 
	   */
	  AvaDivider.prototype._content = {};

	  /**
	   * Stories the button trigger to expand content.
	   *
	   * @type {HTMLElement} 
	   */
	  AvaDivider.prototype._label = {};

	  /**
	   * Returns the current state of expandable.
	   * 
	   * @return {string | null}
	   */
	  AvaDivider.prototype._getState = function () {
	    var isOn = this.element.classList.contains(this._cssClasses.IS_ON);
	    var isOff = this.element.classList.contains(this._cssClasses.IS_OFF);
	    var state = isOn ? this._constants.STATE_ON :
	      (isOff ? this._constants.STATE_OFF : null);
	    return state;
	  };

	  /**
	   * Handles the on click event on expand button.
	   * 
	   */
	  AvaDivider.prototype._expandOnClick = function (event) {
	    var state = this._getState();
	    event.preventDefault();
	    
	    // Needs to hide or show the contents.
	    if (state === this._constants.STATE_OFF) {
	      // Turn on.
	      this.on();
	    } else if (state === this._constants.STATE_ON) {
	      // Turn off.
	      this.off();
	    }
	  };

	  /**
	   * Returns the current content to be expandable.
	   * 
	   * @return {HTMLElement | null}
	   */
	  AvaDivider.prototype._getContent = function () {
	    return this.element.querySelector('.' + this._cssClasses.CONTENT);
	  };

	  /**
	   * Returns the current action button that expand content.
	   * 
	   * @return {HTMLElement | null}
	   */
	  AvaDivider.prototype._getLabel = function () {
	    return this.element.querySelector('.' + this._cssClasses.LABEL);
	  };

	  /**
	   * Hides the expandable content and changes the state to "off".
	   * 
	   * @return {boolean} true - if turned off. 
	   *                   false - if already is off.
	   */
	  AvaDivider.prototype.off = function () {

	    // Returns false if already is off.    
	    if (this._getState() === this._constants.STATE_OFF) return false;

	    this.element.classList.remove(this._cssClasses.IS_ON);
	    this.element.classList.add(this._cssClasses.IS_OFF);
	    this._updateLabel(this._constants.STATE_OFF);
	    return true;
	  };

	  /**
	   * Shows the expandable content and changes the state to "on".
	   * 
	   * @return {boolean} true - if turned on. 
	   *                   false - if already is on.
	   */
	  AvaDivider.prototype.on = function () {
	    // Returns false if already is on.    
	    if (this._getState() === this._constants.STATE_ON) return false;

	    this.element.classList.remove(this._cssClasses.IS_OFF);
	    this.element.classList.add(this._cssClasses.IS_ON);
	    this._updateLabel(this._constants.STATE_ON);
	    return true;
	  };

	  /**
	   * Updates the action button content to current state. 
	   * 
	   */
	  AvaDivider.prototype._updateLabel = function (state) {
	    var iconTextContent /** @type {string} */;
	    var currentIcon = this._label.querySelector('i');
	    var icon = document.createElement('i');
	    icon.classList.add(this._cssClasses.LABEL_ICON_MATERIAL_ICONS);
	    
	    if (state === this._constants.STATE_OFF) {
	      iconTextContent = this._constants.ICON_LABEL_TURN_ON;
	    } else if (state === this._constants.STATE_ON) {
	      iconTextContent = this._constants.ICON_LABEL_TURN_OFF;
	    }

	    if (currentIcon) {
	      this._label.removeChild(currentIcon);
	    }
	    icon.textContent = iconTextContent;
	    this._label.appendChild(icon);
	  };

	  /**
	   * Initializes the instance.
	   * 
	   */
	  AvaDivider.prototype.init = function () {

	    if (!this.element) return;

	    this._content = this._getContent();
	    this._label = this._getLabel();
	    
	    if (!this._content || !this._label) return;

	    // Initial hide the content.
	    this.off();

	    this._label.addEventListener('click', this._expandOnClick.bind(this))
	  };

	  // Registers the component. "Componentize" object must be available globally.
	  Componentize.register({
	    name: 'AvaDivider',
	    constructor: AvaDivider,
	    cssClass: 'ava-divider',
	  });
	})();

/***/ },
/* 23 */
/***/ function(module, exports) {

	/**
	 * avatar.js - a component to handle avatars images. 
	 * 
	 * @author Alexandre Thebaldi <ahlechandre@gmail.com>
	 * @requires componentize
	 */
	(function () {
	  'use strict';
	  /**
	   * 
	   * @class
	   */
	  function AvaAvatar(element) {
	    this.element = element;

	    // Initializes the instance.
	    this.init();
	  };

	  /**
	   * Stories the input element.
	   * 
	   */
	  AvaAvatar.prototype.input = '';
	    
	  /**
	   * Stories the css classes used by this component.
	   * 
	   */
	  AvaAvatar.prototype._cssClasses = {
	    INPUT: 'ava-avatar__input',
	    AVATAR_INPUT: 'ava-avatar--input',
	    AVATAR_IS_CHANGE: 'ava-avatar--is-change',
	  };

	  /**
	   * Returns the avatar input file.
	   *
	   * @return {HTMLElement}
	   */  
	  AvaAvatar.prototype.getInput = function () { 
	    return this.element.querySelector('.' + this._cssClasses.INPUT);
	  };

	  /**
	   * Returns the input file value.
	   *
	   * @return {HTMLElement}
	   */  
	  AvaAvatar.prototype.getInputValue = function () { 
	    return (this.input ? this.input.value : null);
	  };

	  /**
	   * Returns an array of input files.
	   *
	   * @return {array}
	   */  
	  AvaAvatar.prototype.getInputFiles = function () { 
	    return (this.input ? this.input.files : null);
	  };
	  
	  /**
	   * Removes the current avatar and update component state.
	   *
	   */  
	  AvaAvatar.prototype.remove = function () {
	    this.element.style.backgroundImage = '';
	    this.setState();

	    if (!this.input) return;

	    this.input.value = '';
	  }
	  
	  /**
	   * Open the system dialog to search photos.
	   *
	   */  
	  AvaAvatar.prototype.add = function () {
	    return (this.input ? this.input.click() : undefined);
	  }
	  
	  /**
	   * Defines the state of avatar.
	   *
	   */
	  AvaAvatar.prototype.setState = function () {
	    var isEmptyBackground = (!this.element.style.backgroundImage ||
	      this.element.style.backgroundImage === 'url("")');

	    if (isEmptyBackground) {
	      this.element.classList.remove(this._cssClasses.AVATAR_IS_CHANGE);
	    } else {
	      this.element.classList.add(this._cssClasses.AVATAR_IS_CHANGE);
	    }
	  };
	  
	  /**
	   * Changes the preview element background image.
	   *
	   */
	  AvaAvatar.prototype.setPreview = function (imageAsDataURL) {
	    this.element.style.backgroundImage = 'url(' + imageAsDataURL + ')';
	    this.setState();
	  };
	  
	  /**
	   * Updates the preview avatar photo.
	   *
	   */
	  AvaAvatar.prototype.changePhoto = function (photo) {
	    var reader = new FileReader();

	    if (!photo) return;

	    reader.readAsDataURL(photo);
	    reader.addEventListener('load', function () {
	      this.setPreview(reader.result);  
	    }.bind(this), false);
	  };

	  /**
	   * Defines the default behavior of the input.
	   *
	   */
	  AvaAvatar.prototype.setInputBehavior = function () {

	    // Set input file click when preview photo is clicked.
	    this.element.addEventListener('click', function () {
	      this.input.click();  
	    }.bind(this));

	    // Event listener to avatar changes.
	    this.input.addEventListener('change', function () {
	      var photo = this.input.files[0];
	      this.changePhoto(photo);
	    }.bind(this));
	  };

	  /**
	   * Check if avatar is inputable.
	   *
	   */
	  AvaAvatar.prototype.isInput = function () {
	    return this.element.classList.contains(this._cssClasses.AVATAR_INPUT);
	  };

	  /**
	   * Initializes the instance.
	   * 
	   */
	  AvaAvatar.prototype.init = function () {

	    if (!this.element) return;

	    if (!this.isInput()) return;   

	    this.input = this.getInput();

	    if (!this.input) return;

	    this.setInputBehavior();
	    this.setState();
	  };

	  // Registers the component. "Componentize" object must be available globally.
	  Componentize.register({
	    name: 'AvaAvatar',
	    constructor: AvaAvatar,
	    cssClass: 'ava-avatar',
	  });
	})();

/***/ }
/******/ ]);