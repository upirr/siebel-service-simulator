describe("ps-encoder test", function () {
	beforeEach(module('app'));
	jasmine.getJSONFixtures().fixturesPath='base/tests/ps-encoder/';

	var psEncoder;
	beforeEach(inject(function(_psEncoder_) {
		psEncoder = _psEncoder_;
	}));
	
	it("escape system characters", function () {
		expect(psEncoder).not.toBeUndefined();
		expect(jasmine).not.toBeUndefined();
		console.log(getJSONFixture('escape_quotes.json'))
	});
});