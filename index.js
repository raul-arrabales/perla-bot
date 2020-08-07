'use strict';
 
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

const axios = require('axios');
// const qs = require('qs');
// const fetch = require('node-fetch');
// const https = require('https');

// process.env.UV_THREADPOOL_SIZE = 120;
// process.env['UV_THREADPOOL_SIZE'] = 120;

// initialise DB connection

admin.initializeApp({
	credential: admin.credential.applicationDefault(),
    databaseURL: 'ws://XXXXXXXXXXXXX.com'
});

// Generate "unique" userID
// var rand = Math.random();
// var userID = rand.toString().split('.').join(""); 
// console.log("UserID1: " + userID); 
// userID = "pruebas";
// console.log("UserID2: " + userID);
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  
  // Transform entity respuesta into an interget
  // for PHQ9 score calculation
  function likert2Int(likert)
  {
    console.log("Likert: " + likert); 
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
    
    // Unique User ID
    let conv = agent.conv();
    let userId;
    
    if (userId in conv.user.storage) {
      userId = conv.user.storage.userId;
      console.log("UserId Found: " + userId);
    } else {      
      var rand = Math.random();
      userId = rand.toString().split('.').join("");       
      conv.user.storage.userId = userId;
      console.log("UserId Not Found. Created this: " + userId);
    }

    // Get Name
    var nombre = "SinNombre";
    const nombre1 = agent.parameters.person.name;
    const nombre2 = agent.parameter.name; 
    console.log("Nombre: " + nombre); 
    console.log("Nombre2: " + nombre2); 
    if ( nombre1 !== null ) {
      nombre = nombre1; 
    } else {
      nombre = nombre2; 
    }
    console.log("Nombre BD: " + nombre); 
    
    // Create DB entry for this uid
    return admin.database().ref('sessionData/' + userId).set({
      P1: 0, 
      P2: 0,
      P3: 0,
      P4: 0,
      P5: 0,
      P6: 0,
      P7: 0,
      P8: 0,
      P9: 0,
      PHQ9: 0,
      Name: nombre,
      Timestamp: new Date().toLocaleString(),
      Email: "no-email"
    });
    
  }
  
    // Anon user
  function noNombreHandler(agent) {

    // Unique User ID
    let conv = agent.conv();
    let userId;
    
    if (userId in conv.user.storage) {
      userId = conv.user.storage.userId;
      console.log("UserId Found: " + userId);
    } else {      
      var rand = Math.random();
      userId = rand.toString().split('.').join("");       
      conv.user.storage.userId = userId;
      console.log("UserId Not Found. Created this: " + userId);
    }
    const nombre = "SinNombre";
    
    return admin.database().ref('sessionData/' + userId).set({
      P1: 0, 
      P2: 0,
      P3: 0,
      P4: 0,
      P5: 0,
      P6: 0,
      P7: 0,
      P8: 0,
      P9: 0,
      PHQ9: 0,
      Name: nombre,
      Timestamp: new Date().toLocaleString(),
      Email: "no-email"
    });
    
  }
  
  function resp1Handler(agent) {
    // Get response from the user (respuesta parameter)
    const resp = agent.parameters.respuesta; 
    const respInt = likert2Int(resp);
    console.log("Parametros respuesta 1: " + resp); 
    console.log("Respuesta 1 del usuario (int): " + respInt); 
    
    // get id
    let conv = agent.conv();
    let userId = conv.user.storage.userId;
    console.log("Using UserId " + userId);
   
    return admin.database().ref('sessionData/' + userId).update({
      P1: respInt 
    }, function(error) {
      if (error) {
        // The write failed...
        console.log("P1 DB save failed: " + error);
      } else {
        // Data saved successfully!
        console.log("P1 saved to DB.");
      }
    });
  }

  function resp2Handler(agent) {
    // Get response from the user (respuesta parameter)
    const resp = agent.parameters.respuesta; 
    const respInt = likert2Int(resp);
    console.log("Parametros respuesta 2: " + resp); 
    console.log("Respuesta 2 del usuario (int): " + respInt); 
   
    // get id
    let conv = agent.conv();
    let userId = conv.user.storage.userId;
    console.log("Using UserId " + userId);
    
    return admin.database().ref('sessionData/' + userId).update({
      P2: respInt
    });
  }

  function resp3Handler(agent) {
    // Get response from the user (respuesta parameter)
    const resp = agent.parameters.respuesta; 
    const respInt = likert2Int(resp);
    console.log("Parametros respuesta 3: " + resp); 
    console.log("Respuesta 3 del usuario (int): " + respInt); 

    // get id
    let conv = agent.conv();
    let userId = conv.user.storage.userId;
    console.log("Using UserId " + userId);
    
    return admin.database().ref('sessionData/' + userId).update({
      P3: respInt
    });
  }

  function resp4Handler(agent) {
    // Get response from the user (respuesta parameter)
    const resp = agent.parameters.respuesta; 
    const respInt = likert2Int(resp);
    console.log("Parametros respuesta 4: " + resp); 
    console.log("Respuesta 4 del usuario (int): " + respInt); 
   
    // get id
    let conv = agent.conv();
    let userId = conv.user.storage.userId;
    console.log("Using UserId " + userId);
    
    return admin.database().ref('sessionData/' + userId).update({
      P4: respInt
    });
  }

  function resp5Handler(agent) {
    // Get response from the user (respuesta parameter)
    const resp = agent.parameters.respuesta; 
    const respInt = likert2Int(resp);
    console.log("Parametros respuesta 5: " + resp); 
    console.log("Respuesta 5 del usuario (int): " + respInt); 
   
    // get id
    let conv = agent.conv();
    let userId = conv.user.storage.userId;
    console.log("Using UserId " + userId);
    
    return admin.database().ref('sessionData/' + userId).update({
      P5: respInt
    });
  }

  function resp6Handler(agent) {
    // Get response from the user (respuesta parameter)
    const resp = agent.parameters.respuesta; 
    const respInt = likert2Int(resp);
    console.log("Parametros respuesta 6: " + resp); 
    console.log("Respuesta 6 del usuario (int): " + respInt); 
   
    // get id
    let conv = agent.conv();
    let userId = conv.user.storage.userId;
    console.log("Using UserId " + userId);
    
    return admin.database().ref('sessionData/' + userId).update({
      P6: respInt
    });
  }

  function resp7Handler(agent) {
    // Get response from the user (respuesta parameter)
    const resp = agent.parameters.respuesta; 
    const respInt = likert2Int(resp);
    console.log("Parametros respuesta 7: " + resp); 
    console.log("Respuesta 7 del usuario (int): " + respInt); 
   
    // get id
    let conv = agent.conv();
    let userId = conv.user.storage.userId;
    console.log("Using UserId " + userId);
    
    return admin.database().ref('sessionData/' + userId).update({
      P7: respInt
    });
  }

  function resp8Handler(agent) {
    // Get response from the user (respuesta parameter)
    const resp = agent.parameters.respuesta; 
    const respInt = likert2Int(resp);
    console.log("Parametros respuesta 8: " + resp); 
    console.log("Respuesta 8 del usuario (int): " + respInt); 
   
    // get id
    let conv = agent.conv();
    let userId = conv.user.storage.userId;
    console.log("Using UserId " + userId);
    
    return admin.database().ref('sessionData/' + userId).update({
      P8: respInt
    });
  }
  
  
  function resp9Handler(agent) {
    // Get response from the user (respuesta parameter)
    const resp = agent.parameters.respuesta; 
    const respInt = likert2Int(resp);
    console.log("Parametros respuesta 9: " + resp); 
    console.log("Respuesta 9 del usuario (int): " + respInt); 
   
    // get id
    let conv = agent.conv();
    let userId = conv.user.storage.userId;
    console.log("Using UserId " + userId);
    
    return admin.database().ref('sessionData/' + userId).update({
      P9: respInt
    });
  }
  
  function emailHandler(agent) {
    
    const email = agent.parameters.email; 
    console.log("Email: " + email); 
    
    const timestamp = new Date().toLocaleString();
    console.log("TS: " + timestamp);    
    
    // get id
    let conv = agent.conv();
    let userId = conv.user.storage.userId;
    console.log("Using UserId " + userId);
    
    return admin.database().ref('sessionData/' + userId).once('value', 
      function(data) {
        if ( data !== null)
        {
      	  console.log("Data read:" + data.toString());
          let nombre = data.child('Name').val(); 
          console.log("Name from DB:" + nombre);
          let p1 = data.child('P1').val();
          console.log("P1 from DB:" + p1);
          let p2 = data.child('P2').val();
          let p3 = data.child('P3').val();
          let p4 = data.child('P4').val();
          let p5 = data.child('P5').val();
          let p6 = data.child('P6').val();
          let p7 = data.child('P7').val();
          let p8 = data.child('P8').val();
          let p9 = data.child('P9').val();
          const score = p1+p2+p3+p4+p5+p6+p7+p8+p9;
          
          agent.add("Ya hemos terminado " + nombre +
                    ".");
    	  
          agent.add("Analizando tus respuestas estimo que tu PHQ-9 es de " +
                    score + " puntos. Te explico lo que significa:");      

          if ( score >= 10 ) {
        	agent.add("Existe cierto riesgo de que estés sufriendo un trastorno del ánimo.");      
        	agent.add("Es importante que te pongas en contacto con un profesional de la salud para realizar una evaluación más completa."); 
    	  } else {
        	agent.add("No existe un riesgo alto de que padezcas un trastorno del ánimo.");
        	agent.add("No obstante, si notas cualquier malestar ponte en contacto con un profesional de la salud.");      
    	  }

          agent.add("Te dejo un enlace con más información:"); 
          
          agent.add(new Card({
             title: 'Atención Psicológica Online',
		     buttonText: 'Atención Psicológica Online',
		     buttonUrl: 'https://www.psicobotica.com/atencion-psicologica-online/'
	      }));
           
           const logData = 
                 "Timestamp=" + timestamp.replace(/\s/g,'') + "&" +
                 "Name=" + nombre + "&" +
                 "Email=" + email + "&" +
                 "P1=" + p1 + "&" +
                 "P2=" + p2 + "&" +
                 "P3=" + p3 + "&" +
                 "P4=" + p4 + "&" +
                 "P5=" + p5 + "&" +
                 "P6=" + p6 + "&" +
                 "P7=" + p7 + "&" +
                 "P8=" + p8 + "&" +
                 "P9=" + p9 + "&" +
                 "PHQ9=" + score;
          
           const urlGet = "https://XXXXXXXXXXXX/exec?" + logData; 
                 
           // var dataStr = qs.stringify(logdata);
           console.log("UserID Final: " + userId);
           console.log("Sending to sheet: " + urlGet);
    
           // https.get(urlGet, (resp) => {
  		   //	  let data = '';
  			  // A chunk of data has been recieved.
           //   resp.on('data', (chunk) => {
           //      data += chunk;
           //   });

             // The whole response has been received. Print out the result.
           //  resp.on('end', () => {
                // console.log(JSON.parse(data).explanation);
           //    console.log("end sent");
           //  });

           // }).on("error", (err) => {
           //   console.log("Error: " + err.message);
           // });
          
           //fetch(urlGet)
           //  .then(function(response) {
           //  	return response.json();
           //  }).then(function(myJson) {
           //    console.log(myJson);
           // });
          
           axios.get(urlGet).then(resp => {
    		 console.log("Axios: " + resp.data);
		   });
          
           return admin.database().ref('sessionData/' + userId).update({
      		 Email: email,
             PHQ9: score,
      		 Timestamp: timestamp
    	   });  
        }
    });
                                                                 
  }
  
  let intentMap = new Map();
  
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
  intentMap.set('NoNombre', noNombreHandler);
  
  intentMap.set('Email', emailHandler);

  agent.handleRequest(intentMap);
});
