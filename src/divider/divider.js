/**
 * divider.js - a component to hide/show contents with short labels. 
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
  function AvaDivider(element) {
    this.element = element;

    // Initializes the instance.
    this.init();
  };

  /**
   * Stories the css classes used by this component.
   * 
   */
  AvaDivider.prototype._cssClasses = {
    IS_OFF: 'is-off',
    IS_ON: 'is-on',
    CONTENT: 'ava-divider__content',
    LABEL: 'ava-divider__label',
    LABEL_ICON_MATERIAL_ICONS: 'material-icons',
  };

  /**
   * Stories the constant strings used by this component.
   * 
   */
  AvaDivider.prototype._constants = {
    ICON_LABEL_TURN_OFF: 'expand_less',
    ICON_LABEL_TURN_ON: 'expand_more',
    STATE_OFF: 'off',
    STATE_ON: 'on',
  };

  /**
   * Stories the content to be expandable.
   *
   * @type {HTMLElement} 
   */
  AvaDivider.prototype._content = {};

  /**
   * Stories the button trigger to expand content.
   *
   * @type {HTMLElement} 
   */
  AvaDivider.prototype._label = {};

  /**
   * Returns the current state of expandable.
   * 
   * @return {string | null}
   */
  AvaDivider.prototype._getState = function () {
    var isOn = this.element.classList.contains(this._cssClasses.IS_ON);
    var isOff = this.element.classList.contains(this._cssClasses.IS_OFF);
    var state = isOn ? this._constants.STATE_ON :
      (isOff ? this._constants.STATE_OFF : null);
    return state;
  };

  /**
   * Handles the on click event on expand button.
   * 
   */
  AvaDivider.prototype._expandOnClick = function (event) {
    var state = this._getState();
    event.preventDefault();
    
    // Needs to hide or show the contents.
    if (state === this._constants.STATE_OFF) {
      // Turn on.
      this.on();
    } else if (state === this._constants.STATE_ON) {
      // Turn off.
      this.off();
    }
  };

  /**
   * Returns the current content to be expandable.
   * 
   * @return {HTMLElement | null}
   */
  AvaDivider.prototype._getContent = function () {
    return this.element.querySelector('.' + this._cssClasses.CONTENT);
  };

  /**
   * Returns the current action button that expand content.
   * 
   * @return {HTMLElement | null}
   */
  AvaDivider.prototype._getLabel = function () {
    return this.element.querySelector('.' + this._cssClasses.LABEL);
  };

  /**
   * Hides the expandable content and changes the state to "off".
   * 
   * @return {boolean} true - if turned off. 
   *                   false - if already is off.
   */
  AvaDivider.prototype.off = function () {

    // Returns false if already is off.    
    if (this._getState() === this._constants.STATE_OFF) return false;

    this.element.classList.remove(this._cssClasses.IS_ON);
    this.element.classList.add(this._cssClasses.IS_OFF);
    this._updateLabel(this._constants.STATE_OFF);
    return true;
  };

  /**
   * Shows the expandable content and changes the state to "on".
   * 
   * @return {boolean} true - if turned on. 
   *                   false - if already is on.
   */
  AvaDivider.prototype.on = function () {
    // Returns false if already is on.    
    if (this._getState() === this._constants.STATE_ON) return false;

    this.element.classList.remove(this._cssClasses.IS_OFF);
    this.element.classList.add(this._cssClasses.IS_ON);
    this._updateLabel(this._constants.STATE_ON);
    return true;
  };

  /**
   * Updates the action button content to current state. 
   * 
   */
  AvaDivider.prototype._updateLabel = function (state) {
    var iconTextContent /** @type {string} */;
    var currentIcon = this._label.querySelector('i');
    var icon = document.createElement('i');
    icon.classList.add(this._cssClasses.LABEL_ICON_MATERIAL_ICONS);
    
    if (state === this._constants.STATE_OFF) {
      iconTextContent = this._constants.ICON_LABEL_TURN_ON;
    } else if (state === this._constants.STATE_ON) {
      iconTextContent = this._constants.ICON_LABEL_TURN_OFF;
    }

    if (currentIcon) {
      this._label.removeChild(currentIcon);
    }
    icon.textContent = iconTextContent;
    this._label.appendChild(icon);
  };

  /**
   * Initializes the instance.
   * 
   */
  AvaDivider.prototype.init = function () {

    if (!this.element) return;

    this._content = this._getContent();
    this._label = this._getLabel();
    
    if (!this._content || !this._label) return;

    // Initial hide the content.
    this.off();

    this._label.addEventListener('click', this._expandOnClick.bind(this))
  };

  // Registers the component. "Componentize" object must be available globally.
  Componentize.register({
    name: 'AvaDivider',
    constructor: AvaDivider,
    cssClass: 'ava-divider',
  });
})();