import * as React from 'react';
import ModalSet from '../modal/ModalSet';
import { MultiSelect, filterRules } from '@aexol/slothking-form'
import { syncanoRelations } from './formMappings';

let styles = require('./List.css')
let multiSelectStyles = require('./MultiSelect.css')


export class AdminList extends React.Component<
  {
    model: Array<any>;
    schema: any;
    references: Array<any>;
    onAdd: (e: Object) => Promise<void>;
    onUpdate: (id: number, e: Object) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
  },
  any
> {
  state = {
    filtr: [],
    activeFilters: [],
    open: '',
    values: {},
    display: 'id'
  };
  render() {
    const { model, schema, references, onAdd, onDelete, onUpdate } = this.props;
    let { values, open, filtr, display } = this.state;
    if (!model) {
      return <div className={styles.ChooseModel}>Choose a model</div>;
    }
    let renderedObjects = model;
    if (filtr) {
      let filterKeys = Object.keys(filtr).filter((f) =>
        this.state.activeFilters.find((a) => a === f)
      );
      if (filterKeys.length) {
        for (var f of filterKeys) {
          renderedObjects = filterRules({
            value: filtr[f],
            values: renderedObjects,
            name: f,
            type: schema.fields.find((field) => field.name === f).type
          });
        }
      }
    }
    let fields = schema.fields;
    fields = syncanoRelations({ fields, models: references });

    let filterFields = [{ label: 'id', value: 'id' }];
    filterFields = [
      ...filterFields,
      ...schema.fields.filter((f) => f.type === 'string' || f.type === 'text').map((f) => ({
        label: f.name,
        value: f.name
      }))
    ];
    return (
      <div className={styles.SyncanoManage}>
        <div className={styles.SyncanoFilters}>
          <div className={styles.SyncanoMultiSelects}>
            <div className={styles.MultiSelectSearchFields}>
              {schema.fields
                .filter((f) => this.state.activeFilters.find((a) => a === f.name))
                .map((f) => (
                  <input
                    key={f.name}
                    type="text"
                    placeholder={f.name}
                    onChange={(e) => {
                      this.setState({
                        filtr: {
                          ...this.state.filtr,
                          [f.name]: e.target.value
                        }
                      });
                    }}
                  />
                ))}
            </div>
            <MultiSelect
              styles={multiSelectStyles}
              options={filterFields}
              multi={true}
              value={this.state.activeFilters}
              onChange={(activeFilters) => {
                console.log(activeFilters);
                this.setState({
                  activeFilters: activeFilters || []
                });
              }}
              placeholder="Filter by.."
            />
            <MultiSelect
              onChange={(e) => {
                console.log(e);
                this.setState({
                  display: e,
                  search: ''
                });
              }}
              styles={multiSelectStyles}
              placeholder="Display"
              value={display}
              options={filterFields}
            />
          </div>
          <div
            className={styles.AddButton}
            onClick={() => {
              this.setState({
                open: 'add'
              });
            }}
          >
            <div className={styles.Horizontal} />
            <div className={styles.Vertical} />
          </div>
        </div>
        <div className={styles.SyncanoList}>
          {renderedObjects.map((m) => (
            <div className={styles.SyncanoObject} key={m.id}>
              <div
                onClick={() => {
                  this.setState({
                    open: 'delete',
                    values: { id: m.id }
                  });
                }}
                className={styles.deleteButton}
              >
                ×
              </div>
              <div
                className={styles.displayName}
                onClick={() => {
                  this.setState({
                    open: 'update',
                    values: { ...m }
                  });
                }}
              >
                {display ? m[display] || m.id : m.id}
              </div>
            </div>
          ))}
        </div>
        <ModalSet
          name={schema.name}
          fields={fields}
          values={values}
          open={open}
          toggle={(o) => {
            this.setState({
              open: o
            });
          }}
          onAdd={(e) => {
            onAdd(e).then((r) => {
              this.setState({
                open: ''
              });
            });
          }}
          onUpdate={(id, e) => {
            onUpdate(id, e).then((r) => {
              this.setState({
                open: ''
              });
            });
          }}
          onDelete={(id) => {
            onDelete(id).then((r) => {
              this.setState({
                open: ''
              });
            });
          }}
        />
      </div>
    );
  }
}
