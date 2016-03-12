import classnames from 'classnames';

var StyledText = require('renderer/ui/components/base/StyledText');
var Button = require('renderer/ui/components/base/Button');

class StartScreen extends React.Component {
    render() {
        return <div className={classnames('class', ['centerHorizontal', 'centerVertical'])}>
            <StyledText style={'titleText'}>
                <span>{'WINGMOD'}</span>
                <span style={{color: 'red'}}>{'2'}</span>
            </StyledText>
            <Button text={'START'}/>
        </div>;
    }
}

module.exports = StartScreen;
