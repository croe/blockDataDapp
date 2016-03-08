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
		temperature: new Buffer(data.temperature, 'utf8').toString('hex'), 
		power: new Buffer(data.power, 'utf8').toString('hex'), 
		gas: new Buffer(data.gas, 'utf8').toString('hex'),
		clock: new Buffer(data.clock, 'utf8').toString('hex')
	};

	return trs;
}

BlockData.prototype.calculateFee = function (trs) {
    return 0; // Free!
}

BlockData.prototype.verify = function (trs, sender, cb, scope) {
	/*if (trs.asset.temperature.length > 40) {
		return setImmediate(cb, "Max length of an device id is 20 characters!");
	}
	if (trs.asset.deviceName.length > 100) {
		return setImmediate(cb, "Max length of an device name is 50 characters!");
	}*/

	setImmediate(cb, null, trs);
}

BlockData.prototype.getBytes = function (trs) {
	var b = Buffer.concat([new Buffer(trs.asset.deviceId, 'hex'), new Buffer(trs.asset.deviceName, 'hex'), new Buffer(trs.asset.temperature, 'hex'), new Buffer(trs.asset.power, 'hex'), new Buffer(trs.asset.gas, 'hex'), new Buffer(trs.asset.clock, 'hex')]);

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
			temperature: trs.asset.temperature,
			power: trs.asset.power,
			gas: trs.asset.gas,
			clock: trs.asset.clock
		}
	}, cb);
}

BlockData.prototype.dbRead = function (row) {
	if (!row.bd_transactionId) {
		return null;
	} else {
		return {
			deviceId: row.bd_deviceId,
			deviceName: row.bd_deviceName,
			temperature: row.bd_temperature,
			power: row.bd_power,
			gas: row.bd_gas,
			clock: row.bd_clock
		};
	}
}

BlockData.prototype.normalize = function (asset, cb) {
	library.validator.validate(asset, {
		type: "object", // It is an object
		properties: {
			deviceId: { // It contains a temperature property
				type: "string", // It is a string
				format: "hex", // It is in a hexadecimal format
				minLength: 1 // Minimum length of string is 1 character
			},
			deviceName: { // It contains a temperature property
				type: "string", // It is a string
				format: "hex", // It is in a hexadecimal format
				minLength: 1 // Minimum length of string is 1 character
			},
			temperature: { // It contains a deviceName property
				type: "string", // It is a string
				format: "hex", // It is in a hexadecimal format
				minLength: 1 // Minimum length of string is 1 character
			},
			power: { // It contains a deviceName property
				type: "string", // It is a string
				format: "hex", // It is in a hexadecimal format
				minLength: 1 // Minimum length of string is 1 character
			},
			gas: { // It contains a deviceName property
				type: "string", // It is a string
				format: "hex", // It is in a hexadecimal format
				minLength: 1 // Minimum length of string is 1 character
			},
			clock: { // It contains a deviceName property
				type: "string", // It is a string
				format: "hex", // It is in a hexadecimal format
				minLength: 1 // Minimum length of string is 1 character
			}
		},
		required: ["deviceId", "deviceName", "temperature", "power", "gas", "clock"]
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
				temperature: {
					type: "string",
					minLength: 1,
					maxLength: 42
				},
				power: {
					type: "string",
					minLength: 1,
					maxLength: 42
				},
				gas: {
					type: "string",
					minLength: 1,
					maxLength: 42
				},
				clock: {
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
					temperature: query.temperature,
					power: query.power,
					gas: query.gas,
					clock: query.clock,
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
                alias: "bd",
                on: {"t.id": "bd.transactionId"}
            }] // The fields have to be in the same order as in the blockchain.json
        }, ['id', 'type', 'senderId', 'senderPublicKey', 'recipientId', 'amount', 'fee', 'signature', 'blockId', 'transactionId', 'deviceId', 'deviceName', 'temperature', 'power', 'gas', 'clock'], function (err, transactions) {
            if (err) {
                return cb(err.toString());
            }

            // Map results to asset object
            var homeValues = transactions.map(function (tx) { 
                tx.asset = {
                	deviceId: new Buffer(tx.deviceId, 'hex').toString('utf8'),
                    deviceName: new Buffer(tx.deviceName, 'hex').toString('utf8'),
                    temperature: new Buffer(tx.temperature, 'hex').toString('utf8'),
                    power: new Buffer(tx.power, 'hex').toString('utf8'),
                    gas: new Buffer(tx.gas, 'hex').toString('utf8'),
                    clock: new Buffer(tx.clock, 'hex').toString('utf8')
                };

                delete tx.deviceId;
                delete tx.deviceName;
                delete tx.temperature;
                delete tx.power;
                delete tx.gas;
                delete tx.clock;
                return tx;
            });

            return cb(null, {
                homeValues: homeValues
            })
        });
    });
}

module.exports = BlockData;
