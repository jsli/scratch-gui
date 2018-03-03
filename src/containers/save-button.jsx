import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import ButtonComponent from '../components/button/button.jsx';
import {ComingSoonTooltip} from '../components/coming-soon/coming-soon.jsx';
import {projectService} from '../project/actions/project_service_async';


class SaveButton extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleOnlineSaveClick',
            'handleOfflineSaveClick'
        ]);
    }
    handleOnlineSaveClick () {
        const json = this.props.saveProjectSb3();
        projectService.saveOnlineProject(json);
    }
    handleOfflineSaveClick () {
        const json = this.props.saveProjectSb3();
        projectService.saveOfflineProject(json);
    }
    render () {
        const {
            saveProjectSb3, // eslint-disable-line no-unused-vars
            ...props
        } = this.props;
        return (
            <ComingSoonTooltip
                place="bottom"
                tooltipId="save-button"
            >
                <ButtonComponent
                    onClick={this.handleOnlineSaveClick}
                    {...props}
                >
                    Save
                </ButtonComponent>
            </ComingSoonTooltip>
        );
    }
}

SaveButton.propTypes = {
    saveProjectSb3: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    saveProjectSb3: state.vm.saveProjectSb3.bind(state.vm)
});

export default connect(
    mapStateToProps,
    () => ({}) // omit dispatch prop
)(SaveButton);
