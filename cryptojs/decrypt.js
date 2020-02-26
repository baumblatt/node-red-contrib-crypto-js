module.exports = function (RED) {
	var CryptoJS = require("crypto-js");

	function DecryptNode(config) {
		RED.nodes.createNode(this, config);

		var node = this;
		node.algorithm = config.algorithm;
		node.key = config.key;

		if (_isBlockCipher(node.algorithm)) {
			node.mode = config.mode;
			node.padding = config.padding;
		}

		node.on('input', function (msg) {
			var algorithm = Object.is(msg.algorithm, undefined) ? node.algorithm : msg.algorithm;
			var key = Object.is(msg.key, undefined) ? node.key : msg.key;
			var mode = Object.is(msg.mode, undefined) ? node.mode : msg.mode;
			var padding = Object.is(msg.padding, undefined) ? node.padding : msg.padding;		
			var CryptoJSConfig = {};
			
			if (_isBlockCipher(node.algorithm)) {
				CryptoJSConfig = Object.assign(CryptoJSConfig, {
					mode: CryptoJS.mode[mode],
					padding: CryptoJS.pad[padding]
				});
			}

			if (msg.drop) { CryptoJSConfig.drop = msg.drop; }
			if (msg.iv) { CryptoJSConfig.iv = msg.iv; }
			if (msg.salt) { CryptoJSConfig.iv = msg.salt; }

			// check configurations
			if(!algorithm || !key) {
				// rising misconfiguration error
				node.error("Missing configuration, please check your algorithm, secret key, mode or padding.", msg);
			} else {
				// check the payload
				if(msg.payload) {
					// debugging message
					node.debug('Encrypting payload using '+ algorithm);
					// decrypt with CryptoJS
					//let cipherMessage = CryptoJS.lib.CipherParams.create({ ciphertext: msg.payload });
					var bytes = CryptoJS[algorithm].decrypt(msg.payload, key, CryptoJSConfig);
					msg.payload = bytes.toString(CryptoJS.enc.Utf8);

				} else {
					// debugging message
					node.trace('Nothing to decrypt: empty payload');
				}

				node.send(msg);
			}
		});

		function _isBlockCipher(algorithm) {
			return (algorithm === "AES" || algorithm === "DES" || algorithm === "TripleDES");
		}
	}

	RED.nodes.registerType("decrypt", DecryptNode);
};