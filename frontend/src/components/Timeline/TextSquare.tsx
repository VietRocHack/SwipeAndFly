import { Box } from "@mui/material";
import { ReactNode } from "react";

interface TextSquareProps {
  size: string;
  fontSize: string;
  children: ReactNode;
}

export default function TextSquare({ size = "12px", fontSize = "12px", children }: TextSquareProps) {
  return (
    <Box
      sx={{
        display: "flex",
        height: size,
        width: size,
        fontSize: fontSize,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      {children}
    </Box>
  );
}
