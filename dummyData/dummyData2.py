#!/usr/bin/env python

import requests
import time
import random

temperature = 0
power = 0
gas = 0
day = 0
i = 0

while True:
	temperature = random.randint(16,24)
	power = random.randint(95,105)
	gas = random.randint(1,160)
	i = i + 1 #Counter
	day = str(i) #Convert int into string
	if i <= 9:
		day = '0'+day

	payload = {'secret': '1234','deviceId': '9946841100442405851L', 'deviceName': 'Lisk RaspberryPi', 'temperature': temperature, 'power': power, 'gas': gas, 'clock': day+'-03-2016'}
	r = requests.put("http://108.61.170.245:7000/api/dapps/17801572182567880835/api/put/values", data=payload)
	print r.content
	print payload

	time.sleep(10)
	if i == 30:
		break
print "END"
