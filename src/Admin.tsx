import * as React from 'react';
import * as classnames from 'classnames';
import { Login, Arrow, AdminList } from './components';
import { PreloaderScreen } from '@aexol/slothking-components';
import { Auth, Rest } from '@aexol/slothking-syncano';
import { Schema } from './Containers';
import { Subscribe } from 'unstated';

let styles = require('./Admin.css')

// import { AdminList } from './components/AdminList';
export type SyncanoAdminProps = {
  rest: {
    models: Array<{
      name: string;
      display: string;
    }>;
  };
};
export type SyncanoAdminState = {
  showCategories: boolean;
};

export class SyncanoAdmin extends React.Component<SyncanoAdminProps, SyncanoAdminState> {
  state = {
    showCategories: null
  };
  render() {
    const { showCategories } = this.state;
    const { rest: { models } } = this.props;
    return (
      <Subscribe to={[Auth, Schema, Rest]}>
        {(auth: Auth, schemas: Schema, rest: Rest) => {
          const { valid } = auth.state;
          if (valid === false || rest.state.isAdmin === false) {
            return (
              <div className={styles.SyncanoAdmin}>
                <Login onLogin={auth.login} />
              </div>
            );
          }
          if (valid === null) {
            return <PreloaderScreen size={64} text="Validating token..." />;
          }
          if (!schemas.state.schema.length) {
            return <PreloaderScreen size={64} text="Waiting for schema..." />;
          }
          rest.isAdmin();
          if (rest.state.isAdmin === null) {
            return <PreloaderScreen size={64} text="Checking admin privileges..." />;
          }
          rest.list('propertytype');
          if (!rest.state.models['propertytype']) {
            return <PreloaderScreen size={64} text="Loading propertytypes.." />;
          }
          return (
            <div className={[styles.SyncanoAdmin, styles.ContentAdmin].join(' ')}>
              <div
                className={classnames({
                  [styles['open-categories']]: true,
                  [styles['arrow-toggle']]: showCategories
                })}
                onClick={() => {
                  this.setState({
                    showCategories: !showCategories
                  });
                }}
              >
                <Arrow />
              </div>
              <div
                className={classnames({
                  [styles.SyncanoCategories]: true,
                  [styles['show-categories']]: showCategories
                })}
              >
                <div className={styles.SyncanoLogoCompany}>
                  <img src={require('./images/logo.png')} />
                </div>
                <div className={styles.Models}>{models.map((m) => <div>{m.name}</div>)}</div>
                <div
                  className={[styles.SyncanoCategory, styles.LogOut].join(' ')}
                  onClick={auth.logout}
                >
                  log out
                </div>
              </div>
              <div className={styles.SyncanoContainer}>
                <AdminList
                  model={rest.state.models['propertytype']}
                  references={[]}
                  schema={schemas.state.schema.find((sc) => sc.name === 'propertytype')}
                  onAdd={(e) => rest.add('propertytype', e)}
                  onUpdate={(id, e) => rest.update('propertytype', id, e)}
                  onDelete={(id) => rest.remove('propertytype', id)}
                />
              </div>
            </div>
          );
        }}
      </Subscribe>
    );
  }
}
