import { useState } from "react";
import LoginModal from "./LoginModal";
import Modal from "./Modal";

export default function WelcomeModal({
  showWelcomeModal,
  setShowWelcomeModal,
}: {
  showWelcomeModal: boolean;
  setShowWelcomeModal: (showWelcomeModal: boolean) => void;
}) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  return (
    <>
      <Modal show={showWelcomeModal} onClose={() => setShowWelcomeModal(false)}>
        <div
          style={{
            marginTop: 35,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            fontWeight: 300,
          }}
        >
          <div
            style={{
              fontSize: "1.35em",
              fontWeight: 300,
            }}
          >
            🎉 &nbsp;Welcome to the Compose Community 🎉
          </div>
          <div style={{ paddingTop: 20 }}>
            We're so excited you're here! A few things you should know:{" "}
          </div>
          <ol style={{ paddingTop: 20 }}>
            <li>
              This community chat app was{" "}
              <a href="https://github.com/compose-run/compose-community">
                made in Compose
              </a>
              !
            </li>
            <li style={{ paddingTop: 20 }}>
              Every message must have a tag. Tags are if channels in Slack or
              Discord met hashtags from Twitter.
              <div style={{ paddingLeft: 20 }}>
                <div style={{ paddingTop: 10 }}>
                  {/* TODO - render each tag name using the TagName() component, abstracted out from Header & Message  */}
                  #intro is to introduce yourself to the community
                </div>
                <div style={{ paddingTop: 10 }}>
                  #help is to post questions get help
                </div>
                <div style={{ paddingTop: 10 }}>
                  #demo is to get feedback on your Compose app
                </div>
                <div style={{ paddingTop: 10 }}>
                  ... based on what other #tags you use, we may add other
                  channels in the future!
                </div>
              </div>
            </li>
            <li style={{ paddingTop: 20 }}>
              This community is public. Questions in #help are treated like in
              Stack Overflow: resources for the next person with that same
              question.
            </li>
            <li style={{ paddingTop: 20 }}>
              We use infinitely-nested threads for deeply nuanced conversations
              (a la Hacker News or Reddit)
            </li>
          </ol>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: 25,
            }}
          >
            <button
              style={{
                paddingTop: 10,
                backgroundColor: "lightgray",
                padding: "10px 20px",
                borderRadius: 5,
                fontWeight: 300,
              }}
              onClick={() => setShowWelcomeModal(false)}
            >
              Maybe later
            </button>
            <button
              style={{
                paddingTop: 10,
                marginLeft: 20,
                backgroundColor: "lightgreen",
                padding: "10px 20px",
                borderRadius: 5,
                fontWeight: 300,
              }}
              onClick={() => {
                setShowLoginModal(true);
                setShowWelcomeModal(false);
              }}
            >
              Login or Sign Up
            </button>
          </div>
        </div>
      </Modal>
      {/* TODO - fix weird flicker on showing login modal: */}
      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        message="Login or Sign Up to the Compose Community"
      />
    </>
  );
}
