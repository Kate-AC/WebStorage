params = {
  TableName: 'Users',
  AttributeDefinitions: [
    {
      AttributeName: 'GoogleId',
      AttributeType: 'S'
    },
    {
      AttributeName: 'Email',
      AttributeType: 'S'
    },
    {
      AttributeName: 'SessionId',
      AttributeType: 'S'
    },
    {
      AttributeName: 'Capacity',
      AttributeType: 'S'
    }
  ],
  KeySchema: [
    {
      AttributeName: 'GoogleId',
      KeyType: 'HASH'
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  },
  GlobalSecondaryIndexes: [
    {
      IndexName: 'IndexSessionId',
      KeySchema: [
        {
          AttributeName: 'SessionId',
          KeyType: 'HASH',
        }
      ],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      }
    },
    {
      IndexName: 'EmailAndCapacity',
      KeySchema: [
        {
          AttributeName: 'Email',
          KeyType: 'HASH'
        },
        {
          AttributeName: 'Capacity',
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
    },
  ]
}

dynamodb.createTable(params, function (err, data) {
  if (err) {
    console.log(err, err.stack)
  } else {
    console.log(data)
  }
})

