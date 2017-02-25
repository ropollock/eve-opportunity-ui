describe('Unit: Constants', function() {

  let constants;

  beforeEach(function() {
    // instantiate the app module
    angular.mock.module('app');
    angular.mock.inject((AppSettings) => {
      constants = AppSettings;
    });
  });

  it('should exist', function() {
    expect(constants).toBeDefined();
  });

  it('should have an application name', function() {
    expect(constants.APP_TITLE).toEqual('Eve Opportunity');
  });

  it('should have an application API url', function() {
    expect(constants.API_URL).toBeDefined();
  });

  it('should have a CREST API url', function() {
    expect(constants.CREST_API_URL).toBeDefined();
  });

});
