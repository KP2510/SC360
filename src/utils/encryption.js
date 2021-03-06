const CryptoJS = require("crypto-js");

// Code goes here
var keySize = 256; //to be used in encryption
//var ivSize = 128; //to be used in encryption
var iterations = 100; //to be used in encryption

//const credentials = { EMAIL: "konarkjha@gmail.com", PASSWORD: "123456" };
//var password = "the is the pa$$word123brillio22";
//console.log("password length",password.length)

function createtransitmessage(randomchoice, salt, iv, pass, cipher) {
  //This function will arrange salt , pass and iv in some specific order in the payload on the basis of random number provided
  let transitmessage;

  switch (randomchoice) {
    case 1:
      transitmessage =
        randomchoice +
        salt.toString() +
        iv.toString() +
        pass +
        cipher.toString();
      break;
    case 2:
      transitmessage =
        randomchoice +
        iv.toString() +
        salt.toString() +
        pass +
        cipher.toString();
      break;
    case 3:
      transitmessage =
        randomchoice +
        pass +
        iv.toString() +
        salt.toString() +
        cipher.toString();
      break;
    case 4:
      transitmessage =
        randomchoice +
        salt.toString() +
        pass +
        iv.toString() +
        cipher.toString();
      break;
    default: return;
  }
  return transitmessage;
}

function createtransitmessageserver(randomchoice, transitmessage) {
  //This function will find out the correct combination of salt , pass and iv from the payload using the input provided from user
  let transitmessageserver = {};
  var salt;
  let iv;
  let pass;
  let cipher;
  switch (randomchoice) {
    case 1:
      salt = transitmessage.substr(1, 32);
      iv = transitmessage.substr(33, 32);
      pass = transitmessage.substr(65, 32);
      cipher = transitmessage.substring(97);
      break;

    case 2:
      iv = transitmessage.substr(1, 32);
      salt = transitmessage.substr(33, 32);
      pass = transitmessage.substr(65, 32);
      cipher = transitmessage.substring(97);
      break;

    case 3:
      pass = transitmessage.substr(1, 32);
      iv = transitmessage.substr(33, 32);
      salt = transitmessage.substr(65, 32);
      cipher = transitmessage.substring(97);
      break;
    case 4:
      salt = transitmessage.substr(1, 32);
      pass = transitmessage.substr(33, 32);
      iv = transitmessage.substr(65, 32);
      cipher = transitmessage.substring(97);
      break;
    default: return;
  }

  transitmessageserver.salt = salt;
  transitmessageserver.pass = pass;
  transitmessageserver.iv = iv;
  transitmessageserver.cipher = cipher;
  return transitmessageserver;
}

export function encrypt(msg) {
  var salt = CryptoJS.lib.WordArray.random(128 / 8); //Will be used for Key generation
  var pass = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex); //Will be used for Key generation
  //console.log(pass)
  //console.log(pass.length)
  //Key generation step. This key will be used in AES Encryption.Key is getting generated using CryptoJS PBKDF2 function and requires salt and pass.
  var key = CryptoJS.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations: iterations
  });

  var iv = CryptoJS.lib.WordArray.random(128 / 8);
  //Encryption step.Generating cipher from password , PBKDF2 generated key and iv.
  var cipher = CryptoJS.AES.encrypt(msg, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });

  // salt, iv will be hex 32 in length
  // append them to the ciphertext for use  in decryption
  //This random number will be passed to createtransitmessage function in order to find the payload combination
  const randomChoice = randomNumber(1, 4);

  //This step will give us the final payload with a specific combination
  let transitmessage = createtransitmessage(
    randomChoice,
    salt,
    iv,
    pass,
    cipher
  );
  return transitmessage;
}
function randomNumber(min, max) {
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function decrypt(transitmessage) {
  //Here we are taking out the random number which was generated by client and on basis of the we can find out payload data order.
  let randomChoice = Number(transitmessage.substr(0, 1));
  //createtransitmessageserver function will find out the correct combination of salt,pass and iv and will give all the information from the payload
  let transitmessageserver = createtransitmessageserver(
    randomChoice,
    transitmessage
  );
  var salt = CryptoJS.enc.Hex.parse(transitmessageserver.salt);
  var iv = CryptoJS.enc.Hex.parse(transitmessageserver.iv);
  var pass = transitmessageserver.pass;
  // console.log("salt", salt);
  // console.log("IVid", iv);
  // console.log("pass", pass);

  //console.log(pass)
  var cipher = transitmessageserver.cipher;
  //Here we will generate PBKDF2 Key using salt and pass which we will use for decryption of cipher
  var key = CryptoJS.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations: iterations
  });
  //Here we will decrypt the cipher using PBKDF2 key generated and will get the encrypted input.
  var decrypted = CryptoJS.AES.decrypt(cipher, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
  });
  return decrypted;
}

//var encryptedUserName = encrypt(credentials.EMAIL);
//var encryptedPassword = encrypt(credentials.PASSWORD);

//var decryptedUserName = decrypt(encryptedUserName);
//var decryptedPassword = decrypt(encryptedPassword);
// console.log({
//   encryptedUserName: encryptedUserName,
//   encryptedPassword: encryptedPassword
// });

// console.log(
//   "decryptedUserName",
//   decryptedUserName.toString(CryptoJS.enc.Utf8),
//   "decryptedPassword",
//   decryptedPassword.toString(CryptoJS.enc.Utf8)
// );

//console.log(encrypted.length)
// console.log("Decrypted: " + decrypted.toString(CryptoJS.enc.Utf8));