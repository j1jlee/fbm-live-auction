import os
from datetime import datetime, timedelta

def time_format(time_input):
    # print("What is startTime?", time_input)
    strStartTime = time_input.split(" (")[0]

    timeOffset = strStartTime[-5:]
    pos_or_neg = 1 if timeOffset[0] == "-" else -1
    timeOffsetHours = int(timeOffset[1 : 3]) * pos_or_neg
    timeOffsetMinutes = int(timeOffset[3:]) * pos_or_neg

    formatStartTime = datetime.strptime(strStartTime, "%a %b %d %Y %H:%M:%S %Z%z")

    if os.environ.get('FLASK_ENV') != 'production':
        formatStartTime += timedelta(hours=timeOffsetHours, minutes=timeOffsetMinutes)

    return formatStartTime
