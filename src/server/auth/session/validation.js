const sessionValidation = (cache) => async (request, session) => {
  const cached = await cache.get(session.sid);
  const out = {
    valid: !!cached,
  };

  if (out.valid) {
    out.credentials = cached.account;
  }

  return out;
};

export default sessionValidation;
