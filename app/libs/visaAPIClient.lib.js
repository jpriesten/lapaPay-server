const request = require('request');
const fs = require('fs');
const config = require('../../config/visa.config');
var randomstring = require('randomstring');

function logRequest(requestBody, path) {
	console.log("URL : " + config.visaUrl + path);
	if (requestBody !== null && requestBody !== '') {
		console.log("Request Body : " + JSON.stringify(JSON.parse(requestBody),null,4));
	}
}

function logResponseBody(response, body) {
	console.log("Response Code: " + response.statusCode);
	console.log("Headers:");
	for(let item in response.headers) {
		console.log(item + ": " + response.headers[item]);
	}
	console.log("Body: "+ JSON.stringify(JSON.parse(body),null,4));
}

function getBasicAuthHeader(userId, password) {
	return 'Basic ' + new Buffer(userId + ':' + password).toString('base64');
}

function VisaAPIClient() {

}

VisaAPIClient.prototype.doMutualAuthRequest = function(path, requestBody, methodType, headers, callback) {

	let userId = config.userId ;
	let password = config.password;
	let keyFile = config.key;
    let certificateFile = config.cert;
    let keyStore = config.keyStore;
	// logRequest(requestBody, path);

	if (methodType === 'POST' || methodType === 'PUT') {
		headers['Content-Type'] = 'application/json';
	}

	headers['Accept'] = 'application/json';
	headers['Authorization'] = getBasicAuthHeader(userId, password);
	headers['x-correlation-id'] = randomstring.generate({length:12, charset: 'alphanumeric'}) + '_SC';
	request({
		uri : config.visaUrl + path,
		key: fs.readFileSync(keyFile),
		method : methodType,
		cert: fs.readFileSync(certificateFile),
		headers: headers,
		body: requestBody,
		timeout: 30000
	}, function(error, response, body) {
		if (!error) {
			callback(null, response);
		} else {
			console.log("Error", error);
			callback(error);
		}
	});
};

module.exports = VisaAPIClient;