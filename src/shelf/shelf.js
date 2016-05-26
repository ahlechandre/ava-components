/**
 * shelf.js - a component to display a content list with horizontal and vertical scrolling. 
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
  function AvaShelf(element) {
    this.element = element;

    // Initializes the instance.
    this.init();
  };

  /**
   * Stories the css classes used by this component.
   * 
   */
  AvaShelf.prototype._cssClasses = {
    IS_COMPTACT: 'is-compact',
    IS_EXPANDED: 'is-expanded',
    ACTION_LEFT: 'ava-shelf__action-left',
    ACTION_RIGHT: 'ava-shelf__action-right',
    CONTENT: 'ava-shelf__content',
    ACTION_EXPAND: 'ava-shelf__action-expand',
    ACTION_ICON_ALIGN: 'right',
    ACTION_ICON_MATERIAL_ICONS: 'material-icons',
  };

  /**
   * Stories the constant strings used by this component.
   * 
   */
  AvaShelf.prototype._constants = {
    MESSAGE_ACTION_TURN_OFF: 'ocultar',
    MESSAGE_ACTION_TURN_ON: 'mostrar todos',
    ICON_ACTION_TURN_OFF: 'expand_less',
    ICON_ACTION_TURN_ON: 'expand_more',
  };

  /**
   * Stories the content of shelf.
   *
   * @type {HTMLElement} 
   */
  AvaShelf.prototype._content = {};

  /**
   * Stories the button trigger to left scrolling.
   *
   * @type {HTMLElement} 
   */
  AvaShelf.prototype._actionLeft = {};

  /**
   * Stories the button trigger to right scrolling.
   *
   * @type {HTMLElement} 
   */
  AvaShelf.prototype._actionRight = {};

  /**
   * Stories the button trigger to left scrolling.
   *
   * @type {HTMLElement} 
   */
  AvaShelf.prototype._actionExpand = {};

  /**
   * Returns the current state of shelf.
   * 
   * @return {string | null}
   */
  AvaShelf.prototype._isCompacted = function () {
    return this.element.classList.contains(this._cssClasses.IS_COMPTACT);
  };

  /**
   * Handles the on click event on expand button.
   * 
   */
  AvaShelf.prototype._expandOnClick = function (event) {
    event.preventDefault();

    if (this._isCompacted()) {
      // Horizontal shelf.
      this.expand();
    } else {
      // Vertical shelf.
      this.compact();
    }
  };

  /**
   * Handles the on click event on left button.
   * 
   */
  AvaShelf.prototype._leftOnClick = function (event) {
    event.preventDefault();

    if (!this._isCompacted()) return;

    this._onScrolling(true);
  };

  /**
   * Handles the on click event on right button.
   * 
   */
  AvaShelf.prototype._rightOnClick = function (event) {
    event.preventDefault();

    if (!this._isCompacted()) return;

    this._onScrolling(false);
  };

  /**
   * Scrolls the shelf to left/right direction.
   * 
   * @param {boolean} toLeft Determines if must be scrolled to left or right.
   */
  AvaShelf.prototype._onScrolling = function (toLeft) {
    var range = 25;
    var i;
    var _scroll = function (content) {
      var j;
      var increments = toLeft ? -1 : 1;

      for (j = 0; j < 15; j++) {
        content.scrollLeft += increments;
      }
    };

    for (i = 1; i <= range; i++) {
      setTimeout((function (content) {
        return function () {
          _scroll(content);
        };
      })(this._content), ((range + (range / (range / 2))) * (i * 0.5)));
    }
  };

  /**
   * Returns the elements of shelf.
   * 
   * @return {HTMLElement | null}
   */
  AvaShelf.prototype._getElements = function () {
    var content = this.element.querySelector('.' + this._cssClasses.CONTENT);
    var actionExpand = this.element.querySelector('.' + this._cssClasses.ACTION_EXPAND);
    var actionLeft = this.element.querySelector('.' + this._cssClasses.ACTION_LEFT);
    var actionRight = this.element.querySelector('.' + this._cssClasses.ACTION_RIGHT);

    return {
      content: content,
      actionExpand: actionExpand,
      actionLeft: actionLeft,
      actionRight: actionRight,
    };
  };

  /**
   * Compacts the content in a horizontal shelf. 
   * 
   * @return {boolean} 
   */
  AvaShelf.prototype.compact = function () {

    if (this._isCompacted()) return false;

    this.element.classList.remove(this._cssClasses.IS_EXPANDED);
    this.element.classList.add(this._cssClasses.IS_COMPTACT);
    this._updateButtonExpand(true);
    return true;
  };

  /**
   * Compacts the content in a vertical shelf. 
   * 
   * @return {boolean} 
   */
  AvaShelf.prototype.expand = function () {

    if (!this._isCompacted()) return false;

    this.element.classList.remove(this._cssClasses.IS_COMPTACT);
    this.element.classList.add(this._cssClasses.IS_EXPANDED);
    this._updateButtonExpand(false);
    return true;
  };

  /**
   * Updates the action button content to current state. 
   * 
   */
  AvaShelf.prototype._updateButtonExpand = function (isCompacted) {
    var iconTextContent /** @type {string} */;
    var actionTextContent /** @type {string} */;
    var icon = document.createElement('i');
    icon.classList.add(this._cssClasses.ACTION_ICON_MATERIAL_ICONS);
    icon.classList.add(this._cssClasses.ACTION_ICON_ALIGN);

    if (isCompacted) {
      iconTextContent = this._constants.ICON_ACTION_TURN_ON;
      actionTextContent = this._constants.MESSAGE_ACTION_TURN_ON;
    } else {
      iconTextContent = this._constants.ICON_ACTION_TURN_OFF;
      actionTextContent = this._constants.MESSAGE_ACTION_TURN_OFF;
    }
    icon.textContent = iconTextContent;
    this._actionExpand.innerHTML = '';
    this._actionExpand.textContent = actionTextContent;
    this._actionExpand.appendChild(icon);
  };

  /**
   * Initializes the instance.
   * 
   */
  AvaShelf.prototype.init = function () {
    var elements = {};

    if (!this.element) return;

    elements = this._getElements();
    this._actionExpand = elements['actionExpand'];
    this._actionLeft = elements['actionLeft'];
    this._actionRight = elements['actionRight'];
    this._content = elements['content'];

    if (!this._content || !this._actionLeft || !this._actionRight) return;

    // Initial compact.
    this.compact();
    this._actionExpand.addEventListener('click', this._expandOnClick.bind(this))
    this._actionLeft.addEventListener('click', this._leftOnClick.bind(this))
    this._actionRight.addEventListener('click', this._rightOnClick.bind(this))
  };

  // Registers the component. "Componentize" object must be available globally.
  Componentize.register({
    name: 'AvaShelf',
    constructor: AvaShelf,
    cssClass: 'ava-shelf',
  });
})();