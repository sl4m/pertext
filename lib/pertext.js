document.addEventListener('DOMContentLoaded', function() {
  var $,
      calculate,
      isValid,
      strategy,
      optimistic,
      realistic,
      pessimistic,
      result;

  $ = function(id) {
    return document.getElementById(id);
  };

  strategy    = $('strategy');
  optimistic  = $('optimistic');
  realistic   = $('realistic');
  pessimistic = $('pessimistic');
  result      = $('result');

  calculate = function () {
    var pert,
        strategyValue,
        optimisticValue,
        realisticValue,
        pessimisticValue;

    optimisticValue = optimistic.value;
    realisticValue = realistic.value;
    pessimisticValue = pessimistic.value;

    if (isValid(optimisticValue, realisticValue, pessimisticValue)) {
      try {
        pert = Pert.initialize(strategy.value);

        result.value = (pert.calculate(optimisticValue, realisticValue, pessimisticValue)).toFixed(2);
      } catch(e) {}
    } else {
      result.value = "";
    }
  };

  isValid = function(o, r, p) {
    return (+o && +r && +p);
  };

  strategy.addEventListener('change', calculate);
  optimistic.addEventListener('click', calculate);
  optimistic.addEventListener('keyup', calculate);
  realistic.addEventListener('click', calculate);
  realistic.addEventListener('keyup', calculate);
  pessimistic.addEventListener('click', calculate);
  pessimistic.addEventListener('keyup', calculate);
});
