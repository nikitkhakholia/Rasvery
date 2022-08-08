exports.validateCoupoon = (cpn, req) => {
  if (!cpn) {
    return {
      status: 0,
      error: `Please check your coupoon code.`,
    };
  }
  if (cpn.validTill < Date.now()) {
    return {
      status: 0,
      error: `Opps, Coupoon Expired.`,
    };
  }
  if (cpn.username && cpn.username != req.profile.username) {
    return {
      status: 0,
      error: `Opps, Coupoon Not Valid.`,
    };
  }
  if (cpn.status) {
    return {
      status: 0,
      error: `Opps, Coupoon was successfully used at ${cpn.usedAt.localDateString()}`,
    };
  }
  if (cpn.status === 2) {
    return {
      status: 0,
      error: `Opps, Coupoon Expired.`,
    };
  }
  return cpn;
};
