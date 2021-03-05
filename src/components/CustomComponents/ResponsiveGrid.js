import React from "react";
import { connect } from 'react-redux';
import { WidthProvider, Responsive } from "react-grid-layout";
import { cloneDeep } from 'lodash';
import './ResponsiveGrid.css';
//import { connect } from 'react-redux';
// import 'react-grid-layout/css/styles.css';
// import 'react-resizable/css/styles.css';


const ResponsiveReactGridLayout = WidthProvider(Responsive);
const originalLayouts = getFromLS("layouts") || {};

function getFromLS(key) {
  let ls = {};
  if (localStorage) {
    try {
      ls = JSON.parse(localStorage.getItem(key)) || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key];
}

function saveToLS(key, value) {
  if (localStorage) {
    localStorage.setItem(key, JSON.stringify({ [key]: value }));
  }
}

class ResponsiveGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      layouts: JSON.parse(JSON.stringify(originalLayouts))
    };
  }

  componentDidMount = () => {
    const layout1 = []
    this.props.persona && this.props.persona.Items.map(item => layout1.push(cloneDeep(item.cards)))
  }

  componentDidUpdate = (prevProps) => {

    if (this.props.children !== prevProps.children) {
      const layout = this.props.children.map(item => item.props["data-grid"])
      let layouts = { lg: layout }
      this.onLayoutChange(layout, layouts)
    }

    // if(prevProps.gridItemList !== this.props.gridItemList){
    //   this.resetLayout()
    // }    

  }

  static get defaultProps() {
    return {
      className: "layout",
      cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
      //rowHeight: 30,
      autoSize: true
    };
  }

  resetLayout() {
    this.setState({ layouts: {} });
  }

  onLayoutChange(layout, layouts) {
    saveToLS("layouts", layouts);
    this.setState({ layouts });
  }

  render() {
    return (
      <div>
        {/* <button onClick={() => this.resetLayout()}>Reset Layout</button> */}
        <ResponsiveReactGridLayout
          className="layout"
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={this.props.height ? this.props.height : 200}
          autoSize={true}
          layouts={this.state.layouts}
          draggableCancel=".tabulator-col-content"
          onLayoutChange={(layout, layouts) =>
            this.onLayoutChange(layout, layouts)
          }
          useCSSTransforms={true}
          transformScale={1}
        >
        {this.props.children}
        </ResponsiveReactGridLayout>
      </div >
    );
  }
}

const mapStateToProps = (state) => {
  return ({
    login: state.login,
    users: state.users.users,
    persona: state.persona && state.persona.personaData
  })
}
export default connect(mapStateToProps)(ResponsiveGrid);