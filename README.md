

# 🎥 Text-to-Video Flask Application 🎙️
This repository contains a Flask application that converts input text into an animated video of a celebrity speaking the input text. The animation uses a static image of the celebrity and manipulates the image to make it look like the celebrity is speaking the words.

## 🏗️ Application Architecture
The application leverages two key APIs:

*ElevenLabs for Text-to-Speech (TTS) conversion*: The input text is converted into speech in the voice of a specified celebrity.
*D-ID for Video Generation*: The generated speech is then used to animate a static image of the chosen celebrity, making it appear as if the celebrity is speaking the text.
The application also uses Google Cloud Storage to store the generated speech files.

## 🚀 Live Demo
The application is hosted on Replit and can be accessed [here](https://flask--codebatgaming.repl.co).

## 🎯 How to Use
The application exposes a single endpoint: **POST /t2vid**. This endpoint expects a JSON payload with two parameters:

_text_: The text to be spoken in the video.
_actor_: The name of the celebrity who should appear to speak the text.
_The_ 'actor' can be one of the following: Donald Trump, Shah Rukh Khan, Sachin Tendulkar, Narendra Modi, Aishwarya Rai, Kangana Ranaut, Amitabh Bachchan.

Example usage:

```
POST /t2vid
{
    "text": "Hello, world!",
    "actor": "Donald Trump"
}
```
The endpoint returns a URL to the generated video.

## 🏃‍♀️ Running the Application
To run the application, use the following command:

```
python app.py
```
By default, the application will run on port 81.

## 📦 Dependencies
The application requires the following Python packages:

Flask
requests
google-cloud-storage
Install these packages with pip:

```
pip install flask requests google-cloud-storage
```
You also need to have the Google Cloud SDK installed and configured on your machine.

## 🔑 Note
This application uses ElevenLabs and D-ID APIs, and Google Cloud Storage. You need to have accounts and valid API keys for these services to run the application.

For production deployment, consider using a production-ready WSGI server like Gunicorn or uWSGI, as Flask's built-in server is not intended for production use. Also, make sure to secure your API keys and other sensitive data using environment variables or a secure secret management system.

## 🔮 Future Work
This application can be extended in many ways, including adding support for more 'actors', improving the quality of the generated videos, and implementing additional features like video download, sharing, and more. Enjoy crafting 🚀!

## Bounties
LLamaIndex

# 🚧 Challenges Faced
During the development of this application, we faced several challenges. Here's an overview of how we tackled them:

## 🎯 Token Length Limitations
One of the issues we faced was related to the token length limitations of the GPT models. We had to carefully manage our input so that we did not exceed the maximum token limit. Through multiple iterations and testing, we devised a method to split the input text into chunks that could be processed separately, without losing coherence.

## 🗣️ Autonomous Chatbot with GPT-4
Creating an autonomous chatbot using GPT-4 was a challenge due to the model's complexity and resource requirements. We made multiple iterations on the chatbot's implementation, focusing on prompt engineering, to ensure the bot's responses were appropriate and coherent. JSONifying the response from GPT-3.5/4 was another task that required careful handling to ensure the data was correctly parsed and used.

## ⏱️ Latency Issues
We also faced latency issues with GPT-4 due to its high computational requirements. To mitigate this, we performed multiple iterations on the chatbot, focusing on reducing the latency. We streamlined the number of messages exchanged in each workflow to a minimal amount, thus improving response times.

## 🎥 Video Generation
For video generation, we tried multiple services including D-ID and SadTalker. While SadTalker provided valuable learnings and was used to generate a number of videos, we found D-ID to be faster for our use case and thus decided to proceed with it.


## 🎙️ Voice Training
We also encountered challenges in generating voice training for celebrities using ElevenLabs. Despite multiple failures, we persisted and were eventually able to find high-quality voices that significantly enhanced the realism of our generated videos.

Despite these challenges, we believe that the end result was well worth the effort. We hope you find this application useful and look forward to seeing what you create with it!




