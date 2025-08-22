/// <reference types="vite/client" />

declare module "*.svg" {
  import React from "react";
  interface SVGProps extends React.SVGProps<SVGSVGElement> {
    title?: string;
  }
  const ReactComponent: React.ComponentType<SVGProps>;
  export default ReactComponent;
}