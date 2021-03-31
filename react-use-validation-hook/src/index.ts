import { useEffect, useState } from 'react';

/**
 * Given a mapping of exceptions to validation methods and an object of values, use these to continually return an up-to-date list of exceptions.
 * @param exceptionsToValidators - An object mapping TValidationException to a method that takes in the values and returns whether this exception is present.
 * @param values - An object that will be monitored, and when it changes, will run the validation methods.
 * @returns - A list of the exceptions present based on the values.
 */
export default function <TValidationException extends string, TValues>(
  exceptionsToValidators: { [key in TValidationException]: (values: TValues) => boolean },
  values: TValues
): TValidationException[] {
  const getValidationExceptions = () =>
    (Object.keys(exceptionsToValidators) as TValidationException[])
      .map(callback => (exceptionsToValidators[callback](values) ? callback : null))
      .filter(e => e !== null) as TValidationException[];

  const [exceptions, setValidationExceptions] = useState<TValidationException[]>(getValidationExceptions());

  useEffect(() => setValidationExceptions(getValidationExceptions()), [...Object.values(values)]);

  return exceptions;
}
