import { Fragment, PropsWithChildren } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { twMerge } from 'tailwind-merge';
import { ModalCloseButton } from './ModalCloseButton';

export interface ModalDialogProps {
    isOpen: boolean;
    onAskToClose?: () => void;
    className?: string;
    tw?: string;
}

export function ModalDialog(props: PropsWithChildren<ModalDialogProps>) {
    function closeModal() {
        if (typeof props.onAskToClose === 'function') {
            props.onAskToClose();
        }
    }
    return (
        <>
            <Transition appear show={props.isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className={
                            'fixed inset-0 bg-black bg-opacity-5 backdrop-blur-md'
                        } />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className={
                            'flex min-h-full justify-center'
                            + ' items-stretch md:items-center'
                        }>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className={twMerge(
                                    'w-full max-w-7xl transform overflow-hidden'
                                    + ' bg-white text-left align-middle'
                                    + ' md:rounded-md min-h-[4.625rem] '
                                    + ' md:shadow-xl transition-all relative'
                                    + ' flex flex-col items-stretch '
                                    , props.className
                                )}>
                                    {props.children}

                                    <ModalCloseButton
                                        onClick={closeModal}
                                    />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}


