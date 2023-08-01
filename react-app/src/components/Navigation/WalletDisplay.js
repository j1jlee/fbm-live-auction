


import React from 'react';
import { centsToDollars } from '../aaaMiddleware';
import AddToWalletModal from '../AddToWalletModal';
import { useModal } from '../../context/Modal';
import OpenModalCustomText from '../OpenModalButton/OpenModalCustom';

import OpenModalButton from '../OpenModalButton';

import './Navigation.css'

function WalletDisplay({user}) {

    const { setModalContent, setOnModalClose } = useModal();

    return (
        <>
        <OpenModalCustomText
            customText="Add Funds to Wallet"
            hoverTitle="Add Funds"
            modalComponent={<AddToWalletModal />} />

        &emsp;

        <span className="wallet-display-money">
            <span className="material-symbols-outlined wallet-display-icon">attach_money</span>
            <span className="wallet-display-cash">
                {user && centsToDollars(user.cashCents)}
            </span>
        </span>
        </>
    )
}

export default WalletDisplay;