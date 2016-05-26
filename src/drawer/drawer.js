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