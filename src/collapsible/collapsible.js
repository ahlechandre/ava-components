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