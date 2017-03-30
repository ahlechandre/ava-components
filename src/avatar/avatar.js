/**
 * avatar.js - a component to handle avatars images. 
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
  function AvaAvatar(element) {
    this.element = element;

    // Initializes the instance.
    this.init();
  };

  /**
   * Stories the input element.
   * 
   */
  AvaAvatar.prototype.input = '';
    
  /**
   * Stories the css classes used by this component.
   * 
   */
  AvaAvatar.prototype._cssClasses = {
    INPUT: 'ava-avatar__input',
    AVATAR_INPUT: 'ava-avatar--input',
    AVATAR_IS_CHANGE: 'ava-avatar--is-change',
  };

  /**
   * Returns the avatar input file.
   *
   * @return {HTMLElement}
   */  
  AvaAvatar.prototype.getInput = function () { 
    return this.element.querySelector('.' + this._cssClasses.INPUT);
  };

  /**
   * Returns the input file value.
   *
   * @return {HTMLElement}
   */  
  AvaAvatar.prototype.getInputValue = function () { 
    return (this.input ? this.input.value : null);
  };

  /**
   * Returns an array of input files.
   *
   * @return {array}
   */  
  AvaAvatar.prototype.getInputFiles = function () { 
    return (this.input ? this.input.files : null);
  };
  
  /**
   * Removes the current avatar and update component state.
   *
   */  
  AvaAvatar.prototype.remove = function () {
    this.element.style.backgroundImage = '';
    this.setState();

    if (!this.input) return;

    this.input.value = '';
  }
  
  /**
   * Open the system dialog to search photos.
   *
   */  
  AvaAvatar.prototype.add = function () {
    return (this.input ? this.input.click() : undefined);
  }
  
  /**
   * Defines the state of avatar.
   *
   */
  AvaAvatar.prototype.setState = function () {
    var isEmptyBackground = (!this.element.style.backgroundImage ||
      this.element.style.backgroundImage === 'url("")');

    if (isEmptyBackground) {
      this.element.classList.remove(this._cssClasses.AVATAR_IS_CHANGE);
    } else {
      this.element.classList.add(this._cssClasses.AVATAR_IS_CHANGE);
    }
  };
  
  /**
   * Changes the preview element background image.
   *
   */
  AvaAvatar.prototype.setPreview = function (imageAsDataURL) {
    this.element.style.backgroundImage = 'url(' + imageAsDataURL + ')';
    this.setState();
  };
  
  /**
   * Updates the preview avatar photo.
   *
   */
  AvaAvatar.prototype.changePhoto = function (photo) {
    var reader = new FileReader();

    if (!photo) return;

    reader.readAsDataURL(photo);
    reader.addEventListener('load', function () {
      this.setPreview(reader.result);  
    }.bind(this), false);
  };

  /**
   * Defines the default behavior of the input.
   *
   */
  AvaAvatar.prototype.setInputBehavior = function () {

    // Set input file click when preview photo is clicked.
    this.element.addEventListener('click', function () {
      this.input.click();  
    }.bind(this));

    // Event listener to avatar changes.
    this.input.addEventListener('change', function () {
      var photo = this.input.files[0];
      this.changePhoto(photo);
    }.bind(this));
  };

  /**
   * Check if avatar is inputable.
   *
   */
  AvaAvatar.prototype.isInput = function () {
    return this.element.classList.contains(this._cssClasses.AVATAR_INPUT);
  };

  /**
   * Initializes the instance.
   * 
   */
  AvaAvatar.prototype.init = function () {

    if (!this.element) return;

    if (!this.isInput()) return;   

    this.input = this.getInput();

    if (!this.input) return;

    this.setInputBehavior();
    this.setState();
  };

  // Registers the component. "Componentize" object must be available globally.
  Componentize.register({
    name: 'AvaAvatar',
    constructor: AvaAvatar,
    cssClass: 'ava-avatar',
  });
})();