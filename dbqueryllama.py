from flask import Flask, request

app = Flask(__name__)



# My OpenAI Key
import os
os.environ['OPENAI_API_KEY'] = ""

from llama_index import VectorStoreIndex, SimpleDirectoryReader
from llama_index import (
    LLMPredictor,
    ServiceContext
)
from langchain.chat_models import ChatOpenAI
import requests
documents = SimpleDirectoryReader('tempdata').load_data()
# define LLM
llm_predictor = LLMPredictor(llm=ChatOpenAI(temperature=0.7, model_name="gpt-4"
, top_t=0.9
                                        # , instructions=
                                        ))
service_context = ServiceContext.from_defaults(llm_predictor=llm_predictor)
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine()
# # response = query_engine.query("What did the author do growing up?")
# response = query_engine.query("Who purchased earrings with their information? Give the answer as a python list like ['Person, He liked <some item>. He wishes to be let known when <some item> arrives. He purchased <some other item> on <time>']")

# print(response)

@app.route('/')
def index():
    return 'Hello from Flask!'

@app.route('/bulk')
def bulk():
  #get a parameter item from request
  item = request.args.get('item')
  response = query_engine.query(f'Who purchased {item} with their information? Give the answer as a python list like [\'Person, He liked <some item>. He wishes to be let known when <some item> arrives. He purchased <some other item> on <time>\']')
  return response.response
  # return 'Hello from Flask Bulk!'


app.run(host='0.0.0.0', port=81)
