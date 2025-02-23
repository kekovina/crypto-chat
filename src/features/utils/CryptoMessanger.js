const crypto = require('crypto');

class CryptoMessanger{
    constructor(algorithm = 'aes-128-cbc'){
        this.keySize = 128
        this.algorithm = algorithm
        this.key = null
        this.iv = 'a2xhcgAAAAAAAAAA'
        this.Alice = null
        this.Bob = null
    }
    generateAsAlice(){
        const alice = crypto.createDiffieHellman(this.keySize);
        this.Alice = alice
        return {
            prime: alice.getPrime(),
            generator: alice.getGenerator(),
            key: alice.generateKeys()
        }
        
    }
    generateAsBob(alice){
        if(!alice){
            throw new Error('Alice data is required')
        }
        const bob = crypto.createDiffieHellman(alice.prime, alice.generator);
        this.Bob = bob
        const bobKey = bob.generateKeys();
        return {
            key: bobKey
        }
        
       
    }
    setKey(key){
        if(!this.Alice && !this.Bob){
            throw new Error('You must generate keys first')
        }
        if(!key){
            throw new Error('Key is required')
        }
        key = new Uint8Array(key)
        if(this.Alice){
            this.key = this.Alice.computeSecret(key);
        }
        if(this.Bob){
            this.key = this.Bob.computeSecret(key);
        }
    }
    getKey(){
        return this.key
    }
    encrypt(text){
        if (text === null || typeof text === 'undefined' || text === '') {
            return text
          }
        var cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv)
        return Buffer.concat([
          cipher.update(text),
          cipher.final()
        ]).toString('base64')
    }
    decrypt(text){
        if (text === null || typeof text === 'undefined' || text === '') {
            return text
          }
          var decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv)
          return Buffer.concat([
            decipher.update(text, 'base64'), 
            decipher.final()
          ]).toString()
    }
}

export default CryptoMessanger