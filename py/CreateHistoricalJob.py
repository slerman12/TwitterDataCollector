#!/usr/bin/env python

import urllib2
import base64
import json
import sys


def post(UN, PWD, fromDate, toDate, jobTitle, rules):

    url = 'https://historical.gnip.com/accounts/UniversityofRochester/jobs.json'
    publisher = "twitter"
    streamType = "track"
    dataFormat = "original"
    #
    jobString = '{"publisher":"' + publisher + '","streamType":"' + streamType + '","dataFormat":"' + dataFormat + '","fromDate":"' + str(fromDate) + '","toDate":"' + str(toDate) + '","title":"' + jobTitle + '","rules":' + rules + '}'

    base64string = base64.encodestring('%s:%s' % (UN, PWD)).replace('\n', '')
    req = urllib2.Request(url=url, data=jobString)
    req.add_header('Content-type', 'application/json')
    req.add_header("Authorization", "Basic %s" % base64string)

    try:
        response = urllib2.urlopen(req)
    except urllib2.HTTPError as e:
        return e.read()
    data = json.load(response)
    return data