document.addEventListener('DOMContentLoaded', function() {
  var $,
      calculate,
      strategyIterator,
      getStrategyValue,
      isValid,
      strategy,
      currentStrategy,
      optimistic,
      realistic,
      pessimistic,
      estimate;

  $ = function(id) {
    return document.getElementById(id);
  };

  strategy    = document.getElementsByName('strategy');
  optimistic  = $('optimistic');
  realistic   = $('realistic');
  pessimistic = $('pessimistic');
  estimate    = $('estimate');

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
    return (+o && +r && +p);
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
});
