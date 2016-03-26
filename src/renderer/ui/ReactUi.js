import classnames from 'classnames';

var InitialView = require('renderer/ui/component/InitialView');

function ReactUi(){
    Utils.mixin(this, THREE.EventDispatcher);
    this.InitialView = <InitialView/>;
    this.render();
}

ReactUi.prototype.render = function(){
    ReactDOM.render(
        this.InitialView,
        document.getElementById('react-content')
    );
};

ReactUi.prototype.changeMode = function(newMode, context){
    var additionalConfig = context || null;
    this.InitialView = <InitialView mode={newMode} context={context}/>;
    this.render();
};

module.exports = ReactUi;

//https://blog.risingstack.com/the-react-way-getting-started-tutorial/
//http://hugogiraudel.com/2015/06/18/styling-react-component-in-sass/
//http://sass-guidelin.es/#architecture
//https://css-tricks.com/the-debate-around-do-we-even-need-css-anymore/
