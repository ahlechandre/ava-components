(function () {

  /**
   * A module that send dinamically ajax requests for tabs. 
   * 
   */
  var tabAjax = {
    /**
     * Initializes the module. 
     * 
     * @param {object} options - The ajax options for each tab.
     * @return
     */
    init: function (options) { }
  };


  tabAjax = (function () {

    /**
     * Defines an item of options passed for module instance.
     *
     * @type {object}
     * @typedef 
     *  tabHref => {
     *    url: string
     *  }
     */
    var _option = {};

    /**
     * Defines the options passed for module instance.
     *
     * @type array<_option>
     */
    var _options = [];

    /**
     * Defines the config of a tab options.
     *
     * @typedef 
     *  optionsConfig => {
     *    url: string,
     *  }  
     */
    var optionsConfig = {};

    /**
     * Defines the config of a tab item.
     *
     * @typedef 
     *  tabConfig => {
     *    trigger: HTMLElement,
     *    panel: HTMLElement,
     *    options: optionsConfig,
     *    isLoaded: boolean,
     *    name: string
     *  }  
     */
    var _tabConfig = {};

    /**
     * Stories the config of all tabs in instance.
     * 
     * @typedef array<tabConfig>
     */
    var _tabs = [];

    /**
     * Process and returns the tabs.
     * 
     * @return array
     */
    var _getTabs = function () {
      var tabs = [];
      var config = _tabConfig;

      for (option in _options) {
        config = {};
        config['name'] = option;
        config['trigger'] = document.querySelector('[href="#' + option + '"]');
        config['panel'] = document.querySelector('#' + option);
        config['options'] = _options[option];
        config['isLoaded'] = false;
        tabs.push(config);
      }
      return tabs;
    };

    /**
     * Handle the ajax response with success. 
     * 
     * @param {} response
     * @return
     */
    var _processResponseSuccess = function (tab, response) {

      if (!tab.panel) return;

      tab.panel.innerHTML = response;

      if (typeof (Componentize) !== 'undefined') {
        // Upgrades all registered/available javascript plugins on page.
        Componentize.upgradeAll();
      } else {
        console.warn('Please, load componentize.js to upgrade the components.');
      }

      if (tab.options.hasChart) {

        if (typeof (chartHandler) === 'undefined') {
          console.warn('Please, load chartHandler.js to render the charts.');
          return;
        }
        chartHandler.renderAllDiff();
      }
    };

    /**
     * Sends a ajax request for server. 
     * 
     * @param {object} options
     */
    var _sendAjaxRequest = function (options) {
      $.ajax(options);
    };

    /**
     * Returns the ajax options for tab. 
     * 
     * @param {_tabConfig} tab
     * @return {object|null}
     */
    var _getAjaxOptions = function (tab) {

      // Abort ajax requests without url.
      if (!tab.options || !tab.options.url) return null;

      var url = tab.options.url;
      var onSuccess = function (response) {
        // Changes the flag if the content is successfully loaded.
        tab.isLoaded = true;
        _processResponseSuccess(tab, response);
      };
      var onError = function (jqXHR, textStatus, errorThrown) { };
      var onComplete = function () { };

      return {
        method: 'GET',
        url: url,
        success: onSuccess.bind(this),
        error: onError.bind(this),
        complete: onComplete.bind(this),
      };
    };

    /**
     * Handle the tab on click. 
     * 
     * @param {_tabConfig} tab
     * @return 
     */
    var _tabOnClick = function (tab) {
      var ajaxOptions = {};

      // Check if the tab already has your content loaded.
      if (tab.isLoaded) return;

      ajaxOptions = _getAjaxOptions(tab);

      if (ajaxOptions) _sendAjaxRequest(ajaxOptions);

    };


    /**
     * Defines the events for each tab.
     *  
     * @return 
     */
    var _setEvents = function () {
      var trigger /** @type {HTMLElement|null} */;

      for (tab in _tabs) {
        trigger = _tabs[tab].trigger ? _tabs[tab].trigger : null;

        if (!trigger) continue;

        trigger.addEventListener('click', (function (tabItem) {

          return function () {
            _tabOnClick(tabItem);
          };
        })(_tabs[tab]));

        // Simulates the click on tab that is active.
        if (_tabs[tab].options && _tabs[tab].options.isActive) trigger.click();
      }
    };

    /**
     * Initializes the module. 
     * 
     * @param {object} options - The ajax options for each tab.
     * @return
     */
    var init = function (options) {

      if (!options) return;

      _options = options;
      _tabs = _getTabs();
      _setEvents();
    };

    return {
      init: init
    };
  })();

  // Defines the tab ajax module in global scope.
  window['tabAjax'] = tabAjax;
})();
