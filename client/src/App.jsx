/* eslint-disable*/
import { useContext, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { SocketContext } from "./Context";
import {
  FaUser,
  FaUserAlt,
  FaUserAltSlash,
  FaUserCheck,
  FaUserFriends,
  FaVideoSlash,
} from "react-icons/fa";
/*
to solve the error *reading undefined of call**
check vite config file by adding nodePolyfills
 */

const Header = ({ me }) => (
  <div className="flex md:flex-row flex-col relative justify-center py-3 px-4 md:px-6  border-b-2 border-slate-600 rounded-lg mb-4 font-bold tracking-wider ">
    <>
      <span className="text-center text-2xl md:text-3xl">Vidzy</span>
      <div className="flex md:flex-row gap-1 flex-col md:items-center justify-center md:absolute right-4">
        <label className="text-xl text-slate-300 font-medium">
          <span className="text-slate-400 text-sm mx-2">Your User Id</span>
        </label>
        <input
          type="text"
          className="rounded-full bg-slate-700 md:p-2 p-1 text-slate-300 "
          value={me}
          disabled
        />
        <CopyToClipboard
          text={me}
          mt="20"
          onCopy={() => alert("user Id Copied")}
        >
          <button
            type="button"
            className="rounded-full bg-violet-700 hover:bg-violet-800  font-medium p-2"
          >
            Copy Id
          </button>
        </CopyToClipboard>
      </div>
    </>
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
  myVideoStarted,
  setMyVideoStarted,
}) => {
  console.log(myVideo);
  return (
    <div className="md:max-w-2xl w-full flex md:flex-row flex-col md:gap-6 gap-2 mx-auto ">
      {/* First user video */}
      <div className="vid-wrapper bg-slate-600 p-2 md:p-4 rounded-lg h-[150px] md:h-[250px] xl:h-[300px] w-full relative overflow-hidden">
        {!myVideoStarted && (
          <>
            <button
              className="start-video-btn rounded text-xl hover:bg-slate-500 px-2 absolute  "
              onClick={() => {
                name
                  ? setMyVideoStarted(true)
                  : alert("Please enter your name to start the video");
              }}
            >
              Start Camera
            </button>
            <FaVideoSlash size={30} color="red" />
          </>
        )}
        {stream ? (
          <>
            <h3 className="text-center capitalize">{name || "My name"}</h3>

            <video
              ref={myVideo}
              autoPlay
              className="rounded-lg w-full !h-[90%]"
            />
          </>
        ) : (
          <div className="my-user h-[40px] md:h-[100px]">
            <FaUserAltSlash size={"100%"} />
          </div>
        )}
      </div>
      {/* second user video */}
      <div className="bg-slate-600 p-2 md:p-4 rounded-lg h-[150px] md:h-[250px] xl:h-[300px] w-full relative">
        {callAccepted && !callEnded ? (
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
        ) : (
          <div className="other-user h-[40px] md:h-[100px]">
            <FaUser size={"100%"} />
          </div>
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
  <>
    <form className=" md:max-w-2xl w-full mx-auto flex gap-4 md:gap-6 flex-col my-2 md:my-4 xl:my-6 ">
      <div className="flex md:flex-row flex-col gap-2 md:gap-4">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xl text-slate-300 font-medium ">
            Account Info
            <span className="text-slate-400 text-sm mx-2">- Username</span>
          </label>
          <input
            className=" rounded-lg bg-slate-200 p-2 text-slate-700"
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 w-full">
          <label className="text-xl text-slate-300 font-medium ">
            Make Call
            <span className="text-slate-400 text-sm mx-2">
              - User Id to call
            </span>
          </label>
          <input
            className=" rounded-lg bg-slate-200 p-2 text-slate-700"
            type="text"
            placeholder="User Id"
            value={idToCall}
            onChange={(e) => setIdToCall(e.target.value)}
          />
        </div>
      </div>
      <button
        type="button"
        className="mt-1 rounded-lg bg-violet-700 hover:bg-violet-800 font-medium  p-2"
        onClick={() => {
          callAccepted && !callEnded ? leaveCall() : callUser(idToCall);
        }}
      >
        {callAccepted && !callEnded ? " End Call" : "Make Call"}
      </button>
    </form>
  </>
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
    myVideoStarted,
    setMyVideoStarted,
  } = useContext(SocketContext);

  const [idToCall, setIdToCall] = useState("");

  return (
    <div className="bg-slate-900 min-h-[100vh] text-white">
      <Header me={me} />
      <div className="container mx-auto flex flex-col py-3 px-4 md:px-6 gap-6">
        <Video
          stream={stream}
          name={name}
          myVideo={myVideo}
          userVideo={userVideo}
          call={call}
          callAccepted={callAccepted}
          callEnded={callEnded}
          myVideoStarted={myVideoStarted}
          setMyVideoStarted={setMyVideoStarted}
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
