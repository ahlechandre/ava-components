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
    DATASET_URL_CAMEL: 'dialogUrl'
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
    this._dialogContent.innerHTML = response;

    if (typeof Componentize !== 'undefined') {
      Componentize.upgradeAll();
    } else {
      console.warn('Please, load Componentize to upgrade the components.'); 
    }
    // Flag to check if content already is loaded.
    this._dialogContent.classList.add(this._cssClasses.DIALOG_CONTENT_LOADED);
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
    var datasetUrl = this.element.dataset[this._constants.DATASET_URL_CAMEL];
    
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
    
    if (this._defaultBehavior && !this.isLoaded()) {
      this.getContent();    
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
  };

  // Registers the component. "Componentize" object must be available globally.
  Componentize.register({
    name: 'AvaDialogable',
    constructor: AvaDialogable,
    cssClass: 'ava-dialogable',
  });
})();