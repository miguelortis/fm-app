import Modal from "@/components/ui/Modal/Modal";
import { Button } from "@heroui/react";
import { AlertOctagon } from "lucide-react";

interface IApplicationRejectedModal {
  open: boolean;
  onClose: (open: boolean) => void;
  refuseReason: string | undefined;
}

const ApplicationRejectedModal = ({
  open,
  onClose,
  refuseReason,
}: IApplicationRejectedModal) => {
  return (
    <Modal
      title="⚠️ Atención: Solicitud Rechazada por Auditoría"
      isOpen={open}
      onOpenChange={onClose}
      size="lg"
    >
      <div className="flex items-center gap-3 bg-rose-50 p-4 rounded-2xl border border-rose-100 text-rose-800">
        <AlertOctagon size={36} className="shrink-0 text-rose-600" />
        <div className="flex flex-col gap-0.5">
          <span className="font-black text-sm uppercase tracking-wide">
            Expediente Devuelto
          </span>
          <span className="text-xs text-rose-700/90 font-medium">
            El agente autorizado ha devuelto tu solicitud con la siguiente
            observación:
          </span>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 font-mono text-xs font-bold text-slate-700 whitespace-pre-wrap leading-relaxed">
        {refuseReason ||
          "Soportes ilegibles. Por favor vuelva a cargar el Acta de Nacimiento de su hijo menor de edad y verifique el número de cuenta nómina del Banco de Venezuela."}
      </div>

      <p className="text-slate-500 text-xs leading-normal">
        Por favor, revisa detalladamente las pestañas de tu formulario, realiza
        las correcciones pertinentes en los campos marcados y vuelve a enviar el
        expediente a revisión.
      </p>
      <div className="pt-2">
        <Button
          className="font-bold rounded-xl w-full bg-rose-600 text-white h-10"
          onClick={() => onClose(false)}
        >
          Entendido, Proceder a Corregir
        </Button>
      </div>
    </Modal>
  );
};

export default ApplicationRejectedModal;
