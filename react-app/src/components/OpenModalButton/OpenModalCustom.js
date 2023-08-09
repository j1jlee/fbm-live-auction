import React from 'react';
import { useModal } from '../../context/Modal';

function OpenModalCustomText({
  modalComponent, // component to render inside the modal
  //buttonText, // text of the button that opens the modal

  customText,
  hoverTitle, //description on mouse hover
  customClass,

  onButtonClick, // optional: callback function that will be called once the button that opens the modal is clicked
  onModalClose // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    console.log("Open modal custom")

    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (onButtonClick) onButtonClick();
  };

  return (

    <>
    {/* <button onClick={onClick}>{buttonText}</button> */}

    <span title={hoverTitle}
          onClick={onClick}
          className={customClass}>
      {customText}
    </span>

    </>

  );
}

export default OpenModalCustomText;
