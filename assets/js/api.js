class ApiConfig {
    getSettings(request) {
        return {
            "async": false,
            "crossDomain": true,
            "url": "https://covid-193.p.rapidapi.com/" + request.url,
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "7ip7HgeoRUmshPowuEYLusXbqF4np1jmW3ejsntwVpDisNSfUQ",
                "x-rapidapi-host": "covid-193.p.rapidapi.com"
            }
        };
    }
}

class ApiClient {
    constructor(config) {
        this.config = config;
    }

    sendRequest(request) {
        var ajax = $.ajax(this.config.getSettings(request)).done(function (response) {});
        return ajax.responseJSON.response;
    }

    getCountries() {
        let url = 'countries';
        let request = new Request(url);
        return this.sendRequest(request);
    }

    getHistory(country) {
        let url = 'history?country=' + country;
        let request = new Request(url);
        return this.sendRequest(request);
    }
}

class Request {
    constructor(url) {
        this.url = url;
    }
}