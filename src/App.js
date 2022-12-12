import './App.css';
import Main from './components/Views/Main';
import {BrowserRouter} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/saga-green/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import {io} from 'socket.io-client';
import {domain} from './components/Constant/APIConstant';
import { useEffect } from 'react';

const socket = io(domain,{
  extraHeaders: {
    'Access-Control-Allow-Origin':'*'
  }
});
global.socket=socket;
socket.on('connected',()=>{
  // console.log("connected: "+domain);
  let lSocketID = localStorage.getItem('socketID');
  (lSocketID) ? lSocketID = JSON.parse(lSocketID) : lSocketID=[];
  lSocketID.push(socket.id);
  localStorage.setItem('socketID',JSON.stringify(lSocketID));
  
});

function App() {
  
  useEffect(()=>{
    window.addEventListener('beforeunload',()=>{
      let lSocketID = localStorage.getItem('socketID');
      if(lSocketID){
        lSocketID = JSON.parse(lSocketID);
        lSocketID = lSocketID.filter(socketId => socketId !== socket.id);
        localStorage.setItem('socketID',JSON.stringify(lSocketID));
      }
      const user = localStorage.getItem('user');
      socket.emit('beforeDisconnect',user ? undefined :  JSON.parse(user));
      // if(user){
      //   user = JSON.parse(user);
        
      // }
    });
  },[]);
  return (
      <BrowserRouter>
        <Main/>
      </BrowserRouter>  
  );
}

export default App;
