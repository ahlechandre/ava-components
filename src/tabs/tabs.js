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