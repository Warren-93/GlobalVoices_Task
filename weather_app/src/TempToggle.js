import React from 'react';
import { Form } from 'react-bootstrap';

const TemperatureToggle = ({ isCelsius, onToggle }) => {
  return (
    <Form>
      <Form.Check
        type="switch"
        id="temperature-switch"
        label="Toggle Temperature Units"
        checked={isCelsius}
        onChange={() => onToggle(!isCelsius)}
      />
    </Form>
  );
};

export default TemperatureToggle;
