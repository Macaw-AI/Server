# Server
firebase functions/storage

## Set-up
add .env file to root directory
```
npm install -g firebase-tools
firebase login
```

## Run emulator
```
firebase emulators:start
```

## Deploy
```
firebase deploy --only functions:<functionName>
```