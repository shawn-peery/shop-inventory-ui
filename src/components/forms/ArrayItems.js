import React from "react";

import { Button } from "reactstrap";

function ArrayItems(
  name,
  stateValue,
  stateFields,
  handleArrayDeleteElement,
  inputType,
  onArrayChange,
  handleArrayAddElement
) {
  return (
    <React.Fragment>
      {stateFields !== undefined &&
        stateFields &&
        stateFields[name].map((resource, index) => {
          return (
            <React.Fragment>
              <input
                id={name}
                key={`${resource}-${index}-input`}
                value={stateFields[name][index] || ""}
                name={name}
                type={inputType}
                className="form-multi-input"
                onChange={(event) => {
                  onArrayChange(event, index);
                }}
                data-form-group={name}
              />

              {index === stateValue.length - 1 && (
                <div
                  key={`${name}-${index}-buttons-div`}
                  className="button-container"
                >
                  <Button
                    key={`${name}-${index}-add-button`}
                    color="success"
                    type="button"
                    onClick={handleArrayAddElement}
                  >
                    Add
                  </Button>
                  <Button
                    key={`${name}-${index}-delete-button`}
                    color="danger"
                    type="button"
                    onClick={handleArrayDeleteElement}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </React.Fragment>
          );
        })}
    </React.Fragment>
  );
}

export default ArrayItems;
