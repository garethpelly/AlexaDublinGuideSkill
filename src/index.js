var Alexa = require('alexa-sdk');
var http = require('http');

var states = {
    SEARCHMODE: '_SEARCHMODE',
    TOPFIVE: '_TOPFIVE',
};

var location = "Dublin";

var country = "Ireland";

var numberOfResults = 3;

var APIKey = process.env.API_KEY;

var welcomeMessage = location + " Guide. You can ask me for an attraction, the local news, or  say help. What will it be?";

var welcomeRepromt = "You can ask me for an attraction, the local news, or  say help. What will it be?";

var locationOverview = "Located on the east coast of Ireland at the mouth of the River Liffey, Dublin is the capital and largest city of the Republic of Ireland. The city has an urban area population of 1,173,179.";

var HelpMessage = "Here are some things you  can say: Give me an attraction. Tell me about " + location + ". Tell me the top five things to do. Tell me the local news.  What would you like to do?";

var moreInformation = "See your Alexa app for more information."

var tryAgainMessage = "please try again."

var noAttractionErrorMessage = "What attraction was that? " + tryAgainMessage;

var topFiveMoreInfo = "You can tell me a number for more information. For example, open number one.";

var getMoreInfoRepromtMessage = "What number attraction would you like to hear about?";

var getMoreInfoMessage = "OK, " + getMoreInfoRepromtMessage;

var goodbyeMessage = "OK, have a nice time in " + location + ".";

var newsIntroMessage = "These are the " + numberOfResults + " most recent " + location + " headlines, you can read more on your Alexa app. ";

var hearMoreMessage = "Would you like to hear about another top thing that you can do in " + location +"?";

var newline = "\n";

var startSpeak = "<p>";

var endSpeak = "</p>";

var output = "";

var alexa;

var attractions = [
    {
        name: "Trinity College",
        content: "located on College Green and covering 47 acres with most of the buildings constructed around traditional courtyards. Visitors come to marvel at the beautiful grounds and buildings and to see the Library of Trinity College which holds Ireland's most precious books including the Book of Kells.",
        location: "There are three entrances. \n Front Gate Entrance\n Nassau Street Entrance\n Lincoln Place Entrance\n Pearse Street Gate West Entrance",
        contact: "+353 (0)1 896 1000"
    },
    {
        name: "The Guinness Storehouse",
        content: "is located in the St. James's Gate Brewery; it is housed in a seven-storey historic building. The Guinness experience takes you through the company's history and role in Irish culture.",
        location: "St. James Gate, Dublin 8, Ireland",
        contact: "+353 (0)1 408 4800"
    },
    {
        name: "Dublin Castle",
        content: "was built on a site that had previously been settled by Vikings. It was constructed for King John of England from 1204 to 1230 to defend the city and the King's treasures.",
        location: "5 Ship Street Great, Dublin, Ireland",
        contact: "+353 (0)1 645 8813"
    },
    {
        name: "Temple Bar",
        content: "is an area is on the south bank of the River Liffey and bounded by Liffey street, Dame Street, Westmoreland Street and Fishamble Street. The Temple Bar area is considered the cultural quarter of the city.",
        location: "Temple Bar St. Dublin 2, Ireland",
        contact: ""
    },
    {
        name: "Kilmainham Gaol",
        content: " from the 1780s to 1920s was the site of several major events in Ireland's history. Many of the leaders of the Irish rebellion were held here and some were even executed by the English and later by the independent Irish nation.",
        location: "Inchicore Road, Kilmainham, Dublin 8, Ireland",
        contact: "+353 (0)1 453 5984"
    }
];

var topFive = [
    {
        number: "1",
        caption: "Have a Pint at The Guinness Storehouse",
        more: "The Guinness Storehouse is located in the St. James's Gate Brewery; it is housed in a seven-storey historic building. The Guinness experience takes you through the company's history and role in Irish culture.",
        location: "St. James Gate, Dublin 8, Ireland",
        contact: "+353 (0)1 408 4800"
    },
    {
        number: "2",
        caption: "See the Book of Kells at Trinity College",
        more: "Located on College Green and covering 47 acres with most of the buildings constructed around traditional courtyards. Visitors come to marvel at the beautiful grounds and buildings and to see the Library of Trinity College which holds Ireland's most precious books including the Book of Kells.",
        location: "There are three entrances. \n Front Gate Entrance\n Nassau Street Entrance\n Lincoln Place Entrance\n Pearse Street Gate West Entrance",
        contact: "+353 (0)1 896 1000"
    },
    {
        number: "3",
        caption: "Experience the Temple Bar culture",
        more: "The Temple Bar area is on the south bank of the River Liffey and bounded by Liffey street, Dame Street, Westmoreland Street and Fishamble Street. The Temple Bar area is considered the cultural quarter of the city.",
        location: "Temple Bar St. Dublin 2, Ireland",
        contact: ""
    },
    {
        number: "4",
        caption: "Dublin Castle",
        more: "Dublin Castle was built on a site that had previously been settled by Vikings. It was constructed for King John of England from 1204 to 1230 to defend the city and the King's treasures.",
        location: "5 Ship Street Great, Dublin, Ireland",
        contact: "+353 (0)1 645 8813"
    },
    {
        number: "5",
        caption: "Step across the Ha'penny Bridge",
        more: "Ha'Penny Bridge or Half Penny Bridge crosses Liffey Street Lower to Merchants Arch. The elliptical arched metal bridge originally had a wooden gangway when it was constructed in 1816.",
        location: "Ha'penny Bridge, Dublin, Ireland",
        contact: ""
    }
];

var topFiveIntro = "Here are the top five things to do in " + location + ".";

var newSessionHandlers = {
    'LaunchRequest': function () {
        this.handler.state = states.SEARCHMODE;
        output = welcomeMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
    'getOverview': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getOverview');
    },
    'getNewsIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getNewsIntent');
    },
    'getAttractionIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getAttractionIntent');
    },
    'getTopFiveIntent': function(){
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getTopFiveIntent');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    },
};

var startSearchHandlers = Alexa.CreateStateHandler(states.SEARCHMODE, {
    'getOverview': function () {
        output = locationOverview;
        this.emit(':tellWithCard', output, location, locationOverview);
    },
    'getAttractionIntent': function () {
        console.log('getAttractionIntent');
        var cardTitle = location;
        var cardContent = "";

        var attraction = attractions[Math.floor(Math.random() * attractions.length)];
        if (attraction) {
            output = startSpeak + attraction.name + " " + attraction.content + endSpeak + moreInformation;
            cardTitle = attraction.name;
            cardContent = attraction.content + newline + attraction.contact;

            this.emit(':tellWithCard', output, cardTitle, cardContent);
        } else {
            this.emit(':ask', noAttractionErrorMessage, tryAgainMessage);
        }
    },
    'getTopFiveIntent': function () {
        console.log('getTopFiveIntent');
        output  = startSpeak + topFiveIntro + endSpeak;
        cardOutput = topFiveIntro + newline;
        var cardTitle = "Top Five Things To See in " + location;

        for (var counter = topFive.length - 1; counter >= 0; counter--) {
            output += startSpeak + "Number " + topFive[counter].number + ": " + topFive[counter].caption + endSpeak;
            cardOutput += "Number " + topFive[counter].number + ": " + topFive[counter].caption + newline;
        }
        output += topFiveMoreInfo;
        this.handler.state = states.TOPFIVE;
        this.emit(':askWithCard', output, topFiveMoreInfo, cardTitle, cardOutput);
    },
    'AMAZON.YesIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.NoIntent': function () {
        output = HelpMessage;
        this.emit(':ask', HelpMessage, HelpMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },
    'getNewsIntent': function () {
        console.log('getNewsIntent');
        httpGet(location + "," + country, function (response) {

            // Parse the response into a JSON object ready to be formatted.
            var responseData = JSON.parse(response);
            var cardContent = "Data provided by New York Times\n\n";

            // Check if we have correct data, If not create an error speech out to try again.
            if (responseData == null) {
                output = "There was a problem with getting data please try again";
            }
            else {
                output = newsIntroMessage;

                // If we have data.
                for (var i = 0; i < responseData.response.docs.length; i++) {

                    if (i < numberOfResults) {
                        // Get the name and description JSON structure.
                        var headline = responseData.response.docs[i].headline.main;
                        var index = i + 1;

                        output += " Headline " + index + ": " + headline + ";";

                        cardContent += " Headline " + index + ".\n";
                        cardContent += headline + ".\n\n";
                    }
                }

                output += " See your Alexa app for more information.";
            }

            var cardTitle = location + " News";

            alexa.emit(':tellWithCard', output, cardTitle, cardContent);
        });
    },

    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit('AMAZON.StopIntent');
    },
    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

var topFiveHandlers = Alexa.CreateStateHandler(states.TOPFIVE, {
    'getAttractionIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getAttractionIntent');
    },
    'getOverview': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getOverview');
    },
    'getTopFiveIntent': function () {
        this.handler.state = states.SEARCHMODE;
        this.emitWithState('getTopFiveIntent');
    },
    'AMAZON.HelpIntent': function () {
        output = HelpMessage;
        this.emit(':ask', output, HelpMessage);
    },

    'getMoreInfoIntent': function () {
        var slotValue = 0;
        if(this.event.request.intent.slots.attraction ) {
            if (this.event.request.intent.slots.attraction.value) {
                slotValue = this.event.request.intent.slots.attraction.value;

            }
        }

        if (slotValue > 0 && slotValue <= topFive.length) {

            var index = parseInt(slotValue) - 1;
            var selectedAttraction = topFive[index];

            output = startSpeak + selectedAttraction.caption + ". " + selectedAttraction.more + endSpeak + hearMoreMessage;
            var cardTitle = selectedAttraction.name;
            var cardContent = selectedAttraction.caption + newline + newline + selectedAttraction.more + newline + newline + selectedAttraction.location + newline + newline + selectedAttraction.contact;

            this.emit(':askWithCard', output, hearMoreMessage, cardTitle, cardContent);
        } else {
            this.emit(':ask', noAttractionErrorMessage);
        }
    },

    'AMAZON.YesIntent': function () {
        output = getMoreInfoMessage;
        alexa.emit(':ask', output, getMoreInfoRepromtMessage);
    },
    'AMAZON.NoIntent': function () {
        output = goodbyeMessage;
        alexa.emit(':tell', output);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', output, HelpMessage);
    },
    'AMAZON.CancelIntent': function () {
        // Use this function to clear up and save any data needed between sessions
        this.emit(":tell", goodbyeMessage);
    },
    'SessionEndedRequest': function () {
        // Use this function to clear up and save any data needed between sessions
    },

    'Unhandled': function () {
        output = HelpMessage;
        this.emit(':ask', output, welcomeRepromt);
    }
});

exports.handler = function (event, context, callback) {
    alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandlers, startSearchHandlers, topFiveHandlers);
    alexa.execute();
};

// Create a web request and handle the response.
function httpGet(query, callback) {
    console.log("/n QUERY: "+query);

    var options = {
        //http://api.nytimes.com/svc/search/v2/articlesearch.json?q=seattle&sort=newest&api-key=
        host: 'api.nytimes.com',
        path: '/svc/search/v2/articlesearch.json?q=' + query + '&sort=newest&api-key=' + APIKey,
        method: 'GET'
    };

    var req = http.request(options, (res) => {

            var body = '';

    res.on('data', (d) => {
        body += d;
});

    res.on('end', function () {
        callback(body);
    });

});
    req.end();

    req.on('error', (e) => {
        console.error(e);
});
}

String.prototype.trunc =
    function (n) {
        return this.substr(0, n - 1) + (this.length > n ? '&hellip;' : '');
    };
