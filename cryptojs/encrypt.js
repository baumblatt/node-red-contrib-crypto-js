module.exports = function (RED) {
	var CryptoJS = require("crypto-js");

	function EncryptNode(config) {
		RED.nodes.createNode(this, config);

		var node = this;
		node.algorithm = config.algorithm;
		node.key = config.key;
		node.mode = config.mode;
		node.padding = config.padding;

		var CryptoJSConfig = {
			mode: CryptoJS.mode[node.mode],
			padding: CryptoJS.pad[node.padding]
		}

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
					// encrypt with CryptoJS
					let cipherMessage = CryptoJS.lib.CipherParams.create({ ciphertext: msg.payload });
					let cipherKey = node.key;
					msg.payload = CryptoJS[node.algorithm].encrypt(cipherMessage, cipherKey, CryptoJSConfig);

				} else {
					// debugging message
					node.trace('Nothing to encrypt: empty payload');
				}

				node.send(msg);
			}
		});
	}

	RED.nodes.registerType("encrypt", EncryptNode);
};