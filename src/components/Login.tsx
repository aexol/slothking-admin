import * as React from 'react';
import { Form } from '@aexol/slothking-form';
let styles = require('./Login.css');

type LoginType = {
  styles?: {
    SyncanoLogin?: string;
    FormGen?: string;
    SyncanoInstanceName?: string;
    Logo?: string;
    Submit?: string;
  };
  onLogin: (username: string, password: string) => void;
};

const Wrapper = ({ children, styles }) => <div className={styles.FieldWrapper}>{children}</div>;
const Submit = ({ styles }) => <input className={styles.Submit} type="submit" value={'Sign in'} />;

export const Login = ({ styles: overrideStyles, onLogin }: LoginType) => {
  if (overrideStyles) {
    styles = overrideStyles;
  }
  return (
    <div className={styles.SyncanoLogin}>
      <div className={styles.Logo}>
        <img src={require('../images/logo.png')} />
      </div>
      <Form
        fields={[
          {
            name: 'username',
            type: 'string',
            styles
          },
          {
            name: 'password',
            type: 'string',
            inputType: 'password',
            styles
          }
        ]}
        AlternativeWrapper={(props) => <Wrapper {...props} styles={styles} />}
        className={styles.FormGen}
        Submit={(props) => <Submit {...props} styles={styles} />}
        validate={(e) => {
          onLogin(e.username, e.password);
        }}
        submitText={'Sign in'}
      />
    </div>
  );
};
