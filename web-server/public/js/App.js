import MainPage from "./page/MainPage.js";
import Nav from "./component/Nav.js";
import Component from "./core/Component.js";
import Router from "./core/Router.js";
import Route from "./core/Route.js";

export default class App extends Component {
  constructor({ $target }) {
    super({ $target });
  }
  //NavPage는 항상 렌더되야한다
  renderChild() {
    new Nav({
      $target: this.$target,
    });

    this.$app = document.createElement("main");
    this.$app.id = "app";
    this.$target.appendChild(this.$app);

    const routing = () => {
      new Router(
        { $target: this.$app },
        new Route({
          path: "documents",
          component: MainPage,
          initialState: "",
        })
      );
    };

    routing();
  }
}
