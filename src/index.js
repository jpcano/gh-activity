var javascript_time_ago  = require('javascript-time-ago')
var https = require('https');

// Load number pluralization functions for the locales.
// (the ones that decide if a number is gonna be
//  "zero", "one", "two", "few", "many" or "other")
// http://cldr.unicode.org/index/cldr-spec/plural-rules
// https://github.com/eemeli/make-plural.js
// http://www.unicode.org/cldr/charts/latest/supplemental/language_plural_rules.html
//
javascript_time_ago.locale(require('javascript-time-ago/locales/en'))
require('javascript-time-ago/intl-messageformat-global')
require('intl-messageformat/dist/locale-data/en')
const time_ago_english = new javascript_time_ago('en-US')

function GithubActivity(config) {
    this.consumer_key = config.consumer_key;
    this.consumer_secret = config.consumer_secret;
    this.base_url = 'api.github.com';
    this.options = {
        host: this.base_url,
        headers: { 'User-Agent': 'github-activity' }
    };
}

GithubActivity.prototype.getActivity = function (user, count, callback) {
    this.options.path = `/users/${user}/events?client_id=${this.consumer_key}&client_secret=${this.consumer_secret}`;
    /* istanbul ignore next */
    https.request(this.options, function(response) {
        var data = '';
        response.on('data', function(chunk) {
            data += chunk;
        });
        response.on('end', function() {
            var obj = JSON.parse(data)
            if (!obj.message) {
                var result = obj.slice(0, count).map(function (d) {
                    return {
                        type: d.type,
                        ago: time_ago_english.format(new Date(d.created_at)),
                        repo: d.repo.name
                    }
                });
                callback(null, JSON.stringify(result), response);
            } else {
                callback(new Error(data), data, response)
            }
        });
        response.on('error', function(err) {
            callback(err, data, response);
        });
    }).end();
}

module.exports = GithubActivity