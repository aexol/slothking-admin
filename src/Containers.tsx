import { Container } from 'unstated';
import { s } from '@aexol/slothking-syncano';
export type SchemaType = {
  schema: Array<any>;
};

export class Schema extends Container<SchemaType> {
  state = {
    schema: []
  };
  constructor() {
    super();
    s.post('rest-framework/schema', {}).then((schema) => {
      this.setState({
        schema
      });
    });
  }
}

export type ModelProps = {
  model: string;
};
