import { Slot } from "@radix-ui/react-slot";
import React from "react";

const Button = ({ asChild, className, ...props }: React.ComponentProps<"button"> & { asChild?: boolean }) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={`px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition ${className}`}
      {...props}
    />
  );
};

export default Button;