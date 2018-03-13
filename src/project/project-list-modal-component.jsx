import React from 'react';

import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import Box from '../components/box/box.jsx';
import styles from './project-list-modal-component.css';

import List from 'material-ui/List';

const ProjectListModal = props => (
    <ReactModal
        className={styles.modalContent}
        isOpen={props.isOpen}
        overlayClassName={styles.modalOverlay}
    >
        <Box className={styles.body}>
            <List>
                {props.projectListItem}
            </List>
        </Box>
    </ReactModal>
);

ProjectListModal.propTypes = {
    isOpen: PropTypes.bool,
    projectListItem: PropTypes.array
};

export default ProjectListModal;
