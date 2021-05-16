import random
def invokeApi(request_url, payload):
    try:
        print(request_url, params)
        headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'data creator python'
        }
        response = requests.request("POST", request_url, headers=headers, json=payload)

        if not response or response.status_code != 200:
            print("Request failed for api path = {}".format(request_url))
            return {}
        return response.json()
    except Exception as e:
        print(e)
        return {}


url = "http://localhost:5000/generate/ticket?"

data = {
    "customerName": ["karun", "Sophia","Liam","Olivia","Noah","Jackson","Emma","Amelia","Caden","Mia","Mateo","Layla", "Muhammad", "Zoe", "Mason"],
    "performanceTitle": ["parasite","Time to Dance","Mumbai Saga","Switchh","Pagglait","Roohi","avengers","spiderman","batman"],
    "performanceTime": ["2021-03-11","2020-03-07","2021-02-28","2021-03-13","2020-07-20","2021-04-07","2020-08-11","2021-01-10"],
    "ticketPrice": [100,150,200],
    "theater": ["theater1","theater2","theater3"]
}


userlist = []
for i in data:
    rand = random.randrange(1, len(data[i])))
    newdata[i] = data[i][rand]
    userlist.append()
