'use strict';

// Likert value for each item
let items = Array(9); 

let userName = ""; 
 
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
  
  var toType = function(obj) {
  	return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  }
  
  // Transform entity respuesta into an interget
  // for PHQ9 score calculation
  function likert2Int(likert)
  {
    console.log("Likert: " + likert); 
    console.log("Likert type: " + toType(likert)); 
    var likertR = likert.toString().substring(0,8);
    console.log("LikertR: " + likertR); 
    
    if (likertR == "Puntos_0") {
      return 0;
    } else if (likertR == "Puntos_1") {
      return 1; 
    } else if (likertR == "Puntos_2") {
      return 2; 
    } else if (likertR == "Puntos_3") {
      return 3; 
    } else {
      console.log("no match");      
      return -1;
    }
  }
  
  // Get user's name
  function nombreHandler(agent) {
    const nombre = agent.parameters.person.name;
    console.log("Nombre: " + nombre); 
    userName = nombre;
  }
  
  function resp1Handler(agent) {
    // Get response from the user (respuesta parameter)
    const resp = agent.parameters.respuesta; 
    console.log("Parametros respuesta 1: " + resp); 
    console.log("Respuesta 1 del usuario (int): " + likert2Int(resp)); 
    // Transform into an integer value and store in the likert array
    items[0] = likert2Int(resp);
  }

  function resp2Handler(agent) {
    // Get response from the user (respuesta parameter)
    const resp = agent.parameters.respuesta; 
    console.log("Parametros respuesta 1: " + resp); 
    console.log("Respuesta 1 del usuario (int): " + likert2Int(resp)); 
    // Transform into an integer value and store in the likert array
    items[1] = likert2Int(resp);
  }

  function resp3Handler(agent) {
    // Get response from the user (respuesta parameter)
    const resp = agent.parameters.respuesta; 
    console.log("Parametros respuesta 1: " + resp); 
    console.log("Respuesta 1 del usuario (int): " + likert2Int(resp)); 
    // Transform into an integer value and store in the likert array
    items[2] = likert2Int(resp);
  }

  function resp4Handler(agent) {
    // Get response from the user (respuesta parameter)
    const resp = agent.parameters.respuesta; 
    console.log("Parametros respuesta 1: " + resp); 
    console.log("Respuesta 1 del usuario (int): " + likert2Int(resp)); 
    // Transform into an integer value and store in the likert array
    items[3] = likert2Int(resp);
  }

  function resp5Handler(agent) {
    // Get response from the user (respuesta parameter)
    const resp = agent.parameters.respuesta; 
    console.log("Parametros respuesta 1: " + resp); 
    console.log("Respuesta 1 del usuario (int): " + likert2Int(resp)); 
    // Transform into an integer value and store in the likert array
    items[4] = likert2Int(resp);
  }

  function resp6Handler(agent) {
    // Get response from the user (respuesta parameter)
    const resp = agent.parameters.respuesta; 
    console.log("Parametros respuesta 1: " + resp); 
    console.log("Respuesta 1 del usuario (int): " + likert2Int(resp)); 
    // Transform into an integer value and store in the likert array
    items[5] = likert2Int(resp);
  }

  function resp7Handler(agent) {
    // Get response from the user (respuesta parameter)
    const resp = agent.parameters.respuesta; 
    console.log("Parametros respuesta 1: " + resp); 
    console.log("Respuesta 1 del usuario (int): " + likert2Int(resp)); 
    // Transform into an integer value and store in the likert array
    items[6] = likert2Int(resp);
  }

  function resp8Handler(agent) {
    // Get response from the user (respuesta parameter)
    const resp = agent.parameters.respuesta; 
    console.log("Parametros respuesta 1: " + resp); 
    console.log("Respuesta 1 del usuario (int): " + likert2Int(resp)); 
    // Transform into an integer value and store in the likert array
    items[7] = likert2Int(resp);
  }

  function resp9Handler(agent) {
    // Get response from the user (respuesta parameter)
    const resp = agent.parameters.respuesta; 
    console.log("Parametros respuesta 1: " + resp); 
    console.log("Respuesta 1 del usuario (int): " + likert2Int(resp)); 
    // Transform into an integer value and store in the likert array
    items[8] = likert2Int(resp);
  }

  function emailHandler(agent) {
    // Spreadsheet Listener: 
    // https://XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX 
   
    const email = agent.parameters.email; 
    
    const timestamp = new Date().toLocaleString();
    
    const score = items.reduce((a, b) => a + b, 0);
    
    // Build Json with data from this session
    const data = [
      {Timestamp: timestamp,
       Name: userName,
       Email: email,
       P1: items[0], 
       P2: items[1], 
       P3: items[2], 
       P4: items[3], 
       P5: items[4], 
       P6: items[5], 
       P7: items[6], 
       P8: items[7], 
       P9: items[8], 
       PHQ9: score
      }];
    
    console.log("Data to be sent: " + data);
    axios.post('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 
               data);

   	agent.add("Ya hemos terminado " + userName + ", muchas gracias por contestar a mis preguntas.");
    agent.add("Analizando tus respuestas estimo que tu PHQ-9 es de " + score + " puntos.");
    agent.add("Te explico mis conclusiones:");

    // Final message: 
    if ( score >= 10 ) {
        agent.add("Con la información que me has proporcionado he podido determinar que que existe cierto riesgo de que estés sufriendo un trastorno del ánimo.");      
        agent.add("Por lo tanto, es importante que te pongas en contacto con un profesional de la salud para realizar una evaluación más completa"); 
    } else {
        agent.add("Con la información que me has proporcionado he podido determinar que no existe un riesgo alto de que padezcas un trastorno del ánimo.");
        agent.add("No obstante, te recomiendo que si notas cualquier malestar te pongas en contacto con tu profesional de la salud");      
    }
    
    // agent.add("Por favor, no dudes en ponerte en contacto con Raúl (raul@psicobotica.com) si tienes cualquier duda o comentario sobre mis conclusiones");

    agent.add("Te dejo unos enlaces con más información"); 
    
    agent.add(new Card({
		buttonText: 'Proyectos de Ciencia Ciudadana',
		buttonUrl: 'https://www.psicobotica.com/labs/proyectos-de-ciencia-ciudadana/'
	}));

    agent.add(new Card({
		buttonText: 'Atención Psicológica Online',
		buttonUrl: 'https://www.psicobotica.com/atencion-psicologica-online/'
	}));
    
    
  }
  
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  
  intentMap.set('Respuesta1', resp1Handler);
  intentMap.set('Respuesta2', resp2Handler);
  intentMap.set('Respuesta3', resp3Handler);
  intentMap.set('Respuesta4', resp4Handler);
  intentMap.set('Respuesta5', resp5Handler);
  intentMap.set('Respuesta6', resp6Handler);
  intentMap.set('Respuesta7', resp7Handler);
  intentMap.set('Respuesta8', resp8Handler);
  intentMap.set('Respuesta9', resp9Handler);  
                
  intentMap.set('Nombre', nombreHandler);
  
  intentMap.set('Email', emailHandler);

  agent.handleRequest(intentMap);
});
