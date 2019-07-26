const VisaAPIClient = require('../libs/visaAPIClient.lib');

exports.validateAccount = (req, res) => {
    let visaAPIClient = new VisaAPIClient();
    let accountDetails = JSON.stringify({
        "cardCvv2Value": "672",
        "cardExpiryDate": "2020-06",
        "primaryAccountNumber": "4895142232120006",
        "addressVerificationResults": {
            "street": "XYZ St",
            "postalCode": "12345"
        }
    });
    let baseUri = 'pav/';
    let resourcePath = 'v1/cardvalidation';
    try {
        visaAPIClient.doMutualAuthRequest(baseUri + resourcePath, accountDetails, 'POST', {},
		function(err, response) {
			if(!err) {
				console.log("Success: ", JSON.parse(response.body));
			} else {
				console.error("Failed: ", err);
            }
            res.send({statusCode: response.statusCode, body: JSON.parse(response.body)});
		});
    } catch (error) {
        res.send({error});
        console.log(error);
    }
};