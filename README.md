# ppv-admin

## Development instructions

### Start local ppv-api

Follow the instructions inside the project: https://github.com/cavalodeaco/ppv-api/tree/main/node-js

### Environment variables

Create a .env file with the following:

```shell
REACT_APP_BACKEND_ADDRESS=http://localhost:3001
```

Change the backend address according to the port selected on localhost.

### Start application

To register the PWA during development, create a production build and serve it, using the following command:

```
npm run build && serve -s build     
```

