#!/usr/bin/env python

import urllib2
import base64
import json
import sys

def post(url, UN, PWD, accept):

    if accept:
        choice = 'accept'  # Switch to 'reject' to reject the job.
    else:
        choice = 'reject'

    payload = '{"status":"' + choice + '"}'


    base64string = base64.encodestring('%s:%s' % (UN, PWD)).replace('\n', '')
    req = urllib2.Request(url=url, data=payload)
    req.add_header('Content-type', 'application/json')
    req.add_header("Authorization", "Basic %s" % base64string)
    req.get_method = lambda: 'PUT'

    try:
        response = urllib2.urlopen(req)
    except urllib2.HTTPError as e:
        return json.load(e)
    data = json.load(response)
    return data