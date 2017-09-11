module.exports = function (RED) {
	var CryptoJS = require("crypto-js");

	function DecodeNode(config) {
		RED.nodes.createNode(this, config);

		var node = this;
		node.encode = config.encode;

		node.on('input', function (msg) {
			// check configurations
			if(!node.encode) {
				// rising misconfiguration error
				node.error("Missing configuration, please check your encode.", msg);
			} else {
				// check the payload
				if(msg.payload) {
					// debugging message
					node.debug('Decoding payload using '+node.encode);
					// encode with CryptoJS
					msg.payload = CryptoJS.enc[node.encode].parse(msg.payload);
				} else {
					// debugging message
					node.trace('Nothing to decode: empty payload');
				}

				node.send(msg);
			}
		});
	}

	RED.nodes.registerType("decode", DecodeNode);
};