const raise = (message: string): never => {
  throw new Error(message);
};

export default raise;
