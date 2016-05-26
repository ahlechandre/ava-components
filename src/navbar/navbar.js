/**
 * navbar.js - a component to handle navbars. 
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
  function AvaNavbar(element) {
    this.element = element;

    // Initializes the instance.
    this.init();
  };

  /**
   * Stories the css classes used by this component.
   * 
   */
  AvaNavbar.prototype._cssClasses = {
    NAVBAR_TABS: 'ava-navbar--tabs',
    TABS: 'ava-tabs',
    TABS_ONLY_ICONS: 'ava-tabs--icons',
  };

  /**
   * Stories the constant strings used by this component.
   * 
   */
  AvaNavbar.prototype._constants = {};

  /**
   * Stories the tabs element if exists.
   * 
   */
  AvaNavbar.prototype._tabs = {};

  /**
   * Returns the tabs element.
   * 
   * @return {HTMLElement | null}
   */
  AvaNavbar.prototype._getTabs = function () {
    return this.element.querySelector('.' + this._cssClasses.TABS);
  };

  /**
   * Check if navbar is with tabs.
   * 
   * @return {boolean}
   */
  AvaNavbar.prototype._isTabs = function () {
    return this.element.classList.contains(this._cssClasses.NAVBAR_TABS);
  };
  
  /**
   * Shows only icons in tabs on scroll.
   * 
   */
  AvaNavbar.prototype._onScrollShowIcons = function () {
    var navbarHeight = this.element.scrollHeight;
    
    if (!this._tabs) return;
    
    window.addEventListener('scroll', function (event) {
      
      if (window.scrollY > navbarHeight) {
        this._tabs.classList.add(this._cssClasses.TABS_ONLY_ICONS);    
      } else {
        this._tabs.classList.remove(this._cssClasses.TABS_ONLY_ICONS);            
      }
    }.bind(this));
  };
  
  /**
   * Initializes the instance.
   * 
   */
  AvaNavbar.prototype.init = function () {

    if (!this.element) return;
    
    if (this._isTabs()) {
      this._tabs = this._getTabs();
      this._onScrollShowIcons();      
    }
  };

  // Registers the component. "Componentize" object must be available globally.
  Componentize.register({
    name: 'AvaNavbar',
    constructor: AvaNavbar,
    cssClass: 'ava-navbar',
  });
})();