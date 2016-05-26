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