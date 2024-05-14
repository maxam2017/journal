"use client";

import { ComponentProps } from "react";

export default function BackLink(props: ComponentProps<"a">) {
  return (
    <a
      {...props}
      onClick={(event) => {
        if (window.history.state.idx > 0) {
          event.preventDefault();
          window.history.back();
        }
      }}
    />
  );
}
