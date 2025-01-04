describe("build document tree from materialized path", () => {
  const buildTreeFromMaterializedPath = require("./buildTreeFromMaterializedPath");

  it("should return tree structure from materialized path", () => {
    const documents = [
      { _id: 1, id: 1, materializedPath: null },
      { _id: 2, id: 2, materializedPath: ",1," },
      { _id: 3, id: 3, materializedPath: ",1,2," },
      { _id: 4, id: 4, materializedPath: ",1,3," },
      { _id: 5, id: 5, materializedPath: ",1,3,4," },
    ];

    const result = buildTreeFromMaterializedPath(documents);

    const expected = [
      {
        id: 1,
        materializedPath: null,
        documents: [
          {
            id: 2,
            materializedPath: ",1,",
            documents: [
              {
                id: 3,
                materializedPath: ",1,2,",
                documents: [
                  {
                    id: 4,
                    materializedPath: ",1,3,",
                    documents: [
                      {
                        id: 5,
                        materializedPath: ",1,3,4,",
                        documents: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    expect(result).toEqual(expected);
  });
});
