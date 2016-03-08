#!/usr/bin/env python

import requests

payload = {'secret': '123','deviceId': 'liskchip', 'deviceName': 'Lisk C.H.I.P.', 'temperature': '20', 'power': '45', 'gas': '65'}
r = requests.put("http://108.61.170.245:7000/api/dapps/17801572182567880835/api/put/values", data=payload)
print r.status_code
print r.content
