'use strict';

// Likert value for each item
let items = Array(9); 
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

const axios = require('axios');
const qs = require('qs');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  function likert2Int(likert)
  {
    if (likert == "Puntos_0") {
      return 0;
    } else if (likert == "Puntos_1") {
      return 1; 
    } else if (likert == "Puntos_2") {
      return 2; 
    } else if (likert == "Puntos_3") {
      return 3; 
    } else {
      return -1;
    }
  }
  
  function resp1Handler(agent) {
    // Spreadsheet Listener: 
 
    
    // Get response from the user (respuesta parameter)
    const resp = agent.parameters.respuesta; 
    
    console.log("Parametros respuesta: " + resp); 
    console.log("Respuesta del usuario (int): " + likert2Int(resp)); 
    
    // Transform into an integer value and store in the likert array
    items[0] = likert2Int(resp); 
    
    const data = [{P1: items[0], P2: "2"}];
    console.log(data);
    axios.post('XXXXXXXXXXXXX', 
               data);
    
  }

  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Respuesta1', resp1Handler);

  agent.handleRequest(intentMap);
});
