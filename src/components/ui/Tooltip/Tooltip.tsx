import { Tooltip as TooltipHUI } from "@heroui/react";
import { ReactNode } from "react";

const Tooltip = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <TooltipHUI delay={0}>
      {children}
      <TooltipHUI.Content>
        <p>{title}</p>
      </TooltipHUI.Content>
    </TooltipHUI>
  );
};

export default Tooltip;
