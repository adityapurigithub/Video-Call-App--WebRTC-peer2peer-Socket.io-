import { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

//simple peer is giving some err on importing ...
/*
change in vite config to solve the simple-peer global undefined err
 define: {
    global: {},
  },
*/

const API = import.meta.env.VITE_APP_API_URL;

const SocketContext = createContext(null);
const socket = io(`${API}`); //BE endpoint url

// eslint-disable-next-line react/prop-types
const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState("");
  const [call, setCall] = useState({});
  const [me, setMe] = useState("");

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  //we call a useEffect hook that asks for permission to use the camera and microphone.
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        setTimeout(() => (myVideo.current.srcObject = currentStream), 50);
        //*imp--here i wasted 1-2 hrs..getting err cant read the property of undefined
        //i have added setTimeout cause its not working immediately*
      });
    //Here, we set the current stream. Furthermore,
    // since we want to populate the video iframe with the src of our stream we introduce a myVideo ref.

    socket.on("me", (id) => {
      console.log(id);
      setMe(id);
    });
    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);

  /*
  We set a boolean state to check if the call has been accepted. 
  Next, we introduce WebRTC by initializing a Peer using the simple-peer package. 
  Peer has actions and handlers just like Socket IO. Once we receive a signal, 
  we execute the data as callback function. In the function,
   we emit the answer call event and pass in the signal data, 
   and who we are answering the call from. Next, we call the stream handler. 
   Here, we get the current stream and pass the ref for the userVideo(we will be creating this soon). 
  Finally, we create a connectionRef. This means our current connection is equal to the current peer.
  */
  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: call.from });
    });
    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });
    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  /*
  This is similar to the answerCall(). Notice that the initiator key here is set to true. 
  This is because we are the user initiating the call. 
  The signal handler here is emitting the callUser event and we pass in the following 
  { *userToCall*``: **``id, *signalData*``: **``data, *from*``: **``me, **``name}. 
  Finally, the callAccepted action which has signal passed as callback function enables the user to accept our call.
   */
  const callUser = (id) => {
    console.log(id);
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });
    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    connectionRef.current = peer;
  };

  // This function contains logic for leaving a call.
  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
export { ContextProvider, SocketContext };
