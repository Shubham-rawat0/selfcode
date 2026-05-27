import "opentui-spinner/react";
import { useTheme } from "../providers/theme";

// type Props = {
//   mode?: ModeType;
// };

export function Spinner() {
  const { colors } = useTheme();
 
  return <spinner name="aesthetic" color={colors.primary} />;
};