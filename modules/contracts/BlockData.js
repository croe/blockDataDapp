var private = {}, self = null,
	library = null, modules = null;

function BlockData(cb, _library) {
	self = this;
	self.type = 6
	library = _library;
	cb(null, self);
}

BlockData.prototype.create = function (data, trs) {
	trs.asset = {
		deviceId: new Buffer(data.deviceId, 'utf8').toString('hex'), // Save as hex string
		deviceName: new Buffer(data.deviceName, 'utf8').toString('hex'), 
		tempIn: new Buffer(data.tempIn, 'utf8').toString('hex'), 
		powerCosts: new Buffer(data.powerCosts, 'utf8').toString('hex'), 
		gasCosts: new Buffer(data.gasCosts, 'utf8').toString('hex')
	};

	return trs;
}

BlockData.prototype.calculateFee = function (trs) {
    return 0; // Free!
}

BlockData.prototype.verify = function (trs, sender, cb, scope) {
	/*if (trs.asset.tempIn.length > 40) {
		return setImmediate(cb, "Max length of an device id is 20 characters!");
	}
	if (trs.asset.deviceName.length > 100) {
		return setImmediate(cb, "Max length of an device name is 50 characters!");
	}*/

	setImmediate(cb, null, trs);
}

BlockData.prototype.getBytes = function (trs) {
	var b = Buffer.concat([new Buffer(trs.asset.deviceId, 'hex'), new Buffer(trs.asset.deviceName, 'hex'), new Buffer(trs.asset.tempIn, 'hex'), new Buffer(trs.asset.powerCosts, 'hex'), new Buffer(trs.asset.gasCosts, 'hex')]);

	return b;
}

BlockData.prototype.apply = function (trs, sender, cb, scope) {
    modules.blockchain.accounts.mergeAccountAndGet({
        address: sender.address,
        balance: -trs.fee
    }, cb);
}

BlockData.prototype.undo = function (trs, sender, cb, scope) {
    modules.blockchain.accounts.undoMerging({
        address: sender.address,
        balance: -trs.fee
    }, cb);
}

BlockData.prototype.applyUnconfirmed = function (trs, sender, cb, scope) {
    if (sender.u_balance < trs.fee) {
        return setImmediate(cb, "Sender doesn't have enough coins");
    }

    modules.blockchain.accounts.mergeAccountAndGet({
        address: sender.address,
        u_balance: -trs.fee
    }, cb);
}

BlockData.prototype.undoUnconfirmed = function (trs, sender, cb, scope) {
    modules.blockchain.accounts.undoMerging({
        address: sender.address,
        u_balance: -trs.fee
    }, cb);
}

BlockData.prototype.ready = function (trs, sender, cb, scope) {
	setImmediate(cb);
}

BlockData.prototype.save = function (trs, cb) {
	modules.api.sql.insert({
		table: "asset_values",
		values: {
			transactionId: trs.id,
			deviceId: trs.asset.deviceId,
			deviceName: trs.asset.deviceName,
			tempIn: trs.asset.tempIn,
			powerCosts: trs.asset.powerCosts,
			gasCosts: trs.asset.gasCosts,
		}
	}, cb);
}

BlockData.prototype.dbRead = function (row) {
	if (!row.hm_transactionId) {
		return null;
	} else {
		return {
			deviceId: row.hm_deviceId,
			deviceName: row.hm_deviceName,
			tempIn: row.hm_tempIn,
			powerCosts: row.hm_powerCosts,
			gasCosts: row.hm_gasCosts
		};
	}
}

BlockData.prototype.normalize = function (asset, cb) {
	library.validator.validate(asset, {
		type: "object", // It is an object
		properties: {
			deviceId: { // It contains a tempIn property
				type: "string", // It is a string
				format: "hex", // It is in a hexadecimal format
				minLength: 1 // Minimum length of string is 1 character
			},
			deviceName: { // It contains a tempIn property
				type: "string", // It is a string
				format: "hex", // It is in a hexadecimal format
				minLength: 1 // Minimum length of string is 1 character
			},
			tempIn: { // It contains a deviceName property
				type: "string", // It is a string
				format: "hex", // It is in a hexadecimal format
				minLength: 1 // Minimum length of string is 1 character
			},
			powerCosts: { // It contains a deviceName property
				type: "string", // It is a string
				format: "hex", // It is in a hexadecimal format
				minLength: 1 // Minimum length of string is 1 character
			},
			gasCosts: { // It contains a deviceName property
				type: "string", // It is a string
				format: "hex", // It is in a hexadecimal format
				minLength: 1 // Minimum length of string is 1 character
			},
		},
		required: ["deviceId", "deviceName", "tempIn", "tempOut", "humidIn", "humidOut", "powerCosts", "gasCosts"]
	}, cb);
}

BlockData.prototype.onBind = function (_modules) {
	modules = _modules;
	modules.logic.transaction.attachAssetType(self.type, self);
}

BlockData.prototype.putValues = function (cb, query) {
	library.validator.validate(query, {
		type: "object",
		properties: {
				secret: {
					type: "string",
					minLength: 1,
					maxLength: 100
				},
				deviceId: {
					type: "string",
					minLength: 1,
					maxLength: 42
				},
				deviceName: {
					type: "string",
					minLength: 1,
					maxLength: 42
				},
				tempIn: {
					type: "string",
					minLength: 1,
					maxLength: 42
				},
				powerCosts: {
					type: "string",
					minLength: 1,
					maxLength: 42
				},
				gasCosts: {
					type: "string",
					minLength: 1,
					maxLength: 42
				}
		}
	}, function (err) {
		// If error exists, execute callback with error as first argument
		if (err) {
			return cb(err[0].message);
		}

		var keypair = modules.api.crypto.keypair(query.secret);

		modules.blockchain.accounts.setAccountAndGet({
			publicKey: keypair.publicKey.toString('hex')
		}, function (err, account) {
			// If error occurs, call cb with error argument
			if (err) {
				return cb(err);
			}

			console.log(account);
			try {
				var transaction = library.modules.logic.transaction.create({
					type: self.type,
					deviceId: query.deviceId,
					deviceName: query.deviceName,
					tempIn: query.tempIn,
					powerCosts: query.powerCosts,
					gasCosts: query.gasCosts,
					sender: account,
					keypair: keypair
				});
			} catch (e) {
				// Catch error if something goes wrong
				return setImmediate(cb, e.toString());
			}

			// Send transaction for processing
			modules.blockchain.transactions.processUnconfirmedTransaction(transaction, cb);
		});
	});
}

BlockData.prototype.getValues = function (cb, query) {
    // Verify query parameters
    library.validator.validate(query, {
        type: "object",
        properties: {
            deviceId: {
                type: "string",
                minLength: 1,
                maxLength: 42
            }
        },
        required: ["deviceId"]
    }, function (err) {
        if (err) {
            return cb(err[0].message);
        }

        // Select from transactions table and join entries from the asset_values table
        modules.api.sql.select({
            table: "transactions",
            alias: "t",
            condition: {
                deviceId: query.deviceId,
                type: self.type
            },
            join: [{
                type: 'left outer',
                table: 'asset_values',
                alias: "hm",
                on: {"t.id": "hm.transactionId"}
            }] // The fields have to be in the same order as in the blockchain.json
        }, ['id', 'type', 'senderId', 'senderPublicKey', 'recipientId', 'amount', 'fee', 'signature', 'blockId', 'transactionId', 'deviceId', 'deviceName', 'tempIn', 'powerCosts', 'gasCosts'], function (err, transactions) {
            if (err) {
                return cb(err.toString());
            }

            // Map results to asset object
            var homeValues = transactions.map(function (tx) { 
                tx.asset = {
                	deviceId: new Buffer(tx.deviceId, 'hex').toString('utf8'),
                    deviceName: new Buffer(tx.deviceName, 'hex').toString('utf8'),
                    tempIn: new Buffer(tx.tempIn, 'hex').toString('utf8'),
                    powerCosts: new Buffer(tx.powerCosts, 'hex').toString('utf8'),
                    gasCosts: new Buffer(tx.gasCosts, 'hex').toString('utf8')
                };

                delete tx.deviceId;
                delete tx.deviceName;
                delete tx.tempIn;
                delete tx.powerCosts;
                delete tx.gasCosts;
                return tx;
            });

            return cb(null, {
                homeValues: homeValues
            })
        });
    });
}

module.exports = BlockData;
