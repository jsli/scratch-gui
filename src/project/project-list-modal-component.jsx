import React from 'react';

import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import Box from '../components/box/box.jsx';
import styles from './project-list-modal-component.css';

const ProjectListModalComponent = props => (
    <ReactModal
        className={styles.modalContent}
        isOpen={props.isOpen}
        overlayClassName={styles.modalOverlay}
        onRequestClose={props.onRequestClose}
    >
        <Box className={styles.body}>
            {props.projectList}
        </Box>
    </ReactModal>
);

ProjectListModalComponent.propTypes = {
    isOpen: PropTypes.bool,
    onRequestClose: PropTypes.func.isRequired,
    projectList: PropTypes.object
};

export default ProjectListModalComponent;
