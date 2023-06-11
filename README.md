SparkedAI WhatsApp Chatbot
==========================

SparkedAI is an intuitive WhatsApp chatbot that effortlessly generates personalized marketing videos for small businesses across India. It fuses art and technology to spark your brand's growth story. This repository contains the implementation code for the chatbot.

Features
--------

-   GPT-4 Chatbot: Uses GPT-4 language model for generating video content based on user input.
-   Text-to-Speech (TTS): Converts text responses to audio using a selected TTS provider.
-   Video Generation: Generates personalized marketing videos and sends them to users.
-   Bulk Delivery: Supports bulk delivery based on product categories.
-   User Context Management: Maintains individual user contexts to handle multiple conversations.

Installation and Setup
----------------------

1.  Clone the repository:

bashCopy code

`git clone https://github.com/your-username/SparkedAI-Chatbot.git`


Disclaimer - The code is heavily borrowed from root repository -  https://github.com/askrella/whatsapp-chatgpt

1.  Navigate to the project directory:

bashCopy code

`cd SparkedAI-Chatbot`

1.  Install the required dependencies:

bashCopy code

`npm install`

Usage
-----

Before starting the chatbot, make sure to add your API keys and other configurations in the appropriate places. You can find these in the `providers` directory.

Start the chatbot:

bashCopy code

`npm start`

Documentation
-------------

The chatbot has three main states:

1.  GreetingState: The chatbot sends a greeting and options to the user. If the user wants a bulk delivery, the chatbot transitions to the `BulkDeliveryState`. Otherwise, it transitions to the `ContentDeliveryState`.

2.  ContentDeliveryState: The chatbot collects details from the user and generates video content based on the collected information. After sending the video, it sends a thank you message to the user and resets the state to `GreetingState`.

3.  BulkDeliveryState: The chatbot fetches bulk data from an API and generates a personalized video for each user. After sending all the videos, it sends a thank you message to the user and resets the state to `GreetingState`.

Error Handling
--------------

In case of an error during a conversation, the chatbot catches the error and resets the state to `GreetingState`.

Contribution
------------

Feel free to fork the project and submit pull requests. You can also report any issues or suggestions in the GitHub issue tracker.

License
-------

This project is licensed under the MIT License. See the LICENSE file for more details.