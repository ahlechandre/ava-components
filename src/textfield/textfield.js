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
   */
  AvaTextfield.prototype._unsetActiveLabel = function () {
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
    this.update();
    this._input.value = value;
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