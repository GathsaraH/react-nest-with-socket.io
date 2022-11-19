import { useContext, useEffect, useState } from 'react';
import { WebsocketContext } from '../contexts/WebsocketContext';


export const Websocket = () => {
  const [acceptUser, setAcceptUser] = useState('');
  const [rejectUser, setRejectUser] = useState('');
  const [user, setUser] = useState<any[]>([]);
  const socket = useContext(WebsocketContext);

  useEffect(() => {
    //Check the socket connection with the back-end
    socket.on('connect', () => {
      console.log('Connected!');
    });
    // Listing onAcceptWaitingUsers event
    socket.on('onAcceptWaitingUsers', (newMessage: any) => {
      console.log('onAcceptWaitingUsers event received!');
      // console.log('onAcceptWaitingUsers!',newMessage);
      setUser((prev) => [...prev, newMessage?.content.waitingUsers.waitingUserList]);
    });
    // Listing onUserAcceptClientHandler event
    socket.on('onUserAcceptClientHandler', (newMessage: any) => {
      console.log('onUserAcceptClientHandler event received!');
      console.log('onUserAcceptClientHandler!',newMessage);

    });
    // Listing onUserAcceptClientHandler event
    socket.on('onUserRejectClientHandler', (newMessage: any) => {
      console.log('onUserRejectClientHandler event received!');
      console.log('onUserRejectClientHandler!',newMessage);

    });
    // Listing onRejectWaitingUsers event
    socket.on('onRejectWaitingUsers', (newMessage: any) => {
      // console.log('onRejectWaitingUsers event received!');
      setUser((prev) => [...prev, newMessage?.content.waitingUserList]);
    });
   //Emit onGetAllWaitingUserByRoom event
    socket.emit('onGetAllWaitingUserByRoom','WaitingRoom-f74qy-l4hw7-q8qus');
    // Listing onGetAllWaitingUserByRoom event
    socket.on('onGetAllWaitingUserByRoom', (getAllMessage: any) => {
      console.log('onGetAllWaitingUserByRoom event received!');
      //console.log(getAllMessage);
      setUser((prev) => [...prev, getAllMessage?.content.waitingUserList]);
    });
    //Off event
    return () => {
      console.log('Unregistering Events...');
      socket.off('connect');
      socket.off('onMessage');
    };
  }, []);

  //Accept User OBJ
  const acceptObj = {
    userName:acceptUser,
    roomName:'WaitingRoom-f74qy-l4hw7-q8qus'
  }
  //Reject User OBJ
  const rejectObj = {
    userName:rejectUser,
    roomName:'WaitingRoom-f74qy-l4hw7-q8qus'
  }

  //Reject User OBJ
  const statusObj = {
    userName:rejectUser,
    roomName:'WaitingRoom-f74qy-l4hw7-q8qus'
  }

  //Accept event handler
  const acceptHandler = () => {
   const emit =  socket.emit('onAcceptWaitingUsers', acceptObj)
    // setAcceptUser('');
  };

  //Reject event handler
  const rejectHandler = () => {
    socket.emit('onRejectWaitingUsers', rejectObj);
    // setRejectUser('');
  };


  return (
    <div>
      <div>
        <h1>Demo SLT Lynked Waiting Room</h1>
        <div>
          {user.length === 0 ? (
            <h3>No User In Waiting Room</h3>
          ) : (
            <div>
              {user.map((msg) => (
                  // @ts-ignore
                <div>
                  {console.log(msg)}
                  <p>{msg}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <div>Accept User</div>
          <input
            type="text"
            value={acceptUser}
            onChange={(e) => setAcceptUser(e.target.value)}
          />
          <button onClick={acceptHandler}>Submit</button>
        </div>
        <div>
          <div>Reject User</div>
          <input
              type="text"
              value={rejectUser}
              onChange={(e) => setRejectUser(e.target.value)}
          />
          <button onClick={rejectHandler}>Submit</button>
        </div>
      </div>
    </div>
  );
};
