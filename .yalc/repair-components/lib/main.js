import * as components from '../src/components';
import * as defaultIcons from '../src/assets/icons';

const ComponentLibrary = {
  install(Vue, options = { prefix: '', icons: {} }) {
    const { icons } = options;

    for (const componentName in components) {
      const component = components[componentName];

      Vue.component(component.name, component);
    }

    Vue.prototype.$icons = {
      ...defaultIcons,
      ...icons,
    };

    // Vue.config.globalProperties.$prefix = function (classes) {
    //   if (!prefix) {
    //     return classes;
    //   }

    //   return `${prefix}${classes.split(' ').join(` ${prefix}`)}`;
    // };
  },
};

export * from '../src/components';

export { default as tailwindConfig } from '../tailwind.config';
export * as icons from '../src/assets/icons';

export default ComponentLibrary;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(ComponentLibrary);
}
