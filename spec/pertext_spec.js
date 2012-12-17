describe('Pertext', function() {
  beforeEach(function() {
    var fixture = [
      '<button class="standard-deviation"></button>',
      '<button class="weighted-mean"></button>',
      '<input id="optimistic" type="number" max="100" min="0" />',
      '<input id="realistic" type="number" max="100" min="0" />',
      '<input id="pessimistic" type="number" max="100" min="0" />',
      '<input id="estimate" disabled="disabled" />',
      '<button id="clipboard"></button>'
    ].join('');
    setFixtures(fixture);
    Pertext.initialize();
  });

  describe('strategies', function() {
    it('sets to Plus Standard Deviation as default strategy', function() {
      expect(Pertext.getCurrentStrategy()).toEqual(Pert.STANDARD_DEVIATION);
    });

    it('sets current strategy as Plus Standard Deviation', function() {
      $('.standard-deviation').addClass('some-class');
      $('.standard-deviation').click();
      expect(Pertext.getCurrentStrategy()).toEqual(Pert.STANDARD_DEVIATION);
    });

    it('sets current strategy as Weighted Mean', function() {
      $('.weighted-mean').addClass('some-class');
      $('.weighted-mean').click();
      expect(Pertext.getCurrentStrategy()).toEqual(Pert.WEIGHTED_MEAN);
    });

    it('appends active-wm class when clicking Weighted Mean', function() {
      $('.weighted-mean').click();
      expect($('.weighted-mean').hasClass('active-wm')).toBeTruthy();
    });

    it('appends active-sd class when clicking Plus Standard Deviation', function() {
      $('.standard-deviation').click();
      expect($('.standard-deviation').hasClass('active-sd')).toBeTruthy();
    });

    it('does not append more than one active-wm class when clicking Weighted Mean', function() {
      $('.weighted-mean').click();
      $('.weighted-mean').click();
      expect($('.weighted-mean')[0].className).not.toMatch('active-wm active-wm');
    });

    it('removes active-sd class when clicking Weighted Mean', function() {
      $('.standard-deviation').click();
      $('.weighted-mean').click();
      expect($('.standard-deviation').hasClass('active-sd')).toBeFalsy();
    });

    it('removes active-wm class when clicking Plus Standard Deviation', function() {
      $('.weighted-mean').click();
      $('.standard-deviation').click();
      expect($('.weighted-mean').hasClass('active-wm')).toBeFalsy();
    });

    it('preserves classes when clicking Plus Standard Deviation', function() {
      $('.weighted-mean').addClass('some-class');
      $('.weighted-mean').click();
      $('.standard-deviation').click();
      expect($('.weighted-mean').hasClass('some-class')).toBeTruthy();
    });

    it('preserves classes when clicking Weighted Mean', function() {
      $('.standard-deviation').addClass('some-class');
      $('.standard-deviation').click();
      $('.weighted-mean').click();
      expect($('.standard-deviation').hasClass('some-class')).toBeTruthy();
    });
  });

  describe('calculate', function() {
    var setEstimates = function(o, r, p) {
        $('#optimistic').val(o);
        $('#realistic').val(r);
        $('#pessimistic').val(p);
      };

    it('returns an Weighted Mean estimate for 1,2,3', function() {
      setEstimates(1, 2, 3);
      Pertext.setCurrentStrategy(Pert.WEIGHTED_MEAN);
      Pertext.execute();
      expect($('#estimate').val()).toEqual('2.00');
    });

    it('returns an Plus Standard Deviation estimate for 1,2,3', function() {
      setEstimates(1, 2, 3);
      Pertext.setCurrentStrategy(Pert.STANDARD_DEVIATION);
      Pertext.execute();
      expect($('#estimate').val()).toEqual('2.75');
    });

    it('handles bad input values', function() {
      setEstimates('a', 'b', 'c');
      Pertext.setCurrentStrategy(Pert.STANDARD_DEVIATION);
      Pertext.execute();
      expect($('#estimate').val()).toEqual('');
    });

    it('handles bad strategy exception', function() {
      setEstimates(1, 2, 3);
      Pertext.setCurrentStrategy('Bad strategy');
      Pertext.execute();
    });
  });

  describe('clipboard', function() {
    it('copies estimate to clipboard', function() {
      spyOn(document.getElementById('estimate'), 'select');
      spyOn(document, 'execCommand');
      $('#clipboard').click();
      expect(document.getElementById('estimate').select).toHaveBeenCalled();
      expect(document.execCommand).toHaveBeenCalledWith('copy');
    });
  });

  describe('local storage', function() {
    it('persists strategy', function() {
      var strategy = 'test strategy';
      Pertext.setCurrentStrategy(strategy);
      spyOn(window.chrome.storage.local, 'set');
      Pertext.execute();
      expect(window.chrome.storage.local.set).toHaveBeenCalledWith({
        strategy : strategy
      });
    });

    it('restores strategy', function() {
      Pertext.setCurrentStrategy(Pert.STANDARD_DEVIATION);
      spyOn(window.chrome.storage.local, 'get');
      Pertext.restore();
      expect(window.chrome.storage.local.get).toHaveBeenCalled();
    });
  });
});
