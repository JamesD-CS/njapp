export class Api_driver {
    protected static api_endpoint= 'http://localhost:9000/';

     static getItems(): Promise<Response> {
        const requestOptions = {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Accept':'*/*'
            }
          };
        return fetch(this.api_endpoint + 'items', requestOptions);
    }

} 
   
     
    

