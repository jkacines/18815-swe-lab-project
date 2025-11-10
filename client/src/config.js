// API Configuration
// In production (Heroku), use relative URLs since frontend and backend are on same domain
// In development, use the Heroku backend URL
const API_URL = process.env.NODE_ENV === 'production' 
  ? '' // relative URLs in production
  : 'http://localhost:8001';
  //'https://backendserver1-ab6b6912c013.herokuapp.com';

export default API_URL;
