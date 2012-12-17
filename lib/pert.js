(function() {
  "use strict";

  window.Pert = (function() {
    var WEIGHTED_MEAN = "weighted_mean",
        STANDARD_DEVIATION = "standard_deviation",
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
      STANDARD_DEVIATION : STANDARD_DEVIATION,
      initialize : function(strategy) {
        var currentStrategy;

        if (strategy === WEIGHTED_MEAN) {
          currentStrategy = weightedMean;
        } else if (strategy === STANDARD_DEVIATION) {
          currentStrategy = plusStandardDeviation;
        } else {
          throw "Unknown strategy selected.";
        }

        return {
          calculate : function(optimistic, realistic, pessimistic) {
            return currentStrategy.apply(null, arguments);
          }
        };
      }
    };
  }());
}());
