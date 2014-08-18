describe('ngTrack', function() {
	'use strict';

  it('should be a registered module', function() {
    expect(function() {
      angular.module('ngTrack');
    }).not.toThrow();
  });
});
