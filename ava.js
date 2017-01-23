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
	__webpack_require__(6);
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
/***/ function(module, exports) {

	/**
	 * datefield.js - a component to handle date inputs. 
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
	  function AvaDatefield(element) {
	    this.element = element;

	    // Initializes the instance.
	    this.init();
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
	   */  AvaDatefield.prototype._unsetActiveLabel = function () {
	    return this._label.classList.remove(this._cssClasses.LABEL_ACTIVE_MATERIALIZE);
	  };

	  /**
	   * Initializes the datefield.
	   * 
	   */
	  AvaDatefield.prototype.create = function () {

	    if (!this._isActiveLabel()) this._setActiveLabel();

	    if (this._isMaterialInput()) this._setMaterialInput();
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

	    if (!triggerElements) return;
	    
	    onReady = function () {
	      this.element.dispatchEvent(this._customEvents.onready);
	    };
	    onComplete = function () {
	      this.element.dispatchEvent(this._customEvents.onclose);      
	    };
	    
	    // jQuery initialization.
	    $(triggerElements).leanModal({
	      ready: onReady.bind(this),
	      complete: onComplete.bind(this),
	    });
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
/* 7 */
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
/* 8 */
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
/* 9 */
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
/* 10 */
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
/* 11 */
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
/* 12 */
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
/* 13 */
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
/* 14 */
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
/* 15 */
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
/* 16 */
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
/* 17 */
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
	   * Clear the textfield.
	   * 
	   */
	  AvaTextfield.prototype.clear = function () {
	    this._input.value = '';
	  };
	  
	  /**
	   * Clear the textfield.
	   * 
	   */
	  AvaTextfield.prototype.setValue = function (value) {
	    this._input.value = value;
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
	    name: 'AvaTexfield',
	    constructor: AvaTextfield,
	    cssClass: 'ava-textfield',
	  });
	})();

/***/ },
/* 18 */
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
	   * Returns the current time in miliseconds.
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

/***/ }
/******/ ]);