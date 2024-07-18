// import React from "react";
import "../App.css";
import useModal from "../hooks/useModal";
import UnityModal from "../components/UnityModal";

const Home = () => {
  const { isShowing, toggle } = useModal();

  // const test = async () => {
  //   const session = await flow.getSession();
  //   const user: User = jwtDecode(session.jwt ?? "");

  //   // Map the decoded JWT object to the User interface

  //   if (user) {
  //     setAuth(user);
  //     console.log(auth);
  //   }
  // };
  return (
    <div
      style={{
    
        width: "100%",
        height: "100vh",
        overflow: "hidden"
      }}
    >
      <div className="unity-container">
        <button className="show-modal" onClick={toggle}>
          <span className="play-game">PLAY GAME</span>
        </button>
        <UnityModal isShowing={isShowing} hide={toggle} />
      </div>
    </div>
  );
};

export default Home;
