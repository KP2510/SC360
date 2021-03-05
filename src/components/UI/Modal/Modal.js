import React from 'react';
import styles from './Modal.module.css';
import BackDrop from '../BackDrop/Backdrop';
import Auxilary from '../../../hoc/Auxilary';

class Modal extends React.Component {
    shouldComponentUpdate (nextProps, nextState) {
        return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
    }
    render () {
        return (
            <Auxilary>
                <BackDrop show={this.props.show} clicked={this.props.modalClosed}/>
                <div 
                    className={styles.Modal}
                    style={{
                        transform: this.props.show ? 'translateY(0)' : 'translateY(-500vh)',
                        opacity: this.props.show ? '1' : '0'
                    }}>
                    {this.props.children}
                </div>
            </Auxilary>
        )
    }
}

export default Modal;