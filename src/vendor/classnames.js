export default function classNames(...args) {
  const classes = [];

  args.forEach((arg) => {
    if (!arg) return;

    if (typeof arg === 'string' || typeof arg === 'number') {
      classes.push(String(arg));
      return;
    }

    if (Array.isArray(arg)) {
      const nested = classNames(...arg);
      if (nested) classes.push(nested);
      return;
    }

    if (typeof arg === 'object') {
      Object.keys(arg).forEach((key) => {
        if (arg[key]) classes.push(key);
      });
    }
  });

  return classes.join(' ');
}
