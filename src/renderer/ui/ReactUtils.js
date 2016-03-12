var ReactUtils = {
    currentKey: 0,
    generateKey: function(){
        return this.currentKey ++;
    },
    multilinize: function(multilineString){
        return multilineString.split('\n').map(function(item) {
            return (
                <span key={this.generateKey()}>
                {item}
                <br/>
                </span>
            );
        }.bind(this));
    }
};

module.exports = ReactUtils;
