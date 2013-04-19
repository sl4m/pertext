(function(Pert, chrome) {
  'use strict';

  window.Pertext = (function() {
    var ACTIVE_WM,
        ACTIVE_SD,
        STANDARD_DEVIATION,
        WEIGHTED_MEAN,
        currentStrategy,
        storage,
        getById,
        getByClass,
        strategyHandler,
        isValid,
        execute,
        calculate,
        persist,
        restore,
        copyToClipboard,
        setStrategy,
        activateStrategy,
        activateWeightedMean,
        activateStandardDeviation,
        addClassAttr,
        removeClassAttr,
        standardDeviation,
        weightedMean,
        optimistic,
        realistic,
        pessimistic,
        estimate,
        clipboard;

    ACTIVE_WM = 'active-wm';
    ACTIVE_SD = 'active-sd';
    STANDARD_DEVIATION = 'standard-deviation';
    WEIGHTED_MEAN = 'weighted-mean';
    currentStrategy = Pert.STANDARD_DEVIATION;
    storage = chrome.storage.local;

    getById = function(id) {
      return document.getElementById(id);
    };

    getByClass = function(klass) {
      return document.getElementsByClassName(klass);
    };

    setStrategy = function(e) {
      var className = e.srcElement.className;
      if (className.match(STANDARD_DEVIATION)) {
        currentStrategy = Pert.STANDARD_DEVIATION;
      } else if (className.match(WEIGHTED_MEAN)) {
        currentStrategy = Pert.WEIGHTED_MEAN;
      }
    };

    isValid = function(o, r, p) {
      if (o === "" || r === "" || p === "") {
        return false;
      }
      return (+o >= 0 && +r >= 0 +p >= 0);
    };

    execute = function() {
      persist();
      calculate();
    };

    calculate = function() {
      var pert,
          o = optimistic.value,
          r = realistic.value,
          p = pessimistic.value,
          e;

      if (isValid(o, r, p)) {
        try {
          pert = Pert.initialize(currentStrategy);
          estimate.value = (pert.calculate(o, r, p)).toFixed(2);
        } catch(e) {}
      } else {
        estimate.value = '';
      }
    };

    persist = function() {
      storage.set({
        strategy : currentStrategy
      });
    };

    restore = function() {
      storage.get(null, function(object) {
        if (object.strategy) {
          currentStrategy = object.strategy;
          activateStrategy(currentStrategy)();
        }
      });
    };

    copyToClipboard = function() {
      estimate.select();
      document.execCommand('copy');
    };

    activateStrategy = function(strategy) {
      if (strategy === Pert.STANDARD_DEVIATION) {
        return activateStandardDeviation;
      } else if (strategy === Pert.WEIGHTED_MEAN) {
        return activateWeightedMean;
      }
    };

    activateStandardDeviation = function() {
      addClassAttr(standardDeviation, ACTIVE_SD);
      removeClassAttr(weightedMean, ACTIVE_WM);
    };

    activateWeightedMean = function() {
      addClassAttr(weightedMean, ACTIVE_WM);
      removeClassAttr(standardDeviation, ACTIVE_SD);
    };

    addClassAttr = function(el, classToAdd) {
      if (!el.className.match(classToAdd)) {
        el.className += ' ' + classToAdd;
      }
    };

    removeClassAttr = function(el, classToRemove) {
      var className = el.className.replace(classToRemove, '');
      el.className = className;
    };

    strategyHandler = function(strategy) {
      var fn = activateStrategy(strategy);

      return function(e) {
        setStrategy(e);
        fn();
        execute();
      };
    };

    return {
      initialize: function() {
        standardDeviation = getByClass(STANDARD_DEVIATION)[0];
        weightedMean      = getByClass(WEIGHTED_MEAN)[0];
        optimistic        = getById('optimistic');
        realistic         = getById('realistic');
        pessimistic       = getById('pessimistic');
        estimate          = getById('estimate');
        clipboard         = getById('clipboard');

        standardDeviation.addEventListener(
          'click', strategyHandler(Pert.STANDARD_DEVIATION)
        );
        weightedMean.addEventListener(
          'click', strategyHandler(Pert.WEIGHTED_MEAN)
        );

        optimistic.addEventListener('click', execute);
        optimistic.addEventListener('keyup', execute);
        optimistic.addEventListener('keydown', execute);

        realistic.addEventListener('click', execute);
        realistic.addEventListener('keyup', execute);
        realistic.addEventListener('keydown', execute);

        pessimistic.addEventListener('click', execute);
        pessimistic.addEventListener('keyup', execute);
        pessimistic.addEventListener('keydown', execute);

        clipboard.addEventListener('click', copyToClipboard);

        restore();
      },
      getCurrentStrategy : function() {
        return currentStrategy;
      },
      setCurrentStrategy : function(value) {
        currentStrategy = value;
      },
      execute : execute,
      restore : restore
    };
  }());
}(window.Pert, window.chrome));
