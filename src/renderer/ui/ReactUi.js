import classnames from 'classnames';

var Ui = require('renderer/ui/components/Ui');

function ReactUi(){
    Utils.mixin(this, THREE.EventDispatcher);
    this.Ui = <Ui/>;
    this.render();
}

ReactUi.prototype.render = function(){
    ReactDOM.render(
        this.Ui,
        document.getElementById('react-content')
    );
};

ReactUi.prototype.changeMode = function(newMode, context){
    var additionalConfig = context || null;
    this.Ui = <Ui mode={newMode} context={context}/>;
    this.render();
};

module.exports = ReactUi;

//https://blog.risingstack.com/the-react-way-getting-started-tutorial/
//http://hugogiraudel.com/2015/06/18/styling-react-components-in-sass/
//http://sass-guidelin.es/#architecture
//https://css-tricks.com/the-debate-around-do-we-even-need-css-anymore/
