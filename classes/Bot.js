class Bot {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.fulfillmentMessages = { fulfillmentMessages: [] };
  }
  getIntent() {
    return this.req.body.queryResult.intent.displayName;
  }
  intentReceived(intentName) {
    return this.req.body.queryResult.intent.displayName === intentName;
  }
  sendTextMessage(msg) {
    let textTemplate = {
      text: {
        text: [msg],
      },
    };
    this.fulfillmentMessages.fulfillmentMessages.push(textTemplate);
  }
  sendCard(title, subtitle, imageUri, buttons = []) {
    let card = {
      card: {
        title,
        subtitle,
        imageUri,
        buttons,
        // buttons: [
        //   {
        //     text: 'button text',
        //     postback: 'https://example.com/path/for/end-user/to/follow',
        //   },
        // ],
      },
    };
    this.fulfillmentMessages.fulfillmentMessages.push(card);
  }
}

module.exports = Bot;
