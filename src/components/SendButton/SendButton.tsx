import { PropsWithChildren } from "react";
import { useSendAptos } from "../../hooks/useSendAptos";
import { ButtonFaucet } from "../layout/CreateAccout/CreateAccount.styled";
import { useAlert } from "../../contexts/AlertProvider";
import CustomButton from "../buttons/CustomButton";

type SendButtonProps = {
  walletAddress: string;
  type: "devnet" | "testnet";
};

export const SendButton = (props: PropsWithChildren<SendButtonProps>) => {
  const { walletAddress, type } = props;
  console.log("Walet", walletAddress + " Type" + type);
  const { setAlert } = useAlert();

  const sendApt = useSendAptos(walletAddress, type);
  console.log("CHeck sendApt", sendApt);

  const onSubmit = async () => {
    await sendApt();
    setAlert("You get 1 aptos", "success");
  };

  return (
    <CustomButton onClick={onSubmit} disabled={!walletAddress} content="faucet" isMain={false}>
      {/* {props.children} */}
    </CustomButton>
  );
};
