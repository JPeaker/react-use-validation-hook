import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { useValidation } from '../';

enum Errors {
  A = 'A',
  B = 'B',
}

interface State {
  x: number;
  y: string;
}

function UseValidationExample() {
  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<string>('');
  const errors = useValidation<Errors, State>(
    {
      [Errors.A]: ({ x }) => x === 1,
      [Errors.B]: ({ x, y }) => x === 1 && y === 'a',
    },
    { x, y }
  );

  return (
    <div>
      {errors.includes(Errors.A) ? <span>Error A</span> : undefined}
      {errors.includes(Errors.B) ? <span>Error B</span> : undefined}
      <button onClick={() => setX(x === 0 ? 1 : 0)}>Toggle X</button>
      <button onClick={() => setY(y === '' ? 'a' : '')}>Toggle Y</button>
    </div>
  );
}

describe('useValidation', () => {
  it('initializes without errors', () => {
    render(<UseValidationExample />);
    expect(screen.queryByText('Error A')).toBeNull();
    expect(screen.queryByText('Error B')).toBeNull();
  });

  it('can change one error at a time', () => {
    render(<UseValidationExample />);

    fireEvent.click(screen.getByText('Toggle X'));

    expect(screen.queryByText('Error A')).not.toBeNull();
    expect(screen.queryByText('Error B')).toBeNull();
  });

  it('can remove errors', () => {
    render(<UseValidationExample />);

    fireEvent.click(screen.getByText('Toggle X'));

    expect(screen.queryByText('Error A')).not.toBeNull();

    fireEvent.click(screen.getByText('Toggle X'));

    expect(screen.queryByText('Error A')).toBeNull();
  });

  it('can serve multiple errors', () => {
    render(<UseValidationExample />);

    fireEvent.click(screen.getByText('Toggle X'));
    fireEvent.click(screen.getByText('Toggle Y'));

    expect(screen.queryByText('Error A')).not.toBeNull();
    expect(screen.queryByText('Error B')).not.toBeNull();
  });
});
