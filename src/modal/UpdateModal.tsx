import * as React from 'react';
import { Form, FieldDefinition } from '@aexol/slothking-form';
import { Modal, ModalHeader, ModalBody,ModalInterface } from '@aexol/slothking-components';
let styles = require('./FormComponents.css');

export interface UpdateModalInterface extends ModalInterface {
  fields: Array<FieldDefinition>;
  onUpdate: (id: number, e: Object) => void;
}

export class UpdateModal extends React.Component<UpdateModalInterface> {
  render() {
    const { isOpen, toggle, fields, values, name, onUpdate } = this.props;
    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>{`Edit ${name}`}</ModalHeader>
        <ModalBody>
          <Form
            className={styles.FormGen}
            fields={fields.map((f) => ({ ...f, styles }))}
            Submit={() => <input type="submit" value="Edit" className={styles.Submit} />}
            validate={(e) => {
              onUpdate(values.id, e);
            }}
            values={values}
          />
        </ModalBody>
      </Modal>
    );
  }
}
