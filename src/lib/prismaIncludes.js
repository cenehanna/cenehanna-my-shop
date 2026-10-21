export const categoryParentInclude = {
  category: {
    include: {
      parent: {
        include: {
          parent: {
            include: {
              parent: true,
            },
          },
        },
      },
    },
  },
};
