import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalInterface } from '@aexol/slothking-components';
import { Form, FieldDefinition } from '@aexol/slothking-form';
let styles = require('./FormComponents.css');

export interface AddModalInterface extends ModalInterface {
  fields: Array<FieldDefinition>;
  onAdd: (e: Object) => void;
}

export class AddModal extends React.Component<AddModalInterface> {
  render() {
    const { isOpen, toggle, fields, text, onAdd } = this.props;
    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>{text}</ModalHeader>
        <ModalBody>
          <Form
            className={styles.FormGen}
            fields={fields.map((f) => ({ ...f, styles }))}
            Submit={() => <input type="submit" value="Add" className={styles.Submit} />}
            validate={(e) => {
              onAdd(e);
            }}
          />
        </ModalBody>
      </Modal>
    );
  }
}
