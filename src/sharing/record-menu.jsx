import bindAll from 'lodash.bindall';
import React from 'react';
import {connect} from 'react-redux';
import log from '../lib/log.js';

import Menu, {MenuItem} from 'material-ui/Menu';
import Button from 'material-ui/Button';
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

        log.debug('try to record window');
        desktopCapturer.getSources({types: ['window']}, (error, sources) => {
            if (error) {
                log.debug('get window source error: ', error);
            } else {
                for (let i = 0; i < sources.length; ++i) {
                    if (sources[i].name === 'Scratch 3.0 GUI') {
                        log.debug('got scratch window source: ', sources[i]);
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
                                log.debug('got scratch window stream: ', stream);
                                this.mediaStreamRecorder = new MediaStreamRecorder(stream);
                                this.mediaStreamRecorder.mimeType = 'video/mp4';
                                this.mediaStreamRecorder.ondataavailable = blob => {
                                    log.debug('got recording data');
                                    this.mediaStreamRecorder.save(blob, 'scratch3-project.mp4');
                                };
                                log.debug('start to record window');
                                this.mediaStreamRecorder.start();
                            })
                            .catch(e => {
                                log.debug('fetch scratch window stream error: ', e);
                            });
                        break;
                    }
                }
            }
        });
    }

    handleStopClick () {
        this.closeMenu();

        if (this.mediaStreamRecorder) {
            log.debug('stop recording window');
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

export default connect(
    () => ({}),
    () => ({}) // omit dispatch prop
)(RecordMenu);
