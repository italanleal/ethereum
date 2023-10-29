const Wallet = require('ethereumjs-wallet')
const { Web3 } = require('web3')
const { google } = require('googleapis')
const {
    randomBytes,
  } = require('node:crypto')

const auth = Auth()
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

async function checkBalance(walletAddress) {
    try {
        const balance = await web3.eth.getBalance(walletAddress)
        return balance
    } catch (error) {
        console.error('Error:', error)
    }
}

function Auth(){
    const auth = new google.auth.GoogleAuth({
        keyFile: './credentials.json',
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    })

    return auth
}

async function GoogleSheets(auth){
    const client = await auth.getClient()
    const Sheets = google.sheets({
        version: "v4", 
        auth: client
    })
    return Sheets
}

async function PackWallet(wallet){
    
    const Sheets = await GoogleSheets(auth)

    await Sheets.spreadsheets.values.append({
        auth,
        spreadsheetId: '1SLn4IQHKlONH-PHwuYk57qsNJ9pJed4OfvnyVTHn-p0',
        range: 'Sheet1',
        valueInputOption: "RAW",
        resource: {
            values: [
                
                    wallet,
                
            ]
        }
    })
}

async function Purge(){
    let i = 0
    const start = new Date()
    console.log(start.toLocaleTimeString('pt-BR', { 
                timeZone: 'America/Sao_Paulo', 
                timeStyle: 'medium' }
                ))
    
    while(i < 100000){
        i++
        const private_key = randomBytes(32)
        const balance = await checkBalance(Wallet.default.fromPrivateKey(private_key).getAddressString())
        if(balance > 0) PackWallet([private_key, balance])
    }

    const end = new Date()
    
    console.log(end.toLocaleTimeString('pt-BR', { 
                timeZone: 'America/Sao_Paulo', 
                timeStyle: 'medium' }
                ))
}
Purge()
