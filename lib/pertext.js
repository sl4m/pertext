document.addEventListener('DOMContentLoaded', function() {
  var $,
      copyToClipboard,
      calculate,
      strategyIterator,
      getStrategyValue,
      isValid,
      strategy,
      currentStrategy,
      optimistic,
      realistic,
      pessimistic,
      estimate,
      clipboard;

  $ = function(id) {
    return document.getElementById(id);
  };

  strategy    = document.getElementsByName('strategy');
  optimistic  = $('optimistic');
  realistic   = $('realistic');
  pessimistic = $('pessimistic');
  estimate    = $('estimate');
  clipboard   = $('clipboard');

  copyToClipboard = function() {
    estimate.select();
    document.execCommand('copy');
  };

  calculate = function() {
    var pert,
        optimisticValue,
        realisticValue,
        pessimisticValue;

    strategyIterator(getStrategyValue);
    optimisticValue = optimistic.value;
    realisticValue = realistic.value;
    pessimisticValue = pessimistic.value;

    if (isValid(optimisticValue, realisticValue, pessimisticValue)) {
      try {
        pert = Pert.initialize(currentStrategy);

        estimate.value = (pert.calculate(optimisticValue, realisticValue, pessimisticValue)).toFixed(2);
      } catch(e) {}
    } else {
      estimate.value = "";
    }
  };

  strategyIterator = function(block) {
    var i,
        numberOfStrategies;
    numberOfStrategies = strategy.length;

    for (i=0; i<numberOfStrategies; i+=1) {
      block(i);
    }
  };

  getStrategyValue = function(index) {
    if (strategy[index].checked) {
      currentStrategy = strategy[index].value;
    }
  };

  isValid = function(o, r, p) {
    if (o === "" || r === "" || p === "") {
      return false;
    }
    return (+o >= 0 && +r >= 0 +p >= 0);
  };

  strategyIterator(function(index) {
    strategy[index].addEventListener('change', calculate);
  });
  optimistic.addEventListener('click', calculate);
  optimistic.addEventListener('keyup', calculate);
  realistic.addEventListener('click', calculate);
  realistic.addEventListener('keyup', calculate);
  pessimistic.addEventListener('click', calculate);
  pessimistic.addEventListener('keyup', calculate);
  clipboard.addEventListener('click', copyToClipboard);
});
