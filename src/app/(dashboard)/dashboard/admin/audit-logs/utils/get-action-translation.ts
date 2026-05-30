export const getActionTranslation = (action: string) => {
  switch (action) {
    case "CREATE":
      return "Registró";
    case "UPDATE":
      return "Modificó";
    case "DELETE":
      return "Eliminó";
    default:
      return action;
  }
};
