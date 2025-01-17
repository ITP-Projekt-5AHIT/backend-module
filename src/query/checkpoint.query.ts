const checkpointBaseFormat = {
  name: true,
  time: true,
  isMeetingPoint: true,
  tourId: true,
  cId: true,
  description: true,
  location: {
    select: {
      city: true,
      lId: true,
      postCode: true,
      country: true,
      street: true,
      houseNumber: true,
      latitude: true,
      longtitude: true,
      routeDescription: true,
    },
  },
};

const queries = {
  checkpointBaseFormat,
};

export default queries;
