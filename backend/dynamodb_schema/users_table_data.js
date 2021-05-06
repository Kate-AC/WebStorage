params = {
  TableName: 'Users',
  Item: {
    'GoogleId': { S: '1' },
    'Email': { S: 'alice.catharsis.kate@gmail.com' },
    'SessionId': { S: 'none' },
  }
}

dynamodb.putItem(params, function (err, data) {
  if (err) {
    console.log(err, err.stack)
  } else {
    console.log(data)
  }
})
