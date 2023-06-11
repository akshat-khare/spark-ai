from flask import Flask, request, jsonify
from google.cloud import storage
import requests
import os, json
import time
import difflib

app = Flask(__name__)


@app.route('/')
def index():
  return 'Hello from Flask!'

voiceids = {
  # 'Rachel': '21m00Tcm4TlvDq8ikWAM',
 # 'Domi': 'AZnzlk1XvdvUeBnXmlld',
 # 'Bella': 'EXAVITQu4vr4xnSDxMaL',
 # 'Antoni': 'ErXwobaYiN019PkySvjV',
 # 'Elli': 'MF3mGyEYCl7XYWbV9V6O',
 # 'Josh': 'TxGEqnHWrfWFTfGW9XjX',
 # 'Arnold': 'VR6AewLTigWG4xSOukaG',
 # 'Adam': 'pNInz6obpgDQGcFmaJgB',
 # 'Sam': 'yoZ06aMxZJJ28mfd3POQ',
 'donald trump': '6LZYrl2Ci8Pts9LABv2k',
 'shah rukh khan': 'V9jq5JeIyjyTbrZVYxH8',
 'sachin tendulkar': 'VqImSYDN7Nv9X9dowAXt',
 'narendra modi': 'dKjzVThcD5Q0WXNvwLXQ',
 'aishwarya rai': 'gLZvSZVWkdtIKTUxW1FS',
 'kangana ranaut': 'lQ2KwXYXQrp8n6sBaUB7',
 'amitabh bachchan': 'ocitVk29kSVkvlbjtC0p',
 'ranveer beerbicep':'n9VBJOJDNcNLSCO0bybX',
 'komal pandey': 'D6tMPGHwKksjQL9GGeYX',
'shirley setia':'McEZJ1tMkvwU6A3eK2nD',
'priyal kaka':'MMnZMLV3SYUGZ1znWYhk'}

imageurls = {
  'donald trump': 'https://storage.googleapis.com/artifacts-ai-nation/imagedatabase/donald.png',
 'shah rukh khan': 'https://storage.googleapis.com/artifacts-ai-nation/imagedatabase/srkrealcrop.jpg',
 'sachin tendulkar': 'https://storage.googleapis.com/artifacts-ai-nation/imagedatabase/sachin.jpeg',
 'narendra modi': 'https://storage.googleapis.com/artifacts-ai-nation/imagedatabase/modi.png',
 'aishwarya rai': 'https://storage.googleapis.com/artifacts-ai-nation/imagedatabase/aishwarya.jpg',
 'kangana ranaut': 'https://storage.googleapis.com/artifacts-ai-nation/imagedatabase/kangana3.jpeg',
 'amitabh bachchan': 'https://storage.googleapis.com/artifacts-ai-nation/imagedatabase/amitabhh.jpeg',
  'ranveer beerbicep': 'https://storage.googleapis.com/artifacts-ai-nation/imagedatabase/beerbicep.png',
  'komal pandey':'https://storage.googleapis.com/artifacts-ai-nation/imagedatabase/komal2.jpg',
  'shirley setia':'https://storage.googleapis.com/artifacts-ai-nation/imagedatabase/shirley3.jpeg',
  'priyal kaka': 'https://storage.googleapis.com/artifacts-ai-nation/imagedatabase/priyal.jpeg'
}
def add_overlay(video_url):
  url = "https://api.bannerbear.com/v2/videos"

  payload = json.dumps({
  "video_template": "MW3RvwypdOoydgZEJB",
  "input_media_url": video_url,
  "modifications": [
    {
      "name": "svg_shape_4",
      "color": None,
      "border_color": None,
      "border_width": None
    },
    {
      "name": "svg_shape_3",
      "color": None,
      "border_color": None,
      "border_width": None
    },
    {
      "name": "svg_shape_2",
      "color": None,
      "border_color": None,
      "border_width": None
    },
    {
      "name": "svg_shape_1",
      "color": None,
      "border_color": None,
      "border_width": None
    },
    {
      "name": "cta_label",
      "text": "VISIT US",
      "color": None,
      "background": None
    },
    {
      "name": "subtitle",
      "text": "40% OFF",
      "color": None,
      "background": None
    },
    {
      "name": "title",
      "text": "FLASH SALE!",
      "color": None,
      "background": None
    },
    {
      "name": "rectangle_9",
      "color": None
    },
    {
      "name": "rectangle_10",
      "color": None
    }
  ],
  "webhook_url": None,
  "metadata": None
})
  headers = {
    'Authorization': 'Bearer ',
    'Content-Type': 'application/json'
  }

  response = requests.post(url, headers=headers, data=payload)
  response_json = json.loads(response.text)
  uid = response_json['uid']

  tries = 0
  while tries < 10:
    tries += 1
    time.sleep(20)

    url = f"https://api.bannerbear.com/v2/videos/{uid}"

    headers = {
      'Authorization': 'Bearer '
    }

    response = requests.get(url, headers=headers)

    response_json = json.loads(response.text)
    if response_json['status'] == 'completed':
      return response_json['video_url']

  return None

@app.route('/t2vid', methods=['POST'])
def t2vid():
  text = request.json.get('text')
  print(text)
  # if text != 'ok':
  #     return jsonify({'error': 'Invalid text'}), 400
  actor = request.json.get('actor')
  def find_closest_match(actor):
    # convert both input and keys to lower case for case insensitive matching
    actor = actor.lower()
    keys = [key.lower() for key in voiceids.keys()]

    closest_match = difflib.get_close_matches(actor, keys, n=1, cutoff=0.1)

    if not closest_match:
        return None
    else:
        # get the original key without lower case transformation
        original_key = next(key for key in voiceids.keys() if key.lower() == closest_match[0])
        return original_key
  actor = find_closest_match(actor)
  print(actor)
  CHUNK_SIZE = 1024
  url = "https://api.elevenlabs.io/v1/text-to-speech/%s"%(voiceids[actor])

  headers = {
    "Accept": "audio/mpeg",
    "Content-Type": "application/json",
    "xi-api-key": ""
  }
  if not(actor in ['donald trump']):
    data = {
      "text": text,
      "model_id": "eleven_multilingual_v1",
      "voice_settings": {
        "stability": 0.75,
        "similarity_boost": 0.75
      }
    }
  else:
    data = {
      "text": text,
      "model_id": "eleven_monolingual_v1",
      "voice_settings": {
        "stability": 0.75,
        "similarity_boost": 0.75
      }
    }

  response = requests.post(url, json=data, headers=headers)
  fname = 'output%s.mp3'%(int(time.time()))
  with open(fname, 'wb') as f:
    for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
      if chunk:
        f.write(chunk)

  # Initialize a storage client
  storage_client = storage.Client.from_service_account_json(
    'ai-nation-10a64d05fb6c.json')

  bucket_name = 'artifacts-ai-nation'
  source_file_name = fname
  destination_blob_name = 'output%s.mp3'%(int(time.time()))

  bucket = storage_client.bucket(bucket_name)
  blob = bucket.blob(destination_blob_name)

  blob.upload_from_filename(source_file_name)

  file_url = f"https://storage.googleapis.com/{bucket_name}/{destination_blob_name}"
  time.sleep(2)
  # imageurl = request.json.get('imageurl')
  imageurl = imageurls[actor]
  audiourl = file_url
  url = "https://api.d-id.com/talks"

  payload = json.dumps({
    "source_url": imageurl,
    "script": {
      "type": "audio",
      "audio_url": audiourl
    },
    "config": {
      "stitch": True
    }
  })
  headers = {
    'Authorization': 'Basic ',
    'Content-Type': 'application/json'
  }

  response = requests.request("POST", url, headers=headers, data=payload)

  print(response.text)
  tries = 0
  while tries<10:
    tries +=1
    time.sleep(5)
    iddid = json.loads(response.text)['id']
    url = "https://api.d-id.com/talks/%s"%(iddid)
  
    payload = json.dumps({
      "source_url": imageurl,
      "script": {
        "type": "audio",
        "audio_url": audiourl
      },
      "config": {
        "stitch": True
      }
    })
    headers = {
      'Authorization': 'Basic ',
      'Content-Type': 'application/json'
    }
  
    response = requests.request("GET", url, headers=headers, data=payload)
    print(response.text)
    if json.loads(response.text)['status']=='done':
      break
  # return jsonify({"url":json.loads(response.text)['result_url']}), 200
  os.remove(fname)
  # return json.loads(response.text)['result_url'], 200
  result_url = add_overlay(json.loads(response.text)['result_url'])
  return result_url, 200


app.run(host='0.0.0.0', port=81)
