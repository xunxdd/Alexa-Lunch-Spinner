# alexa-lunch-spinner

Have trouble to decide what to eat and where to go for your precious day's precious lunch? Simply bored and want to talk to Alexa?

Give Alexa Lunch Spinner a try by saying: Alexa, ask Lunch Spinner.

Alexa will happily (playfully) spin its lunch wheel for you and pick a food for you; then based on your location (zip or city and state) and find a restaurant for you. Alexa will also send you some happy fortune cookie quote!

# Installation

```bash
	npm install
```

# Sample utterances

```user: Alexa, ask Lunch Spinner.
Alexa: Welcome. ... Are you ready?
user: No
Alexa: Cool. Goodbye

user: Alexa, ask Lunch Spinner.
Alexa: Welcome to Lunch Spinner. <audio src="Spin-Sound.mp3" /> Have a hard time to decide what and where to have today\'s lunch?  No worries. Let\'s spin the lunch spinner and make a fun choice. Additionally, we will send a fortune cookie quote on your way.
user: Yes
Alexa: Today the food of choice for your lunch is Sushi. Would you like us to continue to pick a location for you? If you would like to pick something else, please say "Spin Again", otherwise, please say "Yes"
user: Spin again
Alexa: Today the food of choice for your lunch is Sushi. Would you like us to continue to pick a location for you? If you would like to pick something else, please say "Spin Again", otherwise, please say "Yes"
user: Yes
Alexa: What is your zip code or City and State?
user: 60637
Alexa: <audio src="Spin-Sound.mp3" /> Today\'s lucky restaurant is Juno Sushi Chicago. It is located at 2638 N Lincoln Ave, Chicago, IL 60614. It has a customer rating of 4 and it\'s price level is considered moderate. Your fortune cookie quote is You will have a great success soon. Enjoy your lunch
```

# Features

- Use alexa-server-app by Matt Kruse
- Server side code / food look up using google place api in node js
- Use SSML to include audio

### custom slot types
```{
  "intents": [
    {
      "intent": "AMAZON.YesIntent",
      "slots": []
    },
    {
      "intent": "AMAZON.NoIntent",
      "slots": []
    },
    {
      "intent": "AMAZON.HelpIntent",
      "slots": []
    },
    {
      "intent": "AMAZON.StartOverIntent",
      "slots": []
    },
    {
      "intent": "AMAZON.CancelIntent",
      "slots": []
    },
    {
      "intent": "AMAZON.StopIntent",
      "slots": []
    },
    {
      "intent": "AMAZON.RepeatIntent",
      "slots": []
    },
    {
      "intent": "repickIntent",
      "slots": []
    },
    {
      "intent": "zipCodeIntent",
      "slots": [
        {
          "name": "zip",
          "type": "AMAZON.NUMBER"
        }
      ]
    },
    {
      "intent": "usCityIntent",
      "slots": [
        {
          "name": "usCity",
          "type": "AMAZON.US_CITY"
        },
        {
          "name": "usState",
          "type": "AMAZON.US_STATE"
        }
      ]
    }
  ]
}
```

### utterances

The utterances syntax allows you to generate many (hundreds or even thousands) of sample utterances using just a few samples that get auto-expanded. Any number of sample utterances may be passed in the utterances array. Below are some sample utterances macros and what they will be expanded to.
```
repickIntent	Spin again
repickIntent	Spin again please
zipCodeIntent	zip code {zip}
zipCodeIntent	My zip code {zip}
zipCodeIntent	zip code is {zip}
zipCodeIntent	My zip code is {zip}
usCityIntent	{usCity} {usState}
```

## History

- 0.0.1 - Nov 19, 2016
  - Certified by Amazon. Deployed app

