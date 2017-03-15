/**
 * datefield.js - a component to handle date inputs. 
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