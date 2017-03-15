/**
 * timefield.js - a component to handle time inputs. 
 * 
 * @author Alexandre Thebaldi <ahlechandre@gmail.com>
 * @requires componentize
 */
(function () {
  'use strict';
  // Dependency.
  require('jquery.inputmask/dist/jquery.inputmask.bundle');
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