/**
 * tester.js - a component to handle tests with questions. 
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
  function AvaTester(element) {
    this.element = element;

    // Initializes the instance.
    this.init();
  };

  /**
   * Stories the css classes used by this component.
   * 
   */
  AvaTester.prototype._cssClasses = {
    TEST: 'ava-test',
    TEST_ACTIVE: 'is-active',
    TEST_COMPLETED: 'is-completed',
    LABEL: 'ava-test__label',
    LABEL_INDICATOR: 'ava-test__label-indicator',
    LABEL_INDICATOR_ITEM: 'ava-test__label-indicator-item',
    LABEL_TITLE: 'ava-test__label-title',
    LABEL_TITLE_TEXT: 'ava-test__label-title-text',
    LABEL_DESCRIPTION: 'ava-test__label-description',
    LABEL_SUPPORT: 'ava-test__label-support',
    CONTENT: 'ava-test__content',
    ACTIONS: 'ava-test__actions',
    IS_TRANSITION: 'is-transition',
    IS_TRANSITION_NEXT: 'is-transition-next',
    IS_TRANSITION_BACK: 'is-transition-back',
    ACTIVATOR_NAV: 'ava-tester__activator',
    ACTIVATOR_ITEM: 'ava-tester__activator-item',
  };

  /**
   * Stories the constant strings used by this component.
   * 
   */
  AvaTester.prototype._constants = {
    DATASET_ACTION_COMPLETE: 'test-complete',
    DATASET_ACTION_BACK: 'test-back',
    DATASET_ACTION_SKIP: 'test-skip',
    DATASET_ACTIVATOR_ACTIVATES: 'tester-activates',
  };

  /**
   * Stories the tester config.
   * 
   * @typedef {{
   *  activeIndex: number,
   *  total: number,
   *  totalCompleted: number,
   * }}
   */
  AvaTester.prototype._tester = {};

  /**
   * Stories the list of tests.
   * 
   * @type {array<AvaTester._test>}
   */
  AvaTester.prototype._tests = [];

  /**
   * Defines the config of a test item.
   * 
   * @typedef {{
   *  index: number,
   *  completed: boolean,
   *  element: HTMLElement,
   *  elements: AvaTester._testElements,
   * }}
   */
  AvaTester.prototype._test;

  /**
   * All elements of a test item.
   * 
   * @typedef {{
   *  label: HTMLElement,
   *  labelTitle: HTMLElement,
   *  labelTitleText: HTMLElement,
   *  labelDescription: HTMLElement,
   *  labelIndicator: HTMLElement,
   *  labelIndicatorItem: HTMLElement,
   *  labelSupport: HTMLElement,
   *  content: HTMLElement,
   *  actions: HTMLElement,
   *  actionComplete: HTMLElement,
   *  actionSkip: HTMLElement,
   *  actionBack: HTMLElement
   * }}
   */
  AvaTester.prototype._testElements;

  /**
   * Defines the custom events used by this component. 
   * 
   */
  AvaTester.prototype._customEvents = {
    ongoto: new CustomEvent('ongoto', {
      bubbles: true,
      cancelable: true,
    }),
    onback: new CustomEvent('onback', {
      bubbles: true,
      cancelable: true,
    }),
    oncomplete: new CustomEvent('oncomplete', {
      bubbles: true,
      cancelable: true,
    }),
    onskip: new CustomEvent('onskip', {
      bubbles: true,
      cancelable: true,
    }),
    onsupport: new CustomEvent('onsupport', {
      bubbles: true,
      cancelable: true,
    }),
    onend: new CustomEvent('onend', {
      bubbles: true,
      cancelable: true,
    }),
  };

  /**
   * Check if a given test element is completed.
   * 
   * @param {HTMLElement | number} test
   * @return {boolean}
   */
  AvaTester.prototype.isCompleted = function (test) {
    var element;
    var _test;

    if (typeof test === 'number') {
      _test = this._getTest(test);

      if (_test) {
        element = _test.element;
      } else {
        return false;
      }
    } else if (test instanceof HTMLElement) {
      element = test;
    } else {
      return false;
    }

    return element.classList.contains(this._cssClasses.TEST_COMPLETED);
  };

  /**
   * Check if a given test is active.
   * 
   * @param {HTMLElement | number} test
   * @return {boolean}
   */
  AvaTester.prototype.isActive = function (test) {
    var testElement /** @type {HTMLElement} */;

    if (test instanceof HTMLElement) {
      testElement = test;
    } else if (typeof test === 'number') {
      testElement = this.getTestElementByIndex(test);
    } else {
      return false;
    }
    return testElement.classList.contains(this._cssClasses.TEST_ACTIVE);
  };

  /**
   * Defines a given test element as active.
   * 
   * @param {HTMLElement | number} test
   * @return {boolean}
   */
  AvaTester.prototype.setActive = function (test) {
    var toActiveElement /** @type {HTMLElement} */;
    var activeElement /** @type {HTMLElement} */;
    /** @type {number | undefined} */
    var newActiveIndex;

    if (test instanceof HTMLElement) {
      toActiveElement = test;
    } else if (typeof test === 'number') {
      toActiveElement = this.getTestElementByIndex(test);

      if (!toActiveElement) return false;

      newActiveIndex = test;
    } else {
      return false;
    }
    activeElement = this.getActive();

    // Do nothing if the active is the same.
    if (toActiveElement === activeElement) return true;

    // Check if the active element exists.
    if (activeElement instanceof HTMLElement) {
      activeElement.classList.remove(this._cssClasses.TEST_ACTIVE);
    }
    toActiveElement.classList.add(this._cssClasses.TEST_ACTIVE);

    if (!newActiveIndex) {
      newActiveIndex = this.getTestIndexByElement(toActiveElement);
    }
    this._tester.activeIndex = newActiveIndex;
    return true;
  };

  /**
   * Returns the active test element. 
   * 
   * @return {HTMLElement | null}
   */
  AvaTester.prototype.getActive = function () {
    /** @type {HTMLElement | null} */
    var element = null;
    var i;

    for (i = 0; i < this._tests.length; i++) {

      if (this._tests[i].index === this._tester.activeIndex) {
        element = this._tests[i].element;
        break;
      }
    }

    return element;
  };

  /**
   * Returns the active index. 
   * 
   * @return {number | null}
   */
  AvaTester.prototype.getActiveIndex = function () {
    return this._tester.activeIndex;
  };

  /**
   * Returns the test element of a given index. 
   * 
   * @param {number} index
   * @return {HTMLElement | null}
   */
  AvaTester.prototype.getTestElementByIndex = function (index) {
    var test = this._getTest(index);
    var element = null;

    if (test) element = test.element;

    return element;
  };

  /**
   * Returns the test index of a given element. 
   * 
   * @param {HTMLElement} element
   * @return {number | null}
   */
  AvaTester.prototype.getTestIndexByElement = function (element) {
    /** @type {HTMLElement | null} */
    var index = null;
    var i;
    var isElement = element instanceof HTMLElement;

    if (!isElement) return null;

    for (i = 0; i < this._tests.length; i++) {

      if (this._tests[i].element === element) {
        index = this._tests[i].index;
        break;
      }
    }

    return index;
  };

  /**
   * Creates a transition effect.
   * 
   * @param {number} index 
   * @param {string} direction 
   */
  AvaTester.prototype._createTransition = function (index, direction) {
    var test = this._getTest(index);

    if (!test) return;

    test.element.classList.add(this._cssClasses.IS_TRANSITION);

    switch (direction) {
      case 'next':
      case 'skip': {
        test.element.classList.add(this._cssClasses.IS_TRANSITION_NEXT);
        break;
      }
      case 'back': {
        test.element.classList.add(this._cssClasses.IS_TRANSITION_BACK);
        break;
      }
    }

    setTimeout(function () {
      test.element.classList.remove(this._cssClasses.IS_TRANSITION);
      test.element.classList.remove(this._cssClasses.IS_TRANSITION_NEXT);
      test.element.classList.remove(this._cssClasses.IS_TRANSITION_BACK);
    }.bind(this), 350);
  };

  /**
   * Returns the next test that must be completed after given index. 
   * 
   * @param {number} base
   * @param {number} top
   * @return {number | null}
   */
  AvaTester.prototype._searchIndexNext = function (base, top) {
    var next = null;
    var i;

    if (base > top) return null;

    for (i = 0; i < this._tests.length; i++) {

      if (((this._tests[i].index >= base) && (this._tests[i].index <= top)) && !this._tests[i].completed) {
        // Matchs the first index (after base) that is not completed.
        next = this._tests[i].index;
        break;
      }
    }
    return next;
  }

  /**
   * Returns the next test that must be completed before given index. 
   * 
   * @param {number} base
   * @param {number} top
   * @return {number | null}
   */
  AvaTester.prototype._searchIndexBack = function (base, top) {
    var previous = null;
    var i;

    if (base > top) return null;

    for (i = (this._tests.length - 1); i >= 0; i--) {

      if (((this._tests[i].index <= top) && (this._tests[i].index >= base)) && !this._tests[i].completed) {
        // Matchs the first index (after base) that is not completed.
        previous = this._tests[i].index;
        break;
      }
    }

    return previous;
  }

  /**
   * Returns the test that must be completed based on direction. 
   * 
   * @param {number} base
   * @param {number} top 
   * @return {number | null} 
   */
  AvaTester.prototype.searchIndex = function (base, top, direction) {
    /** @type {number | null} */
    var index = null;

    if ((typeof base !== 'number' && typeof base !== 'undefined') ||
      (typeof top !== 'number' && typeof top !== 'undefined') &&
      (typeof direction !== 'string' && typeof direction !== 'undefined')) {
      return null;
    }

    if (base > top && base > (this._tests.length + 1)) return null;

    base = base || 0;
    top = top || this._tests.length;

    switch (direction) {
      case 'next':
      case 'skip':
      default: {
        index = this._searchIndexNext(base, top);

        // Re-search when the index was not found, the tester is not completed
        // and the search did not walked in all list. 
        if (index === null && (this._tester.total > this._tester.totalCompleted) && (base > 0)) {
          return this.searchIndex(0, base, direction);
        }
        break;
      }
      case 'back': {
        index = this._searchIndexBack(base, top);

        // Re-search when the index was not found, the tester is not completed
        // and the search did not walked in all list. 
        if (index === null && (this._tester.total > this._tester.totalCompleted) && (top <= this._tests.length)) {
          return this.searchIndex(0, (this._tests.length + 1), 'back');
        }
        break;
      }
    }

    return index;
  };

  /**
   * Defines a test item as completed.
   * 
   * @param {number} index 
   */
  AvaTester.prototype._setCompletedTest = function (index) {
    var i;
    var test = this._getTest(index);

    if (test && !test.completed) {
      test.completed = true;
      test.element.classList.add(this._cssClasses.TEST_COMPLETED);
      this._tester.totalCompleted++;
    }
  };

  /**
   * Defines a test item as uncompleted.
   * 
   * @param {number} index 
   */
  AvaTester.prototype._setUncompletedTest = function (index) {
    var i;
    var test = this._getTest(index);

    if (test && test.completed) {
      test.completed = false;
      test.element.classList.remove(this._cssClasses.TEST_COMPLETED);
      this._tester.totalCompleted--;
    }
  };

  /**
   * Get test item by index. 
   * 
   * @param {number} index
   * @return {AvaTester._test | null}
   */
  AvaTester.prototype._getTest = function (index) {
    var testsLength = this._tests.length;
    var test = null;
    var i;

    if (typeof index !== 'number' || index <= 0 || index > testsLength) return null;

    for (i = 0; i < testsLength; i++) {

      if (this._tests[i].index === index) {
        test = this._tests[i];
        break;
      }
    }

    return test;
  };

  /**
   * Goes forward to the next test at list. Changes the state of current test to "completed".
   * 
   * @return {boolean}
   */
  AvaTester.prototype.complete = function () {
    var oldIndex = this._tester.activeIndex;
    var newIndex = this.searchIndex((oldIndex + 1), this.getTestsSize(), 'next');
    var didComplete = this.setActive(newIndex);

    if (didComplete) {

      if (oldIndex !== newIndex) {
        this._createTransition(oldIndex, 'next');
      }
      // Defines the old test as complete after this proccess.
      this._setCompletedTest(oldIndex);
      this._updateActivators();
      
      if (this.isAllCompleted()) {
        // Dispatch on end event.
        this._dispatchEvent(this.element, 'onend');
      }
    }

    return didComplete;
  };

  /**
   * Goes back to the previous test that must be completed at list.
   * 
   * @return {boolean}
   */
  AvaTester.prototype.skipBack = function () {
    var oldIndex = this._tester.activeIndex;
    var newIndex = this.searchIndex(0, (oldIndex - 1), 'back');
    var didBack = this.setActive(newIndex);

    if (didBack) {

      if (oldIndex !== newIndex) {
        this._createTransition(oldIndex, 'back');
      } else {
        didBack = false;
      }
    }

    return didBack;
  };

  /**
   * Goes back to the previous test at list.
   * 
   * @return {boolean}
   */
  AvaTester.prototype.back = function () {
    var prev = this.getActiveIndex() - 1;

    if (prev === 0) prev = this.getTestsSize();

    return this.goto(prev);
  };

  /** 
   * Returns the length of tests list.
   *
   * @return {number} 
   */
  AvaTester.prototype.getTestsSize = function () {
    return this._tests.length;
  };

  /**
   * Goes forward to the next test at list. Does not changes the state 
   * of current test to "completed".
   * 
   * @return {boolean}
   */
  AvaTester.prototype.skip = function () {
    var oldIndex = this.getActiveIndex();
    var newIndex = this.searchIndex((oldIndex + 1), this.getTestsSize(), 'skip');
    var didSkip = this.setActive(newIndex);

    if (didSkip) {

      if (oldIndex !== newIndex) {
        this._createTransition(oldIndex, 'next');
        this._updateActivators();
      } else {
        didSkip = false;
      }
    }

    return didSkip;
  };

  /**
   * Goes to the test of a given index. Reset the state of test item if it is "completed".   
   * 
   * @param {number} newIndex
   * @return {boolean}
   */
  AvaTester.prototype.goto = function (newIndex) {
    var test = this._getTest(newIndex);
    var activated = false;
    var activeIndex;
    var direction;

    if (test && test.element) {
      activeIndex = this.getActiveIndex();
      // Turns new index as active.
      activated = this.setActive(test.element);

      if (activated && (activeIndex !== newIndex)) {
        direction = (newIndex > activeIndex) ? 'next' : 'back';
        this._createTransition(activeIndex, direction);
        // Uncomplete the new activated test to trigger complete event.
        this._setUncompletedTest(newIndex);
        this._updateActivators();
        this._dispatchEvent(this._tester.element, 'ongoto');
        this._dispatchEvent(test.element, 'ongoto');
      } else {
        activated = false;
      }
    }

    return activated;
  };

  /**
   * Check if tester is complete. Verifies if all tests are completed.
   * 
   * @return {boolean}
   */
  AvaTester.prototype.isAllCompleted = function () {
    return (this._tester.total === this._tester.totalCompleted);
  };

  /**
   * Returns the absolute number of completed tests.
   *
   * @return {number} 
   */
  AvaTester.prototype.getTotalCompleted = function () {
    return this._tester.totalCompleted;
  };

  /**
   * Returns the relative (percent) number of completed tests.
   *
   * @return {number} 
   */
  AvaTester.prototype.getTotalCompletedRelative = function () {
    return ((this._tester.totalCompleted * 100) / this._tester.total);
  };

  /** 
   * Creates and returns the label indicator of a given index.
   * 
   * @param {number} index
   * @param {HTMLElement}
   */
  AvaTester.prototype._createIndicator = function (index) {
    var indicator = document.createElement('span');
    var indicatorItem = document.createElement('span');
    indicator.classList.add(this._cssClasses.LABEL_INDICATOR);
    indicatorItem.classList.add(this._cssClasses.LABEL_INDICATOR_ITEM);
    indicatorItem.textContent = index;
    indicator.appendChild(indicatorItem);
    return indicator;
  };

  /**
   * Returns the elements of a given test element.
   * 
   * @return {HTMLElement} testElement
   * @return {AvaTester._testElements}
   */
  AvaTester.prototype._getTestElements = function (testElement, index) {
    /** @type {AvaTester._testElements} */
    var elements = {};
    elements['label'] = testElement.querySelector('.' + this._cssClasses.LABEL);

    if (!elements['label']) {
      throw new Error('Missing label element (.' + this._cssClasses.LABEL + ') in test ' + index + '.');
    }
    elements['labelTitle'] = elements['label'].querySelector('.' + this._cssClasses.LABEL_TITLE);

    if (!elements['labelTitle']) {
      throw new Error('Missing label title element (.' + this._cssClasses.LABEL_TITLE + ') in test ' + index + '.');
    }
    elements['labelTitleText'] = elements['labelTitle'].querySelector('.' + this._cssClasses.LABEL_TITLE_TEXT)
    elements['labelDescription'] = elements['labelTitle'].querySelector('.' + this._cssClasses.LABEL_DESCRIPTION);
    elements['labelIndicator'] = this._createIndicator(index);
    // Inserts the label indicator in the DOM before label title.
    elements['label'].insertBefore(elements['labelIndicator'], elements['labelTitle']);
    elements['labelIndicatorItem'] = elements['labelIndicator'].querySelector('.' + this._cssClasses.LABEL_INDICATOR_ITEM);
    elements['labelSupport'] = elements['label'].querySelector('.' + this._cssClasses.LABEL_SUPPORT);
    elements['content'] = testElement.querySelector('.' + this._cssClasses.CONTENT);

    if (!elements['content']) {
      throw new Error('Missing content element (.' + this._cssClasses.CONTENT + ') in test ' + index + '.');
    }
    elements['actions'] = testElement.querySelector('.' + this._cssClasses.ACTIONS);

    if (!elements['actions']) {
      throw new Error('Missing actions element (.' + this._cssClasses.ACTIONS + ') in test ' + index + '.');
    }
    elements['actionComplete'] = elements['actions'].querySelector('[data-' + this._constants.DATASET_ACTION_COMPLETE + ']');

    if (!elements['actionComplete']) {
      throw new Error('Missing action next element (data-' + this._constants.DATASET_ACTION_COMPLETE + ') in test ' + index + '.');
    }
    elements['actionBack'] = elements['actions'].querySelector('[data-' + this._constants.DATASET_ACTION_BACK + ']');

    if (!elements['actionBack']) {
      throw new Error('Missing action next element (data-' + this._constants.DATASET_ACTION_BACK + ') in test ' + index + '.');
    }
    elements['actionSkip'] = elements['actions'].querySelector('[data-' + this._constants.DATASET_ACTION_SKIP + ']');

    if (!elements['actionSkip']) {
      throw new Error('Missing action next element (data-' + this._constants.DATASET_ACTION_SKIP + ') in test ' + index + '.');
    }

    return elements;
  };

  /**
   * Returns the config of a given test element.
   * 
   * @return {HTMLElement} testElement
   * @return {number} index
   * @return {AvaTester._test}
   */
  AvaTester.prototype._getTestConfig = function (testElement, index) {
    var completed /** @type {boolean} */;
    /** @type {AvaTester._testElements} */
    var elements = this._getTestElements(testElement, index);
    completed = this.isCompleted(testElement);

    return {
      index: index,
      completed: completed,
      element: testElement,
      elements: elements,
    };
  };

  /**
   * Returns the config of the tester used by this component.
   * 
   * @return {AvaTester._tester}
   */
  AvaTester.prototype._getTesterConfig = function () {
    var activeIndex /** @type {number} */;
    var hasActive = false;
    /** @type {AvaTester._test} */
    var test = {};
    /** @type {array<AvaTester._test>} */
    var tests = [];
    var total = 0;
    var totalCompleted = 0;
    var testElements = this.element.querySelectorAll('.' + this._cssClasses.TEST);
    var activatorNav = this.element.querySelector('.' + this._cssClasses.ACTIVATOR_NAV);
    var activatorItems = activatorNav ? activatorNav.querySelectorAll('.' + this._cssClasses.ACTIVATOR_ITEM) : [];
    var i;

    for (i = 0; i < testElements.length; i++) {
      // Creates the test config and defines it index.
      test = this._getTestConfig(testElements[i], (i + 1));

      if (hasActive === false && this.isActive(testElements[i])) {
        hasActive = true;
        activeIndex = test.index;
      }
      total++;
      totalCompleted += test.completed ? 1 : 0;
      tests.push(test);
    }

    // Set the first test as active if it was not defined by user.
    if (hasActive === false) {
      this.setActive(tests[0].element);
      activeIndex = tests[0].index;
    }
    return {
      activeIndex: activeIndex,
      tests: tests,
      total: total,
      totalCompleted: totalCompleted,
      activator: {
        element: activatorNav,
        items: activatorItems,
      }
    };
  };

  /**
   * Returns the tests list assigned by index.
   * 
   * @return {object}
   */
  AvaTester.prototype.getTestsList = function () {
    var list = {};
    var i;

    for (i = 0; i < this._tests.length; i++) {
      list[this._tests[i].index] = this._tests[i].element;
    }

    return list;
  };

  /**
   * Defines the event dispatched on click on complete test button. 
   * 
   */
  AvaTester.prototype._setEventOnComplete = function () {
    var i;
    var onComplete = function (event, testElement) {
      event.preventDefault();
      this._dispatchEvent(testElement, 'oncomplete');
    }.bind(this).bind(this).bind(this);

    for (i = 0; i < this._tests.length; i++) {

      this._tests[i].elements.actionComplete.addEventListener('click', (function (event, element) {

        return function () {
          onComplete(event, element);
        };
      })(event, this._tests[i].element));
    }
  };

  /**
   * Defines the event dispatched on click on skip test button. 
   * 
   */
  AvaTester.prototype._setEventOnSkip = function () {
    var i;
    var onSkip = function (event, testElement) {
      event.preventDefault();
      this._dispatchEvent(testElement, 'onskip');
    }.bind(this).bind(this).bind(this);

    for (i = 0; i < this._tests.length; i++) {

      this._tests[i].elements.actionSkip.addEventListener('click', (function (event, element) {

        return function () {
          onSkip(event, element);
        };
      })(event, this._tests[i].element));
    }
  };

  /**
   * Defines the event dispatched on click on back test button. 
   * 
   */
  AvaTester.prototype._setEventOnBack = function () {
    var i;
    var onBack = function (event, testElement) {
      event.preventDefault();
      this._dispatchEvent(testElement, 'onback');
    }.bind(this).bind(this).bind(this);

    for (i = 0; i < this._tests.length; i++) {

      this._tests[i].elements.actionBack.addEventListener('click', (function (event, element) {

        return function () {
          onBack(event, element);
        };
      })(event, this._tests[i].element));
    }
  };

  /**
   * Defines the event dispatched on click on support test button. 
   * 
   */
  AvaTester.prototype._setEventOnSupport = function () {
    var i;
    var onSupport = function (event, testElement) {
      event.preventDefault();
      this._dispatchEvent(testElement, 'onsupport');
    }.bind(this).bind(this).bind(this);

    for (i = 0; i < this._tests.length; i++) {

      this._tests[i].elements.labelSupport.addEventListener('click', (function (event, element) {

        return function () {
          onSupport(event, element);
        };
      })(event, this._tests[i].element));
    }
  };

  /**
   * Dispatches the on end event. Applied on all items of tests list is completed.
   * 
   * @param {HTMLElement} element
   * @param {string} eventName
   */
  AvaTester.prototype._dispatchEvent = function (element, eventName) {
    var isElement = element instanceof HTMLElement;

    if (typeof this._customEvents[eventName] === 'undefined' ||
      !isElement) return;

    element.dispatchEvent(this._customEvents[eventName]);
  };

  /**
   * Defines the events dispatched by this component.
   * 
   */
  AvaTester.prototype._setEvents = function () {
    this._setEventOnComplete();
    this._setEventOnSkip();
    this._setEventOnBack();
    this._setEventOnSupport();
    this._setEventActivators();
  };
  
  /**
   * Defines the activors links behavior.
   * 
   */
  AvaTester.prototype._setEventActivators = function () {
    var activatorItem /** @type {HTMLElement} */;
    var i;
    
    if (!this._tester.activator.element) return;

    for (i = 0; i < this._tester.activator.items.length; i++) {
      activatorItem = this._tester.activator.items[i];
      
      activatorItem.addEventListener('click', function (event) {
        var activates /** @type {string} */;
        event.preventDefault();
        
        if (event.target) {
          activates = event.target.getAttribute('data-' + this._constants.DATASET_ACTIVATOR_ACTIVATES);
        } else {
          return;
        }   
        activates = parseInt(activates);   
         
        if (!activates) return;
        
        this.goto(activates);
      }.bind(this));
    }
  };
  
  /**
   * Updates the activator items state.
   * 
   */
  AvaTester.prototype._updateActivators = function () {
    var i;
    var activatorItem /** @type {HTMLElement} */;
    var activatorSelector /** @type {string} */;
    
    if (typeof this._tester['activator'] === 'undefined' || !this._tester.activator.element) return;
        
    for (i = 0; i < this._tests.length; i++) {
      activatorSelector = '[data-' + this._constants.DATASET_ACTIVATOR_ACTIVATES + '="' + this._tests[i].index + '"]';
      activatorItem = this._tester.activator.element.querySelector(activatorSelector);
      
      if (!activatorItem) continue;
      // Check if test is completed.
      if (this._tests[i].completed) {
        activatorItem.classList.add(this._cssClasses.TEST_COMPLETED);
      } else {
        activatorItem.classList.remove(this._cssClasses.TEST_COMPLETED);        
      }     

      // Check if test is actives.
      if (this._tests[i].index === this._tester.activeIndex) {
        activatorItem.classList.add(this._cssClasses.TEST_ACTIVE);
      } else {
        activatorItem.classList.remove(this._cssClasses.TEST_ACTIVE);
      }     
    }
  };
  
  /**
   * Initializes the instance.
   * 
   */
  AvaTester.prototype.init = function () {
    var testerConfig = {};

    if (!this.element) return;

    testerConfig = this._getTesterConfig();
    this._tests = testerConfig['tests'];
    // Deletes the lists of tests of config.
    delete testerConfig['tests'];
    this._tester = testerConfig;
    this._setEvents();
    this._updateActivators();
  };

  // Registers the component. "Componentize" object must be available globally.
  Componentize.register({
    name: 'AvaTester',
    constructor: AvaTester,
    cssClass: 'ava-tester',
  });
})();