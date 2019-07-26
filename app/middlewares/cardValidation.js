const config = require('../../config/visa.config');
const VisaAPIClient = require('../libs/visaAPIClient.lib');

console.log(__dirname);

const validateVISAAccount = async (req, res, next) => {
	let visaAPIClient = new VisaAPIClient();
    let accountDetails = JSON.stringify({
        'primaryAccountNumber': '4957030000313108'
    });
    let baseUri = 'pav/';
    let resourcePath = 'v1/cardvalidation';
    console.log('In here!');
    try {
        visaAPIClient.doMutualAuthRequest(baseUri + resourcePath, accountDetails, 'POST', {},
		function(err, responseCode) {
			if(!err) {
				console.log("Success: ", responseCode);
			} else {
				console.error("Failed: ", err, responseCode);
            }
            next();
		});
    } catch (error) {
        console.log(error);
    }
    
}

module.exports = validateVISAAccount;