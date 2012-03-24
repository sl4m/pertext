var Pert;

Pert = (function() {
  var WEIGHTED_MEAN = "Pert Weighted Mean",
      PLUS_STANDARD_DEVIATION = "Plus Standard Deviation",
      weightedMean,
      plusStandardDeviation;

  weightedMean = function(optimistic, realistic, pessimistic) {
    return ((+optimistic) + 4 * (+realistic) + (+pessimistic)) / 6.0;
  };

  plusStandardDeviation = function(optimistic, realistic, pessimistic) {
    var weightedMeanEstimate,
        unroundedWeightedMean;

    weightedMeanEstimate = weightedMean.apply(null, arguments);
    unroundedWeightedMean = weightedMeanEstimate + 2 * (((+pessimistic) - (+optimistic)) / 6.0);
    return Math.round(unroundedWeightedMean / 0.25) * 0.25;
  };

  return {
    version : '0.1.0',
    WEIGHTED_MEAN : WEIGHTED_MEAN,
    PLUS_STANDARD_DEVIATION : PLUS_STANDARD_DEVIATION,
    initialize : function(strategy) {
      var currentStrategy;

      if (strategy === WEIGHTED_MEAN) {
        currentStrategy = weightedMean;
      } else if (strategy === PLUS_STANDARD_DEVIATION) {
        currentStrategy = plusStandardDeviation;
      } else {
        throw "Unknown strategy selected.";
      }

      return {
        calculate : function(optimistic, realistic, pessimistic) {
          return currentStrategy.apply(null, arguments);
        }
      }
    },
  };
})();
