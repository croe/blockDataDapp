payload = {'deviceId': 'liskchip', 'deviceName': 'Lisk C.H.I.P.', 'temperature': '20', 'power': '45', 'gas': '65'}
r = requests.put("http://45.32.158.94:7000/api/dapps/524703051050655352/api/put/values", data=payload)
print r.status_code
print r.content
