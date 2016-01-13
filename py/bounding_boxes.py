import math

def great_circle_distance_miles(longlat_a, longlat_b):

    EARTH_CIRCUMFERENCE = 6378137     # earth circumference in meters
    METERS_IN_MILE = 1609.34

    lon1, lat1 = longlat_a
    lon2, lat2 = longlat_b

    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = (math.sin(dLat / 2) * math.sin(dLat / 2) +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dLon / 2) * math.sin(dLon / 2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    d = EARTH_CIRCUMFERENCE * c

    return d / METERS_IN_MILE


'''
    Recursisvely call great_circle_distance_miles(latlong_a, latlong_b) with current 2 points and
    adjust until 24.9 < X <= 25.00 miles.
'''
def resizeBox(long_offset, long, lat):

    point1 = (long, lat)
    point2 = (long + long_offset, lat)

    distance = great_circle_distance_miles(point1, point2)
    print 'distance = ' + str(distance) + ' with Lat = ' + str(lat)

    if distance > 24.8 and distance <=24.9:
        #print 'Bingo with long_offset=' + str(long_offset)
        return long_offset
    else:
        if distance < 24.8:
            #These latitude driven tweaks are 100% empirical for handle boxes near the Poles.
            if math.fabs(lat) < 75:
                long_offset = long_offset + 0.001
            elif math.fabs(lat) < 85:
                long_offset = long_offset + 0.005
            else:
                long_offset = long_offset + 0.007

        if distance > 24.9:
            #These latitude driven tweaks are 100% empirical for handle boxes near the Poles.
            if math.fabs(lat) < 75:
                long_offset = long_offset - 0.001
            elif math.fabs(lat) < 85:
                long_offset = long_offset - 0.005
            else:
                long_offset = long_offset - 0.007

        #print 'Resizing again...'
        return resizeBox(long_offset,long, lat)

def returnBoundingBox(long_west, long_east, lat_north, lat_south, keywords, tag):

    lat_offset_default = 0.35
    long_offset_default = 0.45

    #Make smaller near the Equator.
    if math.fabs(lat_north) < 15 or math.fabs(lat_south) < 15:
        long_offset_default = 0.35

    #Make larger near the Poles.
    if math.fabs(lat_north) > 80 or math.fabs(lat_south) > 80:
        long_offset_default = 3  #Purely an empirical number!

    #Load latitude bounding box limit.
    lat_offset = lat_offset_default

    #Load longitude bounding box limit.
    long_offset = long_offset_default

    #Load the option for the Dashboard format (one bounding box per line)
    dashboard = False

    #How many columns needed to transverse West-East distance?
    columns = math.fabs(long_west - long_east)/long_offset
    #print 'Fractional columns: ' + str(columns)
    columns = math.ceil(columns)

    #How many rows needed to transverse North-South distance?
    rows = math.fabs(lat_north - lat_south)/lat_offset
    #print 'Fractional rows: ' + str(rows)
    rows = math.ceil(rows)

    print 'Expecting ' + str(rows*columns) + ' boxes (' + str(rows) + ' rows X ' + str(columns) + ' columns)'

    boxes = [] #Create list to hold

    #Confirm default longitude offset
    long_offset = resizeBox(long_offset, long_west, lat_south)

    #Initialize Origin bounding box
    cur_west = long_west
    cur_east = cur_west + long_offset
    cur_south = lat_south
    cur_north = lat_south + lat_offset


#Walk the study area building bounding boxes.
    # Starting in SW corner, marching east, then up a row and repeat.
    #while round(cur_south,6)  < round(lat_north,6):
    #    while round(cur_west,6) < round(long_east,6):
    while cur_south  < lat_north:  #marching northward until next row would be completely out of study area.
        while cur_west < long_east:  #marching eastward, building row of boxes

            #Doing some rounding to create 'clean' numbers.
            bounding_box = (round(cur_west,6), round(cur_south,6), round(cur_east,6), round(cur_north,6))
            #print bounding_box
            boxes.append(bounding_box)

            #Advance eastward.
            cur_west = cur_west + long_offset
            cur_east = cur_east + long_offset

        #Snap back to western edge.
        cur_west = long_west

        #Resize bounding box w.r.t. longitude offset...
        long_offset = resizeBox(long_offset,cur_west, cur_south)

        #Advance eastward, using new longitude offset.
        cur_east = cur_west + long_offset

        #Advance northward.
        cur_south = cur_south + lat_offset
        cur_north = cur_north + lat_offset

    print "Have " + str(len(boxes)) + " boxes."

    #Write output.
    #Produce JSON formatted rule set.
    rules = '['
    first = True
    for box in boxes:
        #Build actual Gnip bounding box format
        rule_syntax = 'bounding_box:[' + str(box[0]) + ' ' + str(box[1]) + ' ' + str(box[2]) + ' ' + str(box[3]) + ']'
        if tag == None:
            rule = '{"value":"' + rule_syntax + '"}'
        else:
            rule = '{"value":"(' + keywords + ') ' + rule_syntax + '", "tag":"' + tag + '"}'
        if first:
            rules += rule
        else:
            rules += ',' + rule
        first = False

    rules += ']'

    return rules