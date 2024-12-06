export default class Route {
  constructor({ path, component, initialState }) {
    this.path = path;
    this.initialState = initialState;
    this.component = component;
  }
}
