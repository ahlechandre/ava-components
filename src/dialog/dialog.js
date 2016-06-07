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
  function AvaDialog(element) {
    this.element = element;

    // Initializes the instance.
    this.init();
  };

  /**
   * Stories the css classes used by this component.
   * 
   */
  AvaDialog.prototype._cssClasses = {};

  /**
   * Stories the constant strings used by this component.
   * 
   */
  AvaDialog.prototype._constants = {};


  /**
   * Defines the custom events used by this component. 
   * 
   */
  AvaDialog.prototype._customEvents = {
    onready: new CustomEvent('onready', {
      bubbles: true,
      cancelable: true,
    }),
    onclose: new CustomEvent('onclose', {
      bubbles: true,
      cancelable: true,
    }),
  };

  /**
   * Initializes the dialog component.
   * 
   */
  AvaDialog.prototype.create = function () {
    var triggerElementHref = '#' + this.element.getAttribute('id');
    var triggerElements = document.querySelectorAll('[href="' + triggerElementHref + '"]');
    var onReady;
    var onComplete;

    if (!triggerElements) return;
    
    onReady = function () {
      this.element.dispatchEvent(this._customEvents.onready);
    };
    onComplete = function () {
      this.element.dispatchEvent(this._customEvents.onclose);      
    };
    
    // jQuery initialization.
    $(triggerElements).leanModal({
      ready: onReady.bind(this),
      complete: onComplete.bind(this),
    });
  };

  /**
   * Initializes the instance.
   * 
   */
  AvaDialog.prototype.init = function () {

    if (!this.element) return;

    if (typeof $ === 'undefined' || typeof jQuery === 'undefined') {
      console.warn('Please, load jQuery. Dialog Component has jQuery as dependency.');
      return;
    }

    // Initializes the dialog.
    this.create();
  };

  // Registers the component. "Componentize" object must be available globally.
  Componentize.register({
    name: 'AvaDialog',
    constructor: AvaDialog,
    cssClass: 'ava-dialog',
  });
})();