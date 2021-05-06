params = {
  TableName: 'Files',
  AttributeDefinitions: [
    {
      AttributeName: 'FileKey',
      AttributeType: 'S'
    },
    {
      AttributeName: 'UserId',
      AttributeType: 'S'
    },
    {
      AttributeName: 'Attributes',
      AttributeType: 'S'
    }
  ],
  KeySchema: [
    {
      AttributeName: 'FileKey',
      KeyType: 'HASH'
    },
    {
      AttributeName: 'UserId',
      KeyType: 'RANGE'
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  },
  GlobalSecondaryIndexes: [
    {
      IndexName: 'AttributesAndUserId',
      KeySchema: [
        {
          AttributeName: 'Attributes',
          KeyType: 'HASH',
        },
        {
          AttributeName: 'UserId',
          KeyType: 'RANGE',
        }
      ],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      }
    }
  ]
}

dynamodb.createTable(params, function (err, data) {
  if (err) {
    console.log(err, err.stack)
  } else {
    console.log(data)
  }
})

