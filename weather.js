const http = require('http');
const api = require('./api.json');

//Print out temp details
function printWeather(weather){
  const message = `Current temperature in ${weather.sys.country} is ${parseInt(weather.main.temp- 273.14)} C`;
  console.log(message);
}
//Print out error message
function printError( error ){
  console.error(error.message);
}

function get(query) {

  try{
  const request =
  http.get(`http://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${api.key}`,
    (response) => {
        if(response.statusCode === 200 ){
        let incomingData = "";
        response.on('data', (chunk) => {
          incomingData += chunk.toString();
        });

        response.on('end', () =>{

          try {
            //Parse data
            //Print the data
            const parsedData = JSON.parse(incomingData);
            if( parsedData.sys.country){
              printWeather(parsedData);
            } else {
              console.log(`There was an error getting the message for ${query}.`);
            }
          } catch(e) {
            printError(e);
          }

        });
      }//End-if checks status code
      else {
        //Status Code error
        const StatusCodeError = new Error(`There was an error getting the message for ${query}. (${http.STATUS_CODES[response.statusCode]})`);
        printError(StatusCodeError);
      }
    });

    request.on('error', (err) => {
      printError(err);
    });
  } catch (error) {
    //Malformed URL Error
    printError(error);
  }
}

module.exports.get = get;
//TODO: Handle any errors
