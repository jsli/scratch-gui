import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import log from '../lib/log.js';

import Menu, {MenuItem} from 'material-ui/Menu';
import Button from 'material-ui/Button';
import {projectService} from './actions/project_service_async.js';
import VM from 'scratch-vm';
import {desktopCapturer} from 'electron';

import MediaStreamRecorder from 'msr';

class RecordMenu extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClick',
            'handleClose',
            'openMenu',
            'closeMenu',
            'handleStartClick',
            'handleStopClick'
        ]);

        this.state = {
            anchorEl: null,
            openMenu: false
        };

        this.mediaStreamRecorder = null;
    }

    openMenu (anchorEl) {
        this.setState({anchorEl: anchorEl, openMenu: true});
    }

    closeMenu () {
        this.setState({anchorEl: null, openMenu: false});
    }

    handleClick (event) {
        this.openMenu(event.currentTarget);
    }

    handleClose () {
        this.closeMenu();
    }

    handleStartClick () {
        this.closeMenu();

        desktopCapturer.getSources({types: ['window']}, (error, sources) => {
            if (error) {
                throw error;
            }

            for (let i = 0; i < sources.length; ++i) {
                if (sources[i].name === 'Scratch 3.0 GUI') {
                    navigator.mediaDevices.getUserMedia({
                        audio: false,
                        video: {
                            mandatory: {
                                chromeMediaSource: 'desktop',
                                chromeMediaSourceId: sources[i].id,
                                minWidth: 1920,
                                maxWidth: 1920,
                                minHeight: 1080,
                                maxHeight: 1080
                            }
                        }
                    })
                        .then(stream => {
                            this.mediaStreamRecorder = new MediaStreamRecorder(stream);
                            this.mediaStreamRecorder.mimeType = 'video/mp4';
                            this.mediaStreamRecorder.ondataavailable = blob => {
                                this.mediaStreamRecorder.save(blob, 'FileName.mp4');
                            };
                            this.mediaStreamRecorder.start();
                        })
                        .catch(e => {
                            console.warn('--got stream error ---', e);
                        });
                    break;
                }
            }
        });
    }

    handleStopClick () {
        this.closeMenu();

        if (this.mediaStreamRecorder) {
            this.mediaStreamRecorder.stop();
        }
    }

    render () {
        const {
            ...props
        } = this.props;

        const {anchorEl, openMenu} = this.state;

        return (
            <div className={props.className}>
                <Button
                    aria-haspopup={'true'}
                    aria-owns={anchorEl ? 'record-menu' : null}
                    onClick={this.handleClick}
                >
                    Record
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    id={'record-menu'}
                    open={openMenu}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.handleStartClick}>start</MenuItem>
                    <MenuItem onClick={this.handleStopClick}>stop</MenuItem>
                </Menu>
            </div>
        );
    }
}

RecordMenu.propTypes = {
};

const mapStateToProps = state => ({
});

export default connect(
    mapStateToProps,
    () => ({}) // omit dispatch prop
)(RecordMenu);
