import { PropsWithChildren } from "react";
import { useSendAptos } from "../../hooks/useSendAptos";
import { ButtonFaucet } from "../layout/UpdateAccout/UpdateAccount.styled";
import { useAlert } from "../../contexts/AlertProvider";

type SendButtonProps = {
  walletAddress: string;
  type: "devnet" | "testnet";
};

export const SendButton = (props: PropsWithChildren<SendButtonProps>) => {
  const { walletAddress, type } = props;
  console.log(
    "Walet", walletAddress + " Type" + type
  );
  const {setAlert} = useAlert()

  const sendApt = useSendAptos(walletAddress, type);
  console.log("CHeck sendApt", sendApt);

  const onSubmit = async () => {
    await sendApt();
    setAlert("You get 1 aptos","success")
  };

  return (
    <ButtonFaucet
      onClick={onSubmit}
      disabled={!walletAddress}
    >
      {props.children}
    </ButtonFaucet>
  );
};
