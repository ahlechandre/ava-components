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
  function AvaSelect(element) {
    this.element = element;
    
    // Initializes the instance.
    this.init();
  };

  /**
   * Stories the css classes used by this component.
   * 
   */
  AvaSelect.prototype._cssClasses = {
    COMPONENT: 'ava-select',
    IS_CREATED: 'is-created'
  };

  /**
   * Stories the constant strings used by this component.
   * 
   */
  AvaSelect.prototype._constants = {};

  /**
   * Check if the select already is initialized.
   * 
   * @return {boolean}
   */
  AvaSelect.prototype._isCreated = function () {
    return this.element.classList.contains(this._cssClasses.IS_CREATED);
  };
  
  /**
   * Selects an option.
   * 
   * @param {string} value
   */
  AvaSelect.prototype.select = function (value) {
    this.element.value = value;
    this.update();
  };
  
  /**
   * Initializes the select.
   * 
   */
  AvaSelect.prototype.create = function () {

    if (this._isCreated()) return;

    // jQuery initialization.
    $(this.element).material_select();
    this.element.classList.add(this._cssClasses.IS_CREATED);
  };

  /**
   * Destroys the select.
   * 
   */
  AvaSelect.prototype.destroy = function () {

    if (!this._isCreated()) return;
        
    // jQuery initialization.
    $(this.element).material_select('destroy');
    this.element.classList.remove(this._cssClasses.IS_CREATED);
  };

  /**
   * Destroys and initializes the select.
   * 
   */
  AvaSelect.prototype.update = function () {
    this.destroy();
    this.create();
  };
  
  /**
   * Defines the real element used by component. 
   * 
   */
  AvaSelect.prototype.setElement = function () {
    var selectElement /** @type {HTMLElement | undefined} */;

    // Materialize clones the select element class list in a parent node.
    // Issue described: <https://github.com/Dogfalo/materialize/issues/3199 /> 
    if (this.element.tagName === 'DIV') {
      selectElement = this.element.querySelector('.' + this._cssClasses.COMPONENT);
      this.element = selectElement;
    }
  };
  
  /**
   * Initializes the instance.
   * 
   */
  AvaSelect.prototype.init = function () {

    if (!this.element) return;
    
    this.setElement();
    
    if (typeof $ === 'undefined' || typeof jQuery === 'undefined') {
      console.warn('Please, load jQuery. Select Component has jQuery as dependency.');
      return;
    }
    // Initial initialization.
    this.create();
  };

  // Registers the component. "Componentize" object must be available globally.
  Componentize.register({
    name: 'AvaSelect',
    constructor: AvaSelect,
    cssClass: 'ava-select',
  });
})();