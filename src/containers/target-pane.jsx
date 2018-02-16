import bindAll from 'lodash.bindall';
import React from 'react';

import {connect} from 'react-redux';

import {
    openSpriteLibrary,
    closeBackdropLibrary,
    closeSpriteLibrary
} from '../reducers/modals';

import {activateTab, COSTUMES_TAB_INDEX} from '../reducers/navigation';

import TargetPaneComponent from '../components/target-pane/target-pane.jsx';
import spriteLibraryContent from '../lib/libraries/sprites.json';

class TargetPane extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleChangeSpriteDirection',
            'handleChangeSpriteName',
            'handleChangeSpriteSize',
            'handleChangeSpriteVisibility',
            'handleChangeSpriteX',
            'handleChangeSpriteY',
            'handleDeleteSprite',
            'handleDuplicateSprite',
            'handleSelectSprite',
            'handleSurpriseSpriteClick',
            'handlePaintSpriteClick'
        ]);
    }
    handleChangeSpriteDirection (direction) {
        this.props.vm.postSpriteInfo({direction});
    }
    handleChangeSpriteName (name) {
        this.props.vm.renameSprite(this.props.editingTarget, name);
    }
    handleChangeSpriteSize (size) {
        this.props.vm.postSpriteInfo({size});
    }
    handleChangeSpriteVisibility (visible) {
        this.props.vm.postSpriteInfo({visible});
    }
    handleChangeSpriteX (x) {
        this.props.vm.postSpriteInfo({x});
    }
    handleChangeSpriteY (y) {
        this.props.vm.postSpriteInfo({y});
    }
    handleDeleteSprite (id) {
        this.props.vm.deleteSprite(id);
    }
    handleDuplicateSprite (id) {
        this.props.vm.duplicateSprite(id);
    }
    handleSelectSprite (id) {
        this.props.vm.setEditingTarget(id);
    }
    handleSurpriseSpriteClick () {
        const item = spriteLibraryContent[Math.floor(Math.random() * spriteLibraryContent.length)];
        this.props.vm.addSprite2(JSON.stringify(item.json));
    }
    handlePaintSpriteClick () {
        spriteLibraryContent.forEach(item => {
            if (item.name === 'Empty') {
                this.props.vm.addSprite2(JSON.stringify(item.json))
                    .then(() => {
                        this.props.onActivateTab(COSTUMES_TAB_INDEX);
                    });

                return;
            }
        });
    }
    render () {
        return (
            <TargetPaneComponent
                {...this.props}
                onChangeSpriteDirection={this.handleChangeSpriteDirection}
                onChangeSpriteName={this.handleChangeSpriteName}
                onChangeSpriteSize={this.handleChangeSpriteSize}
                onChangeSpriteVisibility={this.handleChangeSpriteVisibility}
                onChangeSpriteX={this.handleChangeSpriteX}
                onChangeSpriteY={this.handleChangeSpriteY}
                onDeleteSprite={this.handleDeleteSprite}
                onDuplicateSprite={this.handleDuplicateSprite}
                onSelectSprite={this.handleSelectSprite}
                onSurpriseSpriteClick={this.handleSurpriseSpriteClick}
                onPaintSpriteClick={this.handlePaintSpriteClick}
            />
        );
    }
}

const {
    onSelectSprite, // eslint-disable-line no-unused-vars
    ...targetPaneProps
} = TargetPaneComponent.propTypes;

TargetPane.propTypes = {
    ...targetPaneProps
};

const mapStateToProps = state => ({
    editingTarget: state.targets.editingTarget,
    sprites: Object.keys(state.targets.sprites).reduce((sprites, k) => {
        let {direction, size, x, y, ...sprite} = state.targets.sprites[k];
        if (typeof direction !== 'undefined') direction = Math.round(direction);
        if (typeof x !== 'undefined') x = Math.round(x);
        if (typeof y !== 'undefined') y = Math.round(y);
        if (typeof size !== 'undefined') size = Math.round(size);
        sprites[k] = {...sprite, direction, size, x, y};
        return sprites;
    }, {}),
    stage: state.targets.stage,
    spriteLibraryVisible: state.modals.spriteLibrary,
    backdropLibraryVisible: state.modals.backdropLibrary
});
const mapDispatchToProps = dispatch => ({
    onNewSpriteClick: e => {
        e.preventDefault();
        dispatch(openSpriteLibrary());
    },
    onRequestCloseSpriteLibrary: () => {
        dispatch(closeSpriteLibrary());
    },
    onRequestCloseBackdropLibrary: () => {
        dispatch(closeBackdropLibrary());
    },
    onActivateTab: (t) => {
        dispatch(activateTab(t));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TargetPane);
