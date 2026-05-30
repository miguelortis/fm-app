"use client";

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
import { Rocket } from "lucide-react";

interface ModalProps {
  title: string;
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
  icon,
  size = "lg",
}: ModalProps) => {
  return (
    <ModalHUI
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      /* classNames={{
        backdrop: "bg-slate-900/40 backdrop-blur-sm",
        base: "border border-slate-100 shadow-2xl rounded-[2.5rem] bg-white text-slate-800 overflow-hidden max-h-[90vh]",
        header: "border-b border-slate-50 p-6 font-black text-xl tracking-tight flex items-center gap-2.5",
        body: "p-6 space-y-6 focus:outline-none",
        footer: "border-t border-slate-50 p-6 flex justify-end gap-3",
        closeButton: "top-5 right-5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-all"
      }} */
    >
      <ModalBackdrop className="bg-slate-900/40 backdrop-blur-sm">
        <ModalContainer size={size} scroll="inside">
          <ModalDialog className="border border-slate-100 shadow-2xl rounded-[2.5rem] bg-white text-slate-800 overflow-hidden max-h-[90vh]">
            <ModalCloseTrigger />
            <ModalHeader className="!items-start border-b border-slate-50 p-6 font-black text-xl tracking-tight flex items-center gap-2.5">
              <div className="flex gap-2 items-center">
                {icon && (
                  <div className="p-2 bg-[#006ae1]/10 text-[#006ae1] rounded-xl shrink-0 flex items-center justify-center">
                    {icon}
                  </div>
                )}
                <Rocket className="size-5" />
                <span className="truncate">{title}</span>
              </div>
            </ModalHeader>

            <ModalBody className="p-6 space-y-6 focus:outline-none">
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
