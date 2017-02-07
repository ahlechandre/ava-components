/**
 * timer.js - a component to handle timers. 
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
  function AvaTimer(element) {
    this.element = element;

    // Initializes the instance.
    this.init();
  };

  /**
   * Stories the css classes used by this component.
   * 
   */
  AvaTimer.prototype._cssClasses = {
    TIMER: 'ava-timer',
    TIMER_HOURS: 'ava-timer__hours',
    TIMER_MINS: 'ava-timer__mins',
    TIMER_SECS: 'ava-timer__secs',
    TIMER_STARTED: 'is-started',
    TIMER_PAUSED: 'is-paused',
  };

  /**
   * Stories the constant strings used by this component.
   * 
   */
  AvaTimer.prototype._constants = {
    DATASET_MILISECS: 'timer',
    DATASET_HOURS: 'timer-hours',
    DATASET_MINS: 'timer-mins',
    DATASET_SECS: 'timer-secs',
    DATASET_AUTO: 'timer-auto',
  };

  /**
   * Stories the hours element.
   *  
   * @type {HTMLElement}
   */
  AvaTimer.prototype._elementHours = null;

  /**
   * Stories the minutes element.
   *  
   * @type {HTMLElement}
   */
  AvaTimer.prototype._elementMins = null;

  /**
   * Stories the seconds element.
   *  
   * @type {HTMLElement}
   */
  AvaTimer.prototype._elementSecs = null;

  /**
   * Stories the time of timer in miliseconds.
   *  
   * @type {number}
   */
  AvaTimer.prototype._timer = 0;

  /**
   * Stories the time interval.
   *  
   * @type {number | null}
   */
  AvaTimer.prototype._timeInterval = null;

  /**
   * Stories the time out.
   *  
   * @type {number | null}
   */
  AvaTimer.prototype._timeOut = null;

  /**
   * Defines the custom events.
   * 
   */
  AvaTimer.prototype._customEvents = {
    oninit: new CustomEvent('oninit', {
      bubbles: true,
      cancelable: true,
    }),
    onend: new CustomEvent('onend', {
      bubbles: true,
      cancelable: true,
    }),
    onpause: new CustomEvent('onpause', {
      bubbles: true,
      cancelable: true,
    }),
    onstart: new CustomEvent('onstart', {
      bubbles: true,
      cancelable: true,
    }),
    onrestart: new CustomEvent('onrestart', {
      bubbles: true,
      cancelable: true,
    }),
    oneachsecond: new CustomEvent('oneachsecond', {
      bubbles: true,
      cancelable: true,
    }),
  };

  /**
   * Returns the timers elements.
   * 
   * @return {object}
   */
  AvaTimer.prototype._getElements = function () {
    var hours = this.element.querySelector('.' + this._cssClasses.TIMER_HOURS);
    var mins = this.element.querySelector('.' + this._cssClasses.TIMER_MINS);
    var secs = this.element.querySelector('.' + this._cssClasses.TIMER_SECS);

    return {
      hours: hours,
      mins: mins,
      secs: secs,
    };
  };

  /**
   * Check if timer must be automatically initialized.
   * 
   * @return {boolean}
   */
  AvaTimer.prototype._isAuto = function () {
    return this.element.hasAttribute('data-' + this._constants.DATASET_AUTO);
  };

  /**
   * Returns a given value converted to miliseconds.
   *
   * @param {number} value 
   * @param {string} type 
   */
  AvaTimer.prototype._getMilisecs = function (value, type) {
    var miliseconds = value;

    switch (type) {
      case 's': {
        miliseconds = value * 1000;
        break;
      }
      case 'm': {
        miliseconds = (value * 60) * 1000;
        break;
      }
      case 'h': {
        miliseconds = ((value * 60) * 60) * 1000;
        break;
      }
    }

    return miliseconds;
  };

  /**
   * Returns a given value converted from miliseconds.
   *
   * @param {number} miliseconds 
   * @param {string} type 
   */
  AvaTimer.prototype._getFromMilisecs = function (miliseconds, type) {
    var time = miliseconds;

    switch (type) {
      case 's': {
        time = miliseconds / 1000;
        break;
      }
      case 'm': {
        time = (miliseconds / 60) / 1000;
        break;
      }
      case 'h': {
        time = ((miliseconds / 60) / 60) / 1000;
        break;
      }
    }

    return time;
  };

  /**
   * Check for dataset timers and initializes the time.
   * 
   */
  AvaTimer.prototype._setInitialTime = function () {
    var miliseconds = this.element.getAttribute('data-' + this._constants.DATASET_MILISECS);
    var secs = this.element.getAttribute('data-' + this._constants.DATASET_SECS);
    var mins = this.element.getAttribute('data-' + this._constants.DATASET_MINS);
    var hours = this.element.getAttribute('data-' + this._constants.DATASET_HOURS);
    var realTime = 0;

    if (miliseconds && parseInt(miliseconds)) {
      realTime = parseInt(miliseconds);
    } else if (secs && parseInt(secs)) {
      realTime = this._getMilisecs(parseInt(secs), 's');
    } else if (mins && parseInt(mins)) {
      realTime = this._getMilisecs(parseInt(mins), 'm');
    } else if (hours && parseInt(hours)) {
      realTime = this._getMilisecs(parseInt(hours), 'h');
    }

    this.set(realTime);
  };

  /**
   * Defines the time of timer in miliseconds.
   *
   * @param {number} time 
   * @param {string} optionalType 
   */
  AvaTimer.prototype.set = function (time, optionalType) {

    if (typeof time !== 'number' || time <= 0) {
      console.warn('Please, the time must be a valid integer.');
      return;
    }

    if (optionalType) {
      time = this._getMilisecs(time, optionalType);
    }

    this._time = time;
    this._renderSecs();
    this._renderMins();
    this._renderHours();
  };

  /**
   * Defines the time of timer in seconds.
   *
   * @param {number} time 
   */
  AvaTimer.prototype.setSecs = function (time) {
    this.set(time, 's');
  };

  /**
   * Defines the time of timer in minutes.
   *
   * @param {number} time 
   */
  AvaTimer.prototype.setMins = function (time) {
    this.set(time, 'm');
  };

  /**
   * Defines the time of timer in hours.
   *
   * @param {number} time 
   */
  AvaTimer.prototype.setHours = function (time) {
    this.set(time, 'h');
  };

  /**
   * Increments the time of timer in miliseconds.
   *
   * @param {number} time 
   * @param {string} optionalType 
   */
  AvaTimer.prototype.add = function (time, optionalType) {

    if (typeof time !== 'number' || time <= 0) {
      console.warn('Please, the time must be a valid integer.');
      return;
    }

    if (optionalType) {
      time = this._getMilisecs(time, optionalType);
    }

    this._time += time;
    this._renderSecs();
    this._renderMins();
    this._renderHours();
  };

  /**
   * Increments the time of timer in seconds.
   *
   * @param {number} time 
   */
  AvaTimer.prototype.addSecs = function (time) {
    this.add(time, 's');
  };

  /**
   * Increments the time of timer in minutes.
   *
   * @param {number} time 
   */
  AvaTimer.prototype.addMins = function (time) {
    this.add(time, 'm');
  };

  /**
   * Increments the time of timer in minutes.
   *
   * @param {number} time 
   */
  AvaTimer.prototype.addHours = function (time) {
    this.add(time, 'h');
  };

  /**
   * Decrements the time of timer in miliseconds.
   *
   * @param {number} time 
   */
  AvaTimer.prototype.remove = function (time, optionalType) {

    if (typeof time !== 'number' || time <= 0) {
      console.warn('Please, the time must be a valid integer.');
      return;
    }

    if (optionalType) {
      time = this._getMilisecs(time, optionalType);
    }

    if (this._time - time <= 0) {
      return false;
    }

    this._time -= time;
    this._renderSecs();
    this._renderMins();
    this._renderHours();
    return true;
  };

  /**
   * Decrements the time of timer in seconds.
   *
   * @param {number} time 
   */
  AvaTimer.prototype.removeSecs = function (time) {
    return this.remove(time, 's');
  };

  /**
   * Decrements the time of timer in minutos.
   *
   * @param {number} time 
   */
  AvaTimer.prototype.removeMins = function (time) {
    return this.remove(time, 'm');
  };

  /**
   * Decrements the time of timer in minutos.
   *
   * @param {number} time 
   */
  AvaTimer.prototype.removeHours = function (time) {
    return this.remove(time, 'h');
  };

  /**
   * Returns the current time in miliseconds.
   * 
   */
  AvaTimer.prototype.getTime = function () {
    return this._time;
  };

  /**
   * Returns the current time in seconds.
   * 
   */
  AvaTimer.prototype.getTimeSecs = function () {
    return parseInt(this._getFromMilisecs(this._time, 's'));
  };

  /**
   * Returns the current time in miliseconds.
   * 
   */
  AvaTimer.prototype.getTimeMins = function () {
    return parseInt(this._getFromMilisecs(this._time, 'm'));
  };

  /**
   * Returns the current time in miliseconds.
   * 
   */
  AvaTimer.prototype.getTimeHours = function () {
    return parseInt(this._getFromMilisecs(this._time, 'h'));
  };

  /**
   * Pauses the timer.
   * 
   */
  AvaTimer.prototype.pause = function () {
    clearInterval(this._timeInterval);
    this._timeInterval = null;
    this.element.classList.remove(this._cssClasses.TIMER_STARTED);
    this.element.classList.add(this._cssClasses.TIMER_PAUSED);
    this.element.dispatchEvent(this._customEvents.onpause);
  };

  /**
   * Renders the seconds on HTML.
   * 
   */
  AvaTimer.prototype._renderSecs = function () {
    var elementCurrentSecs;
    var secs = this.getRelativeSecs();

    if (!this._elementSecs) return;

    elementCurrentSecs = parseInt(this._elementSecs.textContent);

    if (elementCurrentSecs != secs) {
      this._elementSecs.textContent = secs < 10 ? '0' + secs : secs;
    }
  };

  /**
   * Renders the minutes on HTML.
   * 
   */
  AvaTimer.prototype._renderMins = function () {
    var elementCurrentMins;
    var mins = this.getRelativeMins();

    if (!this._elementMins) return;

    elementCurrentMins = parseInt(this._elementMins.textContent);

    if (elementCurrentMins != mins) {
      this._elementMins.textContent = mins < 10 ? '0' + mins : mins;
    }
  };


  /**
   * Renders the hours on HTML.
   * 
   */
  AvaTimer.prototype._renderHours = function () {
    var elementCurrentHours;
    var hours = this.getRelativeHours();
    var hoursText /** @type {number} */;

    if (!this._elementHours) return;

    elementCurrentHours = parsetInt(this._elementHours.textContent);

    if (elementCurrentHours != hours) {
      this._elementHours.textContent = hours < 10 ? '0' + hours : hours;
    }
  };

  /**
   * Gets relative seconds. 
   * 
   * @return {number}
   */
  AvaTimer.prototype.getRelativeSecs = function () {
    var secs = parseInt(this._getFromMilisecs(this._time, 's'));

    if (this._elementMins) {
      secs = parseInt(secs % 60);
    }
    return secs;
  }

  /**
   * Gets relative mins. 
   * 
   * @return {number}
   */
  AvaTimer.prototype.getRelativeMins = function () {
    var mins = parseInt(this._getFromMilisecs(this._time, 'm'));

    if (this._elementHours) {
      mins = parseInt(mins % 60);
    }
    return mins;
  }

  /**
   * Gets relative hours. 
   * 
   * @return {number}
   */
  AvaTimer.prototype.getRelativeHours = function () {
    var hours = parseInt(this._getFromMilisecs(this._time, 'h'));
    return hours;
  }

  /**
   * Ends the timer. 
   * 
   */
  AvaTimer.prototype.end = function () {
    clearInterval(this._timeInterval);
    clearTimeout(this._timeOut);
    this._timeInterval = null;
    this._timeTimout = null;
    this._time = 0;
    this.element.classList.remove(this._cssClasses.TIMER_STARTED);
    this.element.classList.remove(this._cssClasses.TIMER_PAUSED);
    this._renderSecs();
    this._renderMins();
    this._renderHours();
    this.element.dispatchEvent(this._customEvents.onend);
  };

  /**
   * Defines the behavior of component on each seconds running.
   * 
   */
  AvaTimer.prototype._onEachSecond = function () {
    // Each seconds decrements 1000 miliseconds.
    this._time -= 1000;

    if (this._time <= 0) {
      this.end();
      return;
    }
    this._renderSecs();
    this._renderMins();
    this._renderHours();
    this.element.dispatchEvent(this._customEvents.oneachsecond);
  };

  /**
   * Initializes the timer.
   * 
   */
  AvaTimer.prototype.start = function () {

    if (!this._time) {
      console.warn('Defines the time of timer.');
      return;
    }

    if (!this._timeInterval) {
      this._timeInterval = setInterval(this._onEachSecond.bind(this), 1000);
      this.element.classList.remove(this._cssClasses.TIMER_PAUSED);
      this.element.classList.add(this._cssClasses.TIMER_STARTED);
      this.element.dispatchEvent(this._customEvents.onstart);
    }
  };

  /**
   * Restarts the timer.
   * 
   */
  AvaTimer.prototype.restart = function () {
    this.end();
    this._setInitialTime();
    this.start();
    this.element.dispatchEvent(this._customEvents.oninit);
    this.element.dispatchEvent(this._customEvents.onrestart);
  };

  /**
   * Initializes the instance.
   * 
   */
  AvaTimer.prototype.init = function () {
    var timers /** @type {object} */;

    if (!this.element) return;

    timers = this._getElements();
    this._elementHours = timers['hours'];
    this._elementMins = timers['mins'];
    this._elementSecs = timers['secs'];
    this._setInitialTime();

    if (this._isAuto()) {
      this.start();
      this.element.dispatchEvent(this._customEvents.oninit);
    }
  };

  // Registers the component. "Componentize" object must be available globally.
  Componentize.register({
    name: 'AvaTimer',
    constructor: AvaTimer,
    cssClass: 'ava-timer',
  });
})();