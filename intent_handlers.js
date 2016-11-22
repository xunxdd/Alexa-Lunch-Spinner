'use strict';

var lunchDataHelper = require('./lunch_data_helper');
var lunchHelper = new lunchDataHelper();
var _ = require('lodash');
var pickType = {
  getFood: 'get-food',
  getLocation: 'get-location',
  getResturant: 'get-resturant'
};

function IntentHandler() {
  var getStartedText = 'Are you ready?',
    welcomeText = 'Welcome to Lunch Spinner. ' +
      '<audio src="https://lunch-where.herokuapp.com/sounds/Spin-Sound.mp3" /> ' +
      'Have a hard time to decide what and where to have today\'s lunch?  ' +
      'No worries. Let\'s spin the lunch spinner and make a fun choice. ' +
      'Additionally, we will send a fortune cookie quote on your way. ' +
      getStartedText;

  var yesIntent = {
    name: "AMAZON.YesIntent",
    utterances: {},
    callFunc: HanleYesIntent
  };

  var noIntent = {
    name: "AMAZON.NoIntent",
    utterances: {},
    callFunc: goodBye
  };

  var startOverIntent = {
    name: "AMAZON.StartOverIntent",
    utterances: {},
    callFunc: handleStartOverIntent
  };

  var helpIntent = {
      name: 'AMAZON.HelpIntent',
      utterances: {},
      callFunc: handleHelpIntent
    },
    cancelIntent = {
      name: 'AMAZON.CancelIntent',
      utterances: {},
      callFunc: goodBye
    },
    repeatIntent = {
      name: 'AMAZON.RepeatIntent',
      utterances: {},
      callFunc: handleRepeatIntent
    },
    stopIntent = {
      name: 'AMAZON.StopIntent',
      utterances: {},
      callFunc: goodBye
    };

  var repickIntent = {
    "utterances": {
      "utterances": ["{Spin again }{|, please}"]
    },
    name: 'repickIntent',
    callFunc: handleRepickIntent
  };

  var zipCodeIntent = {
    "utterances": {
      "slots": {'zip': 'AMAZON.NUMBER'},
      "utterances": ["{|My } {zip code } {| is } {-|zip}"]
    },
    name: 'zipCodeIntent',
    callFunc: handleZipCodeIntent
  };

  var usCityIntent = {
    "utterances": {
      slots: {'usCity': 'AMAZON.US_CITY', 'usState': 'AMAZON.US_STATE'},
      "utterances": ["{usCity}, {usState}"]
    },
    name: 'usCityIntent',
    callFunc: handleCityIntent
  };

  function handleStartOverIntent(req, res) {
    res.session('currentQuestion', null);

    handleLaunchRequest(req, res);
  }

  function handleRepeatIntent(req, res) {
    var currentPick = res.session('pick');

    if (!currentPick) {
      handleLaunchRequest(req, res);
      return;
    }

    if (currentPick.type === pickType.getFood && currentPick.food) {
      pickFood(req, res, currentPick.food);
      return;
    }

    if (currentPick.type === pickType.getLocation) {
      getUserLocation(req, res);
      return;
    }

    if (currentPick.type === pickType.getResturant) {
        noResturantTryAnotherLocation(req, res);
    }
  }

  function handleRepickIntent(req, res) {
    pickFood(req, res);
  }

  function handleCityIntent(req, res) {
    var city = req.slot('usCity'),
      state = req.slot('usState'),
      output;
    if (!city || !state) {
      output = 'Sorry. I did not hear a valid city. Can you say your city again?'
      res.say(output).reprompt(output).shouldEndSession(false);

    } else {
      return pickResturant(req, res, city + ', ' + state);
    }

  }

  function handleZipCodeIntent(req, res) {
    var zipCode = req.slot('zip'),
      zipRexTest = /(^\d{5}$)/.test(zipCode),
      output;

    if (!zipCode || !zipRexTest) {
      output = 'Sorry. I did not hear a valid zip code. Can you say your zip code again?';
      console.log('invalid zip code');
      res.say(output).reprompt(output).shouldEndSession(false);
      return true;
    } else {
      console.log('pick rest');
      return pickResturant(req, res, zipCode);
    }
  }

  function HanleYesIntent(req, res) {
    var currentPick = res.session('pick'),
      currentPickType = currentPick ? currentPick.type : '';

    if (!currentPickType) {
      pickFood(req, res);
    } else if (currentPickType === pickType.getFood) {
      getUserLocation(req, res);
    }
  }

  function getUserLocation(req, res) {
    var currentPick = res.session('pick');
    var pleaseProvideLocation = 'Great. To pick up a restaurant for you, We would like to know your city or zip code. ' +
      'For example, zip code: six zero six three one. Or,  Chicago, Illinois. ' +
      'So, what is your zip code or your city and state?';

    res.session('pick', {
      type: pickType.getLocation,
      food: currentPick.food
    });
    res.say(pleaseProvideLocation).reprompt(pleaseProvideLocation).shouldEndSession(false);
  }

  function pickResturant(req, res, location) {
    var currentPick = res.session('pick'),
      currentPickType = currentPick ? currentPick.type : '',
      currentPickedFood = currentPick ? currentPick.food : '';

    if (currentPickType === 'get-location' && currentPickedFood.length > 0) {
      res.session('pick', {
        type: pickType.getResturant,
        food: currentPick.food,
        location: location
      });
      lunchHelper.requestResturantsInfo(currentPickedFood, location)
        .then(function (data) {
          getResturantSuggestionSuccess(data, req, res);
        })
        .catch(function (error) {
          console.log('pick response faile', error);
          getResturantSuggestionFailure(error, req, res);
        });
      return false;
    }
  }

  function noResturantTryAnotherLocation(req, res) {
    var currentPick = res.session('pick'),
      output,
      reprompt;

    output = 'Oops. Something did not go as planned. We did not find any restaurant that serves '
      + currentPick.food
      + ' based on the location '
      + currentPick.location;

    output += ' Would you like to try another location?';
    reprompt = output;
    res.say(output);
    res.reprompt(reprompt);
    res.shouldEndSession(false);
    res.send();
  }

  function getResturantSuggestionSuccess(data, req, res) {
    var currentPick = res.session('pick'),
      numberOfResturants = data ? data.length : 0,
      output = 'Ok. ' ;

    if (numberOfResturants === 0) {
      noResturantTryAnotherLocation(req, res);
      return;
    }
    console.log(numberOfResturants);
    var rand = Math.floor(Math.random() * numberOfResturants);
    var fortuneCookieQuote = lunchHelper.getRandomFotuneCookieQuote();
    if (rand === numberOfResturants) {
      rand = numberOfResturants - 1;
    }
    console.log(rand, data[rand]);
    output +=  getResturantDetails(data[rand]);
    output += ' Today\'s your fortune cookie quote is ' + fortuneCookieQuote;
    output += ' OK! It was a pleasure serving you. Enjoy your lunch! Goodbye!';

    res.say(output);
    res.shouldEndSession(true);
    res.send();
  }

  function getResturantSuggestionFailure(error, req, res) {
    res.say('Sorry today\'s lunch service is a bit out of whack. Please check back with us later. Goodbye! ');
    res.shouldEndSession(true);
    res.send();
  }

  function getResturantDetails(resturant) {
    var template = _.template('Today\'s lucky restaurant is ${name},  ' +
      'It is located at ${address},  ' +
      'It has a customer rating of ${rating} and it\'s price level is ${priceLevel}. ');
    return template({
      name: resturant.name,
      address: resturant.address,
      rating: resturant.rating,
      priceLevel: resturant.priceType === 'Not specified'? ' not specified' : ' considered as ' + resturant.priceType
    });
  }

  function pickFood(req, res, foodPickedInSession) {
    var foodPicked = foodPickedInSession || lunchHelper.getRandomLunchChoice();
    var foodChoice = ' Today\'s food of choice for your lunch is ' + foodPicked + '. Would you like us to continue to pick a location for you?' +
      ' If you would like to pick something else, please say "Spin Again", otherwise, please say "Yes"';
    var output = getSpinnerSound() + foodChoice;

    res.session('pick', {
      type: pickType.getFood,
      food: foodPicked
    });

    res.say(output).reprompt(foodChoice).shouldEndSession(false);
  }

  function goodBye(req, res) {
    res.say('Cool. Have a good lunch! Goodbye!');
    res.shouldEndSession(true);
  }

  function handleHelpIntent(req, res) {
     handleRepeatIntent(req, res);
  }

  function handleLaunchRequest(req, res) {
    res.say(welcomeText).reprompt(getStartedText).shouldEndSession(false);
  }

  function getSpinnerSound() {
    return '<audio src="https://lunch-where.herokuapp.com/sounds/Spin-Sound.mp3" />';
  }

  return {
    yesIntent: yesIntent,
    noIntent: noIntent,
    helpIntent: helpIntent,
    zipIntent: zipCodeIntent,
    cityIntent: usCityIntent,
    repickIntent: repickIntent,
    repeatIntent: repeatIntent,
    cancelIntent: cancelIntent,
    stopIntent: stopIntent,
    startOverIntent: startOverIntent,
    handleLaunchRequest: handleLaunchRequest
  };
}

module.exports = IntentHandler;