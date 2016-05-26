/**
 * expandable.js - a component to hide/show contents. 
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
  function AvaExpandable(element) {
    this.element = element;

    // Initializes the instance.
    this.init();
  };

  /**
   * Stories the css classes used by this component.
   * 
   */
  AvaExpandable.prototype._cssClasses = {
    IS_OFF: 'is-off',
    IS_ON: 'is-on',
    CONTENT: 'ava-expandable__content',
    ACTION: 'ava-expandable__action',
    ACTION_ICON_ALIGN: 'right',
    ACTION_ICON_MATERIAL_ICONS: 'material-icons',
  };

  /**
   * Stories the constant strings used by this component.
   * 
   */
  AvaExpandable.prototype._constants = {
    MESSAGE_ACTION_TURN_OFF: 'ocultar',
    MESSAGE_ACTION_TURN_ON: 'mostrar todos',
    ICON_ACTION_TURN_OFF: 'expand_less',
    ICON_ACTION_TURN_ON: 'expand_more',
    STATE_OFF: 'off',
    STATE_ON: 'on',
  };

  /**
   * Stories the content to be expandable.
   *
   * @type {HTMLElement} 
   */
  AvaExpandable.prototype._content = {};

  /**
   * Stories the button trigger to expand content.
   *
   * @type {HTMLElement} 
   */
  AvaExpandable.prototype._action = {};

  /**
   * Returns the current state of expandable.
   * 
   * @return {string | null}
   */
  AvaExpandable.prototype._getState = function () {
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
  AvaExpandable.prototype._expandOnClick = function (event) {
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
  AvaExpandable.prototype._getContent = function () {
    return this.element.querySelector('.' + this._cssClasses.CONTENT);
  };

  /**
   * Returns the current action button that expand content.
   * 
   * @return {HTMLElement | null}
   */
  AvaExpandable.prototype._getAction = function () {
    return this.element.querySelector('.' + this._cssClasses.ACTION);
  };

  /**
   * Hides the expandable content and changes the state to "off".
   * 
   * @return {boolean} true - if turned off. 
   *                   false - if already is off.
   */
  AvaExpandable.prototype.off = function () {

    // Returns false if already is off.    
    if (this._getState() === this._constants.STATE_OFF) return false;

    this.element.classList.remove(this._cssClasses.IS_ON);
    this.element.classList.add(this._cssClasses.IS_OFF);
    this._updateAction(this._constants.STATE_OFF);
    return true;
  };

  /**
   * Shows the expandable content and changes the state to "on".
   * 
   * @return {boolean} true - if turned on. 
   *                   false - if already is on.
   */
  AvaExpandable.prototype.on = function () {
    // Returns false if already is on.    
    if (this._getState() === this._constants.STATE_ON) return false;

    this.element.classList.remove(this._cssClasses.IS_OFF);
    this.element.classList.add(this._cssClasses.IS_ON);
    this._updateAction(this._constants.STATE_ON);
    return true;
  };

  /**
   * Updates the action button content to current state. 
   * 
   */
  AvaExpandable.prototype._updateAction = function (state) {
    var iconTextContent /** @type {string} */;
    var actionTextContent /** @type {string} */;
    var icon = document.createElement('i');
    icon.classList.add(this._cssClasses.ACTION_ICON_MATERIAL_ICONS);
    icon.classList.add(this._cssClasses.ACTION_ICON_ALIGN);
    
    if (state === this._constants.STATE_OFF) {
      iconTextContent = this._constants.ICON_ACTION_TURN_ON;
      actionTextContent = this._constants.MESSAGE_ACTION_TURN_ON;
    } else if (state === this._constants.STATE_ON) {
      iconTextContent = this._constants.ICON_ACTION_TURN_OFF;
      actionTextContent = this._constants.MESSAGE_ACTION_TURN_OFF;      
    }
    icon.textContent = iconTextContent;
    this._action.innerHTML = '';
    this._action.textContent = actionTextContent;
    this._action.appendChild(icon);
  };

  /**
   * Initializes the instance.
   * 
   */
  AvaExpandable.prototype.init = function () {

    if (!this.element) return;

    this._content = this._getContent();
    this._action = this._getAction();

    if (!this._content || !this._action) return;

    // Initial hide the content.
    this.off();

    this._action.addEventListener('click', this._expandOnClick.bind(this))
  };

  // Registers the component. "Componentize" object must be available globally.
  Componentize.register({
    name: 'AvaExpandable',
    constructor: AvaExpandable,
    cssClass: 'ava-expandable',
  });
})();