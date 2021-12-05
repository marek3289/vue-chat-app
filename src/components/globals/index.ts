import { App } from "@vue/runtime-core";

const requireComponent = import.meta.globEager(`./*.vue`)

const registerComponents = (app: App<Element>): void => {
  Object.entries(requireComponent).forEach(([path, definition]: any) => {
    const componentName = path
      .replace(/^\.\/_/, "")
      .replace(/\.\w+$/, "")
      .split("-")
      .map((kebab: string) => kebab.charAt(0).toUpperCase() + kebab.slice(1))
      .join("");
    
    app.component(componentName, definition.default || definition);
  }
)};

export default registerComponents;
