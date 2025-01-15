const tourBaseFormat = {
  participants: {
    select: {
      aId: true,
      firstName: true,
      userName: true,
    },
  },
  createdBy: {
    select: {
      aId: true,
      userName: true,
      firstName: true,
    },
  },
  album: {
    select: {
      alId: true,
    },
  },
  checkpoints: {
    select: {
      cId: true,
      name: true,
      time: true,
      isMeetingPoint: true,
      tourId: true,
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
    },
  },
};

const queries = {
  tourBaseFormat,
};

export default queries;
