# React useValidation Hook

## Summary

A way to provide complex validation logic to a React hook, allowing maintaining state and managing a list of exceptions through a simple API.

## Example Usage

```
// Only string-valued exceptions are supported. The returned list of exceptions will come back converted to strings, so
// non-string valued exceptions can't be searched for (except with calling .toString on what you want to find).
enum LoginExceptions {
  EmailRequired = 'EmailRequired',
  EmailFormat = 'EmailFormat',
  EmailAndPasswordIdentical = 'EmailAndPasswordIdentical'
}

const LoginComponent: React.FunctionComponent = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const exceptions = useValidation<LoginExceptions, { email: string | null; password: string | null }>(
    {
      [LoginExceptions.EmailRequired]: ({ email }) => email === null || email === '',
      [LoginExceptions.EmailFormat]: ({ email }) => email === null || !email.includes('@'),
      [LoginExceptions.EmailAndPasswordIdentical]: ({ email, password }) => email === password,
    },
    { email, password }
  );

  ...

  let errorMessage: string = '';
  if (exceptions.includes(LoginExceptions.EmailRequired)) {
    errorMessage = 'Email required';
  } else if (exceptions.includes(LoginExceptions.EmailFormat)) {
    errorMessage = 'Email must contain @';
  } else if (exceptions.includes(LoginExceptions.EmailAndPasswordIdentical)) {
    errorMessage = 'Email and password may not be the same';
  }

  return (
    <>
      <span>{errorMessage}</span>
      <input type="email" onChange={event => setEmail(event.target.value)} />
      <input type="password" onChange={event => setPassword(event.target.value)} />
    </>
  );
};
```

## Motivation

The authors have experienced difficulty whenever using a state validation library in the past. They're always convoluted and difficult to work with because they end up being far too clever, digging deep inside the properties of the component to try and make it easy to plug-and-play. When searching for a pattern that will work for the vast majority of our use cases, while giving us a lot of flexibility on how to utilize validation exceptions, we found that this pattern gave a great balance of power (Being able to write complex validation logic) and flexibility (It works in many different situations).

This pattern makes a very extensible hook available, allowing you to pass in any parts of your state that are relevant for validation, and leave out that which isn't. What you get back is merely a list of validation exceptions that are occurring with the current state. What you do with it is your responsibility.

## Install

by using `npm`:
```bash
$ npm install react-use-validation-hook
```

by using `yarn`:

```bash
$ npm install react-use-validation-hook
```
