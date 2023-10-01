/* eslint-disable*/
import { useContext, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { SocketContext } from "./Context";

/*
to solve the error *reading undefined of call**
check vite config file by adding nodePolyfills
 */

const Header = () => (
  <div className=" py-3 px-4 md:px-6 text-center text-2xl md:text-3xl border-b-2 border-slate-600 rounded-lg mb-4 font-extrabold tracking-wider ">
    Vidzy
  </div>
);

const Video = ({
  stream,
  name,
  myVideo,
  userVideo,
  call,
  callAccepted,
  callEnded,
}) => {
  console.log(myVideo);
  return (
    <div className="md:max-w-2xl w-full flex md:flex-row flex-col md:gap-6 gap-2 mx-auto ">
      {/* First user video */}
      <div className="bg-slate-600 p-2 md:p-4 rounded-lg min-h-[180px] md:min-h-[250px] xl:min-h-[300px] w-full">
        {stream && (
          <>
            <h3 className="text-center capitalize">{name || "My name"}</h3>
            <video
              ref={myVideo}
              autoPlay
              className="rounded-lg w-full !h-[90%]"
            />
          </>
        )}
      </div>
      {/* second user video */}
      <div className="bg-slate-600 p-2 md:p-4 rounded-lg min-h-[180px] md:min-h-[250px] xl:min-h-[300px] w-full">
        {callAccepted && !callEnded && (
          <>
            <h3 className="text-center capitalize">
              {call?.name || "Other User-name"}
            </h3>
            <video
              ref={userVideo}
              autoPlay
              className="rounded-lg w-full !h-[90%]"
            />
          </>
        )}
      </div>
    </div>
  );
};

const CallingForm = ({
  name,
  setName,
  idToCall,
  setIdToCall,
  callAccepted,
  callEnded,
  callUser,
  leaveCall,
  me,
}) => (
  <form className=" md:max-w-2xl w-full mx-auto flex gap-4 md:gap-6 flex-col md:flex-row my-2 md:my-4 xl:my-6 ">
    <div className="flex flex-col gap-2 w-full">
      <label className="text-xl text-slate-300 font-medium ">
        Account Info
        <span className="text-slate-400 text-sm mx-2">- Username</span>
      </label>
      <input
        className=" rounded-lg bg-slate-200 p-2 text-slate-700"
        type="text"
        placeholder="Account Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <CopyToClipboard text={me} mt="20" onCopy={() => alert("user Id Copied")}>
        <button
          type="button"
          className="mt-1 rounded-lg bg-violet-700 hover:bg-violet-800  font-medium p-2"
        >
          Copy Id
        </button>
      </CopyToClipboard>
    </div>
    <div className="flex flex-col gap-2 w-full">
      <label className="text-xl text-slate-300 font-medium ">
        Make Call
        <span className="text-slate-400 text-sm mx-2">- User Id to call</span>
      </label>
      <input
        className=" rounded-lg bg-slate-200 p-2 text-slate-700"
        type="text"
        placeholder="User Id"
        value={idToCall}
        onChange={(e) => setIdToCall(e.target.value)}
      />
      <button
        type="button"
        className="mt-1 rounded-lg bg-violet-700 hover:bg-violet-800 font-medium  p-2"
        onClick={() => {
          callAccepted && !callEnded ? leaveCall() : callUser(idToCall);
        }}
      >
        {callAccepted && !callEnded ? " End Call" : "Make Call"}
      </button>
    </div>
  </form>
);

const Notification = ({ answerCall, call, callAccepted }) => (
  <>
    {call.isReceivingCall && !callAccepted && (
      <div className="z-1 top-14 flex justify-between p-1 px-3 gap-6 absolute left-[50%] -translate-x-[50%] bg-red-800 border border-white min-w-[350px] rounded-full">
        <span className="text-lg">{call.name || "####"} is calling</span>
        <button className="rounded hover:bg-zinc-500 px-2" onClick={answerCall}>
          Answer Call
        </button>
      </div>
    )}
  </>
);

const App = () => {
  const {
    name,
    callAccepted,
    myVideo,
    userVideo,
    callEnded,
    stream,
    call,
    callUser,
    setName,
    me,
    leaveCall,
    answerCall,
  } = useContext(SocketContext);

  const [idToCall, setIdToCall] = useState("");

  return (
    <div className="bg-slate-800 min-h-[100vh] text-white">
      <Header />
      <div className="container mx-auto flex flex-col py-3 px-4 md:px-6 gap-6">
        <Video
          stream={stream}
          name={name}
          myVideo={myVideo}
          userVideo={userVideo}
          call={call}
          callAccepted={callAccepted}
          callEnded={callEnded}
        />
        <CallingForm
          name={name}
          setName={setName}
          idToCall={idToCall}
          setIdToCall={setIdToCall}
          callAccepted={callAccepted}
          callEnded={callEnded}
          me={me}
          callUser={callUser}
          leaveCall={leaveCall}
        />
        <Notification
          answerCall={answerCall}
          call={call}
          callAccepted={callAccepted}
        />
      </div>
    </div>
  );
};

export default App;
