import { useState } from 'react';

const useModal = () => {
    const [isShowing, setIsShowing] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    function toggle(content = null) {
        setIsShowing(!isShowing);
        setModalContent(content);
    }

    return {
        isShowing,
        toggle,
        modalContent
    };
};

export default useModal;
