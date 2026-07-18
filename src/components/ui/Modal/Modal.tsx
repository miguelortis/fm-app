"use client";

import { ReactNode } from "react";
import {
  Modal as ModalHUI,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContainer,
  ModalBackdrop,
  ModalDialog,
  ModalCloseTrigger,
} from "@heroui/react";

interface ModalProps {
  title: string | ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  icon?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "full" | "cover" | undefined;
}

const Modal = ({
  title,
  isOpen,
  onOpenChange,
  children,
  footer,
  size = "lg",
}: ModalProps) => {
  return (
    <ModalHUI isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalBackdrop className="bg-slate-900/40 backdrop-blur-sm">
        <ModalContainer size={size} scroll="inside">
          <ModalDialog className="border border-slate-100 shadow-2xl rounded-[1.5rem] bg-white text-slate-800 overflow-hidden max-h-[90vh]">
            <ModalCloseTrigger />
            <ModalHeader className="!items-start border-b border-slate-50 p-6 font-black text-xl tracking-tight flex items-center gap-2.5">
              <div className="flex gap-2 items-start w-full">
                <span className="block break-words whitespace-normal w-full">
                  {title}
                </span>
              </div>
            </ModalHeader>

            <ModalBody className="p-2 space-y-6 focus:outline-none">
              {children}
            </ModalBody>

            {footer && (
              <ModalFooter className="border-t border-slate-50 p-6 flex justify-end gap-3">
                {footer}
              </ModalFooter>
            )}
          </ModalDialog>
        </ModalContainer>
      </ModalBackdrop>
    </ModalHUI>
  );
};

export default Modal;
