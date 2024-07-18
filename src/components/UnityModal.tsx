import React from "react";
import ReactDOM from "react-dom";
import { Unity, useUnityContext } from "react-unity-webgl";
import LoadingGame from "./LoadingGame";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const Modal = styled.div`
  position: relative;
`;

const UnityGame = styled(Unity)`
  border-radius: 12px;
  width: 1000px;
  height: 500px;
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
`;

const CloseButton = styled.span`
  font-size: 2rem;
`;

interface ModalProps {
  isShowing: boolean;
  hide: () => void;
}

const UnityModal: React.FC<ModalProps> = ({ isShowing, hide }) => {
  const { unityProvider, loadingProgression, isLoaded } = useUnityContext({
    loaderUrl: "build/Build/Build.loader.js",
    dataUrl: "build/Build/Build.data",
    frameworkUrl: "build/Build/Build.framework.js",
    codeUrl: "build/Build/Build.wasm",
  });

  return isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <ModalOverlay />
          <ModalWrapper aria-modal aria-hidden tabIndex={-1} role="dialog">
            <Modal>
              <ModalCloseButton
                type="button"
                data-dismiss="modal"
                aria-label="Close"
                onClick={hide}
              >
                <CloseButton aria-hidden="true">&times;</CloseButton>
              </ModalCloseButton>
              {!isLoaded ? <LoadingGame progress={loadingProgression} /> : null}
              <UnityGame
                unityProvider={unityProvider}
                className="unity-game"
                style={{ display: isLoaded ? "block" : "none" }}
              />
            </Modal>
          </ModalWrapper>
        </React.Fragment>,
        document.body,
      )
    : null;
};

export default UnityModal;
