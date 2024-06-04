import { Fragment, PropsWithChildren } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { twMerge } from 'tailwind-merge';

export interface SideModalProps {
    isOpen: boolean;
    onAskToClose?: () => void;
    className?: string;
}

export function SideModal(props: PropsWithChildren<SideModalProps>) {
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
                        enter="ease-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className={
                            'fixed inset-0 bg-black bg-opacity-5 backdrop-blur-md'
                        } />
                    </Transition.Child>

                    <div className={
                        'fixed inset-0 overflow-hidden'
                    }>
                        <div className={
                            'fixed right-0'
                        }>
                            <Transition.Child
                                as={Fragment}
                                enter='ease-out duration-500'
                                enterFrom='opacity-0 translate-x-full'
                                enterTo='opacity-100'
                                leave='ease-in duration-300'
                                leaveFrom='opacity-100 translate-x-0'
                                leaveTo='opacity-0 translate-x-full'
                            >
                                <Dialog.Panel className={twMerge(
                                    'w-screen h-screen max-w-lg transform'
                                    + ' bg-white text-left align-middle'
                                    + ' border-l border-solid'
                                    + ' border-black/10'
                                    + ' flex flex-col items-stretch'
                                    + ' transition-all relative'
                                    + ' overflow-auto scrollbar-thin'
                                    + ' scrollbar-thumb-slate-300'
                                    + ' scrollbar-track-slate-50'
                                    , props.className
                                )}>
                                    {props.children}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}