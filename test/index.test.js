var expect = require('chai').expect;
var GithubActivity = require('../src/index');
var config = require('./config');

describe('github-activity', function() {
    var gh;

    beforeEach(function (done) {
        gh = new GithubActivity(config);
        done();
    });


    describe('constructor', function () {
        it('should construct GithubActivity object', function(done) {
            expect(gh).to.be.an('object');
            done();
        });
    });

    describe('activity', function () {
        it('should get the activity of a user', function(done) {
            gh.getActivity('github', 5, function(err, data, request) {
                var parsed_data = (JSON.parse(data));
                expect(parsed_data).to.have.length(5);
                done();
            });
        });
    });

    describe('wrong user', function () {
        it('should get the an error if the user is invalid', function(done) {
            gh.getActivity('jper8787psdf38d', 5, function(err, data, request) {
                expect(err).to.be.an('error');
                done();
            });
        });
    });
});