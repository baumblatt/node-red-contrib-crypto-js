module.exports = function (RED) {
	var CryptoJS = require("crypto-js");

	function DecryptNode(config) {
		RED.nodes.createNode(this, config);

		var node = this;
		node.algorithm = config.algorithm;
		node.key = config.key;

		node.on('input', function (msg) {
			// check configurations
			if(!node.algorithm || !node.key) {
				// rising misconfiguration error
				node.error("Missing configuration, please check your algorithm or secret key.", msg);
			} else {
				// check the payload
				if(msg.payload) {
					// debugging message
					node.debug('Encrypting payload using '+node.algorithm);
					// decrypt with CryptoJS
					var bytes = CryptoJS[node.algorithm].decrypt(msg.payload, node.key);
					msg.payload = bytes.toString(CryptoJS.enc.Utf8);
				} else {
					// debugging message
					node.trace('Nothing to decrypt: empty payload');
				}

				node.send(msg);
			}
		});
	}

	RED.nodes.registerType("decrypt", DecryptNode);
};