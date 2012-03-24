describe("Pert", function() {
  var pert;

  describe("PERT Weigted Mean", function() {
    beforeEach(function() {
      pert = Pert.initialize(Pert.WEIGHTED_MEAN);
    });

    it("returns an estimate for 1,1,1", function() {
      expect(pert.calculate(1, 1, 1)).toEqual(1);
    });

    it("returns an estimate for 1,2,3", function() {
      expect(pert.calculate(1, 2, 3)).toEqual(2);
    });

    it("handles string inputs", function() {
      expect(pert.calculate("1", "2", "3")).toEqual(2);
    });
  });

  describe("Plus Standard Deviation", function() {
    beforeEach(function() {
      pert = Pert.initialize(Pert.PLUS_STANDARD_DEVIATION);
    });

    it("returns an estimate for 1,2,3", function() {
      expect(pert.calculate(1, 2, 3)).toEqual(2.75);
    });

    it("returns an estimate for 2,7,9", function() {
      expect(pert.calculate(2, 7, 9)).toEqual(8.75);
    });

    it("handles string inputs", function() {
      expect(pert.calculate("1", "2", "3")).toEqual(2.75);
    });
  });

  it("throws an error if the strategy is unknown", function() {
    var pert;
    var fn = function() {
      pert = Pert.initialize("Fake Strategy");
    }
    expect(fn).toThrow("Unknown strategy selected.");
    expect(pert).toBeUndefined();
  });
});
