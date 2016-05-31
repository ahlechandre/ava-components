/**
 * dialogable.js - a component to dinamically get dialog contents. 
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
  function AvaDialogable(element) {
    this.element = element;

    // Initializes the instance.
    this.init();
  };

  /**
   * Stories the css classes used by this component.
   * 
   */
  AvaDialogable.prototype._cssClasses = {
    DIALOG: 'ava-dialog',
    DIALOG_CONTENT: 'ava-dialog__content',
    DIALOG_CONTENT_LOADED: 'is-loaded',
  };

  /**
   * Stories the constant strings used by this component.
   * 
   */
  AvaDialogable.prototype._constants = {
    DATASET_URL: 'dialog-url',
    DATASET_EXPIRES: 'dialog-expires',
    DATASET_URL_CAMEL: 'dialogUrl'
  };

  /**
   * Defines the custom events.
   * 
   */
  AvaDialogable.prototype._customEvents = {
    onsuccess: new CustomEvent('onsuccess', {
      bubbles: true,
      cancelable: true,
    }),
  };

  /**
   * Stories the flag to indicate the content loading behavior.
   *
   * @type {boolean}
   */
  AvaDialogable.prototype._defaultBehavior = true;

  /**
   * Stories the dialog element.
   *
   * @type {HTMLElement}
   */
  AvaDialogable.prototype._dialog = {};

  /**
   * Stories the dialog content element.
   *
   * @type {HTMLElement} 
   */
  AvaDialogable.prototype._dialogContent = {};

  /**
   * Stories the url.
   * 
   * @type {string | undefined}
   */
  AvaDialogable.prototype.contentUrl = undefined;

  /**
   * Stories the callback function called on get content success.
   * 
   * @type {function | undefined}
   */
  AvaDialogable.prototype.onContentSuccess = undefined;

  /**
   * Stories the callback function called on get content complete.
   * 
   * @type {function | undefined}
   */
  AvaDialogable.prototype.onContentComplete = undefined;

  /**
   * Stories the callback function called on get content error.
   * 
   * @type {function | undefined}
   */
  AvaDialogable.prototype.onContentError = undefined;

  /**
   * Returns the dialog element.
   * 
   * @return {HTMLElement}
   */
  AvaDialogable.prototype._getDialog = function () {
    var selectorId = this.element.getAttribute('href');
    var element = document.querySelector('.' + this._cssClasses.DIALOG + selectorId);
    var content = element.querySelector('.' + this._cssClasses.DIALOG_CONTENT);

    return {
      element: element,
      content: content
    };
  };

  /**
   * Get ajax options. 
   * 
   * @param {string} url
   * @return {object}
   */
  AvaDialogable.prototype._getAjaxOptions = function (url) {
    var onSuccess = function (response) {
      this._onRequestSuccess(response);
      this.element.dispatchEvent(this._customEvents.onsuccess);

      if (typeof this.onContentSuccess === 'function') {
        this.onContentSuccess(response);
      }
    };
    var onComplete = function () {

      if (typeof this.onContentComplete === 'function') {
        this.onContentComplete();
      }
    };
    var onError = function (err, status, throwErr) {

      if (typeof this.onContentError === 'function') {
        this.onContentError(err, status, throwErr);
      }
    };
    var options = {
      method: 'get',
      url: url,
      complete: onComplete.bind(this),
      error: onError.bind(this),
      success: onSuccess.bind(this),
    };

    return options;
  };

  /**
   * Defines the callback for get content request success. 
   * 
   * @param {object} response
   */
  AvaDialogable.prototype._onRequestSuccess = function (response) {
    // Javascript vanilla. 
    // this._dialogContent.innerHTML = response; 
    // jQuery inserts.
    $(this._dialogContent).html(response);

    if (typeof Componentize !== 'undefined') {
      Componentize.upgradeAll();
    } else {
      console.warn('Please, load Componentize to upgrade the components.');
    }
    this._setLoaded();
  };

  /**
   * Defines the dialogable as loaded.
   * 
   */
  AvaDialogable.prototype._setLoaded = function () {
    // Flag to check if content already is loaded.
    this._dialogContent.classList.add(this._cssClasses.DIALOG_CONTENT_LOADED);
  };

  /**
   * Defines the dialogable as not loaded.
   * 
   */
  AvaDialogable.prototype._unsetLoaded = function () {
    // Flag to check if content already is loaded.
    this._dialogContent.classList.remove(this._cssClasses.DIALOG_CONTENT_LOADED);
  };

  /**
   * Sends a ajax request. 
   *
   * @param {object} options 
   * @return {object}
   */
  AvaDialogable.prototype._sendAjaxRequest = function (options) {

    if (!$ || !jQuery)
      throw new Error('Please, load jQuery.');

    $.ajax(options);
  };

  /**
   * Get content of a given url and put into dialog.
   * 
   * @param {string} optionalUrl
   */
  AvaDialogable.prototype.getContent = function (optionalUrl) {
    var url /** @type {object} */;
    var options /** @type {object} */;
    var datasetUrl = this.element.getAttribute('data-' + this._constants.DATASET_URL);

    if (typeof optionalUrl === 'string' && optionalUrl.length) {
      url = optionalUrl;
    }
    else if (datasetUrl && datasetUrl.length) {
      url = datasetUrl;
    }
    else if (typeof this.contentUrl === 'string' && this.contentUrl.length) {
      url = this.contentUrl;
    }
    else {
      return;
    }

    options = this._getAjaxOptions(url);
    this._sendAjaxRequest(options);
  };

  /**
   * Check if dialog content is already loaded.
   * 
   * @return {boolean}
   */
  AvaDialogable.prototype.isLoaded = function () {
    return this._dialogContent.classList.contains(this._cssClasses.DIALOG_CONTENT_LOADED);
  };

  /**
   * Check if dialog content must expires.
   * 
   * @return {boolean}
   */
  AvaDialogable.prototype.isExpires = function () {
    return (this.element.getAttribute('data-' + this._constants.DATASET_EXPIRES) !== null);
  };

  /**
   * Disable default behavior.
   * 
   */
  AvaDialogable.prototype.disableDefaultBehavior = function () {
    this._defaultBehavior = false;
  };

  /**
   * Enable default behavior.
   * 
   */
  AvaDialogable.prototype.enableDefaultBehavior = function () {
    this._defaultBehavior = true;
  };

  /**
   * Event listener to element on click.
   * 
   */
  AvaDialogable.prototype._elementOnClick = function (event) {

    if ((this._defaultBehavior && !this.isLoaded()) || this.isExpires()) {
      this.getContent();
    }
  };

  /**
   * Event listener to dialog element on open.
   * 
   */
  AvaDialogable.prototype._dialogOnReady = function (event) { };

  /**
   * Event listener to dialog element on close.
   * 
   */
  AvaDialogable.prototype._dialogOnClose = function (event) {

    if (this.isExpires()) {
      // Removes the content on close if the dialogable must expires.
      while (this._dialogContent.firstChild) {
        this._dialogContent.removeChild(this._dialogContent.firstChild);
      }      
      this._unsetLoaded();
    }
  };

  /**
   * Initializes the instance.
   * 
   */
  AvaDialogable.prototype.init = function () {
    var dialog /** @type {object} */;

    if (!this.element) return;

    dialog = this._getDialog();
    this._dialog = dialog['element'];
    this._dialogContent = dialog['content'];

    if (!this._dialog) return;

    if (!this._dialogContent) {
      console.warn('Add a content element (' + this._cssClasses.DIALOG_CONTENT + ') into dialog (' + this._cssClasses.DIALOG + ')');
      return;
    }

    this.element.addEventListener('click', this._elementOnClick.bind(this));
    this._dialog.addEventListener('onready', this._dialogOnReady.bind(this));
    this._dialog.addEventListener('onclose', this._dialogOnClose.bind(this));
  };

  // Registers the component. "Componentize" object must be available globally.
  Componentize.register({
    name: 'AvaDialogable',
    constructor: AvaDialogable,
    cssClass: 'ava-dialogable',
  });
})();