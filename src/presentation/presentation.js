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