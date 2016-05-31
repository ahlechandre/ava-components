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