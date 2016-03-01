var tq = require('./index');
tq.init('localhost:3002', function(error, result) {
  if (error) {
    console.log(error)
    return
  }
  console.log("> init done: ", result);

  var msg = {
    request_id: 12345,
    transport: 'email',
    message: {
      to: 'vadim.inc@gmail.com',
      subject: 'test',
      body: "Hello my Dear",
      attachment: "ATTACHMENT"
    }
  };

  tq.send(msg).then(function() {
    console.log("> the message was sent")
  })

})
