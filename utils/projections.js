export function temporally() {
  return {
    ...defaultProjection(),
    expireAt: 0,
    logMessage: 0,
    logEvent: 0,
  };
}

export function onlyUserBasic() {
  return { ...defaultProjection(), config: 0, "data.password": 0 };
}

export function onlyId() {
  return {
    ...defaultProjection(),
    config: 0,
    data: 0,
  };
}

export function onlyEmail() {
  return {
    ...defaultProjection(),
    config: 0,
    "data.name": 0,
    "data.pix": 0,
    "data.password": 0,
    "data.admin": 0,
  };
}

export function restrictedUser() {
  return {
    ...defaultProjection(),
    config: 0,
    "data.pix": 0,
    "data.email": 0,
    "data.password": 0,
  };
}

export function defaultProjection() {
  return {
    _id: 0,
  };
}
